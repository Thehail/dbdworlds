// main.js
import { loadJSONData } from './utils.js';
import { createPerkElement, createAddonElement, createTierIconElement } from './element-creation.js';
import { populateTierIcons, showKillerDetails } from './tier-management.js';
import { createKillerBannedCombos, createSurvivorBannedCombos } from './combo-management.js';
import { updateTabContent } from './tab-management.js';
import { setupRulesetToggle } from './ruleset-toggle.js';
import { populateMapGrid } from './map-management.js';

document.addEventListener('DOMContentLoaded', async () => {

    // Load Killer and Survivor data
    const killerData = await loadJSONData('./assets/data/killer.json');
    const survivorData = await loadJSONData('./assets/data/survivor.json');
    const tier1Data = await loadJSONData('./assets/data/tier1.json');
    const currentTier = 'tier1'; // Default to tier1, modify as needed

    // Populate tier icons after data is loaded
    populateTierIcons(killerData, survivorData, showKillerDetails, loadJSONData, currentTier, createPerkElement);

    // Populate Killer Perks
    if (killerData && killerData.banned_perks) {
        const killerBannedPerks = [
            "Alien Instinct", "All-Shaking Thunders", "Awakened Awareness",
            "Barbecue & Chilli", "Batteries Included", "Bitter Murmur",
            "Coup de Grâce", "Dark Arrogance", "Darkness Revealed",
            "Dead Man's Switch", "Deadlock", "Dissolution", "Dominance",
            "Forced Hesitation", "Friends 'til the End", "Game Afoot",
            "Gearhead", "Genetic Limits", "Grim Embrace",
            "Hex: Blood Favour", "Hex: Crowd Control", "Hex: Haunted Ground",
            "Hex: Retribution", "Hex: Thrill of the Hunt", "Hubris",
            "Human Greed", "Languid Touch", "Lethal Pursuer", "Leverage",
            "Machine Learning", "No Quarter", "Nowhere to Hide",
            "Play with Your Food", "Predator",
            "Scourge Hook: Floods of Rage", "Scourge Hook: Jagged Compass",
            "Scourge Hook: Monstrous Shrine", "Starstruck", "Terminus",
            "THWACK!", "Ultimate Weapon", "Unbound", "Unforeseen",
            "Weave Attunement", "Zanshin Tactics"
        ];

        const killerPerkContainer = document.querySelector('[data-tab-content="general"][data-ruleset="killer"] [data-perk-entries]');
        if (killerPerkContainer) {
            killerPerkContainer.innerHTML = killerData.banned_perks
                .filter(perk => killerBannedPerks.includes(perk.name))
                .map(createPerkElement)
                .join('');
        }
    }

    // Populate Survivor Perks
    if (survivorData && survivorData.banned_perks) {
        const survivorBannedPerks = [
            "Adrenaline",
            "Balanced Landing",
            "Bite the Bullet",
            "Botany Knowledge",
            "Clairvoyance",
            "Dead Hard",
            "Decisive Strike",
            "Deliverance",
            "Desperate Measures",
            "Empathic Connection",
            "Hope",
            "Inner Focus",
            "Inner Strength",
            "Leader",
            "Left Behind",
            "Lightweight",
            "Lithe",
            "Lucky Break",
            "Overcome",
            "Premonition",
            "Resilience",
            "Resurgence",
            "Rookie Spirit",
            "Second Wind",
            "Self-Care",
            "Smash Hit",
            "Solidarity",
            "Sprint Burst",
            "Unbreakable",
            "We'll Make It",
            "We're Gonna Live Forever"
        ];

        const survivorPerkContainer = document.querySelector('[data-tab-content="general"][data-ruleset="survivor"] [data-perk-entries]');
        if (survivorPerkContainer) {
            survivorPerkContainer.innerHTML = survivorData.banned_perks
                .filter(perk => survivorBannedPerks.includes(perk.name))
                .map(createPerkElement)
                .join('');
        }
    }

    // Populate Killer Addons
    if (killerData && killerData.banned_addons) {
        const addonContainer = document.querySelector('[data-addon-entries]');
        if (addonContainer) {
            addonContainer.innerHTML = killerData.banned_addons.map(createAddonElement).join('');
        }
    }

    // Toggle switch functionality
    const rulesetToggle = document.getElementById('ruleset-toggle');
    const bookIcon = document.querySelector('.material-icons');
    let currentRuleset = 'killer'; // Default to killer

    // Function to update footer link styles
    function updateFooterLinks() {
        const footerLinks = document.querySelectorAll('footer a');

        footerLinks.forEach(link => {
            // Determine active color based on current ruleset
            const activeColor = currentRuleset === 'survivor' ? 'text-blue-500' : 'text-red-500';
            const hoverColor = currentRuleset === 'survivor' ? 'hover:text-blue-600' : 'hover:text-red-600';
            const inactiveColor = 'text-neutral-200';
            const hoverInactiveColor = 'hover:text-neutral-100';

            // Remove all color classes
            link.classList.remove(
                'text-red-500', 'text-blue-500', 'text-neutral-200',
                'hover:text-red-600', 'hover:text-blue-600', 'hover:text-neutral-100'
            );

            // Add appropriate classes
            link.classList.add(activeColor, hoverColor);
        });
    }

    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');

    //setupRulesetToggle(killerData, survivorData, updateFooterLinks, currentRuleset, bookIcon, tabButtons, populateMapGrid);

    // Initialize with default tab
    updateTabContent('general', tabButtons, currentRuleset, populateMapGrid, tier1Data);

    // Initial population of combos
    const killerComboContainer = document.querySelector('[data-combos]');
    killerComboContainer.innerHTML = createKillerBannedCombos(killerData);

    // Survivor combos
    const survivorComboContainer = document.querySelector('[data-survivor-combos]');
    survivorComboContainer.innerHTML = createSurvivorBannedCombos(survivorData);

    // Update visibility based on the default ruleset
    const sections = document.querySelectorAll('[data-ruleset]');
    sections.forEach(section => {
        const isSurvivorSection = section.dataset.ruleset === 'survivor';
        section.classList.toggle('hidden', isSurvivorSection);
    });

    // Initialize banned addons
    const addonContainer = document.querySelector('[data-addon-entries]');
    const addonEntries = addonContainer.dataset.addonEntries.split(',').map(Number);

    addonContainer.innerHTML = addonEntries.map(entry => {
        const addon = killerData.banned_addons.find(a => a.entry === entry.toString());
        if (!addon) return '';

        return `
      <div class="group relative w-14 aspect-square">
        <div class="w-full h-full border-4 border-black rotate-45 flex items-center justify-center overflow-hidden bg-gradient-to-r from-[#fbc604] to-[#b15808]">
          <img src="${addon.icon.startsWith('http') ? addon.icon : addon.icon}"
               class="w-12 h-12 -rotate-45 object-contain select-none pointer-events-none"
               alt="${addon.name}"
               draggable="false">
        </div>
        <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700/90 p-4 rounded-lg min-w-[300px] max-w-md text-sm shadow-xl z-50 select-none max-h-[60vh] overflow-y-auto">
          <h4 class="font-bold text-red-500 mb-2">${addon.name}</h4>
          <p class="text-gray-100">${addon.description}</p>
        </div>
      </div>
    `;
    }).join('');

    // Update character portrait background images
    const characterPortraitBg = document.querySelector('.charPortraitBg');
    const characterPortraitRoleBg = document.querySelector('.charPortraitRoleBg');

    if (characterPortraitBg) {
        characterPortraitBg.src = './assets/images/charPortrait_bg.webp';
    }

    if (characterPortraitRoleBg) {
        characterPortraitRoleBg.src = './assets/images/charPortrait_roleBG.webp';
    }

    // Add event listener to dynamically adjust tooltip width
    document.addEventListener('mouseover', (event) => {
        const tooltip = event.target.closest('.group')?.querySelector('.dynamic-tooltip');
        if (tooltip) {
            // Reset width to minimum
            tooltip.style.width = 'auto';

            // If tooltip content is taller than 450px, increase width
            if (tooltip.scrollHeight > 450) {
                tooltip.style.width = '500px';
            }
        }
    });

    // Initial map grid population on page load
    populateMapGrid('tier1', tier1Data);

    //ruleset toggle
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
        updateTabContent(currentTab, tabButtons, currentRuleset, populateMapGrid, tier1Data);
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateTabContent(button.dataset.tab, tabButtons, currentRuleset, populateMapGrid, tier1Data);
        });
    });
});