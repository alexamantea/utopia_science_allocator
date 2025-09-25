# Utopia Science Allocator - Modular Structure

This directory contains the refactored, modular version of the Utopia Science Allocator Chrome extension.

## 📁 Directory Structure

```
src/
├── core/                           # Core functionality
│   ├── extension-manager.js        # Main coordinator
│   ├── page-detector.js            # Detects which page you're on
│   └── storage-manager.js          # Handles chrome.storage
├── features/
│   └── science-allocator/          # Science allocation feature
│       ├── science-content.js      # Main science page logic
│       ├── science-ui.js           # Science UI injection
│       └── science-calculator.js   # Allocation algorithms
├── shared/                         # Shared utilities
│   ├── constants.js                # Game constants and mappings
│   ├── ui-components.js            # Reusable UI elements
│   └── utils.js                    # Common utility functions
└── content.js                      # Main entry point
```

## 🔧 Module Dependencies

The modules are loaded in this order (as specified in manifest.json):

1. **constants.js** - Game constants and mappings
2. **utils.js** - Utility functions
3. **ui-components.js** - Reusable UI components
4. **storage-manager.js** - Chrome storage operations
5. **page-detector.js** - Page detection logic
6. **science-calculator.js** - Calculation algorithms
7. **science-ui.js** - UI injection and display
8. **science-content.js** - Science allocator logic
9. **extension-manager.js** - Main coordinator
10. **content.js** - Entry point

## 🚀 Benefits of This Structure

- **Modularity**: Each module has a single responsibility
- **Maintainability**: Easy to find and modify specific functionality
- **Extensibility**: Easy to add new features (military, economy, etc.)
- **Reusability**: Shared components can be used across features
- **Testing**: Individual modules can be tested in isolation

## 🔮 Future Extensions

This structure makes it easy to add new features:

- **Military Manager**: `src/features/military-manager/`
- **Economy Tracker**: `src/features/economy-tracker/`
- **Building Optimizer**: `src/features/building-optimizer/`

Each new feature would follow the same pattern:
- `feature-content.js` - Main logic
- `feature-ui.js` - UI components
- `feature-calculator.js` - Calculation logic (if needed)

## 📝 Migration Notes

- Original `content.js` is backed up as `content.js.backup`
- Original `manifest.json` is backed up as `manifest.json.backup`
- All existing functionality is preserved
- No changes to popup functionality
- No changes to styling
