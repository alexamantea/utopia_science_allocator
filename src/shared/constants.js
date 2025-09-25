// Game Constants
// Centralized constants for the Utopia Science Allocator

const SCIENCE_CATEGORIES = {
  ECONOMY: 'economy',
  MILITARY: 'military',
  ARCANE: 'arcane'
};

const SCIENCE_MAPPINGS = {
  // Economy
  'alchemy': { category: 'economy', subcategory: 'alchemy' },
  'tools': { category: 'economy', subcategory: 'tools' },
  'housing': { category: 'economy', subcategory: 'housing' },
  'production': { category: 'economy', subcategory: 'production' },
  'bookkeeping': { category: 'economy', subcategory: 'bookkeeping' },
  'artisan': { category: 'economy', subcategory: 'artisan' },
  
  // Military
  'strategy': { category: 'military', subcategory: 'strategy' },
  'siege': { category: 'military', subcategory: 'siege' },
  'tactics': { category: 'military', subcategory: 'tactics' },
  'valor': { category: 'military', subcategory: 'valor' },
  'heroism': { category: 'military', subcategory: 'heroism' },
  'resilience': { category: 'military', subcategory: 'resilience' },
  
  // Arcane
  'crime': { category: 'arcane', subcategory: 'crime' },
  'channeling': { category: 'arcane', subcategory: 'channeling' },
  'shielding': { category: 'arcane', subcategory: 'shielding' },
  'cunning': { category: 'arcane', subcategory: 'cunning' },
  'sorcery': { category: 'arcane', subcategory: 'sorcery' },
  'finesse': { category: 'arcane', subcategory: 'finesse' }
};

const CATEGORY_ORDER = {
  economy: ['alchemy', 'tools', 'housing', 'production', 'bookkeeping', 'artisan'],
  military: ['strategy', 'siege', 'tactics', 'valor', 'heroism', 'resilience'],
  arcane: ['crime', 'channeling', 'shielding', 'cunning', 'sorcery', 'finesse']
};

const CATEGORY_ICONS = {
  economy: '🏛️',
  military: '⚔️',
  arcane: '🔮'
};

const URL_PATTERNS = {
  SCIENCE_WOL: 'utopia-game.com/wol/game/science',
  SCIENCE_GEN: 'utopia-game.com/gen/game/science'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SCIENCE_CATEGORIES,
    SCIENCE_MAPPINGS,
    CATEGORY_ORDER,
    CATEGORY_ICONS,
    URL_PATTERNS
  };
} else {
  window.UtopiaConstants = {
    SCIENCE_CATEGORIES,
    SCIENCE_MAPPINGS,
    CATEGORY_ORDER,
    CATEGORY_ICONS,
    URL_PATTERNS
  };
}
