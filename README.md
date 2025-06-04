# `<html-include>`, The HTML-Include Web Component

`<html-include>` is a lightweight, declarative web component that brings PHP-style includes to static HTML. It fetches and injects HTML fragments into your pages, supports simple templating with `data-*` attributes, and displays fallback content on load or error.

Perfect for modular layouts, static sites, internal tools, and fast prototyping — no build step or framework required.

---

## Features

- HTML includes via `<html-include src="file.html">`
- Optional fallback content inside the tag
- Simple templating using `data-*` attributes and `{{key}}` placeholders
- Works recursively with nested includes
- In-memory caching to prevent duplicate fetches
- No Shadow DOM — easy to style and access

---

## Getting Started

### 1. Include the Component

```html
<script src="lib/html-include.js"></script>
```

<script src="lib/html-include.js"></script>


### 2. Use in Your HTML

```html
<html-include src="header.html"></html-include>

<main>
  <p>Main content here.</p>
</main>

<html-include src="footer.html"></html-include>
```

### 3. Optional: Fallback Content

```html
<html-include src="nav.html">
  <p>Loading nav...</p>
</html-include>
```

### 4. Optional: Simple Templating

If welcome.html contains:

```html
<p>Welcome, {{name}}!</p>
```

You can pass data via attributes:

```html
<html-include src="welcome.html" data-name="Bird"></html-include>
```

## Notes
- Nested <html-include> tags are processed automatically.
- Content is cached after the first load.
- For accessibility or SEO-critical content, consider using server-side includes or a static site generator.
- Info on [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)
- You will naturally run into source-order issues because anything in an include will render inside a block. You can mitigate this "extra-div" issue by adding a data-role to the custom-element, like `data-role="footer"`
- Is this a good idea? Not sure about that.
- This was mostly [vibecoded](https://chatgpt.com/c/682353bc-b178-800a-8f68-a19f918c72fd), dictated and reviewed lightly 