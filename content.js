// Utopia Science Allocator - Content Script
class UtopiaScienceAllocator {
  constructor() {
    this.isUtopiaPage = false;
    this.scienceData = null;
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
    this.init();
  }

  init() {
    // Check if we're on a Utopia science page
    this.checkUtopiaPage();
    
    if (this.isUtopiaPage) {
      this.injectUI();
      this.loadUserRatios();
      this.setupMessageListener();
    }
    
    // Listen for navigation changes (when clicking links within the game)
    this.setupNavigationListener();
  }

  checkUtopiaPage() {
    // Check if we're on the correct Utopia science page URL
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
    this.isUtopiaPage = isCorrectUrl && (hasIndicators || hasScienceTable || hasNumberInputs);
    
    console.log('Final isUtopiaPage:', this.isUtopiaPage);
  }

  async loadUserRatios() {
    try {
      const result = await chrome.storage.sync.get(['scienceRatios']);
      if (result.scienceRatios) {
        this.defaultRatios = { ...this.defaultRatios, ...result.scienceRatios };
      }
    } catch (error) {
      console.log('Using default ratios:', error);
    }
  }

  injectUI() {
    console.log('Utopia Science Allocator - Injecting UI...');
    
    // Create main container
    const container = document.createElement('div');
    container.id = 'utopia-science-allocator';
    container.className = 'utopia-allocator-container';
    
    // Create calculate button
    const calculateBtn = document.createElement('button');
    calculateBtn.id = 'calculate-distribution';
    calculateBtn.textContent = 'Calculate Distribution';
    calculateBtn.className = 'utopia-btn utopia-btn-primary';
    
    // Create floating table container
    const tableContainer = document.createElement('div');
    tableContainer.id = 'allocation-table';
    tableContainer.className = 'utopia-table-container';
    tableContainer.style.display = 'none';
    
    // Create apply button
    const applyBtn = document.createElement('button');
    applyBtn.id = 'apply-allocation';
    applyBtn.textContent = 'Apply Allocation';
    applyBtn.className = 'utopia-btn utopia-btn-success';
    applyBtn.style.display = 'none';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-allocator';
    closeBtn.textContent = '✕';
    closeBtn.className = 'utopia-btn utopia-btn-close';
    closeBtn.title = 'Close';
    
    // Create header with close button
    const header = document.createElement('div');
    header.className = 'utopia-allocator-header';
    header.innerHTML = '<span>🎯 Science Allocator</span>';
    header.appendChild(closeBtn);
    
    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'utopia-allocator-content';
    content.appendChild(calculateBtn);
    content.appendChild(tableContainer);
    content.appendChild(applyBtn);
    
    // Assemble UI
    container.appendChild(header);
    container.appendChild(content);
    
    // Inject into page
    document.body.appendChild(container);
    console.log('Utopia Science Allocator - UI injected successfully!');
    
    // Add event listeners
    calculateBtn.addEventListener('click', () => this.calculateDistribution());
    applyBtn.addEventListener('click', () => this.applyAllocation());
    closeBtn.addEventListener('click', () => this.closeAllocator());
  }

  extractScienceData() {
    const data = {
      economy: { total: 0, available: 0, categories: {} },
      military: { total: 0, available: 0, categories: {} },
      arcane: { total: 0, available: 0, categories: {} }
    };

    // Extract available books from category headers
    this.extractAvailableBooks(data);

    // Extract current values from the science table
    const tableRows = document.querySelectorAll('table tbody tr');
    
    tableRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const scienceName = cells[0]?.textContent?.trim().toLowerCase();
        const currentBooksText = cells[1]?.textContent?.trim() || '0';
        const currentBooks = parseInt(currentBooksText.replace(/,/g, '')) || 0;
        const inputField = cells[3]?.querySelector('input');
        
        if (scienceName && inputField) {
          const category = this.getScienceCategory(scienceName);
          if (category) {
            data[category.category].categories[category.subcategory] = currentBooks;
            data[category.category].total += currentBooks;
          }
        }
      }
    });

    return data;
  }

  extractAvailableBooks(data) {
    // Look for category headers with available books
    const headers = document.querySelectorAll('h2');
    headers.forEach(header => {
      const text = header.textContent;
      console.log('Checking header text:', text);
      
      // Match pattern: "Category - X scientists - Y books available"
      const match = text.match(/^([^-]+?)\s*-\s*\d+\s*scientists\s*-\s*([\d,]+)\s*books available/);
      if (match) {
        const category = match[1].trim().toLowerCase();
        const available = parseInt(match[2].replace(/,/g, '')) || 0;
        
        console.log('Found category header:', category, 'with', available, 'books available');
        
        if (category === 'economy') {
          data.economy.available = available;
        } else if (category === 'military') {
          data.military.available = available;
        } else if (category === 'arcane arts') {
          data.arcane.available = available;
        }
      } else {
        console.log('No match for header:', text);
      }
    });
    
    // Debug logging for available books
    console.log('Available books extracted:', {
      economy: data.economy.available,
      military: data.military.available,
      arcane: data.arcane.available
    });
  }

  getScienceCategory(scienceName) {
    const mappings = {
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
    
    return mappings[scienceName];
  }


  calculateDistribution() {
    this.scienceData = this.extractScienceData();
    
    if (!this.scienceData || this.isEmptyData(this.scienceData)) {
      this.showError('No science data found. Please make sure you are on the Utopia science page.');
      return;
    }

    const suggestions = this.calculateOptimalDistribution();
    this.displaySuggestions(suggestions);
  }

  isEmptyData(data) {
    return data.economy.total === 0 && data.military.total === 0 && data.arcane.total === 0;
  }

  calculateOptimalDistribution() {
    const suggestions = {
      economy: { categories: {} },
      military: { categories: {} },
      arcane: { categories: {} }
    };

    // Calculate for each category
    ['economy', 'military', 'arcane'].forEach(category => {
      const categoryData = this.scienceData[category];
      const ratios = this.defaultRatios[category];
      
      if (!categoryData || !ratios) return;

      const totalWeight = Object.values(ratios).reduce((sum, weight) => sum + weight, 0);
      const availableBooks = categoryData.available;
      
      // Calculate total books in this category (current + available)
      const totalCurrentInCategory = Object.values(categoryData.categories).reduce((sum, val) => sum + val, 0);
      const totalBooksInCategory = totalCurrentInCategory + availableBooks;
      
      console.log(`Category: ${category}, Total current: ${totalCurrentInCategory}, Available: ${availableBooks}, Total: ${totalBooksInCategory}, Total weight: ${totalWeight}`);
      
      // First pass: calculate ideal ratios and identify deficits
      const subcategoryData = {};
      let totalDeficit = 0;
      
      Object.keys(ratios).forEach(subcategory => {
        const weight = ratios[subcategory];
        const current = categoryData.categories[subcategory] || 0;
        // Calculate ideal based on total books (current + available), not just available
        const ideal = Math.round((totalBooksInCategory * weight) / totalWeight);
        // Deficit is how much more we need to allocate to reach ideal
        const deficit = Math.max(0, ideal - current);
        
        subcategoryData[subcategory] = {
          weight,
          current,
          ideal,
          deficit,
          priority: deficit / weight // Higher priority for larger deficits relative to weight
        };
        
        totalDeficit += deficit;
      });
      
      // Second pass: distribute available books based on priority
      let remainingBooks = availableBooks;
      const allocations = {};
      
      // Sort by priority (highest deficit/weight ratio first)
      const sortedSubcategories = Object.keys(subcategoryData).sort((a, b) => 
        subcategoryData[b].priority - subcategoryData[a].priority
      );
      
      // Distribute books to most under-allocated categories first
      sortedSubcategories.forEach(subcategory => {
        const data = subcategoryData[subcategory];
        const maxAllocation = Math.min(data.deficit, remainingBooks);
        allocations[subcategory] = maxAllocation;
        remainingBooks -= maxAllocation;
      });
      
      // If there are still books left, distribute proportionally
      if (remainingBooks > 0) {
        const totalRemainingWeight = sortedSubcategories.reduce((sum, sub) => 
          sum + (allocations[sub] > 0 ? ratios[sub] : 0), 0);
        
        if (totalRemainingWeight > 0) {
          sortedSubcategories.forEach(subcategory => {
            if (allocations[subcategory] > 0) {
              const additionalAllocation = Math.round(
                (remainingBooks * ratios[subcategory]) / totalRemainingWeight
              );
              allocations[subcategory] += additionalAllocation;
            }
          });
        }
      }
      
      // Final pass: create suggestions
      Object.keys(ratios).forEach(subcategory => {
        const data = subcategoryData[subcategory];
        const suggested = allocations[subcategory] || 0;
        
        suggestions[category].categories[subcategory] = {
          current: data.current,
          ideal: data.ideal,
          suggested: suggested,
          weight: data.weight,
          available: availableBooks,
          deficit: data.deficit,
          priority: data.priority
        };
      });
    });

    return suggestions;
  }

  displaySuggestions(suggestions) {
    const tableContainer = document.getElementById('allocation-table');
    const applyBtn = document.getElementById('apply-allocation');
    
    // Clear previous content
    tableContainer.innerHTML = '';
    
    // Create table
    const table = document.createElement('table');
    table.className = 'utopia-allocation-table';
    
    // Create header
    const header = document.createElement('thead');
    header.innerHTML = `
      <tr>
        <th>Category</th>
        <th>Science Type</th>
        <th>Current Books</th>
        <th>Ideal Target</th>
        <th>Deficit</th>
        <th>Suggested</th>
        <th>Available</th>
        <th>Weight</th>
        <th>Current Ratio</th>
      </tr>
    `;
    table.appendChild(header);
    
    // Create body
    const body = document.createElement('tbody');
    
    ['economy', 'military', 'arcane'].forEach((category, categoryIndex) => {
      const categoryData = suggestions[category];
      if (!categoryData || Object.keys(categoryData.categories).length === 0) return;
      
      // Add category separator row (except for the first category)
      if (categoryIndex > 0) {
        const separatorRow = document.createElement('tr');
        separatorRow.className = 'category-separator';
        separatorRow.innerHTML = `
          <td colspan="8" class="separator-cell">
            <div class="separator-line"></div>
          </td>
        `;
        body.appendChild(separatorRow);
      }
      
      // Add category header row
      const categoryHeaderRow = document.createElement('tr');
      categoryHeaderRow.className = 'category-header';
      const categoryIcon = category === 'economy' ? '🏛️' : category === 'military' ? '⚔️' : '🔮';
      categoryHeaderRow.innerHTML = `
        <td colspan="8" class="category-header-cell">
          ${categoryIcon} ${category.charAt(0).toUpperCase() + category.slice(1)} Science
        </td>
      `;
      body.appendChild(categoryHeaderRow);
      
      // Define the correct order for each category as they appear in the game
      const categoryOrder = {
        economy: ['alchemy', 'tools', 'housing', 'production', 'bookkeeping', 'artisan'],
        military: ['strategy', 'siege', 'tactics', 'valor', 'heroism', 'resilience'],
        arcane: ['crime', 'channeling', 'shielding', 'cunning', 'sorcery', 'finesse']
      };
      
      // Use the correct order instead of Object.entries
      const orderedSubcategories = categoryOrder[category] || Object.keys(categoryData.categories);
      
      orderedSubcategories.forEach(subcategory => {
        const data = categoryData.categories[subcategory];
        if (!data) return; // Skip if subcategory doesn't exist
        const row = document.createElement('tr');
        const deficitClass = data.deficit > 0 ? 'deficit-cell-high' : 'deficit-cell-low';
        const suggestedClass = data.suggested > 0 ? 'suggested-cell-high' : 'suggested-cell-low';
        
        // Calculate current ratio percentage
        const totalCurrentInCategory = Object.values(categoryData.categories).reduce((sum, val) => sum + val, 0);
        const currentRatio = totalCurrentInCategory > 0 ? ((data.current / totalCurrentInCategory) * 100).toFixed(1) : '0.0';
        const targetRatio = ((data.weight / Object.values(this.defaultRatios[category]).reduce((sum, w) => sum + w, 0)) * 100).toFixed(1);
        
        row.innerHTML = `
          <td class="category-cell">${category.charAt(0).toUpperCase() + category.slice(1)}</td>
          <td class="subcategory-cell">${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</td>
          <td class="current-cell">${data.current.toLocaleString()}</td>
          <td class="ideal-cell">${data.ideal.toLocaleString()}</td>
          <td class="deficit-cell ${deficitClass}">${data.deficit.toLocaleString()}</td>
          <td class="suggested-cell ${suggestedClass}">
            <input type="number" value="${data.suggested}" min="0" 
                   data-category="${category}" data-subcategory="${subcategory}">
          </td>
          <td class="available-cell">${data.available.toLocaleString()}</td>
          <td class="weight-cell">${data.weight}x</td>
          <td class="ratio-cell">
            <span class="current-ratio">${currentRatio}%</span>
            <span class="target-ratio">(${targetRatio}%)</span>
          </td>
        `;
        body.appendChild(row);
      });
    });
    
    table.appendChild(body);
    tableContainer.appendChild(table);
    
    // Show table and apply button
    tableContainer.style.display = 'block';
    applyBtn.style.display = 'inline-block';
  }

  applyAllocation() {
    const inputs = document.querySelectorAll('#allocation-table input[type="number"]');
    const fieldMap = new Map();
    
    // Create mapping of category/subcategory to input fields
    inputs.forEach(input => {
      const category = input.dataset.category;
      const subcategory = input.dataset.subcategory;
      const value = parseInt(input.value) || 0;
      
      if (category && subcategory) {
        fieldMap.set(`${category}-${subcategory}`, value);
      }
    });
    
    // Find and fill corresponding input fields on the page
    const tableRows = document.querySelectorAll('table tbody tr');
    let filledCount = 0;
    
    tableRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const scienceName = cells[0]?.textContent?.trim().toLowerCase();
        const inputField = cells[3]?.querySelector('input');
        
        if (scienceName && inputField) {
          const category = this.getScienceCategory(scienceName);
          if (category) {
            const key = `${category.category}-${category.subcategory}`;
            const value = fieldMap.get(key);
            
            if (value !== undefined) {
              inputField.value = value;
              inputField.dispatchEvent(new Event('input', { bubbles: true }));
              inputField.dispatchEvent(new Event('change', { bubbles: true }));
              filledCount++;
            }
          }
        }
      }
    });
    
    this.showSuccess(`Applied ${filledCount} allocations to the page.`);
  }


  showError(message) {
    this.showNotification(message, 'error');
  }

  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  setupMessageListener() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'RATIOS_UPDATED') {
        this.defaultRatios = { ...this.defaultRatios, ...message.ratios };
        this.showNotification('Ratios updated! Recalculate to see new suggestions.', 'success');
      }
    });
  }

  setupNavigationListener() {
    // Listen for URL changes (when navigating within the game)
    let currentUrl = window.location.href;
    
    // Check for URL changes every 500ms
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        console.log('Utopia Science Allocator - URL changed, re-initializing...');
        
        // Remove existing UI
        const existingContainer = document.getElementById('utopia-science-allocator');
        if (existingContainer) {
          existingContainer.remove();
        }
        
        // Re-initialize
        setTimeout(() => {
          this.init();
        }, 100); // Small delay to let the page content load
      }
    }, 500);
    
    // Note: DOM observer removed to prevent conflicts with extension's own UI
    // URL change detection should be sufficient for navigation detection
  }

  closeAllocator() {
    const container = document.getElementById('utopia-science-allocator');
    if (container) {
      container.style.display = 'none';
      this.showReopenButton();
    }
  }

  showReopenButton() {
    // Remove existing reopen button
    const existing = document.getElementById('utopia-reopen-button');
    if (existing) {
      existing.remove();
    }

    // Create small floating reopen button
    const reopenBtn = document.createElement('button');
    reopenBtn.id = 'utopia-reopen-button';
    reopenBtn.textContent = '🎯';
    reopenBtn.className = 'utopia-reopen-btn';
    reopenBtn.title = 'Reopen Science Allocator';
    
    reopenBtn.addEventListener('click', () => {
      const container = document.getElementById('utopia-science-allocator');
      if (container) {
        container.style.display = 'block';
        reopenBtn.remove();
      }
    });
    
    document.body.appendChild(reopenBtn);
  }

  showNotification(message, type) {
    // Remove existing notifications
    const existing = document.querySelector('.utopia-notification');
    if (existing) {
      existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `utopia-notification utopia-notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new UtopiaScienceAllocator();
  });
} else {
  new UtopiaScienceAllocator();
}
