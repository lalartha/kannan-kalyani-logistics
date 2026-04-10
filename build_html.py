import os
import json

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en" class="light">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Kannan Kalyani — Logistics Management</title>
    <meta name="description" content="Construction Logistics & Services" />
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        @layer base {
            :root {
                --background: 0 0% 100%;
                --foreground: 240 10% 3.9%;
                --card: 0 0% 100%;
                --card-foreground: 240 10% 3.9%;
                --popover: 0 0% 100%;
                --popover-foreground: 240 10% 3.9%;
                --primary: 38 92% 50%;
                --primary-foreground: 240 5.9% 10%;
                --secondary: 240 4.8% 95.9%;
                --secondary-foreground: 240 5.9% 10%;
                --muted: 240 4.8% 95.9%;
                --muted-foreground: 240 3.8% 46.1%;
                --accent: 240 4.8% 95.9%;
                --accent-foreground: 240 5.9% 10%;
                --destructive: 0 84.2% 60.2%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 5.9% 90%;
                --input: 240 5.9% 90%;
                --ring: 38 92% 50%;
                --radius: 0.5rem;
            }
            .dark {
                --background: 240 10% 3.9%;
                --foreground: 0 0% 98%;
                --card: 240 10% 3.9%;
                --card-foreground: 0 0% 98%;
                --popover: 240 10% 3.9%;
                --popover-foreground: 0 0% 98%;
                --primary: 38 92% 50%;
                --primary-foreground: 240 5.9% 10%;
                --secondary: 240 3.7% 15.9%;
                --secondary-foreground: 0 0% 98%;
                --muted: 240 3.7% 15.9%;
                --muted-foreground: 240 5% 64.9%;
                --accent: 240 3.7% 15.9%;
                --accent-foreground: 0 0% 98%;
                --destructive: 0 62.8% 30.6%;
                --destructive-foreground: 0 0% 98%;
                --border: 240 3.7% 15.9%;
                --input: 240 3.7% 15.9%;
                --ring: 38 92% 50%;
            }
            * { border-color: hsl(var(--border)); font-family: 'Inter', sans-serif; }
            body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); font-feature-settings: "rlig" 1, "calt" 1; }
        }
        /* Leaflet tile dark mode filter */
        .dark .leaflet-layer,
        .dark .leaflet-control-zoom-in,
        .dark .leaflet-control-zoom-out,
        .dark .leaflet-control-attribution { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
    </style>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        border: "hsl(var(--border))",
                        input: "hsl(var(--input))",
                        ring: "hsl(var(--ring))",
                        background: "hsl(var(--background))",
                        foreground: "hsl(var(--foreground))",
                        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
                        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
                        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
                        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
                        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
                        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
                        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
                    },
                    borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
                }
            }
        }
    </script>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useEffect, useRef, forwardRef, useMemo } = React;

        function cn(...classes) {
            return classes.filter(Boolean).join(' ');
        }

        // --- ICONS (Lucide styled) ---
        const Icons = {
            Home: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
            Calculator: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>,
            ClipboardList: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
            Phone: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
            Settings: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
            Plus: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
            X: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
            Check: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 6 9 17l-5-5"/></svg>,
            Moon: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>,
            Sun: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>,
            MapPin: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
            Truck: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-3.34a4 4 0 0 0-1.17-2.83L19 9h-5v8h2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>,
            Building2: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>,
            User: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
            Users: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
            Calendar: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
            ChevronRight: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m9 18 6-6-6-6"/></svg>,
            ChevronDown: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m6 9 6 6 6-6"/></svg>,
            ChevronLeft: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m15 18-6-6 6-6"/></svg>,
            Trash2: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>,
            Edit2: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
            Menu: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
            LogOut: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
            Package: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
            Layers: p => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
        };

        // --- UI COMPONENTS ---
        const Button = forwardRef(({ className, variant="default", size="default", children, ...props }, ref) => {
            const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
            const variants = {
                default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
                outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline"
            };
            const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-10 rounded-md px-8", icon: "h-9 w-9" };
            return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
        });

        const Input = forwardRef(({ className, type, ...props }, ref) => {
            return <input type={type} ref={ref} className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
        });

        const Label = forwardRef(({ className, ...props }, ref) => (
            <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
        ));

        const Card = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />);
        const CardHeader = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />);
        const CardTitle = forwardRef(({ className, ...props }, ref) => <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />);
        const CardDescription = forwardRef(({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />);
        const CardContent = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />);
        const CardFooter = forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />);

        const Badge = forwardRef(({ className, variant="default", ...props }, ref) => {
            const base = "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
            const variants = {
                default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
            };
            return <div ref={ref} className={cn(base, variants[variant], className)} {...props} />
        });

        const Select = forwardRef(({ className, ...props }, ref) => {
            return <select ref={ref} className={cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
        });

        const Tabs = ({ value, onValueChange, children }) => {
            return <div className="space-y-4">{React.Children.map(children, child => React.cloneElement(child, { value, onValueChange }))}</div>;
        };
        const TabsList = ({ className, children, value, onValueChange }) => (
            <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
                {React.Children.map(children, child => React.cloneElement(child, { activeValue: value, onValueChange }))}
            </div>
        );
        const TabsTrigger = ({ className, children, value, activeValue, onValueChange, disabled }) => {
            const active = value === activeValue;
            return (
                <button
                    disabled={disabled}
                    onClick={() => onValueChange(value)}
                    className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                        active ? "bg-background text-foreground shadow" : "hover:bg-background/50 hover:text-foreground", className)}
                >{children}</button>
            );
        };
        const TabsContent = ({ className, children, value, activeValue }) => {
            if (value !== activeValue) return null;
            return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>;
        };

        const Table = forwardRef(({ className, ...props }, ref) => (
            <div className="relative w-full overflow-auto border rounded-md"><table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} /></div>
        ));
        const TableHeader = forwardRef(({ className, ...props }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b bg-muted/50", className)} {...props} />);
        const TableBody = forwardRef(({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />);
        const TableRow = forwardRef(({ className, ...props }, ref) => <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />);
        const TableHead = forwardRef(({ className, ...props }, ref) => <th ref={ref} className={cn("h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />);
        const TableCell = forwardRef(({ className, ...props }, ref) => <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />);

        // --- DATA LAYER ---
        const DEFAULT_MATERIALS = [
            { id: 1, name: "M-Sand", pricing_type: "per_ft", price_per_ft: 50, price_per_load: null, description: "Manufactured sand for plastering & brickwork" },
            { id: 2, name: "P-Sand", pricing_type: "per_ft", price_per_ft: 55, price_per_load: null, description: "Plastering-grade fine sand" },
            { id: 3, name: "Crushed Metal", pricing_type: "per_ft", price_per_ft: 48, price_per_load: null, description: "Crushed stone aggregate for concrete" },
            { id: 4, name: "Rock Boulders", pricing_type: "per_load", price_per_ft: null, price_per_load: 5000, description: "Large boulders for foundations" },
            { id: 5, name: "Gravel", pricing_type: "per_load", price_per_ft: null, price_per_load: 3000, description: "Natural gravel for road base & filling" },
            { id: 6, name: "Cutting Earth", pricing_type: "per_load", price_per_ft: null, price_per_load: 2500, description: "Excavated earth for land filling" },
            { id: 7, name: "Quarry Waste", pricing_type: "per_load", price_per_ft: null, price_per_load: 2000, description: "Quarry by-product for sub-base layers" },
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
        
        // Logistics Data
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

        // --- THEME CONTEXT ---
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

        // --- COMPONENTS ---
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
                                <span className="font-bold inline-block leading-tight">
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
                </header>
            );
        }

        // ... (I will fill in the pages in the next chunk, keeping this clean)
"""

with open("index.tmp.html", "w", encoding="utf-8") as f:
    f.write(HTML_CONTENT)
