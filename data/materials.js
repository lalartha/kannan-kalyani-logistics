// ============================================
// MATERIALS DATA — Editable by Admin Panel
// Persisted in localStorage, seeded from defaults
// ============================================

const DEFAULT_MATERIALS = [
  {
    id: 1,
    name: "M-Sand",
    pricing_type: "per_ft",
    price_per_ft: 50,
    price_per_load: null,
    description: "Manufactured sand for plastering & brickwork",
    icon: "🏗️"
  },
  {
    id: 2,
    name: "P-Sand",
    pricing_type: "per_ft",
    price_per_ft: 55,
    price_per_load: null,
    description: "Plastering-grade fine sand",
    icon: "🧱"
  },
  {
    id: 3,
    name: "Crushed Metal",
    pricing_type: "per_ft",
    price_per_ft: 48,
    price_per_load: null,
    description: "Crushed stone aggregate for concrete work",
    icon: "⛏️"
  },
  {
    id: 4,
    name: "Rock Boulders",
    pricing_type: "per_load",
    price_per_ft: null,
    price_per_load: 5000,
    description: "Large rock boulders for foundations",
    icon: "🪨"
  },
  {
    id: 5,
    name: "Gravel",
    pricing_type: "per_load",
    price_per_ft: null,
    price_per_load: 3000,
    description: "Natural gravel for road base & filling",
    icon: "🔩"
  },
  {
    id: 6,
    name: "Cutting Earth",
    pricing_type: "per_load",
    price_per_ft: null,
    price_per_load: 2500,
    description: "Excavated earth for land filling",
    icon: "🌍"
  },
  {
    id: 7,
    name: "Quarry Waste",
    pricing_type: "per_load",
    price_per_ft: null,
    price_per_load: 2000,
    description: "Quarry by-product for sub-base layers",
    icon: "🏔️"
  }
];

// Load from localStorage or use defaults
function getMaterials() {
  const stored = localStorage.getItem('kk_materials');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fall through */ }
  }
  return DEFAULT_MATERIALS;
}

function saveMaterials(materials) {
  localStorage.setItem('kk_materials', JSON.stringify(materials));
}

// Initialize on first load
if (!localStorage.getItem('kk_materials')) {
  saveMaterials(DEFAULT_MATERIALS);
}
