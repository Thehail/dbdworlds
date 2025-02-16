// ruleset-toggle.js
import { createKillerBannedCombos, createSurvivorBannedCombos } from './combo-management.js';
import { updateTabContent } from './tab-management.js';

export function setupRulesetToggle(killerData, survivorData, updateFooterLinks, currentRuleset, bookIcon, tabButtons, populateMapGrid) {
  const rulesetToggle = document.getElementById('ruleset-toggle');

  rulesetToggle.addEventListener('change', () => {
    currentRuleset = rulesetToggle.checked ? 'survivor' : 'killer';

    // Update visibility of ruleset sections with explicit logging
    const sections = document.querySelectorAll('[data-ruleset]');
    sections.forEach(section => {
      const isSurvivorSection = section.dataset.ruleset === 'survivor';
      const isKillerSection = section.dataset.ruleset === 'killer';

      // Show/hide sections based on current ruleset
      if (currentRuleset === 'survivor') {
        section.classList.toggle('hidden', !isSurvivorSection);
      } else {
        section.classList.toggle('hidden', !isKillerSection);
      }
    });

    // Update tab button colors
    tabButtons.forEach(btn => {
      if (currentRuleset === 'survivor') {
        btn.classList.replace('bg-red-600', 'bg-blue-600');
        btn.classList.replace('text-white', 'text-white');
      } else {
        btn.classList.replace('bg-blue-600', 'bg-red-600');
        btn.classList.replace('text-white', 'text-white');
      }
    });

    // Update book icon color
    if (currentRuleset === 'survivor') {
      bookIcon.classList.replace('text-red-600', 'text-blue-600');
    } else {
      bookIcon.classList.replace('text-blue-600', 'text-red-600');
    }

    // Update footer link colors
    updateFooterLinks();

    // Render combos based on current ruleset
    const killerComboContainer = document.querySelector('[data-combos]');
    const survivorComboContainer = document.querySelector('[data-survivor-combos]');

    if (currentRuleset === 'killer') {
      killerComboContainer.innerHTML = createKillerBannedCombos(killerData);
      survivorComboContainer.innerHTML = ''; // Clear survivor combos
    } else {
      killerComboContainer.innerHTML = ''; // Clear killer combos
      survivorComboContainer.innerHTML = createSurvivorBannedCombos(survivorData);
    }

    // Maintain the current tab when switching rulesets
    const currentActiveTab = document.querySelector('.tab-button.active');
    const currentTab = currentActiveTab ? currentActiveTab.dataset.tab : 'general';
    updateTabContent(currentTab, tabButtons, currentRuleset, populateMapGrid);
  });
}