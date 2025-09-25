// UI Components Module
// Reusable UI components for the extension

class UIComponents {
  static createFloatingContainer(title, icon = '🎯') {
    const container = document.createElement('div');
    container.id = 'utopia-science-allocator';
    container.className = 'utopia-allocator-container';
    
    // Create header with close button
    const header = document.createElement('div');
    header.className = 'utopia-allocator-header';
    header.innerHTML = `<span>${icon} ${title}</span>`;
    
    const closeBtn = document.createElement('button');
    closeBtn.id = 'close-allocator';
    closeBtn.textContent = '✕';
    closeBtn.className = 'utopia-btn utopia-btn-close';
    closeBtn.title = 'Close';
    
    header.appendChild(closeBtn);
    
    // Create content wrapper
    const content = document.createElement('div');
    content.className = 'utopia-allocator-content';
    
    // Assemble UI
    container.appendChild(header);
    container.appendChild(content);
    
    return { container, content, closeBtn };
  }

  static createButton(id, text, className, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    button.className = className;
    
    if (onClick) {
      button.addEventListener('click', onClick);
    }
    
    return button;
  }

  static createTable(headers, data) {
    const table = document.createElement('table');
    table.className = 'utopia-allocation-table';
    
    // Create header
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });
    
    header.appendChild(headerRow);
    table.appendChild(header);
    
    // Create body
    const body = document.createElement('tbody');
    table.appendChild(body);
    
    return { table, body };
  }

  static createNotification(message, type) {
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
    
    return notification;
  }

  static createReopenButton() {
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
    return reopenBtn;
  }

  static createTableContainer() {
    const tableContainer = document.createElement('div');
    tableContainer.id = 'allocation-table';
    tableContainer.className = 'utopia-table-container';
    tableContainer.style.display = 'none';
    
    return tableContainer;
  }

  static createCategorySeparator() {
    const separatorRow = document.createElement('tr');
    separatorRow.className = 'category-separator';
    separatorRow.innerHTML = `
      <td colspan="9" class="separator-cell">
        <div class="separator-line"></div>
      </td>
    `;
    return separatorRow;
  }

  static createCategoryHeader(category) {
    const categoryHeaderRow = document.createElement('tr');
    categoryHeaderRow.className = 'category-header';
    const categoryIcon = UtopiaConstants.CATEGORY_ICONS[category];
    categoryHeaderRow.innerHTML = `
      <td colspan="9" class="category-header-cell">
        ${categoryIcon} ${category.charAt(0).toUpperCase() + category.slice(1)} Science
      </td>
    `;
    return categoryHeaderRow;
  }

  static createDataRow(category, subcategory, data, totalCurrentInCategory, totalWeightInCategory) {
    const row = document.createElement('tr');
    const deficitClass = data.deficit > 0 ? 'deficit-cell-high' : 'deficit-cell-low';
    const suggestedClass = data.suggested > 0 ? 'suggested-cell-high' : 'suggested-cell-low';
    
    // Calculate current ratio percentage
    const currentRatio = totalCurrentInCategory > 0 ? ((data.current / totalCurrentInCategory) * 100).toFixed(1) : '0.0';
    const targetRatio = ((data.weight / totalWeightInCategory) * 100).toFixed(1);
    
    row.innerHTML = `
      <td class="category-cell">${category.charAt(0).toUpperCase() + category.slice(1)}</td>
      <td class="subcategory-cell">${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}</td>
      <td class="current-cell">${Utils.formatNumber(data.current)}</td>
      <td class="ideal-cell">${Utils.formatNumber(data.ideal)}</td>
      <td class="deficit-cell ${deficitClass}">${Utils.formatNumber(data.deficit)}</td>
      <td class="suggested-cell ${suggestedClass}">
        <input type="number" value="${data.suggested}" min="0" 
               data-category="${category}" data-subcategory="${subcategory}">
      </td>
      <td class="available-cell">${Utils.formatNumber(data.available)}</td>
      <td class="weight-cell">${data.weight}x</td>
      <td class="ratio-cell">
        <span class="current-ratio">${currentRatio}%</span>
        <span class="target-ratio">(${targetRatio}%)</span>
      </td>
    `;
    
    return row;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIComponents;
} else {
  window.UIComponents = UIComponents;
}
