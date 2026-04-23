const ThemeContext = React.createContext();
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('kk_theme') || 'dark');
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('kk_theme', theme);
    }, [theme]);
    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

function Navbar({ page, navigate }) {
    const navItems = [
        { id: 'home', label: 'HOME' },
        { id: 'about', label: 'ABOUT US' },
        { id: 'services', label: 'SERVICES' },
        { id: 'fleet', label: 'FLEET' },
        { id: 'calculator', label: 'CALCULATOR' },
        { id: 'logistics', label: 'DAILY LOG' },
        { id: 'admin', label: 'ADMIN' },
    ];
    return (
        <header className="sticky top-0 z-50 w-full bg-[#1A1A1A] text-white border-b border-white/10 shadow-lg">
            <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
                {/* Logo */}
                <button onClick={() => navigate('home')} className="flex items-center space-x-3 group shrink-0">
                    <div className="flex items-center">
                        <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary fill-current">
                            <path d="M0 0h12l8 20L12 40H0l8-20z"/><path d="M15 0h12l8 20-8 20H15l8-20z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="font-extrabold text-xl md:text-2xl tracking-wider leading-none">KANNAN KALYANI</span>
                        <span className="text-primary text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mt-1">Logistics</span>
                    </div>
                </button>

                {/* Nav Links */}
                <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
                    {navItems.map(item => {
                        const isSection = ['about', 'services', 'fleet'].includes(item.id);
                        const isActive = page === item.id || (page === 'home' && item.id === 'home');
                        return (
                            <button key={item.id} onClick={() => {
                                if (isSection) {
                                    if (page !== 'home') navigate('home');
                                    setTimeout(() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }), 100);
                                } else {
                                    navigate(item.id);
                                    window.scrollTo(0, 0);
                                }
                            }}
                                className={cn("text-xs font-bold tracking-widest transition-colors hover:text-primary relative py-8", isActive ? "text-primary" : "text-white/80")}>
                                {item.label}
                                {isActive && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>}
                            </button>
                        );
                    })}
                </nav>

                {/* Contact Right */}
                <div className="hidden md:flex items-center gap-3 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                        <Icons.Phone className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Call Us Today</span>
                        <span className="font-bold text-sm tracking-wider">+91 94470 07076</span>
                    </div>
                </div>
                
                {/* Mobile Menu Button */}
                <Button variant="ghost" size="icon" className="lg:hidden text-white hover:bg-white/10 shrink-0">
                    <Icons.Menu className="h-6 w-6" />
                </Button>
            </div>
            {/* Mobile Bottom Nav for Tools */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 border-t border-white/10 bg-[#1A1A1A]/95 backdrop-blur pb-safe shadow-[0_-4px_10px_rgb(0,0,0,0.5)]">
                {[
                    { id: 'home', label: 'Home', icon: Icons.Home },
                    { id: 'calculator', label: 'Calc', icon: Icons.Calculator },
                    { id: 'logistics', label: 'Log', icon: Icons.ClipboardList },
                    { id: 'admin', label: 'Admin', icon: Icons.Settings },
                ].map(item => {
                    const Icon = item.icon;
                    const isActive = page === item.id;
                    return (
                        <button key={item.id} onClick={() => navigate(item.id)} className={cn("flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg transition-all", isActive ? "text-black bg-primary" : "text-white/60 hover:bg-white/10")}>
                            <Icon className={cn("w-5 h-5", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-bold tracking-wider leading-none">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </header>
    );
}

function HomePage({ navigate }) {
    return (
        <div className="flex flex-col w-full font-sans bg-background">
            {/* Hero Section */}
            <section className="relative w-full h-[600px] md:h-[750px] bg-[#1a1a1a] overflow-hidden flex items-center">
                {/* Background Image / Placeholder */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-transparent z-10"></div>
                    <img src="images/6779.png" alt="Truck" className="w-full h-full object-cover md:object-right md:object-contain object-right-bottom scale-[1.2] md:scale-100" />
                </div>

                <div className="container relative z-20 mx-auto px-4 md:px-8">
                    <div className="max-w-xl text-white space-y-6">
                        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold uppercase leading-[1] tracking-tight text-shadow-lg">
                            Reliable<br/>
                            <span className="text-primary text-shadow-none drop-shadow-md">Logistics</span><br/>
                            Partner
                        </h1>
                        <p className="text-lg md:text-xl font-medium text-white/90 drop-shadow-md">
                            Safe. Timely. Efficient.<br/>
                            Your cargo, our commitment.
                        </p>
                        <Button className="bg-primary hover:bg-primary/90 text-black font-bold h-12 md:h-14 px-8 md:px-10 text-sm md:text-base tracking-wider uppercase flex items-center gap-2 group mt-4">
                            Get A Quote <Icons.ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
                {/* Yellow Dots Indicator */}
                <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-white shadow-md"></div>
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-primary shadow-md"></div>
                    <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-primary shadow-md"></div>
                </div>
            </section>

            {/* Welcome Section */}
            <section id="about" className="relative w-full bg-primary py-24 md:py-32 overflow-hidden">
                {/* Torn edge effect top */}
                <div className="absolute top-0 left-0 right-0 h-6 md:h-10 bg-[#1a1a1a]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 98% 80%, 96% 10%, 94% 90%, 92% 15%, 90% 85%, 88% 20%, 86% 90%, 84% 10%, 82% 85%, 80% 20%, 78% 90%, 76% 15%, 74% 85%, 72% 10%, 70% 90%, 68% 20%, 66% 85%, 64% 15%, 62% 90%, 60% 10%, 58% 85%, 56% 20%, 54% 90%, 52% 15%, 50% 85%, 48% 10%, 46% 90%, 44% 20%, 42% 85%, 40% 15%, 38% 90%, 36% 10%, 34% 85%, 32% 20%, 30% 90%, 28% 15%, 26% 85%, 24% 10%, 22% 90%, 20% 20%, 18% 85%, 16% 15%, 14% 90%, 12% 10%, 10% 85%, 8% 20%, 6% 90%, 4% 15%, 2% 85%, 0 20%)' }}></div>
                
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

                <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center relative z-10">
                    <div className="space-y-6 text-black">
                        <div className="font-bold tracking-widest text-sm">WELCOME TO</div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase leading-[1.1]">Kannan Kalyani<br/>Logistics</h2>
                        <p className="font-semibold text-black/80 leading-relaxed text-base md:text-lg max-w-lg">
                            Kannan Kalyani Logistics is a trusted name in road transport and material logistics. With a focus on safety, reliability and customer satisfaction, we ensure your goods reach their destination on time, every time.
                        </p>
                        <Button className="bg-black hover:bg-black/80 text-white font-bold h-12 md:h-14 px-8 md:px-10 text-sm md:text-base tracking-wider uppercase flex items-center gap-2 group mt-4 w-max">
                            Read More <Icons.ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8 md:gap-x-16 md:gap-y-12 pl-0 md:pl-16 border-l-0 md:border-l border-black/10">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0"><Icons.Clock className="w-10 h-10 md:w-12 md:h-12 text-black stroke-[1.5]" /></div>
                            <div>
                                <h3 className="font-black text-lg md:text-xl leading-tight uppercase">On-Time<br/>Delivery</h3>
                                <p className="text-black/80 text-sm mt-2 font-medium">Timely delivery,<br/>every time.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black md:w-12 md:h-12"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-lg md:text-xl leading-tight uppercase">Safe & Secure<br/>Transport</h3>
                                <p className="text-black/80 text-sm mt-2 font-medium">Your goods are<br/>in safe hands.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0"><Icons.MapPin className="w-10 h-10 md:w-12 md:h-12 text-black stroke-[1.5]" /></div>
                            <div>
                                <h3 className="font-black text-lg md:text-xl leading-tight uppercase">Local Expertise</h3>
                                <p className="text-black/80 text-sm mt-2 font-medium">We know the roads.<br/>We deliver better.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black md:w-12 md:h-12"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                            </div>
                            <div>
                                <h3 className="font-black text-lg md:text-xl leading-tight uppercase">Affordable<br/>Pricing</h3>
                                <p className="text-black/80 text-sm mt-2 font-medium">Best service at<br/>competitive rates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map outline decoration */}
                <div className="absolute right-0 top-1/2 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-[2]">
                    <svg width="400" height="400" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="0.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                {/* Torn edge effect bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-6 md:h-10 bg-[#1a1a1a]" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 80%, 98% 20%, 96% 90%, 94% 10%, 92% 85%, 90% 15%, 88% 80%, 86% 10%, 84% 90%, 82% 15%, 80% 80%, 78% 10%, 76% 85%, 74% 15%, 72% 90%, 70% 10%, 68% 80%, 66% 15%, 64% 85%, 62% 10%, 60% 90%, 58% 15%, 56% 80%, 54% 10%, 52% 85%, 50% 15%, 48% 90%, 46% 10%, 44% 80%, 42% 15%, 40% 85%, 38% 10%, 36% 90%, 34% 15%, 32% 80%, 30% 10%, 28% 85%, 26% 15%, 24% 90%, 22% 10%, 20% 80%, 18% 15%, 16% 85%, 14% 10%, 12% 90%, 10% 15%, 8% 80%, 6% 10%, 4% 85%, 2% 15%, 0 80%)' }}></div>
            </section>

            {/* Services Section */}
            <section id="services" className="bg-[#1a1a1a] text-white py-24 md:py-32">
                <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
                    <div className="text-center mb-16">
                        <div className="text-primary font-bold tracking-widest text-sm mb-2">OUR SERVICES</div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white">What We Do</h2>
                        <div className="w-16 h-1 bg-primary mx-auto mt-6"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* Service Cards */}
                        {[
                            { title: 'MATERIAL TRANSPORT', desc: 'Sand, gravel, stones and construction materials.', icon: Icons.Truck, img: 'https://images.unsplash.com/photo-1517457224213-94c6f3db1ec5?auto=format&fit=crop&q=80&w=600' },
                            { title: 'INDUSTRIAL LOGISTICS', desc: 'Reliable transport for industrial goods and equipment.', icon: Icons.Building2, img: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c1590a?auto=format&fit=crop&q=80&w=600' },
                            { title: 'LOCAL TRANSPORT', desc: 'Fast and efficient transport across Kerala.', icon: Icons.MapPin, img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600' },
                            { title: 'BULK CARGO', desc: 'Bulk cargo handling with care and efficiency.', icon: Icons.Truck, img: 'https://images.unsplash.com/photo-1503596476-1c12a8ba09a9?auto=format&fit=crop&q=80&w=600' },
                            { title: 'SITE CLEARANCE SUPPORT', desc: 'Debris and waste removal support for construction sites.', icon: Icons.Trash2, img: 'https://images.unsplash.com/photo-1541888001646-3dc9a37e4fb3?auto=format&fit=crop&q=80&w=600' },
                        ].map((srv, idx) => {
                            const Icon = srv.icon;
                            return (
                                <div key={idx} className="bg-[#222222] group hover:bg-[#2A2A2A] transition-colors overflow-hidden flex flex-col h-full border border-white/5 shadow-lg">
                                    <div className="h-48 w-full bg-[#333] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                                        <img src={srv.img} alt={srv.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        
                                        <div className="absolute bottom-0 left-6 w-12 h-12 bg-primary flex items-center justify-center z-20 translate-y-1/2 rounded shadow-md">
                                            <Icon className="text-black w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="p-6 pt-10 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg uppercase leading-tight mb-3 group-hover:text-primary transition-colors text-white">{srv.title}</h3>
                                        <p className="text-white/60 text-sm flex-1 font-medium">{srv.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Fleet Section */}
            <section id="fleet" className="bg-white text-black py-24 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-96 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/tree-bark.png')] pointer-events-none"></div>
                
                {/* Background mountain silhouette */}
                <div className="absolute bottom-0 left-0 right-0 h-48 opacity-[0.03] z-0">
                    <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none"><path fill="#000" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
                </div>

                <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6 md:pr-12">
                        <div className="text-primary font-bold tracking-widest text-sm">OUR FLEET</div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[1.1]">Built For<br/>Every Load</h2>
                        <p className="text-black/70 font-medium text-lg max-w-md">
                            Our Eicher tipper trucks are built tough to handle heavy loads and rough terrains with ease.
                        </p>
                        <Button className="bg-[#1a1a1a] hover:bg-black text-white font-bold h-12 md:h-14 px-8 md:px-10 text-sm md:text-base tracking-wider uppercase flex items-center gap-2 group mt-4">
                            View Fleet <Icons.ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-primary" />
                        </Button>
                    </div>
                    <div className="relative">
                        <img src="images/6779.png" alt="Fleet Truck" className="relative z-10 w-full max-w-2xl mx-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="bg-primary py-12 md:py-16 relative">
                <div className="container mx-auto px-4 md:px-8 grid lg:grid-cols-[auto_1fr_auto] gap-8 items-center max-w-6xl">
                    <div className="flex items-center gap-6 justify-center md:justify-start">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase text-black leading-tight">
                            Need Transport<br/>Solutions?
                        </h2>
                    </div>
                    
                    <div className="hidden lg:block w-px h-16 bg-black/20 mx-auto"></div>
                    
                    <div className="text-center md:text-left flex items-center justify-center lg:justify-start">
                        <p className="text-black font-semibold text-lg md:text-xl">We are ready to move<br className="hidden md:block lg:hidden"/> your business forward.</p>
                    </div>

                    <div className="flex justify-center md:justify-end">
                        <Button className="bg-[#1a1a1a] hover:bg-black text-white font-bold h-14 px-10 text-base tracking-wider uppercase flex items-center gap-2 group w-full md:w-auto shadow-xl">
                            Contact Us <Icons.ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1 text-primary" />
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}

function CalculatorPage() {
    const [materials, setMaterials] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selMat, setSelMat] = useState(null);
    const [selFt, setSelFt] = useState('');
    const [selLoc, setSelLoc] = useState('');
    const [loads, setLoads] = useState(1);
    const [result, setResult] = useState(null);

    useEffect(() => {
        Promise.all([fetchMaterials(), fetchLocations()]).then(([m, l]) => {
            setMaterials(m); setLocations(l); setLoading(false);
        });
    }, []);

    const mat = useMemo(() => materials.find(m => m.id?.toString() === selMat), [materials, selMat]);
    const loc = useMemo(() => locations.find(l => l.id?.toString() === selLoc), [locations, selLoc]);

    function calculate() {
        if (!mat || !loc) return;
        let matCost = 0;
        if (mat.pricing_type === 'per_ft') {
            if (!selFt) return;
            matCost = Number(mat.price_per_ft) * parseInt(selFt);
        } else {
            matCost = Number(mat.price_per_load);
        }
        const tpCost = Number(loc.transport_rate);
        const base = matCost + tpCost;
        const total = base * loads;
        setResult({ matCost, tpCost, base, total, mat, loc, ft: selFt, loads });
    }

    if (loading) return <div className="container mx-auto px-4 py-12 max-w-3xl"><Loading text="Loading calculator..." /></div>;

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">Expense Calculator</h2>
                <p className="text-muted-foreground mt-2">Get precise estimates for your material and delivery costs.</p>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Estimate Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select Material</Label>
                            <Select value={selMat || ''} onChange={e => { setSelMat(e.target.value); setResult(null); }}>
                                <option value="">Choose material...</option>
                                {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </Select>
                            {mat && <p className="text-xs text-muted-foreground">{mat.description}</p>}
                        </div>
                        
                        {mat?.pricing_type === 'per_ft' && (
                            <div className="space-y-2">
                                <Label>Measurement (Cubic Feet)</Label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[145, 150, 195, 200, 250].map(ft => (
                                        <Button key={ft} type="button" variant={selFt === ft.toString() ? "default" : "outline"}
                                            onClick={() => { setSelFt(ft.toString()); setResult(null); }}>
                                            {ft}
                                        </Button>
                                    ))}
                                    <Input type="number" placeholder="Custom" value={selFt} onChange={e => { setSelFt(e.target.value); setResult(null); }} className="col-span-3"/>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Load Multiplier</Label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(l => (
                                    <Button key={l} type="button" variant={loads === l ? "default" : "outline"} className="flex-1"
                                        onClick={() => { setLoads(l); setResult(null); }}>
                                        {l}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Delivery Destination</Label>
                            <Select value={selLoc || ''} onChange={e => { setSelLoc(e.target.value); setResult(null); }}>
                                <option value="">Choose location...</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name} — ₹{Number(l.transport_rate).toLocaleString()}</option>)}
                            </Select>
                        </div>

                        <Button className="w-full" size="lg" onClick={calculate} disabled={!mat || !loc || (mat.pricing_type === 'per_ft' && !selFt)}>
                            Calculate Total
                        </Button>
                    </CardContent>
                </Card>

                {result && (
                    <Card className="border-primary bg-primary/5">
                        <CardHeader className="pb-4 border-b border-primary/20">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl">Cost Breakdown</CardTitle>
                                    <CardDescription>
                                        {result.mat.name} {result.mat.pricing_type === 'per_ft' ? `(${result.ft} ft)` : ''} to {result.loc.name}
                                    </CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setResult(null)}><Icons.X className="w-4 h-4"/></Button>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Material Cost ({result.mat.pricing_type === 'per_ft' ? `₹${result.mat.price_per_ft}/ft` : 'Fixed per load'})</span>
                                <span className="font-semibold">₹{result.matCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Transport Cost</span>
                                <span className="font-semibold">₹{result.tpCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm pt-4 border-t border-primary/20">
                                <span className="text-muted-foreground">Base Cost (per load)</span>
                                <span className="font-semibold">₹{result.base.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Multiplier</span>
                                <span className="font-semibold">x {result.loads} loads</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t border-primary/20 bg-primary/10 rounded-b-xl flex-col items-start gap-2">
                            <div className="w-full flex justify-between items-center pb-2">
                                <span className="font-bold text-lg">Total Estimate</span>
                                <span className="font-bold text-3xl text-primary">₹{result.total.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Approximate estimate. Actual cost may vary based on site conditions.</p>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Contact Us</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Get in Touch</CardTitle>
                    <CardDescription>Reach out to us for bulk orders and business inquiries.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 border p-4 rounded-lg">
                        <div className="p-3 bg-primary/10 rounded-full"><Icons.Phone className="text-primary w-6 h-6"/></div>
                        <div>
                            <div className="font-medium text-sm text-muted-foreground">Phone</div>
                            <div className="font-bold text-lg">+91 94470 07076</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border p-4 rounded-lg">
                        <div className="p-3 bg-primary/10 rounded-full"><Icons.Building2 className="text-primary w-6 h-6"/></div>
                        <div>
                            <div className="font-medium text-sm text-muted-foreground">Office / Yard</div>
                            <div className="font-bold">Adoor, Pathanamthitta, Kerala</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-[#1a1a1a] text-white pt-20 pb-6 font-sans">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* Logo Col */}
                    <div className="flex flex-col items-start space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                                <svg width="48" height="48" viewBox="0 0 40 40" className="text-primary fill-current">
                                    <path d="M0 0h12l8 20L12 40H0l8-20z"/><path d="M15 0h12l8 20-8 20H15l8-20z"/>
                                </svg>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="font-extrabold text-2xl tracking-wider leading-none">KANNAN KALYANI</span>
                                <span className="text-primary text-xs font-bold tracking-[0.3em] uppercase mt-1">Logistics</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Col */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-white">Quick Links</h4>
                        <ul className="space-y-3 text-white/70 font-medium">
                            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Services</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Fleet</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Gallery</a></li>
                        </ul>
                    </div>

                    {/* Services Col */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-white">Services</h4>
                        <ul className="space-y-3 text-white/70 font-medium">
                            <li><a href="#" className="hover:text-primary transition-colors">Material Transport</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Industrial Logistics</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Local Transport</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Bulk Cargo</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Site Clearance Support</a></li>
                        </ul>
                    </div>

                    {/* Contact Col */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 uppercase tracking-widest text-white">Contact Info</h4>
                        <ul className="space-y-4 text-white/70 font-medium">
                            <li className="flex gap-4 items-start">
                                <Icons.Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="font-bold text-white text-lg">+91 94470 07076</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Icons.MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span>Adoor, Pathanamthitta<br/>Kerala, India</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Icons.Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                <span className="break-all">kannankalyanilogistics@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40 font-medium">
                    <p>© 2026 Kannan Kalyani Logistics. All Rights Reserved.</p>
                    <p>Designed with <span className="text-red-500">❤️</span> by Your Brand</p>
                </div>
            </div>
        </footer>
    );
}
