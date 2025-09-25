// Extension Manager Module
// Main coordinator for the Utopia Science Allocator extension

class ExtensionManager {
  constructor() {
    this.currentPage = null;
    this.activeFeature = null;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Detect current page
    this.currentPage = PageDetector.detectPage();
    
    // Load appropriate feature
    this.loadFeature();
    
    // Setup navigation listener
    this.setupNavigationListener();
    
    this.isInitialized = true;
  }

  loadFeature() {
    // Clean up existing feature
    if (this.activeFeature && this.activeFeature.destroy) {
      this.activeFeature.destroy();
    }
    
    // Remove existing UI
    Utils.removeExistingUI();
    
    switch(this.currentPage) {
      case 'science':
        this.loadScienceAllocator();
        break;
      case 'military':
        // Future: Load military manager
        console.log('Military page detected - feature not implemented yet');
        break;
      case 'economy':
        // Future: Load economy tracker
        console.log('Economy page detected - feature not implemented yet');
        break;
      default:
        console.log('Unknown page type:', this.currentPage);
    }
  }

  async loadScienceAllocator() {
    try {
      // Import and initialize science allocator
      this.activeFeature = new ScienceAllocator();
    } catch (error) {
      console.error('Failed to load science allocator:', error);
    }
  }

  setupNavigationListener() {
    Utils.setupNavigationListener(() => {
      // Re-initialize when URL changes
      setTimeout(() => {
        this.init();
      }, 100); // Small delay to let the page content load
    });
  }

  destroy() {
    if (this.activeFeature && this.activeFeature.destroy) {
      this.activeFeature.destroy();
    }
    this.isInitialized = false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExtensionManager;
} else {
  window.ExtensionManager = ExtensionManager;
}
