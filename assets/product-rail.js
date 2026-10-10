if (!customElements.get('product-rail')) {
  class ProductRail extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-rail-track]');
      this.prev = this.querySelector('[data-rail-prev]');
      this.next = this.querySelector('[data-rail-next]');
      if (!this.track) return;

      this.update = this.update.bind(this);
      this.prev?.addEventListener('click', () => this.go(-1));
      this.next?.addEventListener('click', () => this.go(1));
      this.track.addEventListener('scroll', this.update, { passive: true });
      window.addEventListener('resize', this.update);
      this.update();
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this.update);
    }

    go(direction) {
      const rtl = getComputedStyle(this.track).direction === 'rtl' ? -1 : 1;
      this.track.scrollBy({ left: direction * rtl * this.track.clientWidth, behavior: 'smooth' });
    }

    update() {
      const max = this.track.scrollWidth - this.track.clientWidth;
      const position = Math.abs(this.track.scrollLeft);
      if (this.prev) this.prev.disabled = position <= 2;
      if (this.next) this.next.disabled = position >= max - 2;
      this.toggleAttribute('data-static', max <= 2);
    }
  }

  customElements.define('product-rail', ProductRail);
}
