// Utility Functions
// Common utility functions used across the extension

class Utils {
  static getScienceCategory(scienceName) {
    return UtopiaConstants.SCIENCE_MAPPINGS[scienceName];
  }

  static isEmptyData(data) {
    return data.economy.total === 0 && data.military.total === 0 && data.arcane.total === 0;
  }

  static formatNumber(num) {
    return num.toLocaleString();
  }

  static parseNumber(text) {
    return parseInt(text.replace(/,/g, '')) || 0;
  }

  static validateInput(input) {
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0) {
      input.value = 0;
    }
  }

  static validateRatios(ratios) {
    // Check if at least one category has non-zero weights
    return Object.values(ratios).some(category => 
      Object.values(category).some(weight => weight > 0)
    );
  }

  static collectRatios() {
    const ratios = {
      economy: {},
      military: {},
      arcane: {}
    };

    // Collect all input values
    const inputs = document.querySelectorAll('.ratio-input');
    inputs.forEach(input => {
      const id = input.id;
      const [category, subcategory] = id.split('-');
      
      if (ratios[category]) {
        ratios[category][subcategory] = parseInt(input.value) || 0;
      }
    });

    return ratios;
  }

  static setupNavigationListener(callback) {
    // Listen for URL changes (when navigating within the game)
    let currentUrl = window.location.href;
    
    // Check for URL changes every 500ms
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('Utopia Science Allocator - URL changed, re-initializing...');
        
        if (callback) {
          callback();
        }
      }
    }, 500);
  }

  static removeExistingUI() {
    // Remove existing UI elements
    const existingContainer = document.getElementById('utopia-science-allocator');
    if (existingContainer) {
      existingContainer.remove();
    }
    
    const existingReopen = document.getElementById('utopia-reopen-button');
    if (existingReopen) {
      existingReopen.remove();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
} else {
  window.Utils = Utils;
}
