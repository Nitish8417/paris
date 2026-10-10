class MiniCart extends HTMLElement {
  constructor() {
    super();
    this.bindEvents();
  }
  bindEvents() {
    if (document.querySelector("#minicart-drawer-toggle")) {
      document
        .querySelector("#minicart-drawer-toggle")
        .addEventListener("click", this.openDrawer.bind(this));
    }
    this.querySelectorAll("[data-sideDrawer-close]").forEach((button) =>
      button.addEventListener("click", this.closeDrawer.bind(this)),
    );
  }
  openDrawer(event) {
    event.preventDefault();
    fetch(this.dataset.url)
      .then((response) => response.text())
      .then((html) => {
        document.getElementById("minicart").innerHTML =
          this.getSectionInnerHTML(html, "minicart");
        if (document.querySelector("#cart-upsell-product")) {
          themeSlidersInit($("#cart-upsell-product"));
        }
        this.positionDropdown();
        document.querySelector("#minicart").classList.add("active");
        document.querySelector("body").classList.add("no-scroll");
        this.setExpanded(true);
        this.querySelectorAll("[data-sideDrawer-close]").forEach((button) =>
          button.addEventListener("click", this.closeDrawer.bind(this)),
        );
        setTimeout(function () {
          trapFocusElements(document.querySelector("#minicart"));
        }, 500);
        setTimeout(function () {
          fetch("/cart.js")
            .then((response) => response.json())
            .then((data) => {
              let totalprice = data.total_price;
              shippingProgressBar(totalprice);
            });
        }, 500);
      })
      .catch((e) => {
        console.error(e);
      });
  }
  renderContents(parsedState) {
    this.getSectionsToRender().forEach((section) => {
      if (document.getElementById(section.id)) {
        let parseElement = this.getSectionInnerHTML(
          parsedState.sections[section.id],
          section.selector,
        );
        document.querySelector(section.selector).innerHTML =
          this.getSectionInnerHTML(
            parsedState.sections[section.id],
            section.selector,
          );
        if (document.querySelector("#cart-upsell-product")) {
          themeSlidersInit($("#cart-upsell-product"));
        }
        let totalCount = new DOMParser()
          .parseFromString(parsedState.sections[section.id], "text/html")
          .querySelector("mini-cart")
          .getAttribute("data-cart-count");
        if (document.querySelector("[data-header-cart-count]")) {
          if (
            document
              .querySelector("[data-header-cart-count]")
              .classList.contains("hidden")
          ) {
            document
              .querySelector("[data-header-cart-count]")
              .classList.remove("hidden");
          }
          if (totalCount == 0) {
            document
              .querySelector("[data-header-cart-count]")
              .classList.add("hidden");
          } else if (totalCount < 100) {
            document.querySelector("[data-header-cart-count]").textContent =
              totalCount;
          } else {
            document.querySelector("[data-header-cart-count]").textContent = "";
          }
        }
        this.querySelectorAll("[data-sideDrawer-close]").forEach((button) =>
          button.addEventListener("click", this.closeDrawer.bind(this)),
        );
      }
    });
    setTimeout(function () {
      fetch("/cart.js")
        .then((response) => response.json())
        .then((data) => {
          let totalprice = data.total_price;
          shippingProgressBar(totalprice);
        });
    }, 500);
  }
  getSectionsToRender() {
    return [
      {
        id: "mini-cart",
        section: "cart-drawer",
        selector: "cart-drawer",
      },
    ];
  }
  getSectionInnerHTML(html, selector = "cart-drawer") {
    return new DOMParser()
      .parseFromString(html, "text/html")
      .querySelector("cart-drawer").innerHTML;
  }
  closeDrawer(event) {
    event.preventDefault();
    const closeElement = event.currentTarget;
    if (
      closeElement.closest(".side-drawer-panel").classList.contains("active")
    ) {
      closeElement.closest(".side-drawer-panel").classList.remove("active");
      document.querySelector("body").classList.remove("no-scroll");
      this.setExpanded(false);
    }
  }
  // On desktop the drawer is styled as a dropdown anchored under the header cart icon.
  positionDropdown() {
    const toggle = document.querySelector("#minicart-drawer-toggle");
    if (!toggle) return;
    const iconRect = toggle.getBoundingClientRect();
    const header = toggle.closest(".shopify-section, header");
    const headerBottom = header
      ? header.getBoundingClientRect().bottom
      : iconRect.bottom;
    this.style.setProperty(
      "--cart-dropdown-top",
      `${Math.max(headerBottom, 12)}px`,
    );
    this.style.setProperty(
      "--cart-dropdown-right",
      `${Math.max(document.documentElement.clientWidth - iconRect.right, 12)}px`,
    );
    this.style.setProperty(
      "--cart-dropdown-caret",
      `${Math.max(iconRect.width / 2 - 7, 8)}px`,
    );
  }
  setExpanded(expanded) {
    const toggle = document.querySelector("#minicart-drawer-toggle");
    if (toggle) toggle.setAttribute("aria-expanded", expanded);
  }
}

customElements.define("cart-drawer", MiniCart);
