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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-sm">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <div className="flex gap-6 md:gap-10">
                    <button onClick={() => navigate('home')} className="flex items-center space-x-2">
                        <span className="font-bold inline-block leading-tight text-left">
                            <div className="text-primary text-base">KANNAN KALYANI</div>
                            <div className="text-muted-foreground text-[10px] uppercase tracking-wider">Construction Logistics</div>
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
            {/* Mobile Nav */}
            <div className="md:hidden flex justify-around p-2 border-b bg-background">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = page === item.id;
                    return (
                        <button key={item.id} onClick={() => navigate(item.id)} className={cn("flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium", isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted")}>
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </button>
                    )
                })}
            </div>
        </header>
    );
}

function HomePage({ navigate }) {
    return (
        <div className="container mx-auto px-4 py-12 md:py-24 max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col justify-center space-y-6">
                    <Badge className="w-fit" variant="secondary">Kollam's Trusted Logistics</Badge>
                    <h1 className="text-4xl font-bold tracking-tight md:text-6xl text-foreground">
                        Unmatched load.<br/>
                        <span className="text-primary">On-time delivery.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-md">
                        Reliable delivery of M-Sand, P-Sand, Crushed Metal, Rock Boulders, Gravel and more — serving Kollam, Kallada, Munroe Thuruth and surrounding areas.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button size="lg" onClick={() => navigate('calculator')}>Calculate Estimate</Button>
                        <Button size="lg" variant="outline" onClick={() => navigate('contact')}>Contact Us</Button>
                    </div>
                </div>
                <div className="rounded-xl overflow-hidden border bg-muted/30 p-6 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="p-4"><CardTitle className="text-3xl font-bold text-primary">24/7</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">Emergency Support</CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4"><CardTitle className="text-3xl font-bold text-primary">15+</CardTitle></CardHeader>
                            <CardContent className="p-4 pt-0 text-sm text-muted-foreground">Service Zones</CardContent>
                        </Card>
                        <Card className="col-span-2">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg"><Icons.Truck className="text-primary w-5 h-5"/></div>
                                    <div className="font-semibold text-sm">Heavy Duty Fleet</div>
                                </div>
                                <Badge variant="outline">Verified</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function CalculatorPage() {
    const [materials] = useState(getMaterials);
    const [locations] = useState(getLocations);
    const [selMat, setSelMat] = useState(null);
    const [selFt, setSelFt] = useState('');
    const [selLoad, setSelLoad] = useState('');
    const [selLoc, setSelLoc] = useState('');
    const [loads, setLoads] = useState(1);
    const [result, setResult] = useState(null);

    const mat = useMemo(() => materials.find(m => m.id.toString() === selMat), [materials, selMat]);
    const loc = useMemo(() => locations.find(l => l.id.toString() === selLoc), [locations, selLoc]);

    function calculate() {
        if (!mat || !loc) return;
        let matCost = 0;
        if (mat.pricing_type === 'per_ft') {
            if (!selFt) return;
            matCost = mat.price_per_ft * parseInt(selFt);
        } else {
            matCost = mat.price_per_load;
        }
        const tpCost = loc.transport_rate;
        const base = matCost + tpCost;
        const total = base * loads;
        setResult({ matCost, tpCost, base, total, mat, loc, ft: selFt, loads });
    }

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
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name} — ₹{l.transport_rate.toLocaleString()}</option>)}
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
