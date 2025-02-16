// tier-management.js
import { createTierIconElement } from './element-creation.js';

export function populateTierIcons(killerData, survivorData, showKillerDetails, loadJSONData, currentTier, createPerkElement) {
    const tierContainers = document.querySelectorAll('.killers-container');

    tierContainers.forEach((container, index) => {
        // Determine tier based on the parent section's data-tab-content
        const parentSection = container.closest('section');
        const tier = parentSection ? parentSection.dataset.tabContent : null;
        const ruleset = parentSection ? parentSection.dataset.ruleset : null;

        // Set data attributes if not already set
        container.dataset.tier = tier;
        container.dataset.ruleset = ruleset;

        const data = ruleset === 'killer' ? killerData : survivorData;

        // Determine which characters to show
        let tierCharacters = [];
        if (ruleset === 'killer') {
            const tierKey = `top${tier.replace('tier', '')}`;
            tierCharacters = data[tierKey] || [];
        } else {
            // For survivor, use the same killer characters
            const tierKey = `top${tier.replace('tier', '')}`;
            tierCharacters = killerData[tierKey] || [];
        }

        if (tierCharacters.length > 0) {
            const tierIconsHTML = tierCharacters
                .map(character => {
                    // Find the killer in the killers array to get the icon
                    const killerDetails = killerData.killers.find(killer =>
                        killer.name.toLowerCase() === character.name.toLowerCase()
                    );

                    const iconElement = createTierIconElement({
                        ...character,
                        icon: killerDetails ? killerDetails.icon : './assets/images/charPortrait_bg.webp', // fallback icon
                        type: ruleset === 'killer' ? 'killer' : 'survivor'
                    });

                    // Wrap the icon with a clickable div
                    return `
            <div class="killer-icon-wrapper" data-killer-name="${character.name}" data-ruleset="${ruleset}">
              ${iconElement}
            </div>
          `;
                })
                .join('');

            container.innerHTML = tierIconsHTML;

            // Add click event listeners to killer icons
            container.querySelectorAll('.killer-icon-wrapper').forEach(wrapper => {
                wrapper.addEventListener('click', (event) => {
                    // Remove any existing details containers in this tier
                    const existingDetailsContainer = parentSection.querySelector('.killer-details-container');
                    if (existingDetailsContainer) {
                        existingDetailsContainer.remove();
                    }

                    const killerName = wrapper.dataset.killerName;
                    const ruleset = wrapper.dataset.ruleset;
                    showKillerDetails(killerData, killerName, ruleset, parentSection, currentTier, loadJSONData, createPerkElement);
                });
            });
        } else {
            container.innerHTML = '<p class="text-neutral-400 text-center w-full">No characters available for this tier.</p>';
        }
    });
}

export function showKillerDetails(killerData, killerName, ruleset, parentSection, currentTier, loadJSONData, createPerkElement) {
    // Find the killer details in the data
    const killerDetails = killerData.killers.find(killer =>
        killer.name.toLowerCase() === killerName.toLowerCase()
    );

    if (!killerDetails) {
        console.error(`Killer not found: ${killerName}`);
        return;
    }

    // Create a details container
    const detailsContainer = document.createElement('div');
    detailsContainer.classList.add('killer-details-container', 'mt-6', 'p-4', 'bg-neutral-800', 'rounded-lg');

    // Function to update details container
    function updateDetailsContainer(rulesetDescription, tierData) {
        // Determine the description to use
        const killerDescription = killerDetails.description || rulesetDescription || 'No description available';

        // Check for killer-specific tier details
        const killerTierData = tierData && tierData.killer_specific && tierData.killer_specific[killerName]
            ? tierData.killer_specific[killerName]
            : null;

          const killerAvailableMapsHtml = killerTierData && killerTierData.available_maps ? `
      <div class="mb-6">
        <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Killer-Specific Available Maps</h4>
        <div class="flex flex-wrap justify-center gap-4">
          ${killerTierData.available_maps.map(mapName => {
              const getMapFileName = (name) => {
                  const variantMap = {
                      'Coal Tower I': 'coaltower',
                      'Coal Tower II': 'coaltower',
                      'Groaning Storehouse I': 'groaningstorehouse',
                      'Groaning Storehouse II': 'groaningstorehouse',
                      'Ironworks of Misery I': 'ironworksofmisery',
                      'Ironworks of Misery II': 'ironworksofmisery',
                      'Shelter Woods I': 'shelterwoods',
                      'Shelter Woods II': 'shelterwoods',
                      'Suffocation Pit I': 'suffocationpit',
                      'Suffocation Pit II': 'suffocationpit',
                      'Badham Preschool I': 'badhampreschool',
                      'Badham Preschool II': 'badhampreschool',
                      'Badham Preschool III': 'badhampreschool',
                      'Badham Preschool IV': 'badhampreschool',
                      'Badham Preschool V': 'badhampreschool',
                      'Family Residence I': 'familyresidence',
                      'Family Residence II': 'familyresidence',
                      'Sanctum of Wrath I': 'sanctumofwrath',
                      'Sanctum of Wrath II': 'sanctumofwrath',
                      'Mount Ormond Resort I': 'mountormondresort',
                      'Mount Ormond Resort II': 'mountormondresort',
                      'Mount Ormond Resort III': 'mountormondresort',
                      'Raccoon City Police Station East Wing': 'rpdeast',
                      'Raccoon City Police Station West Wing': 'rpdwest',
                      'Haddonfield': 'lampkinlane',
                      'Crotus Prenn Asylum': 'disturbedward',
                      'Father Campbell\'s Chapel': 'fathercampbellschapel',
                      'Mother\'s Dwelling': 'mothersdwelling'
                  };

                  return variantMap[name] || name.toLowerCase().replace(/\s+/g, '');
              };

              const mapFileName = getMapFileName(mapName);
              const mapImagePath = `./assets/images/maps/${mapFileName}.png`;

              return `
              <div class="map-card bg-neutral-700 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 w-64">
                <img src="${mapImagePath}" alt="${mapName}" class="w-64 h-48 object-cover mx-auto">
                <div class="p-4 text-center">
                  <h4 class="text-neutral-100 font-semibold">${mapName}</h4>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : '';

        const bannedPerksHtml = killerTierData && killerTierData.banned_perks ? `
        <div class="mb-6">
          <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Banned Perks</h4>
          <div class="flex flex-wrap justify-center gap-6">
            ${killerTierData.banned_perks.map(perkName => {
                // Find the perk details in killerData.banned_perks array
                const perk = killerData.banned_perks.find(p => p.name === perkName);
                if (perk) {
                    return createPerkElement(perk);
                } else {
                    return `<div>Perk "${perkName}" not found.</div>`;
                }
            }).join('')}
          </div>
        </div>
        ` : '';

        const bannedCombosHtml = killerTierData && killerTierData.banned_combos ? `
        <div class="mb-6">
          <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Banned Combos</h4>
          <ul class="list-disc list-inside text-neutral-300">
            ${killerTierData.banned_combos.map(combo => `<li>${combo}</li>`).join('')}
          </ul>
        </div>
      ` : '';

        const bannedAddonsHtml = killerTierData && killerTierData.banned_addons ? `
      <div class="mb-6">
        <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Banned Add-ons</h4>
        <ul class="list-disc list-inside text-neutral-300">
          ${killerTierData.banned_addons.map(addon => `<li>${addon}</li>`).join('')}
        </ul>
      </div>
    ` : '';

        detailsContainer.innerHTML = `
      <div class="flex items-center mb-6 justify-center">
        <img src="${killerDetails.icon.startsWith('http') ? killerDetails.icon : killerDetails.icon}" 
             alt="${killerDetails.name}" 
             class="w-24 h-24 object-contain mr-6 rounded-lg" draggable="false">
        <div>
          <h3 class="text-3xl font-bold ${ruleset === 'killer' ? 'text-red-500' : 'text-blue-500'} text-center">${killerDetails.name}</h3>
          <p class="text-neutral-300 text-center">${killerDescription}</p>
        </div>
      </div>
      
      <div class="mb-6">
        <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Ruleset Overview</h4>
        <p class="text-neutral-300 text-center">${rulesetDescription}</p>
      </div>
      
      ${killerAvailableMapsHtml}
      ${bannedPerksHtml}
      ${bannedCombosHtml}
      ${bannedAddonsHtml}
      
      ${killerDetails.abilities && killerDetails.abilities.length > 0 ? `
        <div>
          <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Unique Abilities</h4>
          <ul class="list-disc list-inside text-neutral-300">
            ${killerDetails.abilities.map(ability => `<li>${ability}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${killerDetails.perks ? `
        <div>
          <h4 class="text-xl font-semibold text-neutral-200 border-b border-neutral-700 pb-2 mb-4 text-center">Unique Perks</h4>
          <div class="grid grid-cols-3 gap-4">
            ${killerDetails.perks.map(perk => `
              <div class="group relative w-full aspect-square shrink-0">
                <div class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
                  <img src="${perk.icon.startsWith('http') ? perk.icon : perk.icon}"
                       class="w-3/4 h-3/4 -rotate-45 object-contain select-none pointer-events-none"
                       alt="${perk.name}"
                       draggable="false">
                </div>
                <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700/90 p-4 rounded-lg min-w-[300px] max-w-md text-sm shadow-xl z-50 select-none max-h-[60vh] overflow-y-auto">
                  <h4 class="font-bold text-blue-500 mb-2">${perk.name}</h4>
                  <div class="text-gray-100">
                    ${perk.description}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}
    `;

        // Insert the details container after the killers-container in the same section
        const killersContainer = parentSection.querySelector('.killers-container');
        if (killersContainer) {
            killersContainer.insertAdjacentElement('afterend', detailsContainer);
        }
    }

    // Fetch ruleset description and tier details
    let rulesetDescription = 'Welcome to the Ruleset!';
    let tierData = null;

    // Determine the current tier (you might want to pass this as a parameter or derive it from the UI)
    // const currentTier = 'tier1'; // Default to tier1, modify as needed

    if (ruleset === 'killer' && killerData.ruleset_description && killerData.ruleset_description.killer) {
        rulesetDescription = killerData.ruleset_description.killer;
    }

    // Fetch tier data
    loadJSONData(`./assets/data/${currentTier}.json`)
        .then(data => {
            tierData = data;
            updateDetailsContainer(rulesetDescription, tierData);
        })
        .catch(error => {
            console.error(`Error fetching ${currentTier} data:`, error);
            updateDetailsContainer(rulesetDescription, null);
        });

    if (ruleset === 'survivor') {
        // Fetch survivor data from the global survivorData object
        if (window.survivorData && window.survivorData.ruleset_description && window.survivorData.ruleset_description.survivor) {
            rulesetDescription = window.survivorData.ruleset_description.survivor;
        } else {
            // If survivorData is not loaded, fetch it
            loadJSONData('./assets/data/survivor.json')
                .then(response => response.json())
                .then(data => {
                    // Store the survivor data globally for future use
                    window.survivorData = data;
                    rulesetDescription = data.ruleset_description.survivor;
                })
                .catch(error => {
                    console.error('Error fetching survivor ruleset description:', error);
                });
        }
    }
}