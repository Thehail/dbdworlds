// combo-management.js
import { createPerkElement } from './element-creation.js';

// Function to create survivor banned combo elements
export function createSurvivorBannedCombos(survivorData) {

  // Verify banned_perks exists and has content
  if (!survivorData || !survivorData.banned_perks) {
    return '<div class="text-red-500">Error: Survivor data not found</div>';
  }

  // Predefined indices for specific perks
  const perkIndices = {
    'Iron Will': 73,
    'Lucky Break': 81,
    'Overcome': 94,
    'Decisive Strike': 45,
    'Parental Guidance': 96
  };

  // Create banned combos with detailed logging
  const bannedCombos = [
    {
      perks: [
        survivorData.banned_perks[perkIndices['Iron Will']],
        survivorData.banned_perks[perkIndices['Lucky Break']]
      ]
    },
    {
      perks: [
        survivorData.banned_perks[perkIndices['Overcome']],
        survivorData.banned_perks[perkIndices['Lucky Break']]
      ]
    },
    {
      perks: [
        survivorData.banned_perks[perkIndices['Parental Guidance']],
        survivorData.banned_perks[perkIndices['Decisive Strike']]
      ]
    }
  ];

  // Check if any combos are valid
  const validCombos = bannedCombos.filter(combo =>
    combo.perks.every(perk => perk !== undefined)
  );

  // If no valid combos, return an error message
  if (validCombos.length === 0) {
    return '<div class="text-red-500">No valid survivor combos found</div>';
  }

  // Render combos
  return validCombos.map(combo => `
    <div class="combo-group inline-flex items-center p-4 bg-gray-700/50 rounded-lg mx-1">
      <div class="flex items-center gap-3">
        ${combo.perks.map((perk, index) => `
          ${index > 0 ? `<span class="text-2xl font-bold text-blue-500 mx-2">+</span>` : ''}
          <div class="group relative w-14 aspect-square shrink-0">
            <div class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
              <img src="${perk.icon.startsWith('http') ? perk.icon : perk.icon}"
                   class="w-12 h-12 -rotate-45 object-contain select-none pointer-events-none"
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
    </div>
  `).join('');
}

// Function to create killer banned combo elements
export function createKillerBannedCombos(killerData) {
  const bannedCombos = [
    { perks: [killerData.banned_perks[5], killerData.banned_perks[108]] },
    { perks: [killerData.banned_perks[32], killerData.banned_perks[105]] },
    { perks: [killerData.banned_perks[80], killerData.banned_perks[90]] },
    { perks: [killerData.banned_perks[50], killerData.banned_perks[82]] }
  ];

  return bannedCombos.map(combo => `
    <div class="combo-group inline-flex items-center p-4 bg-gray-700/50 rounded-lg mx-1">
      <div class="flex items-center gap-3">
        ${combo.perks.map((perk, index) => `
          ${index > 0 ? `<span class="text-2xl font-bold text-red-500 mx-2">+</span>` : ''}
          <div class="group relative w-14 aspect-square shrink-0">
            <div class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
              <img src="${perk.icon.startsWith('http') ? perk.icon : perk.icon}"
                   class="w-12 h-12 -rotate-45 object-contain select-none pointer-events-none"
                   alt="${perk.name}"
                   draggable="false">
            </div>
            <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700/90 p-4 rounded-lg min-w-[300px] max-w-md text-sm shadow-xl z-50 select-none max-h-[60vh] overflow-y-auto">
              <h4 class="font-bold text-red-500 mb-2">${perk.name}</h4>
              <div class="text-gray-100">
                ${perk.description}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}