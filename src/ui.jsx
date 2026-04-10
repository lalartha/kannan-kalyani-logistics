const Button = forwardRef(({ className, variant="default", size="default", children, ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
    };
    const sizes = { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-10 rounded-md px-8", icon: "h-9 w-9" };
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props}>{children}</button>;
});
const Input = forwardRef(({ className, type, ...props }, ref) => {
    return <input type={type} ref={ref} className={cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
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
const Select = forwardRef(({ className, children, ...props }, ref) => {
    return <select ref={ref} className={cn("flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props}>{children}</select>;
});
const Tabs = ({ value, onValueChange, children }) => {
    return <div className="space-y-4">{React.Children.map(children, child => child && React.cloneElement(child, { value, onValueChange }))}</div>;
};
const TabsList = ({ className, children, value, onValueChange }) => (
    <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>
        {React.Children.map(children, child => child && React.cloneElement(child, { activeValue: value, onValueChange }))}
    </div>
);
const TabsTrigger = ({ className, children, value, activeValue, onValueChange, disabled }) => {
    const active = value === activeValue;
    return (
        <button disabled={disabled} onClick={() => onValueChange(value)}
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
