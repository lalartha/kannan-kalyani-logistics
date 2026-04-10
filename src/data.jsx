const DEFAULT_MATERIALS = [
    { id: 1, name: "M-Sand", pricing_type: "per_ft", price_per_ft: 50, price_per_load: null, description: "Manufactured sand for plastering & brickwork" },
    { id: 2, name: "P-Sand", pricing_type: "per_ft", price_per_ft: 55, price_per_load: null, description: "Plastering-grade fine sand" },
    { id: 3, name: "Crushed Metal", pricing_type: "per_ft", price_per_ft: 48, price_per_load: null, description: "Crushed stone aggregate for concrete" },
    { id: 4, name: "Rock Boulders", pricing_type: "per_load", price_per_ft: null, price_per_load: 5000, description: "Large boulders for foundations" },
    { id: 5, name: "Gravel", pricing_type: "per_load", price_per_ft: null, price_per_load: 3000, description: "Natural gravel for road base & filling" },
    { id: 6, name: "Cutting Earth", pricing_type: "per_load", price_per_ft: null, price_per_load: 2500, description: "Excavated earth for land filling" },
    { id: 7, name: "Quarry Waste", pricing_type: "per_load", price_per_ft: null, price_per_load: 2000, description: "Quarry by-product for sub-base layers"},
];
const DEFAULT_LOCATIONS = [
    { id: 1, name: "Kollam", transport_rate: 1500, distance_km: 8 },
    { id: 2, name: "Munroe Thuruth", transport_rate: 2500, distance_km: 20 },
    { id: 3, name: "Kallada", transport_rate: 1800, distance_km: 15 },
];

function getMaterials() { try { const s = localStorage.getItem('kk_materials'); if (s) return JSON.parse(s); } catch (e) {} return DEFAULT_MATERIALS; }
function saveMaterials(d) { localStorage.setItem('kk_materials', JSON.stringify(d)); }
function getLocations() { try { const s = localStorage.getItem('kk_locations'); if (s) return JSON.parse(s); } catch (e) {} return DEFAULT_LOCATIONS; }
function saveLocations(d) { localStorage.setItem('kk_locations', JSON.stringify(d)); }

const LOAD_MATERIALS = ['Gravel', 'Cutting', 'Othala', 'Others'];
function getSites() { try { const s = localStorage.getItem('kk_sites'); if (s) return JSON.parse(s); } catch (e) {} return []; }
function saveSites(d) { localStorage.setItem('kk_sites', JSON.stringify(d)); }
function getDefaultVehicles() { try { const s = localStorage.getItem('kk_def_vehicles'); if (s) return JSON.parse(s); } catch (e) {} return []; }
function saveDefaultVehicles(d) { localStorage.setItem('kk_def_vehicles', JSON.stringify(d)); }
function getLogKey(siteId, date) { return `kk_log_${siteId}_${date}`; }
function getRawLog(siteId, date) { try { const s = localStorage.getItem(getLogKey(siteId, date)); if (s) return JSON.parse(s); } catch (e) {} return null; }
function saveLog(siteId, date, data) { localStorage.setItem(getLogKey(siteId, date), JSON.stringify(data)); }
function buildLog(siteId, date) {
    const defs = getDefaultVehicles();
    const existing = getRawLog(siteId, date) || { owners: [] };
    const defOwnerMap = {};
    defs.forEach(v => { if (!defOwnerMap[v.owner_name]) defOwnerMap[v.owner_name] = []; defOwnerMap[v.owner_name].push(v); });
    Object.entries(defOwnerMap).forEach(([ownerName, vehicles]) => {
        let ownerEntry = existing.owners.find(o => o.is_default && o.name === ownerName);
        if (!ownerEntry) {
            ownerEntry = { id: `downer_${ownerName}`, name: ownerName, contact: '', is_default: true, is_disabled: false, is_open: true, vehicles: [] };
            existing.owners.unshift(ownerEntry);
        }
        vehicles.forEach(v => {
            const dvId = `dv_${v.id}`;
            if (!ownerEntry.vehicles.find(ev => ev.id === dvId)) {
                ownerEntry.vehicles.push({ id: dvId, number: v.number, is_default: true, is_disabled: false, loads: [] });
            }
        });
    });
    return existing;
}
