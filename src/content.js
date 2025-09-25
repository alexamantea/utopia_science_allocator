// Utopia Science Allocator - Main Content Script
// This file loads all modules and initializes the extension

// Load all required modules in the correct order
// Note: In a real browser environment, these would be loaded via script tags in the manifest

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ExtensionManager();
  });
} else {
  new ExtensionManager();
}
