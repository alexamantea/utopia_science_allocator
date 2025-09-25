# 🎯 Utopia Science Allocator - Chrome Extension

A Chrome extension to help **Utopia** players manage science book allocation automatically. The extension reads current values from the science page, calculates optimal distribution based on player-defined ratios, and automatically fills in the page's input fields with suggested values.

## 📸 Screenshots

<!-- Add screenshots here once you have them -->
<!-- 
![Extension Button](screenshots/extension-button.png)
![Configuration Popup](screenshots/popup-config.png)
![Allocation Table](screenshots/allocation-table.png)
![Science Page](screenshots/science-page.png)
-->

## ✨ Features

- **🔍 Automatic Data Extraction**: Reads current science book allocations from the Utopia page
- **🧮 Smart Distribution Calculation**: Uses player-defined weights to calculate optimal book distribution
- **🎨 Clean UI Integration**: Injects a floating interface directly into the science page
- **⚙️ Customizable Ratios**: Configure weights for each science category through the extension popup
- **💾 Persistent Settings**: Saves your preferences using Chrome storage
- **📱 Responsive Design**: Works on different screen sizes with dark mode support

## 🚀 Installation

### From Source (Developer Mode)

1. **Download/Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in the top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Required Files

Make sure your extension folder contains:
```
utopia-science-extension/
├── manifest.json          # Extension configuration
├── content.js            # Main functionality script
├── popup.html            # Settings interface
├── popup.js              # Settings logic
├── styles.css            # UI styling
└── README.md             # This documentation
```

## 🎮 How to Use

### 1. Configure Your Ratios

1. **Click the extension icon** in your Chrome toolbar
2. **Set weights** for each science category (0-10 scale):
   - Higher weights = more books allocated to that category
   - Example: Alchemy 2x, Tools 2x, Bookkeeping 1x
3. **Click "Save Ratios"** to store your preferences

### 2. Use on Utopia Science Page

1. **Navigate** to the Utopia science allocation page:
   - `https://utopia-game.com/wol/game/science` (World of Legends)
   - `https://utopia-game.com/gen/game/science` (General)
2. **Look for the floating "Calculate Distribution" button** (top-right corner)
3. **Click "Calculate Distribution"** to analyze current allocations
4. **Review the suggestions** in the floating table:
   - **Current**: Your current allocation
   - **Ideal**: Target allocation based on your ratios
   - **Suggested**: Recommended new allocation
5. **Adjust values** manually if needed (editable input fields)
6. **Click "Apply Allocation"** to fill the page's input fields
7. **Submit** your changes in the game as usual

## 📊 Distribution Algorithm

The extension uses a weighted distribution formula:

```
Fraction = Weight / Sum of Weights in Category
Ideal = TotalBooks_Category × Fraction
Suggested = max(0, Ideal - Current)
```

### Example Calculation

If you have:
- **Total Economy Books**: 100
- **Alchemy Weight**: 2
- **Tools Weight**: 2  
- **Bookkeeping Weight**: 1
- **Total Weight**: 5

Then:
- **Alchemy Ideal**: 100 × (2/5) = 40 books
- **Tools Ideal**: 100 × (2/5) = 40 books
- **Bookkeeping Ideal**: 100 × (1/5) = 20 books

## 🏗️ Science Categories

### 🏛️ Economy
- **Alchemy** - Potion brewing and magical chemistry
- **Tools** - Crafting and equipment improvement
- **Bookkeeping** - Economic management and trade
- **Construction** - Building and infrastructure
- **Housing** - Population and settlement management

### ⚔️ Military
- **Tactics** - Battle strategy and unit coordination
- **Strategy** - Long-term military planning
- **Valor** - Heroic combat abilities
- **Heroism** - Leadership and inspiration
- **Honor** - Military discipline and tradition

### 🔮 Arcane
- **Channeling** - Mana manipulation and flow
- **Mysticism** - Ancient knowledge and secrets
- **Sorcery** - Direct magical combat
- **Thaumaturgy** - Magical theory and research
- **Enchantment** - Magical item creation

## ⚙️ Technical Details

### Permissions Used
- `activeTab` - Access and modify the current Utopia page
- `storage` - Save player-defined ratios and preferences
- `scripting` - Inject scripts into the page

### Browser Compatibility
- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Firefox**: Not supported (different extension format)

### Data Storage
- Uses `chrome.storage.sync` for cross-device synchronization
- Stores only your ratio preferences (no personal game data)
- All data remains local to your browser

## 🛠️ Development

### File Structure
- `manifest.json` - Extension configuration and permissions
- `content.js` - Main logic for DOM manipulation and calculations
- `popup.html/js` - Settings interface for ratio configuration
- `styles.css` - Styling for injected UI elements

### Key Functions
- `extractScienceData()` - Scrapes current values from the page
- `calculateOptimalDistribution()` - Computes suggested allocations
- `displaySuggestions()` - Shows results in floating table
- `applyAllocation()` - Fills page input fields with suggestions

## 🐛 Troubleshooting

### Extension Not Working?
1. **Check if you're on the correct page** - Look for science-related content
2. **Refresh the page** - The extension injects after page load
3. **Check console errors** - Press F12 and look for error messages
4. **Verify permissions** - Make sure the extension has access to the page

### Calculation Issues?
1. **Verify your ratios** - Open the popup and check your weight settings
2. **Check input field detection** - The extension looks for number inputs
3. **Manual adjustment** - You can always edit the suggested values before applying

### UI Problems?
1. **Try different screen sizes** - The interface is responsive
2. **Check for conflicts** - Other extensions might interfere
3. **Disable/re-enable** - Toggle the extension off and on

## 📝 Changelog

### Version 1.0.0
- Initial release
- Automatic data extraction from Utopia science pages
- Weighted distribution calculation
- Floating UI with editable suggestions
- Popup interface for ratio configuration
- Chrome storage integration
- Responsive design with dark mode support

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the extension!

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Science Allocating! 🎯✨**
