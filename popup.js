// Utopia Science Allocator - Popup Script

class PopupManager {
  constructor() {
    // Use the same default ratios as StorageManager
    this.defaultRatios = {
      economy: {
        alchemy: 2,
        tools: 2,
        housing: 2,
        production: 2,
        bookkeeping: 1,
        artisan: 0
      },
      military: {
        strategy: 5,
        siege: 1,
        tactics: 10,
        valor: 1,
        heroism: 1,
        resilience: 10
      },
      arcane: {
        crime: 20,
        channeling: 20,
        shielding: 1,
        cunning: 1,
        sorcery: 1,
        finesse: 10
      }
    };
    
    this.init();
  }

  async init() {
    await this.loadSavedRatios();
    this.setupEventListeners();
  }

  async loadSavedRatios() {
    try {
      const result = await chrome.storage.sync.get(['scienceRatios']);
      const savedRatios = result.scienceRatios || this.defaultRatios;
      
      // Populate form fields
      Object.entries(savedRatios).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategory, value]) => {
          const input = document.getElementById(`${category}-${subcategory}`);
          if (input) {
            input.value = value;
          }
        });
      });
    } catch (error) {
      console.error('Error loading saved ratios:', error);
      this.showStatus('Error loading saved ratios', 'error');
    }
  }

  setupEventListeners() {
    // Save button
    document.getElementById('save-ratios').addEventListener('click', () => {
      this.saveRatios();
    });

    // Reset button
    document.getElementById('reset-defaults').addEventListener('click', () => {
      this.resetToDefaults();
    });

    // Input validation
    const inputs = document.querySelectorAll('.ratio-input');
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.validateInput(e.target);
      });
    });
  }

  validateInput(input) {
    const value = parseInt(input.value);
    
    if (isNaN(value) || value < 0) {
      input.value = 0;
    }
    // Removed the 10 limit - now allows any positive number
  }

  async saveRatios() {
    try {
      const ratios = this.collectRatios();
      
      // Validate ratios
      if (!this.validateRatios(ratios)) {
        this.showStatus('Please ensure at least one category has non-zero weights', 'error');
        return;
      }

      // Save to storage
      await chrome.storage.sync.set({ scienceRatios: ratios });
      
      this.showStatus('Ratios saved successfully!', 'success');
      
      // Notify content script of changes
      this.notifyContentScript(ratios);
      
    } catch (error) {
      console.error('Error saving ratios:', error);
      this.showStatus('Error saving ratios', 'error');
    }
  }

  collectRatios() {
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

  validateRatios(ratios) {
    // Check if at least one category has non-zero weights
    return Object.values(ratios).some(category => 
      Object.values(category).some(weight => weight > 0)
    );
  }

  async resetToDefaults() {
    try {
      // Reset form fields
      Object.entries(this.defaultRatios).forEach(([category, subcategories]) => {
        Object.entries(subcategories).forEach(([subcategory, value]) => {
          const input = document.getElementById(`${category}-${subcategory}`);
          if (input) {
            input.value = value;
          }
        });
      });

      // Save defaults
      await chrome.storage.sync.set({ scienceRatios: this.defaultRatios });
      
      this.showStatus('Reset to default ratios', 'success');
      
      // Notify content script
      this.notifyContentScript(this.defaultRatios);
      
    } catch (error) {
      console.error('Error resetting ratios:', error);
      this.showStatus('Error resetting ratios', 'error');
    }
  }

  async notifyContentScript(ratios) {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (tab) {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, {
          type: 'RATIOS_UPDATED',
          ratios: ratios
        }).catch(error => {
          // Content script might not be loaded yet, that's okay
          console.log('Content script not ready:', error);
        });
      }
    } catch (error) {
      console.log('Could not notify content script:', error);
    }
  }

  showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status status-${type}`;
    status.style.display = 'block';

    // Auto-hide after 3 seconds
    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});
