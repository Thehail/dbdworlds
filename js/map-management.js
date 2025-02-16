// map-management.js

export function populateMapGrid(tier, tier1Data) {
    const mapGridContainer = document.getElementById('map-grid');
    if (!mapGridContainer) return;
  
    // Get available maps from tier1.json data
    const mapData = tier1Data.killer_specific;
    const allMaps = Object.values(mapData).flatMap(killer => killer.available_maps);
    const uniqueMaps = [...new Set(allMaps)];
  
    mapGridContainer.innerHTML = `
      <div class="flex flex-wrap justify-center gap-4">
        ${uniqueMaps.map(mapName => {
          // Function to handle map variants
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
            <div class="map-card bg-neutral-800 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105 w-64">
              <img src="${mapImagePath}" alt="${mapName}" class="w-64 h-48 object-cover">
              <div class="p-4 text-center">
                <h4 class="text-neutral-100 font-semibold">${mapName}</h4>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }