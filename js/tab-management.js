// tab-management.js

// Function to update tab content
export function updateTabContent(selectedTab, tabButtons, currentRuleset, populateMapGrid) {
    // Update tab button styles
    tabButtons.forEach(btn => {
      const isActive = btn.dataset.tab === selectedTab;
  
      // Determine active color based on current ruleset
      const activeBackgroundColor = currentRuleset === 'survivor' ? 'bg-blue-600' : 'bg-red-600';
  
      // Apply styles
      btn.classList.toggle(activeBackgroundColor, isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('bg-neutral-800', !isActive);
      btn.classList.toggle('text-neutral-200', !isActive);
      btn.classList.toggle('active', isActive);
    });
  
    // Update content visibility
    document.querySelectorAll('[data-tab-content]').forEach(content => {
      const isVisible = content.dataset.tabContent === selectedTab &&
        content.dataset.ruleset === currentRuleset;
      content.classList.toggle('hidden', !isVisible);
    });
  
    // Populate map grid for the selected tier
    populateMapGrid(selectedTab);
  }