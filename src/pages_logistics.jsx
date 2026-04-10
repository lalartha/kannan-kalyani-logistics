function LogisticsPage() {
    const [sites, setSites] = useState(getSites);
    const [defVehicles, setDefVehicles] = useState(getDefaultVehicles);
    const [activeSite, setActiveSite] = useState(null);
    const [activeDate, setActiveDate] = useState(null);

    const isSiteExpired = (end) => end && new Date(end) < new Date(new Date().setHours(0,0,0,0));
    
    // Auto-update standard vehicles
    const addDefVehicle = (e) => {
        e.preventDefault();
        const num = e.target.num.value; const own = e.target.own.value;
        if(num && own && !defVehicles.find(v=>v.number===num)) {
            const nd = [...defVehicles, {id: Date.now().toString(), number: num, owner_name: own}];
            setDefVehicles(nd); saveDefaultVehicles(nd);
            e.target.reset();
        }
    };
    const removeDefVehicle = (id) => {
        const nd = defVehicles.filter(v=>v.id!==id);
        setDefVehicles(nd); saveDefaultVehicles(nd);
    };

    if (activeDate && activeSite) return <DailyLogView site={activeSite} date={activeDate} onBack={() => setActiveDate(null)} />;
    if (activeSite) return <DateView site={activeSite} onBack={() => setActiveSite(null)} onOpenDate={setActiveDate} onUpdate={()=>{setSites(getSites())}} />;

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
                                <Button variant="ghost" size="sm" onClick={() => removeDefVehicle(v.id)}><Icons.Trash2 className="w-4 h-4 text-destructive"/></Button>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={addDefVehicle} className="flex gap-2">
                        <Input name="num" placeholder="Vehicle No (e.g. KL07)" required className="uppercase" />
                        <Input name="own" placeholder="Owner Name" required />
                        <Button type="submit">Add</Button>
                    </form>
                </div>
            </details>

            <form onSubmit={e => {
                e.preventDefault();
                const fm = new FormData(e.target);
                const s = { id: 'site_'+Date.now(), name: fm.get('name'), location: fm.get('loc'), start_date: fm.get('sd'), end_date: fm.get('ed') };
                const ns = [...sites, s]; setSites(ns); saveSites(ns); e.target.reset(); setActiveSite(s);
            }} className="grid gap-4 md:grid-cols-5 p-4 border rounded-xl bg-card">
                <div className="md:col-span-1"><Label>New Site Name</Label><Input name="name" required placeholder="Project Name" /></div>
                <div className="md:col-span-1"><Label>Location</Label><Input name="loc" required placeholder="City/Region" /></div>
                <div className="md:col-span-1"><Label>Start Date</Label><Input name="sd" type="date" required defaultValue={new Date().toISOString().split('T')[0]}/></div>
                <div className="md:col-span-1"><Label>Legal Pass End Date</Label><Input name="ed" type="date" required /></div>
                <div className="md:col-span-1 flex items-end"><Button className="w-full">Create Site</Button></div>
            </form>

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
    const keys = Object.keys(localStorage).filter(k => k.startsWith(`kk_log_${site.id}_`));
    const dates = keys.map(k => k.split(`kk_log_${site.id}_`)[1]).sort((a,b)=>new Date(b)-new Date(a));

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="cursor-pointer hover:underline" onClick={onBack}>Sites</span>
                <Icons.ChevronRight className="w-4 h-4"/> <span>{site.name}</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Select Date</h2>
            <Card>
                <CardContent className="pt-6 flex gap-4">
                    <Input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} />
                    <Button onClick={() => onOpenDate(selDate)}>Open Log</Button>
                </CardContent>
            </Card>
            <h3 className="text-xl font-semibold mt-8">Recent Logs</h3>
            <div className="space-y-2">
                {dates.map(d => {
                    const lg = getRawLog(site.id, d);
                    let count = 0;
                    lg?.owners?.forEach(o => o.vehicles?.forEach(v => count += v.loads?.length || 0));
                    return (
                        <div key={d} className="flex justify-between items-center p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors" onClick={() => onOpenDate(d)}>
                            <span className="font-medium flex items-center gap-2"><Icons.Calendar className="w-4 h-4"/> {new Date(d).toLocaleDateString(undefined, {weekday:'long', year:'numeric', month:'short', day:'numeric'})}</span>
                            <Badge variant="secondary">{count} loads</Badge>
                        </div>
                    );
                })}
                {dates.length === 0 && <div className="text-sm text-muted-foreground py-4">No logs recorded yet.</div>}
            </div>
        </div>
    );
}

function DailyLogView({ site, date, onBack }) {
    const [log, setLog] = useState(() => buildLog(site.id, date));
    useEffect(() => { saveLog(site.id, date, log); }, [log, site.id, date]);

    const addOwner = (e) => {
        e.preventDefault();
        const nm = e.target.nm.value; const ph = e.target.ph.value;
        if(nm) {
            setLog({ ...log, owners: [...log.owners, { id: 'own_'+Date.now(), name: nm, contact: ph, is_open: true, is_disabled: false, vehicles: [] }] });
            e.target.reset();
        }
    };
    
    let totalLoads = 0;
    log.owners.forEach(o => { if(!o.is_disabled) { o.vehicles.forEach(v => { if(!v.is_disabled) { totalLoads += v.loads.length; }})}});

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
                {log.owners.map((o, oi) => (
                    <OwnerSection key={o.id} owner={o} updateOwner={(uo) => {
                        const no = [...log.owners]; no[oi] = uo; setLog({...log, owners: no});
                    }} log={log} />
                ))}

                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="pt-6">
                        <form onSubmit={addOwner} className="flex gap-4">
                            <Input name="nm" placeholder="New Transporter / Owner Name" required />
                            <Input name="ph" placeholder="Contact (optional)" />
                            <Button type="submit" variant="secondary"><Icons.Plus className="w-4 h-4 mr-1"/> Add Owner</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <OwnerSummary owners={log.owners} />
        </div>
    );
}

function OwnerSection({ owner, updateOwner, log }) {
    let oLoads = 0;
    owner.vehicles?.forEach(v => { if(!v.is_disabled) oLoads += v.loads?.length || 0; });
    
    // Check global uniqueness for new vehicle
    const addVehicle = (e) => {
        e.preventDefault(); const nv = e.target.nv.value.trim().toUpperCase();
        if(!nv) return;
        let exists = false;
        log.owners.forEach(o => o.vehicles.forEach(v => { if(v.number === nv) exists = true; }));
        if(exists) { alert('Vehicle already exists today.'); return; }
        updateOwner({...owner, vehicles: [...owner.vehicles, {id: 'v_'+Date.now(), number: nv, is_disabled: false, loads: []}]});
        e.target.reset();
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b bg-muted/40 p-3 pr-4 group cursor-pointer" onClick={() => updateOwner({...owner, is_open: !owner.is_open})}>
                <div className="flex items-center gap-4">
                    <Button variant={owner.is_disabled ? "outline" : "default"} size="sm" className="h-7 text-xs w-14"
                        onClick={(e) => { e.stopPropagation(); updateOwner({...owner, is_disabled: !owner.is_disabled}); }}>
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
                    {owner.vehicles.map((v, vi) => (
                        <VehicleRow key={v.id} vehicle={v} updateVehicle={(uv) => {
                            const nv = [...owner.vehicles]; nv[vi] = uv; updateOwner({...owner, vehicles: nv});
                        }} />
                    ))}
                    <form onSubmit={addVehicle} className="flex gap-2 w-full max-w-sm mt-4">
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
    return (
        <div className="border border-muted-foreground/20 rounded-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center bg-muted/20 p-2 px-3 cursor-pointer" onClick={() => setOpen(!open)}>
                <div className="flex items-center gap-3">
                    <Button variant={vehicle.is_disabled ? "outline" : "secondary"} size="sm" className="h-6 text-[10px] w-12 px-0"
                        onClick={(e) => { e.stopPropagation(); updateVehicle({...vehicle, is_disabled: !vehicle.is_disabled}); }}>
                        {vehicle.is_disabled ? 'OFF' : 'ON'}
                    </Button>
                    <div className={cn("font-medium text-sm flex items-center gap-2", vehicle.is_disabled && "opacity-50 line-through")}>
                        <Icons.Truck className="w-4 h-4"/> {vehicle.number}
                    </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {vehicle.loads.length} loads
                    <Icons.ChevronDown className={cn("w-4 h-4 transition-transform", !open && "rotate-180")} />
                </div>
            </div>
            {open && !vehicle.is_disabled && (
                <div className="p-3 space-y-2 bg-background border-t">
                    {vehicle.loads.map((l, li) => (
                        <div key={li} className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded border border-muted">
                            <span className="text-muted-foreground tabular-nums px-2 border-r">{l.time}</span>
                            <Select className="h-7 py-0 w-32 border-transparent bg-transparent" value={l.material} onChange={(e) => {
                                const nl = [...vehicle.loads]; nl[li].material = e.target.value; updateVehicle({...vehicle, loads: nl});
                            }}>
                                {LOAD_MATERIALS.map(m => <option key={m}>{m}</option>)}
                            </Select>
                            <Button variant="ghost" size="sm" className={cn("h-7 px-2", l.is_paid ? "text-green-600 bg-green-50 dark:bg-green-950/30" : "text-destructive bg-destructive/10")}
                                onClick={() => { const nl = [...vehicle.loads]; nl[li].is_paid = !l.is_paid; updateVehicle({...vehicle, loads: nl}); }}>
                                {l.is_paid ? 'Paid' : 'Unpaid'}
                            </Button>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={l.has_pass} className="accent-primary" onChange={(e) => {
                                    const nl = [...vehicle.loads]; nl[li].has_pass = e.target.checked; updateVehicle({...vehicle, loads: nl});
                                }}/> <span className="text-xs">Pass</span>
                            </label>
                            <div className="flex-1 text-right">
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => {
                                    const nl = [...vehicle.loads]; nl.splice(li, 1); updateVehicle({...vehicle, loads: nl});
                                }}><Icons.X className="w-3 h-3"/></Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2 h-8 border-dashed" onClick={() => {
                        const nl = [...vehicle.loads, { time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}), material: 'Gravel', is_paid: false, has_pass: false }];
                        updateVehicle({...vehicle, loads: nl});
                    }}>
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
        if(o.is_disabled) return;
        let t = 0, p = 0, u = 0, mats = {};
        o.vehicles.forEach(v => {
            if(v.is_disabled) return;
            v.loads.forEach(l => {
                t++; if(l.is_paid) p++; else u++;
                mats[l.material] = (mats[l.material]||0)+1;
            });
        });
        if(t > 0) summary.push({ name: o.name, total: t, paid: p, unpaid: u, mats: Object.entries(mats).map(([k,v])=>`${k}:${v}`).join(', ') });
    });
    if(summary.length === 0) return null;

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
