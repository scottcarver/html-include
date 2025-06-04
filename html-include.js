/**
 * <html-include> Web Component
 * Dynamically loads and injects external HTML into the page using the `src` attribute.
 * Supports simple templating via `data-*` attributes and fallback content.
 */
class HtmlInclude extends HTMLElement {
  /** @type {Map<string, string>} In-memory cache of fetched HTML content */
  static cache = new Map();

  constructor() {
    super();
    /** @private {MutationObserver} Observes changes to the `src` attribute */
    this._observer = new MutationObserver(() => this.loadContent());
    /** @private {string} Inner HTML to show if fetch fails or during loading */
    this._fallback = this.innerHTML;
  }

  /** Called when the element is added to the DOM */
  connectedCallback() {
    this.loadContent();
    this._observer.observe(this, { attributes: true, attributeFilter: ['src'] });
  }

  /** Called when the element is removed from the DOM */
  disconnectedCallback() {
    this._observer.disconnect();
  }

  /**
   * Fetches external HTML, processes template variables, and injects content.
   * Also processes nested <html-include> tags recursively.
   * @returns {Promise<void>}
   */
  async loadContent() {
    const src = this.getAttribute('src');
    if (!src) return;

    // Display fallback while loading
    this.innerHTML = this._fallback;

    try {
      let html;

      // Use cache if available
      if (HtmlInclude.cache.has(src)) {
        html = HtmlInclude.cache.get(src);
      } else {
        const response = await fetch(src);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        html = await response.text();
        HtmlInclude.cache.set(src, html);
      }

      // Basic templating: replace {{key}} with this.dataset[key]
      html = html.replace(/{{(.*?)}}/g, (_, key) => {
        const value = this.dataset[key.trim()];
        return value !== undefined ? value : '';
      });

      this.innerHTML = html;

      // Recursively process nested includes
      const nested = this.querySelectorAll('html-include');
      for (const el of nested) {
        await customElements.whenDefined('html-include');
        el.loadContent?.();
      }

    } catch (err) {
      this.innerHTML = `<pre style="color:red;">Error loading "${src}": ${err.message}</pre>`;
    }
  }
}

// Define the custom element
customElements.define('html-include', HtmlInclude);