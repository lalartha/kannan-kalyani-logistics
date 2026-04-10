
// ============================================
// KANNAN KALYANI — React App (Babel CDN)
// ============================================

const { useState, useEffect, useRef, useCallback } = React;

// ── Measurement options per plan ──────────────────────────────────────────────
const FT_OPTIONS = [145, 150, 195, 200, 250];

// ── Tiny Router ───────────────────────────────────────────────────────────────
function useRoute() {
  const [page, setPage] = useState(() => {
    const h = window.location.hash.replace('#', '') || 'home';
    return h;
  });
  useEffect(() => {
    const handler = () => {
      const h = window.location.hash.replace('#', '') || 'home';
      setPage(h);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  const navigate = (p) => { window.location.hash = p; };
  return [page, navigate];
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className={`toast ${type === 'success' ? 'toast-success' : 'toast-error'} flex items-center gap-3`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ page, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: 'home',       label: 'Home',       icon: '🏠' },
    { id: 'calculator', label: 'Calculator', icon: '🧮' },
    { id: 'admin',      label: 'Admin',      icon: '⚙️' },
    { id: 'contact',    label: 'Contact',    icon: '📞' },
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => { navigate('home'); setMenuOpen(false); }}
          className="flex items-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-black font-black text-base shadow-lg">
            KK
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-white font-bold text-sm tracking-wide">KANNAN KALYANI</div>
            <div className="text-surface-500 text-xs">Construction Logistics</div>
          </div>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => navigate(l.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                page === l.id
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-surface-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {page === l.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-brand-400 to-brand-600 rounded-full" />
              )}
              {l.label}
            </button>
          ))}
          <button
            onClick={() => navigate('calculator')}
            className="ml-3 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-black text-sm font-bold hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200 hover:-translate-y-0.5"
          >
            Get Estimate
          </button>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-white/5 transition-colors"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 px-4 pb-4">
          {links.map(l => (
            <button
              key={l.id}
              onClick={() => { navigate(l.id); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all ${
                page === l.id
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-surface-300 hover:bg-white/5'
              }`}
            >
              <span>{l.icon}</span> {l.label}
            </button>
          ))}
          <button
            onClick={() => { navigate('calculator'); setMenuOpen(false); }}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-brand-700 text-black font-bold text-sm"
          >
            🧮 Get Estimate
          </button>
        </div>
      )}
    </nav>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ navigate }) {
  return (
    <footer className="border-t border-white/5 mt-20 py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 flex items-center justify-center text-black font-black text-sm">KK</div>
          <div>
            <div className="text-white font-bold text-sm">KANNAN KALYANI</div>
            <div className="text-surface-500 text-xs">Construction Logistics & Services</div>
          </div>
        </div>
        <div className="flex gap-6 text-sm text-surface-400">
          {['home','calculator','contact','admin'].map(p => (
            <button key={p} onClick={() => navigate(p)} className="hover:text-brand-400 capitalize transition-colors">{p}</button>
          ))}
        </div>
        <div className="text-surface-600 text-xs text-center">
          © 2026 Kannan Kalyani. All rights reserved.<br/>
          <span className="text-surface-700">Based in Kollam, Kerala</span>
        </div>
      </div>
    </footer>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ navigate }) {
  const services = [
    { icon: '🏗️', title: 'M-Sand & P-Sand',    desc: 'High-quality manufactured & plastering sand for all construction needs.' },
    { icon: '⛏️', title: 'Crushed Metal',       desc: 'Precisely graded crushed stone aggregate for concrete and roads.' },
    { icon: '🪨', title: 'Rock Boulders',       desc: 'Durable boulders for foundations, retaining walls and landscaping.' },
    { icon: '🌍', title: 'Gravel & Earth',      desc: 'Natural gravel, cutting earth and quarry waste for filling & base layers.' },
    { icon: '🏚️', title: 'Building Demolition', desc: 'Safe and professional demolition services with complete waste removal.' },
    { icon: '📋', title: 'Land Development',    desc: 'End-to-end land development with full legal documentation support.' },
  ];

  const stats = [
    { value: '500+', label: 'Projects Delivered' },
    { value: '10+',  label: 'Years Experience' },
    { value: '6',    label: 'Service Zones' },
    { value: '24h',  label: 'Response Time' },
  ];

  // Map init
  useEffect(() => {
    setTimeout(() => {
      const mapEl = document.getElementById('service-map');
      if (!mapEl || mapEl._leaflet_id) return;
      const map = L.map('service-map', { zoomControl: true, scrollWheelZoom: false })
        .setView([8.8932, 76.6141], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);
      const icon = L.divIcon({
        className: '',
        html: `<div style="background:linear-gradient(135deg,#FFC107,#FF8F00);width:32px;height:32px;
          border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid rgba(255,255,255,0.8);
          box-shadow:0 4px 15px rgba(255,193,7,0.5)"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const areas = [
        { name: 'Kollam (HQ)',       lat: 8.8932,  lng: 76.6141 },
        { name: 'Kallada',           lat: 8.9167,  lng: 76.7667 },
        { name: 'Munroe Thuruth',    lat: 8.9833,  lng: 76.5667 },
        { name: 'Pavithreswaram',    lat: 8.9422,  lng: 76.6844 },
        { name: 'West Kallada',      lat: 8.9250,  lng: 76.7100 },
      ];
      areas.forEach(a => {
        L.marker([a.lat, a.lng], { icon })
          .addTo(map)
          .bindPopup(`<div style="font-family:Inter,sans-serif;color:#212121;font-weight:600;padding:4px 8px">${a.name}</div>`);
      });
    }, 300);
  }, []);

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="min-h-screen flex items-center relative overflow-hidden hero-bg dot-pattern">
        {/* Floating orbs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-brand-600/4 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 items-center gap-12">
          {/* Text */}
          <div className="animate-slide-in-left">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse" />
              <span className="text-brand-400 text-xs font-semibold tracking-widest uppercase">Kollam's Trusted Logistics</span>
            </div>
            <h1 className="font-display font-black leading-none mb-4" style={{fontSize: 'clamp(2.8rem, 6vw, 5rem)'}}>
              <span className="text-white">KANNAN</span><br/>
              <span className="gradient-text">KALYANI</span>
            </h1>
            <p className="text-surface-400 text-lg mb-3 font-medium">Construction Logistics &amp; Services</p>
            <p className="text-brand-400/80 italic text-base mb-8">"Unmatched load. On-time delivery."</p>
            <p className="text-surface-300 text-sm leading-relaxed mb-10 max-w-md">
              Reliable delivery of M-Sand, P-Sand, Crushed Metal, Rock Boulders, Gravel and more — serving Kollam, Kallada, Munroe Thuruth and surrounding areas.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('calculator')} className="btn-primary">
                🧮 Calculate Estimate
              </button>
              <button onClick={() => navigate('contact')} className="btn-secondary">
                📞 Contact Us
              </button>
            </div>
          </div>

          {/* Image card */}
          <div className="animate-slide-in-right">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/8 animate-float">
              <img
                src="images/6779.png"
                alt="Kannan Kalyani Truck"
                className="w-full object-cover"
                style={{maxHeight: '420px', objectPosition: 'center'}}
                onError={e => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden items-center justify-center h-64 text-6xl">🚛</div>
            </div>
            {/* Badge */}
            <div className="mt-4 flex gap-3">
              {['✅ Licensed', '📍 Kollam Based', '⚡ Fast Delivery'].map(b => (
                <div key={b} className="glass rounded-xl px-3 py-2 text-xs text-surface-300 font-medium flex-1 text-center">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className={`glass-card rounded-2xl p-6 text-center animate-scale-in stagger-${i+1}`} style={{animationFillMode:'both'}}>
              <div className="gradient-text font-display font-black text-4xl mb-1">{s.value}</div>
              <div className="text-surface-400 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">What We Offer</p>
            <h2 className="font-display font-black text-3xl md:text-4xl text-white mb-3">Our Services</h2>
            <p className="text-surface-400 text-sm max-w-md mx-auto">Comprehensive construction logistics, material delivery, and land development services.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className={`glass-card rounded-2xl p-6 animate-slide-up stagger-${i+1}`} style={{animationFillMode:'both'}}>
                <div className="text-3xl mb-4">{s.icon}</div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE AREA MAP */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Coverage</p>
            <h2 className="font-display font-black text-3xl text-white mb-3">Service Area</h2>
            <p className="text-surface-400 text-sm">Based in Kollam — serving all highlighted zones with reliable delivery.</p>
          </div>
          <div className="map-container" style={{height: '420px'}}>
            <div id="service-map" style={{width:'100%', height:'100%', borderRadius:'16px'}} />
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card rounded-3xl p-10 text-center border border-brand-500/10 animate-pulse-glow">
            <div className="text-4xl mb-4">🚛</div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-3">Ready to Place an Order?</h2>
            <p className="text-surface-400 text-sm mb-7">Use our smart calculator to get an instant cost estimate, or call us directly.</p>
            <button onClick={() => navigate('calculator')} className="btn-primary">
              Calculate My Estimate →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── CALCULATOR PAGE ───────────────────────────────────────────────────────────
function CalculatorPage() {
  const [materials, setMaterials] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedFt, setSelectedFt] = useState(FT_OPTIONS[0]);
  const [loads, setLoads] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    const mats = getMaterials();
    const locs = getLocations();
    setMaterials(mats);
    setLocations(locs);
    setSelectedMaterial(mats[0]?.id?.toString() || '');
    setSelectedLocation(locs[0]?.id?.toString() || '');
  }, []);

  const currentMat = materials.find(m => m.id === parseInt(selectedMaterial));
  const currentLoc = locations.find(l => l.id === parseInt(selectedLocation));
  const isPerFt = currentMat?.pricing_type === 'per_ft';

  function calculate(e) {
    e.preventDefault();
    if (!currentMat || !currentLoc) return;
    setCalculating(true);
    setTimeout(() => {
      let materialCost;
      if (currentMat.pricing_type === 'per_ft') {
        materialCost = currentMat.price_per_ft * selectedFt;
      } else {
        materialCost = currentMat.price_per_load;
      }
      const transportCost = currentLoc.transport_rate;
      const baseCost = materialCost + transportCost;
      const totalCost = baseCost * loads;
      setResult({ materialCost, transportCost, baseCost, totalCost, loads, mat: currentMat, loc: currentLoc, ft: selectedFt });
      setCalculating(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 600);
  }

  function reset() {
    setResult(null);
    setLoads(1);
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-brand-400 text-xs font-semibold tracking-widest uppercase">Smart Pricing Engine</span>
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white mb-3">Expense Calculator</h1>
          <p className="text-surface-400 text-sm">Get an instant cost estimate for your delivery.</p>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-3xl p-7 md:p-9 border border-white/6 animate-scale-in">
          <form onSubmit={calculate} className="space-y-6">

            {/* Material */}
            <div>
              <label className="form-label">Material Type</label>
              <div className="relative">
                <select
                  className="form-input pr-10"
                  value={selectedMaterial}
                  onChange={e => setSelectedMaterial(e.target.value)}
                  required
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.icon} {m.name} — {m.pricing_type === 'per_ft' ? `₹${m.price_per_ft}/ft` : `₹${m.price_per_load?.toLocaleString('en-IN')}/load`}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">▾</span>
              </div>
              {currentMat && (
                <p className="mt-2 text-xs text-surface-500">{currentMat.description}</p>
              )}
            </div>

            {/* Pricing type badge */}
            {currentMat && (
              <div className={`rounded-xl p-3 flex items-center gap-2 text-xs font-semibold ${
                isPerFt
                  ? 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
                  : 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
              }`}>
                <span>{isPerFt ? '📐' : '📦'}</span>
                {isPerFt
                  ? `Type A — Per Foot Pricing: ₹${currentMat.price_per_ft} × selected ft`
                  : `Type B — Fixed Load Pricing: ₹${currentMat.price_per_load?.toLocaleString('en-IN')} per load`
                }
              </div>
            )}

            {/* Measurement — only shown for per_ft materials */}
            {isPerFt && (
              <div>
                <label className="form-label">Measurement (cubic feet)</label>
                <div className="grid grid-cols-5 gap-2">
                  {FT_OPTIONS.map(ft => (
                    <button
                      key={ft}
                      type="button"
                      onClick={() => setSelectedFt(ft)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all duration-200 ${
                        selectedFt === ft
                          ? 'bg-brand-500/20 border-brand-500/40 text-brand-400 shadow-lg shadow-brand-500/10'
                          : 'bg-white/4 border-white/8 text-surface-400 hover:bg-white/8 hover:text-white'
                      }`}
                    >
                      {ft}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Loads */}
            <div>
              <label className="form-label">Number of Loads</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setLoads(l => Math.max(1, l - 1))}
                  className="w-12 h-12 rounded-xl glass border border-white/10 text-white text-xl font-bold hover:bg-white/10 transition-colors"
                >−</button>
                <input
                  type="number"
                  className="form-input text-center text-xl font-bold text-brand-400"
                  value={loads}
                  min="1"
                  max="100"
                  onChange={e => setLoads(Math.max(1, parseInt(e.target.value) || 1))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setLoads(l => Math.min(100, l + 1))}
                  className="w-12 h-12 rounded-xl glass border border-white/10 text-white text-xl font-bold hover:bg-white/10 transition-colors"
                >+</button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="form-label">Delivery Location</label>
              <div className="relative">
                <select
                  className="form-input pr-10"
                  value={selectedLocation}
                  onChange={e => setSelectedLocation(e.target.value)}
                  required
                >
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>
                      📍 {l.name} — Transport: ₹{l.transport_rate.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">▾</span>
              </div>
              {currentLoc && (
                <p className="mt-2 text-xs text-surface-500">~{currentLoc.distance_km} km from Kollam</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={calculating}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {calculating ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Calculating…
                </>
              ) : '🧮 Calculate Total Cost'}
            </button>
          </form>
        </div>

        {/* RESULT */}
        {result && (
          <div ref={resultRef} className="mt-8 glass-card rounded-3xl overflow-hidden border border-brand-500/15 animate-scale-in">
            {/* Header */}
            <div className="result-shimmer px-7 py-5 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-bold text-base">Cost Breakdown</h2>
                <button onClick={reset} className="text-surface-500 hover:text-white text-xs transition-colors">✕ Clear</button>
              </div>
              <p className="text-surface-400 text-xs mt-1">
                {result.mat.icon} {result.mat.name} → 📍 {result.loc.name}
              </p>
            </div>

            {/* Breakdown rows */}
            <div className="px-7 py-5 space-y-4">
              {/* Material cost */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-surface-300 text-sm font-medium">Material Cost</div>
                  <div className="text-surface-500 text-xs mt-0.5">
                    {result.mat.pricing_type === 'per_ft'
                      ? `₹${result.mat.price_per_ft}/ft × ${result.ft} ft`
                      : `Fixed price per load`
                    }
                  </div>
                </div>
                <div className="text-white font-bold">₹{result.materialCost.toLocaleString('en-IN')}</div>
              </div>
              <div className="border-t border-white/5" />

              {/* Transport cost */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-surface-300 text-sm font-medium">Transport Cost</div>
                  <div className="text-surface-500 text-xs mt-0.5">📍 {result.loc.name}</div>
                </div>
                <div className="text-white font-bold">₹{result.transportCost.toLocaleString('en-IN')}</div>
              </div>
              <div className="border-t border-white/5" />

              {/* Base cost per load */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-surface-300 text-sm font-medium">Base Cost (per load)</div>
                  <div className="text-surface-500 text-xs mt-0.5">Material + Transport</div>
                </div>
                <div className="text-white font-bold">₹{result.baseCost.toLocaleString('en-IN')}</div>
              </div>

              {/* Multiplier */}
              {result.loads > 1 && (
                <>
                  <div className="border-t border-white/5" />
                  <div className="flex items-center justify-between">
                    <div className="text-surface-500 text-xs">× {result.loads} loads</div>
                    <div className="text-surface-500 text-xs">₹{result.baseCost.toLocaleString('en-IN')} × {result.loads}</div>
                  </div>
                </>
              )}
            </div>

            {/* Total */}
            <div className="px-7 py-5 border-t border-brand-500/15 bg-brand-500/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-brand-300 text-sm font-semibold uppercase tracking-wide">Total Cost</div>
                  <div className="text-surface-500 text-xs mt-0.5">{result.loads} load{result.loads > 1 ? 's' : ''}</div>
                </div>
                <div className="gradient-text font-display font-black text-3xl count-animate">
                  ₹{result.totalCost.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="px-7 py-4 bg-surface-900/50">
              <p className="text-surface-500 text-xs text-center">
                ⚠️ This is an approximate estimate. Actual cost may vary based on site conditions, material availability and seasonal factors.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage() {
  const [tab, setTab] = useState('materials');
  const [materials, setMaterials] = useState([]);
  const [locations, setLocations] = useState([]);
  const [toast, setToast] = useState(null);
  const [editingMat, setEditingMat] = useState(null);
  const [editingLoc, setEditingLoc] = useState(null);

  // Add-material form
  const [newMat, setNewMat] = useState({ name:'', pricing_type:'per_ft', price_per_ft:'', price_per_load:'', description:'', icon:'📦' });
  // Add-location form
  const [newLoc, setNewLoc] = useState({ name:'', transport_rate:'', distance_km:'' });

  useEffect(() => {
    setMaterials(getMaterials());
    setLocations(getLocations());
  }, []);

  function showToast(msg, type='success') {
    setToast({ msg, type });
  }

  // Materials CRUD
  function saveMat(mat) {
    const updated = materials.map(m => m.id === mat.id ? mat : m);
    saveMaterials(updated);
    setMaterials(updated);
    setEditingMat(null);
    showToast('Material updated successfully!');
  }
  function deleteMat(id) {
    if (!confirm('Delete this material?')) return;
    const updated = materials.filter(m => m.id !== id);
    saveMaterials(updated);
    setMaterials(updated);
    showToast('Material deleted.', 'error');
  }
  function addMat(e) {
    e.preventDefault();
    const id = Date.now();
    const mat = {
      id,
      name: newMat.name,
      pricing_type: newMat.pricing_type,
      price_per_ft: newMat.pricing_type === 'per_ft' ? parseFloat(newMat.price_per_ft) : null,
      price_per_load: newMat.pricing_type === 'per_load' ? parseFloat(newMat.price_per_load) : null,
      description: newMat.description,
      icon: newMat.icon || '📦',
    };
    const updated = [...materials, mat];
    saveMaterials(updated);
    setMaterials(updated);
    setNewMat({ name:'', pricing_type:'per_ft', price_per_ft:'', price_per_load:'', description:'', icon:'📦' });
    showToast('Material added!');
  }

  // Locations CRUD
  function saveLoc(loc) {
    const updated = locations.map(l => l.id === loc.id ? loc : l);
    saveLocations(updated);
    setLocations(updated);
    setEditingLoc(null);
    showToast('Location updated!');
  }
  function deleteLoc(id) {
    if (!confirm('Delete this location?')) return;
    const updated = locations.filter(l => l.id !== id);
    saveLocations(updated);
    setLocations(updated);
    showToast('Location deleted.', 'error');
  }
  function addLoc(e) {
    e.preventDefault();
    const id = Date.now();
    const loc = { id, name: newLoc.name, transport_rate: parseFloat(newLoc.transport_rate), distance_km: parseFloat(newLoc.distance_km) };
    const updated = [...locations, loc];
    saveLocations(updated);
    setLocations(updated);
    setNewLoc({ name:'', transport_rate:'', distance_km:'' });
    showToast('Location added!');
  }

  function resetToDefaults() {
    if (!confirm('Reset ALL data to factory defaults?')) return;
    localStorage.removeItem('kk_materials');
    localStorage.removeItem('kk_locations');
    setMaterials(getMaterials());
    setLocations(getLocations());
    showToast('Data reset to defaults!');
  }

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-1">Admin Panel</p>
              <h1 className="font-display font-black text-3xl text-white">Pricing Control</h1>
              <p className="text-surface-400 text-sm mt-1">Manage material prices and delivery location rates.</p>
            </div>
            <button onClick={resetToDefaults} className="btn-secondary text-xs py-2 px-4">
              🔄 Reset to Defaults
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-7 bg-white/3 rounded-2xl p-1.5 border border-white/5">
          {['materials', 'locations'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                tab === t
                  ? 'bg-gradient-to-r from-brand-500 to-brand-700 text-black shadow-lg'
                  : 'text-surface-400 hover:text-white'
              }`}
            >
              {t === 'materials' ? '🧱 Materials' : '📍 Locations'}
            </button>
          ))}
        </div>

        {/* ── MATERIALS TAB ── */}
        {tab === 'materials' && (
          <div className="space-y-5 animate-fade-in">
            {/* Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-white font-bold text-sm">📋 Material Catalog ({materials.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Pricing Type</th>
                      <th>Rate</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map(m => (
                      editingMat?.id === m.id ? (
                        <MatEditRow key={m.id} mat={editingMat} setMat={setEditingMat} onSave={saveMat} onCancel={() => setEditingMat(null)} />
                      ) : (
                        <tr key={m.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{m.icon}</span>
                              <div>
                                <div className="text-white font-medium text-sm">{m.name}</div>
                                <div className="text-surface-500 text-xs">{m.description}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                              m.pricing_type === 'per_ft'
                                ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                            }`}>
                              {m.pricing_type === 'per_ft' ? '📐 Per Foot' : '📦 Per Load'}
                            </span>
                          </td>
                          <td>
                            <span className="text-brand-400 font-bold text-sm">
                              {m.pricing_type === 'per_ft'
                                ? `₹${m.price_per_ft}/ft`
                                : `₹${m.price_per_load?.toLocaleString('en-IN')}/load`}
                            </span>
                          </td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setEditingMat({...m})} className="text-xs bg-white/5 hover:bg-white/10 border border-white/8 px-3 py-1.5 rounded-lg text-surface-300 hover:text-white transition-all">Edit</button>
                              <button onClick={() => deleteMat(m.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg text-red-400 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add material form */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold text-sm mb-4">➕ Add New Material</h3>
              <form onSubmit={addMat} className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Name</label>
                  <input className="form-input" placeholder="e.g. River Sand" value={newMat.name} onChange={e=>setNewMat({...newMat,name:e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Icon (emoji)</label>
                  <input className="form-input" placeholder="📦" value={newMat.icon} onChange={e=>setNewMat({...newMat,icon:e.target.value})} />
                </div>
                <div>
                  <label className="form-label">Pricing Type</label>
                  <select className="form-input" value={newMat.pricing_type} onChange={e=>setNewMat({...newMat,pricing_type:e.target.value})}>
                    <option value="per_ft">Per Foot (Type A)</option>
                    <option value="per_load">Per Load (Type B)</option>
                  </select>
                </div>
                <div>
                  {newMat.pricing_type === 'per_ft' ? (
                    <>
                      <label className="form-label">Price per Foot (₹)</label>
                      <input className="form-input" type="number" placeholder="50" value={newMat.price_per_ft} onChange={e=>setNewMat({...newMat,price_per_ft:e.target.value})} required />
                    </>
                  ) : (
                    <>
                      <label className="form-label">Price per Load (₹)</label>
                      <input className="form-input" type="number" placeholder="3000" value={newMat.price_per_load} onChange={e=>setNewMat({...newMat,price_per_load:e.target.value})} required />
                    </>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">Description</label>
                  <input className="form-input" placeholder="Short description" value={newMat.description} onChange={e=>setNewMat({...newMat,description:e.target.value})} />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="btn-primary w-full">➕ Add Material</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── LOCATIONS TAB ── */}
        {tab === 'locations' && (
          <div className="space-y-5 animate-fade-in">
            {/* Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
              <div className="px-5 py-4 border-b border-white/5">
                <h2 className="text-white font-bold text-sm">📍 Delivery Locations ({locations.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>Distance</th>
                      <th>Transport Rate</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map(l => (
                      editingLoc?.id === l.id ? (
                        <LocEditRow key={l.id} loc={editingLoc} setLoc={setEditingLoc} onSave={saveLoc} onCancel={() => setEditingLoc(null)} />
                      ) : (
                        <tr key={l.id}>
                          <td className="text-white font-medium text-sm">📍 {l.name}</td>
                          <td className="text-surface-400 text-sm">~{l.distance_km} km</td>
                          <td className="text-brand-400 font-bold text-sm">₹{l.transport_rate.toLocaleString('en-IN')}</td>
                          <td className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setEditingLoc({...l})} className="text-xs bg-white/5 hover:bg-white/10 border border-white/8 px-3 py-1.5 rounded-lg text-surface-300 hover:text-white transition-all">Edit</button>
                              <button onClick={() => deleteLoc(l.id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 px-3 py-1.5 rounded-lg text-red-400 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add location form */}
            <div className="glass-card rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-bold text-sm mb-4">➕ Add New Location</h3>
              <form onSubmit={addLoc} className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Location Name</label>
                  <input className="form-input" placeholder="e.g. Munroturuthu" value={newLoc.name} onChange={e=>setNewLoc({...newLoc,name:e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Transport Rate (₹)</label>
                  <input className="form-input" type="number" placeholder="2500" value={newLoc.transport_rate} onChange={e=>setNewLoc({...newLoc,transport_rate:e.target.value})} required />
                </div>
                <div>
                  <label className="form-label">Distance (km)</label>
                  <input className="form-input" type="number" placeholder="20" value={newLoc.distance_km} onChange={e=>setNewLoc({...newLoc,distance_km:e.target.value})} />
                </div>
                <div className="sm:col-span-3">
                  <button type="submit" className="btn-primary w-full">➕ Add Location</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// Inline edit rows
function MatEditRow({ mat, setMat, onSave, onCancel }) {
  return (
    <tr className="bg-brand-500/5">
      <td colSpan={4} className="p-4">
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="form-label">Name</label>
            <input className="form-input text-sm" value={mat.name} onChange={e=>setMat({...mat,name:e.target.value})} />
          </div>
          <div>
            <label className="form-label">Type</label>
            <select className="form-input text-sm" value={mat.pricing_type} onChange={e=>setMat({...mat,pricing_type:e.target.value,price_per_ft:null,price_per_load:null})}>
              <option value="per_ft">Per Foot</option>
              <option value="per_load">Per Load</option>
            </select>
          </div>
          <div>
            <label className="form-label">{mat.pricing_type==='per_ft' ? 'Price/ft (₹)' : 'Price/load (₹)'}</label>
            <input className="form-input text-sm" type="number"
              value={mat.pricing_type==='per_ft' ? mat.price_per_ft||'' : mat.price_per_load||''}
              onChange={e => {
                const v = parseFloat(e.target.value);
                setMat(mat.pricing_type==='per_ft' ? {...mat,price_per_ft:v,price_per_load:null} : {...mat,price_per_load:v,price_per_ft:null});
              }}
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onSave(mat)} className="btn-primary py-2 px-4 text-sm flex-1">Save</button>
            <button onClick={onCancel} className="btn-secondary py-2 px-4 text-sm flex-1">Cancel</button>
          </div>
        </div>
      </td>
    </tr>
  );
}
function LocEditRow({ loc, setLoc, onSave, onCancel }) {
  return (
    <tr className="bg-brand-500/5">
      <td colSpan={4} className="p-4">
        <div className="grid sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="form-label">Name</label>
            <input className="form-input text-sm" value={loc.name} onChange={e=>setLoc({...loc,name:e.target.value})} />
          </div>
          <div>
            <label className="form-label">Distance (km)</label>
            <input className="form-input text-sm" type="number" value={loc.distance_km} onChange={e=>setLoc({...loc,distance_km:parseFloat(e.target.value)})} />
          </div>
          <div>
            <label className="form-label">Transport Rate (₹)</label>
            <input className="form-input text-sm" type="number" value={loc.transport_rate} onChange={e=>setLoc({...loc,transport_rate:parseFloat(e.target.value)})} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => onSave(loc)} className="btn-primary py-2 px-4 text-sm flex-1">Save</button>
            <button onClick={onCancel} className="btn-secondary py-2 px-4 text-sm flex-1">Cancel</button>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── CONTACT PAGE ──────────────────────────────────────────────────────────────
function ContactPage() {
  const contacts = [
    { label: 'Phone', value: '+91 94470 XXXXX', icon: '📞', hint: 'Mon–Sat, 8am–7pm' },
    { label: 'WhatsApp', value: '+91 94470 XXXXX', icon: '💬', hint: 'Fast response' },
    { label: 'Location', value: 'Kollam, Kerala', icon: '📍', hint: 'Serving all nearby zones' },
    { label: 'Email', value: 'kannankalyani@gmail.com', icon: '✉️', hint: 'For quotes & enquiries' },
  ];
  return (
    <div className="pt-24 pb-16 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-brand-400 text-xs font-semibold uppercase tracking-widest mb-3">Reach Us</p>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white mb-3">Contact Info</h1>
          <p className="text-surface-400 text-sm">We're based in Kollam and ready to serve your logistics needs.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {contacts.map((c, i) => (
            <div key={i} className={`glass-card rounded-2xl p-6 animate-slide-up stagger-${i+1}`} style={{animationFillMode:'both'}}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-surface-400 text-xs font-semibold uppercase tracking-wider mb-1">{c.label}</div>
              <div className="text-white font-bold text-base mb-1">{c.value}</div>
              <div className="text-surface-500 text-xs">{c.hint}</div>
            </div>
          ))}
        </div>

        {/* Business hours */}
        <div className="glass-card rounded-2xl p-7 border border-white/5 animate-scale-in">
          <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">🕐 Business Hours</h2>
          <div className="space-y-3">
            {[
              { day: 'Monday – Saturday', hours: '8:00 AM – 7:00 PM' },
              { day: 'Sunday',            hours: 'Emergency only' },
              { day: 'Public Holidays',   hours: 'Call ahead' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-surface-300 text-sm">{r.day}</span>
                <span className={`text-sm font-semibold ${r.hours.includes('Emergency') ? 'text-brand-400' : 'text-white'}`}>{r.hours}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service zones */}
        <div className="glass-card rounded-2xl p-7 mt-5 border border-white/5">
          <h2 className="text-white font-bold text-base mb-4 flex items-center gap-2">🗺️ Service Zones</h2>
          <div className="flex flex-wrap gap-2">
            {['Kollam', 'Kallada', 'Munroe Thuruth', 'Pavithreswaram', 'West Kallada', 'Shuttle / Local'].map(z => (
              <span key={z} className="bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-medium px-3 py-1.5 rounded-full">
                📍 {z}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────────
function App() {
  const [page, navigate] = useRoute();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [page]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar page={page} navigate={navigate} />
      <main className="flex-1">
        {page === 'home'       && <HomePage navigate={navigate} />}
        {page === 'calculator' && <CalculatorPage />}
        {page === 'admin'      && <AdminPage />}
        {page === 'contact'    && <ContactPage />}
      </main>
      <Footer navigate={navigate} />
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
