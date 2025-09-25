// Storage Manager Module
// Handles all chrome.storage operations

class StorageManager {
  constructor() {
    this.defaultRatios = {
      economy: {
        alchemy: 2,
        tools: 2,
        housing: 1,
        production: 2,
        bookkeeping: 1,
        artisan: 1
      },
      military: {
        strategy: 2,
        siege: 1,
        tactics: 2,
        valor: 1,
        heroism: 1,
        resilience: 1
      },
      arcane: {
        crime: 2,
        channeling: 2,
        shielding: 1,
        cunning: 1,
        sorcery: 1,
        finesse: 1
      }
    };
  }

  async loadUserRatios() {
    try {
      const result = await chrome.storage.sync.get(['scienceRatios']);
      if (result.scienceRatios) {
        return { ...this.defaultRatios, ...result.scienceRatios };
      }
      return this.defaultRatios;
    } catch (error) {
      console.log('Using default ratios:', error);
      return this.defaultRatios;
    }
  }

  async saveRatios(ratios) {
    try {
      await chrome.storage.sync.set({ scienceRatios: ratios });
      return true;
    } catch (error) {
      console.error('Error saving ratios:', error);
      return false;
    }
  }

  async resetToDefaults() {
    try {
      await chrome.storage.sync.set({ scienceRatios: this.defaultRatios });
      return true;
    } catch (error) {
      console.error('Error resetting ratios:', error);
      return false;
    }
  }

  getDefaultRatios() {
    return this.defaultRatios;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else {
  window.StorageManager = StorageManager;
}
