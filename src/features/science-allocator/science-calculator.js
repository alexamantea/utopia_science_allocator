// Science Calculator Module
// Handles the calculation logic for optimal science book distribution

class ScienceCalculator {
  constructor(storageManager) {
    this.storageManager = storageManager;
    this.ratios = null;
  }

  async loadRatios() {
    this.ratios = await this.storageManager.loadUserRatios();
  }

  updateRatios(newRatios) {
    this.ratios = { ...this.ratios, ...newRatios };
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
        const currentBooks = Utils.parseNumber(currentBooksText);
        const inputField = cells[3]?.querySelector('input');
        
        if (scienceName && inputField) {
          const category = Utils.getScienceCategory(scienceName);
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
        const available = Utils.parseNumber(match[2]);
        
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

  calculateOptimalDistribution() {
    const scienceData = this.extractScienceData();
    
    if (!scienceData || Utils.isEmptyData(scienceData)) {
      throw new Error('No science data found. Please make sure you are on the Utopia science page.');
    }

    const suggestions = {
      economy: { categories: {} },
      military: { categories: {} },
      arcane: { categories: {} }
    };

    // Calculate for each category
    ['economy', 'military', 'arcane'].forEach(category => {
      const categoryData = scienceData[category];
      const ratios = this.ratios[category];
      
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
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScienceCalculator;
} else {
  window.ScienceCalculator = ScienceCalculator;
}
