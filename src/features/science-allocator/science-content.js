// Science Content Module
// Main science allocator functionality

class ScienceAllocator {
  constructor() {
    this.storageManager = new StorageManager();
    this.calculator = new ScienceCalculator(this.storageManager);
    this.ui = new ScienceUI();
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    
    // Check if we're on a Utopia science page
    if (!PageDetector.isUtopiaSciencePage()) {
      return;
    }
    
    // Load user ratios
    await this.calculator.loadRatios();
    
    // Inject UI
    const uiElements = this.ui.injectUI();
    
    // Setup event listeners
    this.setupEventListeners(uiElements);
    
    // Setup message listener for ratio updates
    this.setupMessageListener();
    
    this.isInitialized = true;
  }

  setupEventListeners(uiElements) {
    uiElements.calculateBtn.addEventListener('click', () => this.calculateDistribution());
    uiElements.applyBtn.addEventListener('click', () => this.ui.applyAllocation());
    uiElements.closeBtn.addEventListener('click', () => this.ui.closeAllocator());
  }

  async calculateDistribution() {
    try {
      const suggestions = this.calculator.calculateOptimalDistribution();
      this.ui.displaySuggestions(suggestions);
    } catch (error) {
      this.ui.showError(error.message);
    }
  }

  setupMessageListener() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'RATIOS_UPDATED') {
        this.calculator.updateRatios(message.ratios);
        this.ui.showSuccess('Ratios updated! Recalculate to see new suggestions.');
      }
    });
  }

  destroy() {
    // Clean up event listeners and UI
    if (this.container) {
      this.container.remove();
    }
    this.isInitialized = false;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScienceAllocator;
} else {
  window.ScienceAllocator = ScienceAllocator;
}
