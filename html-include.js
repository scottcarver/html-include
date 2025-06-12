class HtmlInclude extends HTMLElement {
  /**
   * Triggered when the element is added to the DOM.
   * Kicks off loading and rendering of the external HTML.
   */
  connectedCallback() {
    const src = this.getAttribute('src');
    if (!src) return;
    this.loadAndRender(src);
  }

  /**
   * Fetch the HTML, apply logic, pass down props, and insert it into the DOM.
   * @param {string} src - The URL of the HTML fragment to include.
   */
  async loadAndRender(src) {
    try {
      const response = await fetch(src);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      let html = await response.text();

      html = this.applyConditionals(html);
      html = this.interpolateVariables(html);

      // Create a template so we can manipulate DOM before inserting
      const template = document.createElement('template');
      template.innerHTML = html;

      // Prop drilling: pass this component's dataset to any nested <html-include> tags
      template.content.querySelectorAll('html-include').forEach(child => {
        for (const [key, value] of Object.entries(this.dataset)) {
          if (!child.dataset.hasOwnProperty(key)) {
            child.dataset[key] = value;
          }
        }
      });

      // Clear this element and insert the processed content
      this.innerHTML = '';
      this.appendChild(template.content);
    } catch (err) {
      console.error('html-include error:', err);
    }
  }

  /**
   * Replace {{key}} placeholders with values from this element's data-* attributes.
   * @param {string} html - Raw HTML content to process.
   * @returns {string} - HTML with interpolated values.
   */
  interpolateVariables(html) {
    return html.replace(/{{(.*?)}}/g, (_, key) => {
      return this.dataset[key.trim()] ?? '';
    });
  }

  /**
   * Evaluate and process {{#if key == "value"}}...{{/if}} logic blocks.
   * Only supports == and != comparisons for now.
   * @param {string} html - Raw HTML content to process.
   * @returns {string} - HTML with resolved conditional content.
   */
  applyConditionals(html) {
    return html.replace(/{{#if (.*?)}}([\s\S]*?){{\/if}}/g, (_, condition, content) => {
      const match = condition.match(/(\w+)\s*(==|!=)\s*["'](.*?)["']/);
      if (!match) return '';
      const [, key, operator, expected] = match;
      const actual = this.dataset[key];
      const result = operator === '==' ? actual === expected : actual !== expected;
      return result ? content : '';
    });
  }
}

// Register the custom element
customElements.define('html-include', HtmlInclude);
