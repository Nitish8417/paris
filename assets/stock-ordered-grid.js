/**
 * Shows every in-stock product of a collection before any sold-out product,
 * across all pages. Products are streamed from the collection's own
 * availability filter URLs (in stock first, then out of stock) through the
 * Section Rendering API, keeping the shopper's sort order and other filters.
 */
class StockOrderedGrid extends HTMLElement {
  connectedCallback() {
    this.sectionId = this.dataset.sectionId;
    this.perPage = parseInt(this.dataset.perPage, 10) || 20;
    this.total =
      (parseInt(this.dataset.inStockCount, 10) || 0) +
      (parseInt(this.dataset.outOfStockCount, 10) || 0);

    this.phases = [
      { url: this.dataset.inStockUrl, count: parseInt(this.dataset.inStockCount, 10) || 0, page: 1 },
      { url: this.dataset.outOfStockUrl, count: parseInt(this.dataset.outOfStockCount, 10) || 0, page: 1 },
    ];
    this.queue = [];

    this.results = this.querySelector("#result-product-grid");
    this.gridRow = this.results?.querySelector(".grid-row");
    this.moreButton = this.querySelector("[data-stock-order-more]");
    this.status = this.querySelector("[data-stock-order-status]");
    if (!this.results || !this.gridRow) return;

    this.onMoreClick = this.onMoreClick.bind(this);
    this.moreButton?.addEventListener("click", this.onMoreClick);

    this.init();
  }

  disconnectedCallback() {
    this.moreButton?.removeEventListener("click", this.onMoreClick);
    this.observer?.disconnect();
    this.abortController?.abort();
  }

  async init() {
    this.abortController = new AbortController();

    if (this.dataset.initialComplete === "true") {
      // The server-rendered first page already holds only in-stock products,
      // which are exactly the first in-stock page.
      this.phases[0].page = 2;
      this.shown = this.gridRow.children.length;
    } else {
      try {
        const items = await this.take(this.perPage);
        this.gridRow.replaceChildren(...items);
        this.shown = items.length;
        this.refreshAnimations();
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
        this.shown = this.gridRow.children.length;
        this.moreButton?.closest("[data-stock-order-pager]")?.remove();
      }
    }

    this.results.classList.remove("is-stock-pending");
    this.updatePager();

    if (this.dataset.mode === "infinite" && this.moreButton) {
      this.observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) this.loadMore();
      }, { rootMargin: "200px 0px" });
      this.observer.observe(this.moreButton);
    }
  }

  onMoreClick(event) {
    event.preventDefault();
    this.loadMore();
  }

  async loadMore() {
    if (this.loading || this.shown >= this.total) return;
    this.loading = true;
    this.moreButton?.classList.add("loading");
    this.moreButton?.setAttribute("aria-busy", "true");

    try {
      const items = await this.take(this.perPage);
      this.gridRow.append(...items);
      this.shown += items.length;
      this.refreshAnimations();
    } catch (error) {
      if (error.name !== "AbortError") console.error(error);
    } finally {
      this.loading = false;
      this.moreButton?.classList.remove("loading");
      this.moreButton?.removeAttribute("aria-busy");
      this.updatePager();
    }
  }

  async take(count) {
    while (this.queue.length < count && this.hasMorePages()) {
      await this.fetchNextPage();
    }
    return this.queue.splice(0, count);
  }

  hasMorePages() {
    return this.phases.some((phase) => phase.page <= Math.ceil(phase.count / this.perPage));
  }

  async fetchNextPage() {
    const phase = this.phases.find((p) => p.page <= Math.ceil(p.count / this.perPage));
    if (!phase) return;

    const separator = phase.url.includes("?") ? "&" : "?";
    const url = `${phase.url}${separator}page=${phase.page}&section_id=${this.sectionId}`;
    phase.page += 1;

    const response = await fetch(url, { signal: this.abortController.signal });
    if (!response.ok) throw new Error(`Stock-ordered grid: HTTP ${response.status}`);

    const html = new DOMParser().parseFromString(await response.text(), "text/html");
    const row = html.querySelector("#result-product-grid .grid-row");
    if (row) this.queue.push(...Array.from(row.children));
  }

  updatePager() {
    const done = this.shown >= this.total;
    const pager = this.moreButton?.closest("[data-stock-order-pager]");
    if (pager) pager.hidden = done;
    if (done) this.observer?.disconnect();

    if (this.status && this.dataset.statusTemplate) {
      this.status.textContent = this.dataset.statusTemplate.replace("[shown]", this.shown);
    }
  }

  refreshAnimations() {
    if (typeof AOS !== "undefined" && AOS.refreshHard) AOS.refreshHard();
  }
}

if (!customElements.get("stock-ordered-grid")) {
  customElements.define("stock-ordered-grid", StockOrderedGrid);
}
