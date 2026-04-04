import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BarChart3, CircleUserRound, LayoutDashboard, Moon, Search, Receipt, Settings, Sun, Bell, } from "lucide-react";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, } from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
const searchItems = [
    {
        label: "Dashboard",
        description: "Open the main overview and summary cards.",
        to: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Transactions",
        description: "Browse, filter, and manage the transaction ledger.",
        to: "/transactions",
        icon: Receipt,
    },
    {
        label: "Insights",
        description: "Review trends, monthly snapshots, and spending mix.",
        to: "/insights",
        icon: BarChart3,
    },
    {
        label: "Settings",
        description: "Adjust role, theme, and export preferences.",
        to: "/settings",
        icon: Settings,
    },
];
function matchesSearch(item, query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
        return true;
    }
    return (item.label.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized));
}
export default function Header() {
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const themeIcon = theme === "dark" ? Sun : Moon;
    const ThemeIcon = themeIcon;
    const filteredItems = searchItems.filter((item) => matchesSearch(item, searchQuery));
    useEffect(() => {
        const handleKeyDown = (event) => {
            const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
            if (isShortcut) {
                event.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    useEffect(() => {
        if (!searchOpen) {
            setSearchQuery("");
        }
    }, [searchOpen]);
    const goTo = (to) => {
        navigate(to);
        setSearchOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "sticky top-0 z-40 flex items-center gap-3 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/80", children: [_jsx(SidebarTrigger, { className: "shrink-0" }), _jsxs("button", { type: "button", onClick: () => setSearchOpen(true), className: cn("flex min-w-0 flex-1 items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-2xl"), "aria-label": "Open search", children: [_jsx(Search, { className: "size-4 shrink-0 text-muted-foreground" }), _jsx("span", { className: "min-w-0 flex-1 truncate", children: "Search sections, settings, and transactions" }), _jsxs("span", { className: "hidden items-center gap-1 md:flex", children: [_jsx(Kbd, { children: "Ctrl" }), _jsx(Kbd, { children: "K" })] })] }), _jsx("button", { type: "button", onClick: () => setSearchOpen(true), className: "flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted md:hidden", "aria-label": "Open search", children: _jsx(Search, { className: "size-4" }) }), _jsxs("div", { className: "ml-auto flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted", "aria-label": "Toggle theme", children: _jsx(ThemeIcon, { className: "size-4" }) }), _jsxs("button", { type: "button", className: "relative flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted", "aria-label": "Notifications", children: [_jsx(Bell, { className: "size-4" }), _jsx("span", { className: "absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground", children: "3" })] }), _jsx("button", { type: "button", onClick: () => navigate("/settings"), className: "flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted", "aria-label": "User profile", children: _jsx(CircleUserRound, { className: "size-4" }) })] })] }), _jsx(Sheet, { open: searchOpen, onOpenChange: setSearchOpen, children: _jsx(SheetContent, { side: "right", className: "overflow-hidden p-0 data-[side=right]:left-1/2 data-[side=right]:top-1/2 data-[side=right]:right-auto data-[side=right]:bottom-auto data-[side=right]:h-auto data-[side=right]:w-[min(92vw,48rem)] data-[side=right]:max-h-[80vh] data-[side=right]:-translate-x-1/2 data-[side=right]:-translate-y-1/2 data-[side=right]:rounded-3xl data-[side=right]:border data-[side=right]:shadow-2xl", children: _jsxs("div", { className: "flex w-full flex-col gap-4 overflow-hidden px-4 py-5", children: [_jsxs(SheetHeader, { className: "px-0 pb-0", children: [_jsx(SheetTitle, { children: "Quick search" }), _jsx(SheetDescription, { children: "Jump between dashboard sections with a keyboard-first search." })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { autoFocus: true, value: searchQuery, onChange: (event) => setSearchQuery(event.target.value), placeholder: "Search Dashboard, Transactions, Insights, Settings...", className: "h-10 pl-9 pr-20" }), _jsx("div", { className: "pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 md:flex", children: _jsx(Kbd, { children: "Esc" }) })] }), _jsx("div", { className: "grid gap-2", children: filteredItems.length > 0 ? (filteredItems.map((item) => {
                                            const Icon = item.icon;
                                            const active = location.pathname === item.to;
                                            return (_jsxs("button", { type: "button", onClick: () => goTo(item.to), className: cn("flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors", active
                                                    ? "border-primary/20 bg-primary/8"
                                                    : "border-border/70 bg-background/70 hover:bg-muted/60"), children: [_jsx("div", { className: cn("flex size-10 items-center justify-center rounded-full border", active
                                                            ? "border-primary/20 bg-primary/10 text-primary"
                                                            : "border-border/70 bg-background text-muted-foreground"), children: _jsx(Icon, { className: "size-4" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: item.label }), active ? (_jsx("span", { className: "rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary", children: "Open" })) : null] }), _jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: item.description })] })] }, item.to));
                                        })) : (_jsx("div", { className: "rounded-2xl border border-dashed border-border/70 bg-background/70 p-6 text-sm text-muted-foreground", children: "No sections match this search." })) }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1", children: [_jsx(Kbd, { children: "Ctrl" }), _jsx("span", { children: "+" }), _jsx(Kbd, { children: "K" }), _jsx("span", { children: "to open" })] }), _jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1", children: [_jsx(Kbd, { children: "Esc" }), _jsx("span", { children: "to close" })] })] })] })] }) }) })] }));
}
