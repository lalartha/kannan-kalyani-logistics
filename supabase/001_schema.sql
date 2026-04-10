-- ============================================================
-- Kannan Kalyani Logistics — Supabase Schema
-- ============================================================

-- Materials catalog
CREATE TABLE IF NOT EXISTS materials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    pricing_type TEXT NOT NULL CHECK (pricing_type IN ('per_ft', 'per_load')),
    price_per_ft NUMERIC,
    price_per_load NUMERIC,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Delivery zones
CREATE TABLE IF NOT EXISTS locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    transport_rate NUMERIC NOT NULL,
    distance_km NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Construction sites
CREATE TABLE IF NOT EXISTS sites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company default vehicles (auto-populate into each new daily log)
CREATE TABLE IF NOT EXISTS default_vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number TEXT NOT NULL UNIQUE,
    owner_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily logs (one per site per date)
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(site_id, log_date)
);

-- Transporter / owner sections within a daily log
CREATE TABLE IF NOT EXISTS owners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact TEXT DEFAULT '',
    is_default BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles under each owner
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    number TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_disabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual load entries
CREATE TABLE IF NOT EXISTS loads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    load_time TEXT NOT NULL,
    material TEXT NOT NULL DEFAULT 'Gravel',
    is_paid BOOLEAN DEFAULT FALSE,
    has_pass BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_daily_logs_site ON daily_logs(site_id, log_date);
CREATE INDEX IF NOT EXISTS idx_owners_log ON owners(daily_log_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_owner ON vehicles(owner_id);
CREATE INDEX IF NOT EXISTS idx_loads_vehicle ON loads(vehicle_id);

-- ============================================================
-- Row Level Security (permissive for anon — single-admin tool)
-- ============================================================
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_materials" ON materials FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_locations" ON locations FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_sites" ON sites FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE default_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_default_vehicles" ON default_vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_daily_logs" ON daily_logs FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_owners" ON owners FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_vehicles" ON vehicles FOR ALL TO anon USING (true) WITH CHECK (true);

ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all_loads" ON loads FOR ALL TO anon USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Data
-- ============================================================
INSERT INTO materials (name, pricing_type, price_per_ft, price_per_load, description) VALUES
    ('M-Sand',        'per_ft',   50,   NULL, 'Manufactured sand for plastering & brickwork'),
    ('P-Sand',        'per_ft',   55,   NULL, 'Plastering-grade fine sand'),
    ('Crushed Metal', 'per_ft',   48,   NULL, 'Crushed stone aggregate for concrete'),
    ('Rock Boulders', 'per_load', NULL, 5000, 'Large boulders for foundations'),
    ('Gravel',        'per_load', NULL, 3000, 'Natural gravel for road base & filling'),
    ('Cutting Earth', 'per_load', NULL, 2500, 'Excavated earth for land filling'),
    ('Quarry Waste',  'per_load', NULL, 2000, 'Quarry by-product for sub-base layers')
ON CONFLICT DO NOTHING;

INSERT INTO locations (name, transport_rate, distance_km) VALUES
    ('Kollam',         1500, 8),
    ('Munroe Thuruth',  2500, 20),
    ('Kallada',        1800, 15)
ON CONFLICT DO NOTHING;
