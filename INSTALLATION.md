# 🚀 Installation Guide

## Quick Start

### Step 1: Download the Extension
1. Download or clone this repository to your computer
2. Extract the files to a folder (e.g., `utopia-science-allocator`)

### Step 2: Load in Chrome
1. Open **Google Chrome**
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **"Load unpacked"**
5. Select the extension folder you created in Step 1
6. The extension should now appear in your extensions list

### Step 3: Pin the Extension
1. Click the **puzzle piece icon** in Chrome's toolbar
2. Find "Utopia Science Allocator" and click the **pin icon**
3. The extension icon will now appear in your toolbar

### Step 4: Configure Your Ratios
1. Click the **extension icon** in your toolbar
2. Set your preferred weights for each science category
3. Click **"Save Ratios"**

### Step 5: Use on Utopia
1. Navigate to the Utopia science allocation page:
   - `https://utopia-game.com/wol/game/science` (World of Legends)
   - `https://utopia-game.com/gen/game/science` (Genesis)
2. Look for the **"Calculate Distribution"** button (top-right corner)
3. Click it to see your optimal science distribution
4. Review and adjust the suggestions as needed
5. Click **"Apply Allocation"** to fill the form
6. Submit your changes in the game

## Troubleshooting

### Extension Not Loading?
- Make sure you extracted all files to the same folder
- Check that `manifest.json` is in the root of the folder
- Try refreshing the extensions page

### Icons Not Showing?
- The extension includes custom icons (16x16, 48x48, 128x128 PNG)
- Icons should appear in the Chrome toolbar and extension management page
- If icons don't show, try refreshing the extensions page or reloading the extension

### Extension Not Working on Utopia?
- Make sure you're on the correct science allocation page
- Refresh the page after installing the extension
- Check that the page has input fields for science allocation

## File Structure Check

Your extension folder should contain:
```
utopia-science-allocator/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
├── styles.css
├── README.md
├── INSTALLATION.md
└── icons/
    └── README.md
```

## Need Help?

- Check the main `README.md` for detailed usage instructions
- Look for the floating "Calculate Distribution" button on Utopia pages
- Make sure your ratios are saved in the extension popup
- Try refreshing the page if the extension doesn't appear

---

**Ready to optimize your science allocation! 🎯**
