// ============================================
// LOCATIONS DATA — Editable by Admin Panel
// Persisted in localStorage, seeded from defaults
// ============================================

const DEFAULT_LOCATIONS = [
  {
    id: 1,
    name: "Kollam",
    transport_rate: 1500,
    distance_km: 8
  },
  {
    id: 2,
    name: "Kallada",
    transport_rate: 2500,
    distance_km: 22
  },
  {
    id: 3,
    name: "Munroe Thuruth",
    transport_rate: 2500,
    distance_km: 20
  },
  {
    id: 4,
    name: "Pavithreswaram",
    transport_rate: 2000,
    distance_km: 15
  },
  {
    id: 5,
    name: "West Kallada",
    transport_rate: 3000,
    distance_km: 28
  },
  {
    id: 6,
    name: "Shuttle (Local)",
    transport_rate: 1000,
    distance_km: 5
  }
];

// Load from localStorage or use defaults
function getLocations() {
  const stored = localStorage.getItem('kk_locations');
  if (stored) {
    try { return JSON.parse(stored); } catch(e) { /* fall through */ }
  }
  return DEFAULT_LOCATIONS;
}

function saveLocations(locations) {
  localStorage.setItem('kk_locations', JSON.stringify(locations));
}

// Initialize on first load
if (!localStorage.getItem('kk_locations')) {
  saveLocations(DEFAULT_LOCATIONS);
}
