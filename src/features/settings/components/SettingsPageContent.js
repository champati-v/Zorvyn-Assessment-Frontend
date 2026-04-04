import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Check, LayoutGrid, Monitor, Moon, Palette, Shield, Sun, UserRound, } from "lucide-react";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFinanceStore } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";
const themeOptions = [
    {
        value: "light",
        label: "Light",
        description: "Bright canvas with higher contrast accents.",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        description: "Low-light mode tuned for extended analysis.",
        icon: Moon,
    },
    {
        value: "system",
        label: "System",
        description: "Follow the device preference automatically.",
        icon: Monitor,
    },
];
const roleOptions = [
    {
        value: "admin",
        label: "Admin",
        description: "Can manage transactions and workspace data.",
        icon: Shield,
    },
    {
        value: "viewer",
        label: "User",
        description: "Read-only access for browsing and insights.",
        icon: UserRound,
    },
];
function roleLabel(role) {
    return role === "admin" ? "Admin" : "User";
}
function themeLabel(theme, resolvedTheme) {
    if (!theme || theme === "system") {
        return `System (${resolvedTheme === "dark" ? "Dark" : "Light"})`;
    }
    return theme === "dark" ? "Dark" : "Light";
}
function ProfileBadge({ label, value, }) {
    return (_jsxs("div", { className: "rounded-2xl border border-border/70 bg-background/70 p-4", children: [_jsx("div", { className: "text-[10px] uppercase tracking-[0.22em] text-muted-foreground", children: label }), _jsx("div", { className: "mt-2 text-sm font-medium", children: value })] }));
}
export default function SettingsPageContent() {
    const { role, setRole } = useFinanceStore();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const activeTheme = theme ?? "system";
    const themeDisplay = themeLabel(theme, resolvedTheme);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("section", { className: "overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-card via-card to-muted/30 shadow-sm", children: _jsxs("div", { className: "grid gap-0 lg:grid-cols-[1.2fr_0.8fr]", children: [_jsxs("div", { className: "space-y-5 p-6 md:p-8", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground", children: [_jsx(Palette, { className: "size-3.5 text-chart-1" }), "Workspace preferences and account controls"] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Settings" }), _jsx("p", { className: "max-w-2xl text-sm leading-relaxed text-muted-foreground", children: "Tune the dashboard experience, switch between Admin and User access, and manage your app's theme." })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground", children: [_jsx(Shield, { className: "size-3.5" }), roleLabel(role), " access"] }), _jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground", children: [_jsx(Sun, { className: "size-3.5" }), themeDisplay, " theme"] })] })] }), _jsx("div", { className: "border-t border-border/70 bg-background/50 p-6 md:p-8 lg:border-l lg:border-t-0", children: _jsx(Card, { className: "h-full border-border/70 bg-card/90 shadow-none", children: _jsxs(CardContent, { className: "space-y-4 p-5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-muted/40", children: _jsx(UserRound, { className: "size-7 text-muted-foreground" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-lg font-semibold tracking-tight", children: "Vibekananda Champati" }), _jsx("div", { className: "truncate text-sm text-muted-foreground", children: "admin@zorvyn.com" }), _jsx("div", { className: "mt-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground", children: roleLabel(role) })] })] }), _jsx(Separator, {}), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [_jsx(ProfileBadge, { label: "Workspace", value: "Zorvyn Finance" }), _jsx(ProfileBadge, { label: "Storage", value: "Local sync enabled" }), _jsx(ProfileBadge, { label: "Theme", value: themeDisplay }), _jsx(ProfileBadge, { label: "Role", value: roleLabel(role) })] })] }) }) })] }) }), _jsxs("div", { className: "grid gap-4 xl:grid-cols-[0.95fr_1.05fr]", children: [_jsxs(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Shield, { className: "size-4 text-chart-2" }), "Access level"] }), _jsx(CardDescription, { children: "Choose whether this dashboard behaves like an Admin workspace or a User view." })] }), _jsx(CardContent, { className: "space-y-3 p-4", children: roleOptions.map((option) => {
                                    const Icon = option.icon;
                                    const active = role === option.value;
                                    return (_jsxs("button", { type: "button", onClick: () => setRole(option.value), className: cn("flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors", active
                                            ? "border-primary/20 bg-primary/8"
                                            : "border-border/70 bg-background/60 hover:bg-muted/50"), children: [_jsx("div", { className: cn("flex size-10 items-center justify-center rounded-full border", active
                                                    ? "border-primary/20 bg-primary/10 text-primary"
                                                    : "border-border/70 bg-background text-muted-foreground"), children: _jsx(Icon, { className: "size-4" }) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "text-sm font-medium", children: option.label }), active ? (_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary", children: [_jsx(Check, { className: "size-3" }), "Active"] })) : null] }), _jsx("div", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: option.description })] })] }, option.value));
                                }) })] }), _jsxs(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Palette, { className: "size-4 text-chart-1" }), "Appearance"] }), _jsx(CardDescription, { children: "Switch the app between light, dark, and system-aware themes." })] }), _jsxs(CardContent, { className: "space-y-3 p-4", children: [_jsx("div", { className: "grid gap-3 md:grid-cols-3", children: themeOptions.map((option) => {
                                            const Icon = option.icon;
                                            const active = activeTheme === option.value;
                                            return (_jsxs("button", { type: "button", onClick: () => setTheme(option.value), className: cn("rounded-2xl border p-4 text-left transition-colors", active
                                                    ? "border-primary/20 bg-primary/8"
                                                    : "border-border/70 bg-background/60 hover:bg-muted/50"), children: [_jsx("div", { className: cn("flex size-9 items-center justify-center rounded-full border", active
                                                            ? "border-primary/20 bg-primary/10 text-primary"
                                                            : "border-border/70 bg-background text-muted-foreground"), children: _jsx(Icon, { className: "size-4" }) }), _jsx("div", { className: "mt-3 text-sm font-medium", children: option.label }), _jsx("div", { className: "mt-1 text-xs leading-relaxed text-muted-foreground", children: option.description })] }, option.value));
                                        }) }), _jsxs("div", { className: "rounded-2xl border border-border/70 bg-linear-to-r from-background/80 via-muted/20 to-background/80 p-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Current theme" }), _jsx("div", { className: "mt-1 text-sm font-medium", children: themeDisplay })] }), _jsx(LayoutGrid, { className: "size-5 text-muted-foreground" })] }), _jsx("div", { className: "mt-3 text-xs leading-relaxed text-muted-foreground", children: "Header controls and sidebar quick actions stay in sync with the active theme choice." })] })] })] })] })] }));
}
