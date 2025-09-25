# Privacy Policy for Utopia Science Allocator

**Last Updated:** September 25, 2024

## Overview

Utopia Science Allocator is a Chrome extension designed to help players of the Utopia game manage their science book allocation. This privacy policy explains how we handle your data when you use this extension.

## Data Collection

### What Data We Collect
- **Science Allocation Ratios**: Your custom preferences for how to distribute science books across different categories (Economy, Military, Arcane)
- **No Personal Information**: We do not collect any personal information, usernames, passwords, or game account details

### How We Collect Data
- Data is collected only when you manually configure your science allocation ratios through the extension's popup interface
- The extension reads current science book values from Utopia game pages to calculate optimal distributions

## Data Storage and Usage

### Local Storage Only
- All data is stored locally in your browser using Chrome's built-in storage API (`chrome.storage.sync`)
- No data is transmitted to external servers or third parties
- Your preferences are synchronized across your Chrome browsers (if you're signed into Chrome)

### How We Use Your Data
- Your science allocation ratios are used solely to calculate optimal book distributions
- The extension uses this data to suggest how to allocate your available science books
- No data is used for advertising, analytics, or any other purpose

## Data Sharing

**We do not share, sell, or transmit your data to any third parties.** All data remains local to your browser and is not accessible to the extension developer or any external services.

## Permissions Justification

### ActiveTab Permission
Used to read current science book allocations from the Utopia game page and inject the allocation interface. Only active when you're on a Utopia science page.

### Storage Permission
Used to save your custom science allocation ratios locally in your browser, allowing your preferences to persist across browser sessions.

### Scripting Permission
Required to inject JavaScript code into Utopia game pages to read current science book values and display the allocation interface.

### Host Permissions (utopia-game.com)
Necessary for the extension to function on Utopia game pages. The extension only operates on science allocation pages and does not access any other websites.

## Data Security

- All data is stored using Chrome's secure storage API
- No external network connections are made
- No data is transmitted over the internet
- Your data is protected by Chrome's built-in security measures

## Your Rights

- You can view your stored ratios at any time through the extension popup
- You can modify or delete your ratios through the extension interface
- You can uninstall the extension at any time, which will remove all stored data
- You can reset to default ratios at any time

## Children's Privacy

This extension is not intended for children under 13. We do not knowingly collect personal information from children under 13.

## Changes to This Policy

We may update this privacy policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.

## Contact

If you have any questions about this privacy policy or the extension, please contact us through the Chrome Web Store listing or create an issue on the extension's GitHub repository.

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- Chrome Extension Manifest V3 requirements
- General data protection best practices

---

**Note**: This extension does not use remote code or external services. All functionality is provided by local code files included with the extension.
