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
    const { theme, setTheme } = React.useContext(ThemeContext);
    const navItems = [
        { id: 'home', label: 'Home', icon: Icons.Home },
        { id: 'calculator', label: 'Calculator', icon: Icons.Calculator },
        { id: 'logistics', label: 'Daily Log', icon: Icons.ClipboardList },
        { id: 'admin', label: 'Admin', icon: Icons.Settings },
    ];
    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <div className="flex gap-6 md:gap-10">
                        <button onClick={() => navigate('home')} className="flex items-center space-x-2">
                            <span className="font-bold inline-block leading-tight text-left">
                                <div className="text-primary text-sm md:text-base">KANNAN KALYANI</div>
                                <div className="text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-wider">Construction Logistics</div>
                            </span>
                        </button>
                        <nav className="hidden md:flex gap-6">
                            {navItems.map(item => {
                                const Icon = item.icon;
                                const isActive = page === item.id;
                                return (
                                    <button key={item.id} onClick={() => navigate(item.id)}
                                        className={cn("flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground/80", isActive ? "text-foreground" : "text-foreground/60")}>
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            {theme === 'dark' ? <Icons.Sun className="h-4 w-4" /> : <Icons.Moon className="h-4 w-4" />}
                        </Button>
                        <Button className="hidden md:inline-flex" variant="default" onClick={() => navigate('calculator')}>Get Estimate</Button>
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 border-t bg-background/95 backdrop-blur pb-safe select-none shadow-[0_-4px_10px_rgb(0,0,0,0.05)] dark:shadow-[0_-4px_10px_rgb(0,0,0,0.4)]">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = page === item.id;
                    return (
                        <button key={item.id} onClick={() => navigate(item.id)} className={cn("flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-lg transition-all", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted/50")}>
                            <Icon className={cn("w-5 h-5", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        </button>
                    )
                })}
            </div>
        </>
    );
}

function HomePage({ navigate }) {
    return (
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
            <div className="grid gap-12 md:grid-cols-2 items-center">
                {/* Truck Image - Order 1 on Desktop, Order 2 on Mobile */}
                <div className="relative group order-2 md:order-1 flex justify-center items-center">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-transparent blur-3xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative animate-float z-10 w-full max-w-lg">
                        <img 
                            src="images/6779.png" 
                            alt="Eicher Truck" 
                            className="w-full h-auto object-contain transform transition duration-500 hover:scale-[1.02]"
                        />
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
                            <Badge variant="default" className="bg-primary text-primary-foreground font-bold shadow-lg">PREMIUM SERVICE — KL 24 X 6779</Badge>
                        </div>
                    </div>
                </div>

                {/* Text Content - Order 2 on Desktop, Order 1 on Mobile */}
                <div className="flex flex-col space-y-8 order-1 md:order-2">
                    <div className="space-y-4">
                        <Badge className="w-fit bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1 text-xs md:text-sm" variant="outline">Kollam's Trusted Logistics</Badge>
                        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                            Unmatched load.<br/>
                            <span className="text-primary italic">On-time delivery.</span>
                        </h1>
                        <p className="text-muted-foreground text-base md:text-xl leading-relaxed max-w-lg">
                            Professional delivery of M-Sand, P-Sand, Crushed Metal, Rock Boulders, and Gravel. Reliable service across Kollam and surrounding regions.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold shadow-lg shadow-primary/20" onClick={() => navigate('calculator')}>Calculate Estimate</Button>
                        <Button size="lg" variant="outline" className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-bold" onClick={() => navigate('contact')}>Contact Us</Button>
                    </div>
                    <div className="flex items-center gap-8 pt-4">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">24/7</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Support</span>
                        </div>
                        <div className="w-px h-8 bg-border"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">15+</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Zones</span>
                        </div>
                        <div className="w-px h-8 bg-border"></div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold">Verified</span>
                            <span className="text-xs text-muted-foreground uppercase tracking-widest">Fleet</span>
                        </div>
                    </div>
                </div>
            </div>
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
                            <div className="font-bold text-lg">+91 999 999 9999</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 border p-4 rounded-lg">
                        <div className="p-3 bg-primary/10 rounded-full"><Icons.Building2 className="text-primary w-6 h-6"/></div>
                        <div>
                            <div className="font-medium text-sm text-muted-foreground">Office / Yard</div>
                            <div className="font-bold">Kallada, Kollam, Kerala</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
