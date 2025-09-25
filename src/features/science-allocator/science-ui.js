// Science UI Module
// Handles UI injection and display for the science allocator

class ScienceUI {
  constructor() {
    this.container = null;
    this.tableContainer = null;
    this.applyBtn = null;
    this.calculateBtn = null;
    this.closeBtn = null;
  }

  injectUI() {
    console.log('Utopia Science Allocator - Injecting UI...');
    
    // Create main container using UIComponents
    const { container, content, closeBtn } = UIComponents.createFloatingContainer('Science Allocator');
    this.container = container;
    this.closeBtn = closeBtn;
    
    // Create calculate button
    this.calculateBtn = UIComponents.createButton(
      'calculate-distribution',
      'Calculate Distribution',
      'utopia-btn utopia-btn-primary'
    );
    
    // Create floating table container
    this.tableContainer = UIComponents.createTableContainer();
    
    // Create apply button
    this.applyBtn = UIComponents.createButton(
      'apply-allocation',
      'Apply Allocation',
      'utopia-btn utopia-btn-success'
    );
    this.applyBtn.style.display = 'none';
    
    // Assemble content
    content.appendChild(this.calculateBtn);
    content.appendChild(this.tableContainer);
    content.appendChild(this.applyBtn);
    
    // Inject into page
    document.body.appendChild(container);
    console.log('Utopia Science Allocator - UI injected successfully!');
    
    return {
      calculateBtn: this.calculateBtn,
      applyBtn: this.applyBtn,
      closeBtn: this.closeBtn,
      tableContainer: this.tableContainer
    };
  }

  displaySuggestions(suggestions) {
    // Clear previous content
    this.tableContainer.innerHTML = '';
    
    // Create table using UIComponents
    const headers = [
      'Category', 'Science Type', 'Current Books', 'Ideal Target', 
      'Deficit', 'Suggested', 'Available', 'Weight', 'Current Ratio'
    ];
    
    const { table, body } = UIComponents.createTable(headers);
    
    ['economy', 'military', 'arcane'].forEach((category, categoryIndex) => {
      const categoryData = suggestions[category];
      if (!categoryData || Object.keys(categoryData.categories).length === 0) return;
      
      // Add category separator row (except for the first category)
      if (categoryIndex > 0) {
        body.appendChild(UIComponents.createCategorySeparator());
      }
      
      // Add category header row
      body.appendChild(UIComponents.createCategoryHeader(category));
      
      // Use the correct order instead of Object.entries
      const orderedSubcategories = UtopiaConstants.CATEGORY_ORDER[category] || Object.keys(categoryData.categories);
      
      // Calculate total current books in this category once
      const totalCurrentInCategory = Object.values(categoryData.categories).reduce((sum, val) => sum + (val.current || 0), 0);
      const totalWeightInCategory = Object.values(categoryData.categories).reduce((sum, val) => sum + (val.weight || 0), 0);
      
      orderedSubcategories.forEach(subcategory => {
        const data = categoryData.categories[subcategory];
        if (!data) return; // Skip if subcategory doesn't exist
        
        const row = UIComponents.createDataRow(
          category, 
          subcategory, 
          data, 
          totalCurrentInCategory, 
          totalWeightInCategory
        );
        body.appendChild(row);
      });
    });
    
    this.tableContainer.appendChild(table);
    
    // Show table and apply button
    this.tableContainer.style.display = 'block';
    this.applyBtn.style.display = 'inline-block';
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
    let totalAvailable = 0;
    
    tableRows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 4) {
        const scienceName = cells[0]?.textContent?.trim().toLowerCase();
        const inputField = cells[3]?.querySelector('input');
        
        if (scienceName && inputField) {
          const category = Utils.getScienceCategory(scienceName);
          if (category) {
            const key = `${category.category}-${category.subcategory}`;
            const value = fieldMap.get(key);
            
            if (value !== undefined && value > 0) {
              inputField.value = value;
              inputField.dispatchEvent(new Event('input', { bubbles: true }));
              inputField.dispatchEvent(new Event('change', { bubbles: true }));
              filledCount++;
              totalAvailable += value;
            }
          }
        }
      }
    });
    
    if (filledCount > 0) {
      UIComponents.createNotification(`Applied ${filledCount} allocations (${Utils.formatNumber(totalAvailable)} books) to the page.`, 'success');
    } else {
      UIComponents.createNotification('No allocations to apply (all values are 0).', 'info');
    }
  }

  closeAllocator() {
    if (this.container) {
      this.container.style.display = 'none';
      UIComponents.createReopenButton();
    }
  }

  showError(message) {
    UIComponents.createNotification(message, 'error');
  }

  showSuccess(message) {
    UIComponents.createNotification(message, 'success');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScienceUI;
} else {
  window.ScienceUI = ScienceUI;
}
