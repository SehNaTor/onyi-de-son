/**
 * Purpose: Centralized Configuration
 * Responsibilities: Export configuration objects for dynamic UI rendering (e.g., product categories, contact details).
 * Version: 1.0.0
 */

const CONFIG = {
  company: {
    name: "Onyi De Son of Grace Nig Ltd",
    phone: "+234 123 456 7890", // Placeholder for actual number
    email: "info@onyideson.com",
  },
  products: {
    categories: [
      {
        id: "tarpaulin",
        label: "Tarpaulin",
        url: "products.html#tarpaulin"
      },
      {
        id: "carport",
        label: "Carport",
        url: "products.html#carport"
      },
      {
        id: "wallpaper",
        label: "Wallpaper",
        url: "products.html#wallpaper"
      }
    ]
  },
  navigation: {
    main: [
      { label: "Home", url: "/index.html" },
      { label: "Products", url: "/products.html", hasDropdown: true },
      { label: "Projects", url: "/projects.html" },
      { label: "Services", url: "/services.html" },
      { label: "Gallery", url: "/gallery.html" },
      { label: "About", url: "/about.html" },
      { label: "Contact", url: "/contact.html" }
    ]
  },
  cloudinary: {
    cloudName: " vwrjamwn", // TODO: Replace with your Cloudinary Cloud Name
    uploadPreset: "porfolio _upload" // TODO: Replace with your Unsigned Upload Preset
  }
};

export default CONFIG;
