// ============================================================
// Supabase Client
// ============================================================
const SUPABASE_URL = 'https://aiiisosniegmhaptuajo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_UCB6prrb50VTlYoVuNTSfA_T4I6IPM_';
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const LOAD_MATERIALS = ['Gravel', 'Cutting', 'Othala', 'Others'];

// ============================================================
// Loading Spinner
// ============================================================
function Loading({ text = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm">{text}</span>
        </div>
    );
}

// ============================================================
// Materials & Locations (Calculator + Admin)
// ============================================================
async function fetchMaterials() {
    const { data, error } = await db.from('materials').select('*').order('id');
    if (error) { console.error('fetchMaterials:', error); return []; }
    return data || [];
}

async function fetchLocations() {
    const { data, error } = await db.from('locations').select('*').order('id');
    if (error) { console.error('fetchLocations:', error); return []; }
    return data || [];
}

async function updateMaterialField(id, field, value) {
    const { error } = await db.from('materials').update({ [field]: value }).eq('id', id);
    if (error) console.error('updateMaterial:', error);
}

async function updateLocationField(id, field, value) {
    const { error } = await db.from('locations').update({ [field]: value }).eq('id', id);
    if (error) console.error('updateLocation:', error);
}

// ============================================================
// Sites
// ============================================================
async function fetchSites() {
    const { data, error } = await db.from('sites').select('*').order('created_at', { ascending: false });
    if (error) { console.error('fetchSites:', error); return []; }
    return data || [];
}

async function createSite({ name, location, start_date, end_date }) {
    const { data, error } = await db.from('sites').insert({ name, location, start_date, end_date }).select().single();
    if (error) { console.error('createSite:', error); return null; }
    return data;
}

async function deleteSite(id) {
    const { error } = await db.from('sites').delete().eq('id', id);
    if (error) console.error('deleteSite:', error);
}

// ============================================================
// Default Vehicles
// ============================================================
async function fetchDefaultVehicles() {
    const { data, error } = await db.from('default_vehicles').select('*').order('created_at');
    if (error) { console.error('fetchDefaultVehicles:', error); return []; }
    return data || [];
}

async function addDefaultVehicle(number, owner_name) {
    const { data, error } = await db.from('default_vehicles').insert({ number, owner_name }).select().single();
    if (error) { console.error('addDefaultVehicle:', error); return null; }
    return data;
}

async function removeDefaultVehicle(id) {
    const { error } = await db.from('default_vehicles').delete().eq('id', id);
    if (error) console.error('removeDefaultVehicle:', error);
}

// ============================================================
// Daily Logs
// ============================================================
async function fetchDailyLogsForSite(siteId) {
    const { data, error } = await db.from('daily_logs').select('id, log_date').eq('site_id', siteId).order('log_date', { ascending: false });
    if (error) { console.error('fetchDailyLogs:', error); return []; }
    // For each log, get load count
    const enriched = [];
    for (const dl of (data || [])) {
        const { count } = await db.from('loads')
            .select('id', { count: 'exact', head: true })
            .in('vehicle_id', 
                (await db.from('vehicles').select('id').in('owner_id',
                    (await db.from('owners').select('id').eq('daily_log_id', dl.id)).data?.map(o=>o.id) || []
                )).data?.map(v=>v.id) || []
            );
        enriched.push({ ...dl, load_count: count || 0 });
    }
    return enriched;
}

async function getOrCreateDailyLog(siteId, date) {
    // Try existing
    let { data: dl } = await db.from('daily_logs').select('id').eq('site_id', siteId).eq('log_date', date).maybeSingle();
    
    if (!dl) {
        // Create new
        const { data: newDl, error } = await db.from('daily_logs').insert({ site_id: siteId, log_date: date }).select('id').single();
        if (error) { console.error('createDailyLog:', error); return null; }
        dl = newDl;
        
        // Auto-populate with default vehicles
        const defVehicles = await fetchDefaultVehicles();
        if (defVehicles.length > 0) {
            const ownerGroups = {};
            defVehicles.forEach(v => {
                if (!ownerGroups[v.owner_name]) ownerGroups[v.owner_name] = [];
                ownerGroups[v.owner_name].push(v);
            });
            for (const [ownerName, vehicles] of Object.entries(ownerGroups)) {
                const { data: owner } = await db.from('owners')
                    .insert({ daily_log_id: dl.id, name: ownerName, is_default: true, sort_order: 0 })
                    .select('id').single();
                if (owner) {
                    for (const v of vehicles) {
                        await db.from('vehicles').insert({ owner_id: owner.id, number: v.number, is_default: true });
                    }
                }
            }
        }
    }
    return dl.id;
}

// ============================================================
// Full Log Tree (owners -> vehicles -> loads)
// ============================================================
async function fetchFullLog(dailyLogId) {
    const { data, error } = await db.from('owners')
        .select('*, vehicles(*, loads(*))')
        .eq('daily_log_id', dailyLogId)
        .order('sort_order')
        .order('created_at');
    if (error) { console.error('fetchFullLog:', error); return []; }
    return data || [];
}

// ============================================================
// Owner CRUD
// ============================================================
async function dbAddOwner(dailyLogId, name, contact) {
    const { data, error } = await db.from('owners')
        .insert({ daily_log_id: dailyLogId, name, contact: contact || '' })
        .select().single();
    if (error) { console.error('addOwner:', error); return null; }
    return { ...data, vehicles: [] };
}

async function dbUpdateOwner(id, updates) {
    const { error } = await db.from('owners').update(updates).eq('id', id);
    if (error) console.error('updateOwner:', error);
}

// ============================================================
// Vehicle CRUD
// ============================================================
async function dbAddVehicle(ownerId, number) {
    const { data, error } = await db.from('vehicles')
        .insert({ owner_id: ownerId, number })
        .select().single();
    if (error) { console.error('addVehicle:', error); return null; }
    return { ...data, loads: [] };
}

async function dbUpdateVehicle(id, updates) {
    const { error } = await db.from('vehicles').update(updates).eq('id', id);
    if (error) console.error('updateVehicle:', error);
}

// ============================================================
// Load CRUD
// ============================================================
async function dbAddLoad(vehicleId, load) {
    const { data, error } = await db.from('loads')
        .insert({ vehicle_id: vehicleId, load_time: load.load_time, material: load.material, is_paid: load.is_paid, has_pass: load.has_pass })
        .select().single();
    if (error) { console.error('addLoad:', error); return null; }
    return data;
}

async function dbUpdateLoad(id, updates) {
    const { error } = await db.from('loads').update(updates).eq('id', id);
    if (error) console.error('updateLoad:', error);
}

async function dbDeleteLoad(id) {
    const { error } = await db.from('loads').delete().eq('id', id);
    if (error) console.error('deleteLoad:', error);
}
