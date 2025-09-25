// Page Detection Module
// Handles detection of different Utopia game pages

class PageDetector {
  static detectPage() {
    const url = window.location.href;
    
    if (url.includes('/game/science')) return 'science';
    if (url.includes('/game/military')) return 'military';
    if (url.includes('/game/economy')) return 'economy';
    if (url.includes('/game/buildings')) return 'buildings';
    
    return 'unknown';
  }

  static isUtopiaSciencePage() {
    const currentUrl = window.location.href;
    const isCorrectUrl = currentUrl.includes('utopia-game.com/wol/game/science') || 
                        currentUrl.includes('utopia-game.com/gen/game/science');
    
    // Look for specific Utopia science page indicators
    const indicators = [
      'science',
      'alchemy',
      'tools',
      'bookkeeping',
      'tactics',
      'strategy',
      'channeling',
      'crime'
    ];
    
    const pageText = document.body.textContent.toLowerCase();
    const hasIndicators = indicators.some(indicator => pageText.includes(indicator));
    
    // Check for the science table structure
    const scienceTable = document.querySelector('table tbody tr td');
    const hasScienceTable = scienceTable && scienceTable.textContent.toLowerCase().includes('alchemy');
    
    // Also check for common input field patterns
    const inputFields = document.querySelectorAll('input[type="number"], input[type="text"]');
    const hasNumberInputs = inputFields.length > 0;
    
    // Debug logging
    console.log('Utopia Science Allocator - Page Detection:');
    console.log('URL:', currentUrl);
    console.log('isCorrectUrl:', isCorrectUrl);
    console.log('hasIndicators:', hasIndicators);
    console.log('hasScienceTable:', hasScienceTable);
    console.log('hasNumberInputs:', hasNumberInputs);
    console.log('inputFields found:', inputFields.length);
    
    // More lenient detection - if we're on the right URL and have some indicators, proceed
    const isUtopiaPage = isCorrectUrl && (hasIndicators || hasScienceTable || hasNumberInputs);
    
    console.log('Final isUtopiaPage:', isUtopiaPage);
    
    return isUtopiaPage;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PageDetector;
} else {
  window.PageDetector = PageDetector;
}
