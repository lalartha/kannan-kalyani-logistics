function AdminPage() {
    const [materials, setMaterials] = useState([]);
    const [locations, setLocations] = useState([]);
    const [activeTab, setActiveTab] = useState('materials');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchMaterials(), fetchLocations()]).then(([m, l]) => {
            setMaterials(m); setLocations(l); setLoading(false);
        });
    }, []);

    const updateMat = async (id, field, val) => {
        const numVal = val === '' ? null : Number(val);
        // Optimistic update
        setMaterials(materials.map(m => m.id === id ? { ...m, [field]: numVal } : m));
        await updateMaterialField(id, field, numVal);
    };

    const updateLoc = async (id, field, val) => {
        const numVal = val === '' ? null : Number(val);
        setLocations(locations.map(l => l.id === id ? { ...l, [field]: numVal } : l));
        await updateLocationField(id, field, numVal);
    };

    if (loading) return <div className="container mx-auto px-4 py-12 max-w-4xl"><Loading text="Loading admin panel..." /></div>;

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Admin Portal</h2>
                <Badge variant="secondary">Supabase Connected</Badge>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="materials">Materials & Pricing</TabsTrigger>
                    <TabsTrigger value="locations">Delivery Zones</TabsTrigger>
                </TabsList>
                
                <TabsContent value="materials">
                    <Card>
                        <CardHeader>
                            <CardTitle>Materials Base Rates</CardTitle>
                            <CardDescription>Update per-ft or per-load base pricing. Changes save to Supabase automatically.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Material</TableHead>
                                        <TableHead>Pricing Scheme</TableHead>
                                        <TableHead>Rate (₹)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {materials.map(m => (
                                        <TableRow key={m.id}>
                                            <TableCell className="font-medium">{m.name}</TableCell>
                                            <TableCell><Badge variant="outline">{m.pricing_type === 'per_ft' ? 'Per Cubic Ft' : 'Per Load'}</Badge></TableCell>
                                            <TableCell>
                                                <Input type="number" className="w-32"
                                                    value={m.pricing_type === 'per_ft' ? (m.price_per_ft ?? '') : (m.price_per_load ?? '')}
                                                    onChange={e => updateMat(m.id, m.pricing_type === 'per_ft' ? 'price_per_ft' : 'price_per_load', e.target.value)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="locations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transport Rates</CardTitle>
                            <CardDescription>Update delivery rates by zone.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Zone / Location</TableHead>
                                        <TableHead>Base Rate (₹)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.map(l => (
                                        <TableRow key={l.id}>
                                            <TableCell className="font-medium">{l.name}</TableCell>
                                            <TableCell>
                                                <Input type="number" className="w-32" value={l.transport_rate ?? ''} onChange={e => updateLoc(l.id, 'transport_rate', e.target.value)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function App() {
    const [page, setPage] = useState('home');
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        if (hash) setPage(hash);
    }, []);
    const navigate = (p) => { setPage(p); window.location.hash = p; window.scrollTo(0, 0); };

    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <Navbar page={page} navigate={navigate} />
                <main className="flex-1 pb-16 md:pb-0">
                    {page === 'home' && <HomePage navigate={navigate} />}
                    {page === 'calculator' && <CalculatorPage />}
                    {page === 'logistics' && <LogisticsPage />}
                    {page === 'admin' && <AdminPage />}
                    {page === 'contact' && <ContactPage />}
                </main>
                <footer className="border-t py-6 md:py-0 bg-muted/40 text-muted-foreground text-sm">
                    <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4">
                        <p>© 2026 Kannan Kalyani Logistics. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}
