# Navigation Component Integration Instructions

This document provides a comprehensive guide on how to integrate the premium navigation component into all other HTML pages in the project (e.g., `products.html`, `projects.html`, `services.html`, etc.).

By following these instructions, you ensure that the component remains modular, DRY (Don't Repeat Yourself), and perfectly synced across the entire website.

## 1. Include the Stylesheets
In the `<head>` of every HTML document, ensure you load the Google Fonts, `global.css`, and `navbar.css`. The `global.css` file must load *before* `navbar.css` so that the CSS variables are available.

```html
<!-- Preconnect to Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;700;800&display=swap" rel="stylesheet">

<!-- Stylesheets -->
<link rel="stylesheet" href="./css/global.css">
<link rel="stylesheet" href="./css/navbar.css">
```

## 2. Insert the HTML Markup
Copy everything starting from `<!-- Navigation Component Start -->` up to `<!-- Navigation Component End -->` from `index.html` and paste it as the very first elements inside the `<body>` tag of your new page.

```html
<body>
  <!-- Navigation Component Start -->
  <header class="header" data-navbar="header">
    ... (copy the entire block from index.html)
  </nav>
  <!-- Navigation Component End -->
  
  <main>
    <!-- Page Content Goes Here -->
  </main>
</body>
```
*Note: You do not need to manually change the `aria-current` attribute for the active page. The `Navbar` JavaScript class dynamically detects the current URL and applies the active styling automatically.*

## 3. Include the JavaScript Module
At the bottom of the `<body>` tag (just before `</body>`), include the JavaScript initialization block. Because we are using ES6 modules, you must specify `type="module"`.

```html
<!-- Module Script Integration -->
<script type="module">
  import Navbar from './js/components/navbar.js';
  
  // Initialize Navigation
  document.addEventListener('DOMContentLoaded', () => {
    new Navbar();
  });
</script>
```

## 4. Troubleshooting
- **Dropdown Not Showing Products**: Ensure that the `data-navbar="desktop-dropdown"` and `data-navbar="mobile-dropdown-inner"` attributes are present on the `<ul>` tags inside the markup. The JavaScript relies on these attributes to inject the categories from `js/config.js`.
- **Navigation Not Shrinking on Scroll**: Ensure your main content (`<main>`) allows for scrolling by having enough height, and that `overflow-x: hidden` is on the `body`, but vertical scrolling is untouched.
- **Active Page Not Highlighting**: The JavaScript checks `window.location.pathname`. Ensure your pages are named consistently (e.g., `/products.html`) and match the `href` attributes in the HTML markup.
