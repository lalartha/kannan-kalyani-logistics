function LogisticsPage() {
    const [sites, setSites] = useState([]);
    const [defVehicles, setDefVehicles] = useState([]);
    const [activeSite, setActiveSite] = useState(null);
    const [activeDate, setActiveDate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetchSites(), fetchDefaultVehicles()]).then(([s, dv]) => {
            setSites(s); setDefVehicles(dv); setLoading(false);
        });
    }, []);

    const isSiteExpired = (end) => end && new Date(end) < new Date(new Date().setHours(0,0,0,0));
    
    const handleAddDefVehicle = async (e) => {
        e.preventDefault();
        const num = e.target.num.value.trim().toUpperCase();
        const own = e.target.own.value.trim();
        if (!num || !own) return;
        if (defVehicles.find(v => v.number === num)) { alert('Vehicle already exists.'); return; }
        const nv = await addDefaultVehicle(num, own);
        if (nv) { setDefVehicles([...defVehicles, nv]); e.target.reset(); }
    };

    const handleRemoveDefVehicle = async (id) => {
        await removeDefaultVehicle(id);
        setDefVehicles(defVehicles.filter(v => v.id !== id));
    };

    const handleCreateSite = async (e) => {
        e.preventDefault();
        const fm = new FormData(e.target);
        const s = await createSite({ name: fm.get('name'), location: fm.get('loc'), start_date: fm.get('sd'), end_date: fm.get('ed') });
        if (s) { setSites([s, ...sites]); e.target.reset(); setActiveSite(s); }
    };

    if (activeDate && activeSite) return <DailyLogView site={activeSite} date={activeDate} onBack={() => setActiveDate(null)} />;
    if (activeSite) return <DateView site={activeSite} onBack={() => { setActiveSite(null); fetchSites().then(setSites); }} onOpenDate={setActiveDate} />;

    if (loading) return <div className="container mx-auto px-4 py-12 max-w-4xl"><Loading text="Loading sites..." /></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Active Sites</h2>

            {/* Default Vehicles Panel */}
            <details className="group [&_summary::-webkit-details-marker]:hidden border rounded-xl overflow-hidden bg-card">
                <summary className="flex cursor-pointer items-center justify-between bg-muted/30 p-4 font-semibold">
                    <span className="flex items-center gap-2"><Icons.Truck className="w-5 h-5"/> Company Default Vehicles <Badge variant="secondary" className="ml-2">{defVehicles.length}</Badge></span>
                    <Icons.ChevronDown className="h-5 w-5 transition-transform group-open:-rotate-180" />
                </summary>
                <div className="p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">These vehicles automatically appear in every new daily log.</p>
                    <div className="space-y-2">
                        {defVehicles.map(v => (
                            <div key={v.id} className="flex justify-between items-center p-3 border rounded-md">
                                <span className="font-medium flex items-center gap-2"><Icons.Truck className="w-4 h-4 text-primary"/> {v.number} <span className="text-muted-foreground text-xs font-normal">({v.owner_name})</span></span>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveDefVehicle(v.id)}><Icons.Trash2 className="w-4 h-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleAddDefVehicle} className="flex gap-2">
                        <Input name="num" placeholder="Vehicle No (e.g. KL07)" required className="uppercase" />
                        <Input name="own" placeholder="Owner Name" required />
                        <Button type="submit">Add</Button>
                    </form>
                </div>
            </details>

            {/* New Site Form */}
            <form onSubmit={handleCreateSite} className="grid gap-4 md:grid-cols-5 p-4 border rounded-xl bg-card">
                <div className="md:col-span-1"><Label>New Site Name</Label><Input name="name" required placeholder="Project Name" /></div>
                <div className="md:col-span-1"><Label>Location</Label><Input name="loc" required placeholder="City/Region" /></div>
                <div className="md:col-span-1"><Label>Start Date</Label><Input name="sd" type="date" required defaultValue={new Date().toISOString().split('T')[0]}/></div>
                <div className="md:col-span-1"><Label>Pass End Date</Label><Input name="ed" type="date" required /></div>
                <div className="md:col-span-1 flex items-end"><Button className="w-full">Create Site</Button></div>
            </form>

            {/* Site List */}
            <div className="space-y-3">
                {sites.map(s => (
                    <Card key={s.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveSite(s)}>
                        <CardHeader className="py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{s.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1"><Icons.MapPin className="w-3 h-3"/> {s.location} • Expires {new Date(s.end_date).toLocaleDateString()}</CardDescription>
                                </div>
                                <div className="flex items-center gap-4">
                                    {isSiteExpired(s.end_date) && <Badge variant="destructive">Pass Expired</Badge>}
                                    <Icons.ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
                {sites.length === 0 && <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl">No active sites. Create one above.</div>}
            </div>
        </div>
    );
}

function DateView({ site, onBack, onOpenDate }) {
    const [selDate, setSelDate] = useState(new Date().toISOString().split('T')[0]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDailyLogsForSite(site.id).then(d => { setLogs(d); setLoading(false); });
    }, [site.id]);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="cursor-pointer hover:underline" onClick={onBack}>Sites</span>
                <Icons.ChevronRight className="w-4 h-4"/> <span>{site.name}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Select Date</h2>
            <Card>
                <CardContent className="pt-6 flex gap-4">
                    <Input type="date" value={selDate} onChange={e => setSelDate(e.target.value)} />
                    <Button onClick={() => onOpenDate(selDate)}>Open Log</Button>
                </CardContent>
            </Card>
            <h3 className="text-xl font-semibold mt-8">Recent Logs</h3>
            {loading ? <Loading text="Loading logs..." /> : (
                <div className="space-y-2">
                    {logs.map(d => (
                        <div key={d.id} className="flex justify-between items-center p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors" onClick={() => onOpenDate(d.log_date)}>
                            <span className="font-medium flex items-center gap-2"><Icons.Calendar className="w-4 h-4"/> {new Date(d.log_date).toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'short', day:'numeric'})}</span>
                            <Badge variant="secondary">{d.load_count} loads</Badge>
                        </div>
                    ))}
                    {logs.length === 0 && <div className="text-sm text-muted-foreground py-4">No logs recorded yet.</div>}
                </div>
            )}
        </div>
    );
}

function DailyLogView({ site, date, onBack }) {
    const [dailyLogId, setDailyLogId] = useState(null);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const logId = await getOrCreateDailyLog(site.id, date);
            if (!logId) { setLoading(false); return; }
            setDailyLogId(logId);
            const ownerData = await fetchFullLog(logId);
            setOwners(ownerData);
            setLoading(false);
        })();
    }, [site.id, date]);

    const handleAddOwner = async (e) => {
        e.preventDefault();
        const nm = e.target.nm.value.trim();
        const ph = e.target.ph.value.trim();
        if (!nm) return;
        const newOwner = await dbAddOwner(dailyLogId, nm, ph);
        if (newOwner) { setOwners([...owners, newOwner]); e.target.reset(); }
    };
    
    const updateOwnerInState = (idx, updated) => {
        const nOwners = [...owners]; nOwners[idx] = updated; setOwners(nOwners);
    };

    let totalLoads = 0;
    owners.forEach(o => { if(!o.is_disabled) { (o.vehicles || []).forEach(v => { if(!v.is_disabled) { totalLoads += (v.loads || []).length; }})}});

    if (loading) return <div className="container mx-auto px-4 py-12 max-w-5xl"><Loading text="Loading daily log..." /></div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span className="cursor-pointer hover:underline" onClick={onBack}>Dates</span>
                <Icons.ChevronRight className="w-4 h-4"/> <span>{site.name}</span>
                <Icons.ChevronRight className="w-4 h-4"/> <span className="font-medium text-foreground">{new Date(date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Daily Log</h2>
                <Badge variant="default" className="text-sm px-3 py-1">{totalLoads} loads today</Badge>
            </div>

            <div className="space-y-4">
                {owners.map((o, oi) => (
                    <OwnerSection key={o.id} owner={o} owners={owners} updateOwner={(uo) => updateOwnerInState(oi, uo)} />
                ))}

                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="pt-6">
                        <form onSubmit={handleAddOwner} className="flex gap-4">
                            <Input name="nm" placeholder="New Transporter / Owner Name" required />
                            <Input name="ph" placeholder="Contact (optional)" />
                            <Button type="submit" variant="secondary"><Icons.Plus className="w-4 h-4 mr-1"/> Add Owner</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <OwnerSummary owners={owners} />
        </div>
    );
}

function OwnerSection({ owner, owners, updateOwner }) {
    let oLoads = 0;
    (owner.vehicles || []).forEach(v => { if(!v.is_disabled) oLoads += (v.loads || []).length; });
    
    const handleToggleDisabled = async (e) => {
        e.stopPropagation();
        const newVal = !owner.is_disabled;
        await dbUpdateOwner(owner.id, { is_disabled: newVal });
        updateOwner({ ...owner, is_disabled: newVal });
    };

    const handleToggleOpen = () => updateOwner({ ...owner, is_open: !owner.is_open });

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        const nv = e.target.nv.value.trim().toUpperCase();
        if (!nv) return;
        // Check uniqueness across all owners in current day
        let exists = false;
        owners.forEach(o => (o.vehicles || []).forEach(v => { if (v.number === nv) exists = true; }));
        if (exists) { alert('Vehicle already exists today.'); return; }
        const newVehicle = await dbAddVehicle(owner.id, nv);
        if (newVehicle) {
            updateOwner({ ...owner, vehicles: [...(owner.vehicles || []), newVehicle] });
            e.target.reset();
        }
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/40 p-3 pr-4 cursor-pointer" onClick={handleToggleOpen}>
                <div className="flex items-center gap-4">
                    <Button variant={owner.is_disabled ? "outline" : "default"} size="sm" className="h-7 text-xs w-14" onClick={handleToggleDisabled}>
                        {owner.is_disabled ? 'OFF' : 'ON'}
                    </Button>
                    <div className={cn("font-semibold flex items-center gap-2", owner.is_disabled && "opacity-50 line-through")}>
                        <Icons.Building2 className="w-5 h-5 text-muted-foreground"/> {owner.name}
                        {owner.is_default && <span className="text-[10px] uppercase font-bold text-muted-foreground ml-2 tracking-wider">Default</span>}
                    </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{oLoads} loads</span>
                    <Icons.ChevronDown className={cn("w-5 h-5 transition-transform", !owner.is_open && "rotate-180")} />
                </div>
            </div>
            
            {owner.is_open && !owner.is_disabled && (
                <div className="p-4 space-y-4">
                    {(owner.vehicles || []).map((v, vi) => (
                        <VehicleRow key={v.id} vehicle={v} updateVehicle={(uv) => {
                            const nv = [...(owner.vehicles || [])]; nv[vi] = uv; updateOwner({ ...owner, vehicles: nv });
                        }} />
                    ))}
                    <form onSubmit={handleAddVehicle} className="flex gap-2 w-full max-w-sm mt-4">
                        <Input name="nv" placeholder="Add Vehicle (e.g. KL07)" size="sm" className="uppercase h-8" />
                        <Button type="submit" variant="outline" size="sm" className="h-8"><Icons.Plus className="w-4 h-4"/></Button>
                    </form>
                </div>
            )}
        </Card>
    );
}

function VehicleRow({ vehicle, updateVehicle }) {
    const [open, setOpen] = useState(false);

    const handleToggleDisabled = async (e) => {
        e.stopPropagation();
        const newVal = !vehicle.is_disabled;
        await dbUpdateVehicle(vehicle.id, { is_disabled: newVal });
        updateVehicle({ ...vehicle, is_disabled: newVal });
    };

    const handleAddLoad = async () => {
        const newLoad = await dbAddLoad(vehicle.id, {
            load_time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            material: 'Gravel',
            is_paid: false,
            has_pass: false
        });
        if (newLoad) updateVehicle({ ...vehicle, loads: [...(vehicle.loads || []), newLoad] });
    };

    const handleUpdateLoad = async (li, field, value) => {
        const load = vehicle.loads[li];
        await dbUpdateLoad(load.id, { [field]: value });
        const nl = [...vehicle.loads]; nl[li] = { ...load, [field]: value }; updateVehicle({ ...vehicle, loads: nl });
    };

    const handleDeleteLoad = async (li) => {
        const load = vehicle.loads[li];
        await dbDeleteLoad(load.id);
        const nl = [...vehicle.loads]; nl.splice(li, 1); updateVehicle({ ...vehicle, loads: nl });
    };

    return (
        <div className="border border-muted-foreground/20 rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-muted/20 p-2 px-3 cursor-pointer" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-3">
                    <Button variant={vehicle.is_disabled ? "outline" : "secondary"} size="sm" className="h-6 text-[10px] w-12 px-0" onClick={handleToggleDisabled}>
                        {vehicle.is_disabled ? 'OFF' : 'ON'}
                    </Button>
                    <div className={cn("font-medium text-sm flex items-center gap-2", vehicle.is_disabled && "opacity-50 line-through")}>
                        <Icons.Truck className="w-4 h-4"/> {vehicle.number}
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {(vehicle.loads || []).length} loads
                    <Icons.ChevronDown className={cn("w-4 h-4 transition-transform", !open && "rotate-180")} />
                </div>
            </div>
            {open && !vehicle.is_disabled && (
                <div className="p-3 space-y-2 bg-background border-t">
                    {(vehicle.loads || []).map((l, li) => (
                        <div key={l.id} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded border border-muted">
                            <span className="text-muted-foreground tabular-nums px-2 border-r">{l.load_time}</span>
                            <Select className="h-7 py-0 w-32 border-transparent bg-transparent" value={l.material} onChange={(e) => handleUpdateLoad(li, 'material', e.target.value)}>
                                {LOAD_MATERIALS.map(m => <option key={m}>{m}</option>)}
                            </Select>
                            <Button variant="ghost" size="sm" className={cn("h-7 px-2", l.is_paid ? "text-green-600 bg-green-50 dark:bg-green-950/30" : "text-destructive bg-destructive/10")}
                                onClick={() => handleUpdateLoad(li, 'is_paid', !l.is_paid)}>
                                {l.is_paid ? 'Paid' : 'Unpaid'}
                            </Button>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={l.has_pass} className="accent-primary" onChange={(e) => handleUpdateLoad(li, 'has_pass', e.target.checked)}/> <span className="text-xs">Pass</span>
                            </label>
                            <div className="flex-1 text-right">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => handleDeleteLoad(li)}><Icons.X className="w-3 h-3"/></Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2 h-8 border-dashed" onClick={handleAddLoad}>
                        <Icons.Plus className="w-4 h-4 mr-1"/> Add Load
                    </Button>
                </div>
            )}
        </div>
    );
}

function OwnerSummary({ owners }) {
    let summary = [];
    owners.forEach(o => {
        if (o.is_disabled) return;
        let t = 0, p = 0, u = 0, mats = {};
        (o.vehicles || []).forEach(v => {
            if (v.is_disabled) return;
            (v.loads || []).forEach(l => {
                t++; if (l.is_paid) p++; else u++;
                mats[l.material] = (mats[l.material] || 0) + 1;
            });
        });
        if (t > 0) summary.push({ name: o.name, total: t, paid: p, unpaid: u, mats: Object.entries(mats).map(([k, v]) => `${k}:${v}`).join(', ') });
    });
    if (summary.length === 0) return null;

    return (
        <Card className="mt-8 border-primary/20">
            <CardHeader className="bg-primary/5 pb-4"><CardTitle>Owner Settlement Summary</CardTitle></CardHeader>
            <CardContent className="pt-4 p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Owner</TableHead>
                            <TableHead className="text-right">Total Loads</TableHead>
                            <TableHead className="text-center text-green-600">Paid</TableHead>
                            <TableHead className="text-center text-destructive">Unpaid</TableHead>
                            <TableHead>Materials</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {summary.map(s => (
                            <TableRow key={s.name}>
                                <TableCell className="font-semibold">{s.name}</TableCell>
                                <TableCell className="text-right font-bold">{s.total}</TableCell>
                                <TableCell className="text-center text-green-600 bg-green-50/50 dark:bg-green-900/10">{s.paid}</TableCell>
                                <TableCell className="text-center text-destructive bg-destructive/5">{s.unpaid}</TableCell>
                                <TableCell className="text-muted-foreground text-xs">{s.mats}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
