// element-creation.js
export function createPerkElement(perk) {
    return `
      <div class="group relative w-14 aspect-square">
        <div class="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
          <img src="${perk.icon.startsWith('http') ? perk.icon : perk.icon}"
               class="w-12 h-12 -rotate-45 object-contain select-none pointer-events-none"
               alt="${perk.name}"
               draggable="false">
        </div>
        <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700/90 p-4 rounded-lg min-w-[300px] max-w-md text-sm shadow-xl z-50 select-none max-h-[60vh] overflow-y-auto dynamic-tooltip">
          <h4 class="font-bold text-red-500 mb-2">${perk.name}</h4>
          <div class="text-gray-100 [&_.yellow]:text-yellow-300 [&_.green]:text-green-300 [&_.purple]:text-purple-300 [&_ul]:list-disc [&_ul]:pl-5 [&_i]:italic">
            ${perk.description}
          </div>
        </div>
      </div>
    `;
  }
  
  export function createAddonElement(addon) {
    return `
      <div class="group relative w-full aspect-square">
        <div class="w-full h-full bg-gradient-to-br from-blue-600 to-green-600 border-4 border-black rotate-45 flex items-center justify-center overflow-hidden">
          <img src="${addon.icon.startsWith('http') ? addon.icon : addon.icon}"
               class="w-3/4 h-3/4 -rotate-45 object-contain select-none pointer-events-none"
               alt="${addon.name}"
               draggable="false">
        </div>
        <div class="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-700/90 p-4 rounded-lg min-w-[300px] max-w-[600px] text-sm shadow-xl z-50 select-none max-h-[60vh] overflow-y-auto dynamic-tooltip">
          <h4 class="font-bold text-red-500 mb-2">${addon.name}</h4>
          <div class="text-gray-100 [&_ul]:list-disc [&_ul]:pl-5 [&_i]:italic">
            ${addon.description}
          </div>
        </div>
      </div>
    `;
  }
  
  export function createTierIconElement(character) {
    return `
      <div class="role-container relative w-20 h-20 flex-shrink-0 cursor-pointer" style="transition: transform 0.2s ease-in-out;">
        <img src="./assets/images/charPortrait_bg.webp" class="charPortraitBg absolute inset-0 w-full h-full z-10" alt="Background" draggable="false" />
        <img src="./assets/images/charPortrait_roleBG.webp" class="charPortraitRoleBg ${character.type} absolute inset-0 w-full h-full z-20"
             style="filter: sepia(1) saturate(30) hue-rotate(289.1deg) saturate(7) brightness(0.47);"
             alt="Role Background" draggable="false" />
        ${character.icon ? `
          <img src="${character.icon.startsWith('http') ? character.icon : character.icon}" alt="${character.name}"
               class="killer-icon absolute inset-0 w-full h-full object-contain z-30"
               style="transition: transform 0.2s ease-in-out;"
               onmouseover="this.parentElement.style.transform = 'scale(1.25)'"
               onmouseout="this.parentElement.style.transform = 'scale(1)'"
               draggable="false" />
        ` : `
          <span class="absolute inset-0 z-30 flex items-center justify-center text-neutral-400">No Icon</span>
        `}
      </div>
    `;
  }