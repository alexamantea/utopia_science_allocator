# 🔧 Troubleshooting Guide

## Issue: "Calculate Distribution" Button Not Appearing

If you can't find the "Calculate Distribution" button, follow these steps:

### Step 1: Check the URL
Make sure you're on the correct page:
- ✅ **Correct**: `https://utopia-game.com/wol/game/science`
- ❌ **Wrong**: Any other Utopia page (throne, military, etc.)

### Step 2: Check Browser Console
1. **Open Developer Tools**: Press `F12` or right-click → "Inspect"
2. **Go to Console tab**
3. **Look for messages** starting with "Utopia Science Allocator"
4. **Check the debug output** - it will show:
   - Current URL
   - Page detection results
   - Whether UI was injected

### Step 3: Reload the Extension
1. **Go to** `chrome://extensions/`
2. **Find** "Utopia Science Allocator"
3. **Click the refresh/reload button** (🔄)
4. **Go back** to the Utopia science page
5. **Refresh the page** (F5)

### Step 4: Check Extension Permissions
1. **Go to** `chrome://extensions/`
2. **Find** "Utopia Science Allocator"
3. **Click "Details"**
4. **Check** that it has access to the current site
5. **If not**, click "Allow access to file URLs" or similar

### Step 5: Manual Debugging
If the button still doesn't appear, try this in the browser console:

```javascript
// Check if the extension is loaded
console.log('Extension loaded:', typeof UtopiaScienceAllocator !== 'undefined');

// Check if the container exists
console.log('Container exists:', document.getElementById('utopia-science-allocator'));

// Manually trigger the extension
if (typeof UtopiaScienceAllocator !== 'undefined') {
  new UtopiaScienceAllocator();
}
```

### Step 6: Check Page Content
The extension looks for these elements on the page:
- ✅ Science-related text (alchemy, tools, tactics, etc.)
- ✅ Input fields for science allocation
- ✅ Table structure with science data

### Common Issues & Solutions

#### Issue: Extension not loading
**Solution**: 
- Make sure you're in Developer Mode
- Check that all files are in the same folder
- Verify `manifest.json` is valid

#### Issue: Wrong URL
**Solution**: 
- Navigate to: `https://utopia-game.com/wol/game/science`
- Make sure you're logged into Utopia
- The page should show science allocation options

#### Issue: Page not detected
**Solution**: 
- Check browser console for debug messages
- The extension now has more lenient detection
- Should work if you're on the right URL

#### Issue: Button appears but doesn't work
**Solution**: 
- Check console for JavaScript errors
- Make sure the page has loaded completely
- Try refreshing the page

### Debug Output Example
When working correctly, you should see in the console:
```
Utopia Science Allocator - Page Detection:
URL: https://utopia-game.com/wol/game/science
isCorrectUrl: true
hasIndicators: true
hasScienceTable: true
hasNumberInputs: true
inputFields found: 18
Final isUtopiaPage: true
Utopia Science Allocator - Injecting UI...
Utopia Science Allocator - UI injected successfully!
```

### Still Having Issues?
1. **Check the console** for any error messages
2. **Try the test page**: Open `test-page.html` in your browser
3. **Verify file structure**: All files should be in the same folder
4. **Check Chrome version**: Make sure you're using a recent version

---

**The extension should now work with more lenient page detection!** 🎯
