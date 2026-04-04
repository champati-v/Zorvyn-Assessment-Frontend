import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
const toneClasses = {
    primary: {
        wrapper: "border-primary/15 bg-primary/5",
        icon: "text-primary",
    },
    success: {
        wrapper: "border-emerald-500/15 bg-emerald-500/8",
        icon: "text-emerald-500",
    },
    warning: {
        wrapper: "border-amber-500/15 bg-amber-500/8",
        icon: "text-amber-500",
    },
};
export default function InsightMetricCard({ title, value, description, icon, tone = "primary", }) {
    const classes = toneClasses[tone];
    return (_jsx(Card, { size: "sm", className: "border-border/70 bg-card/90", children: _jsx(CardContent, { className: "p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-muted-foreground", children: title }), _jsx("div", { className: "text-2xl font-semibold tracking-tight", children: value }), _jsx("p", { className: "text-xs text-muted-foreground", children: description })] }), _jsx("div", { className: `flex size-10 items-center justify-center rounded-full border ${classes.wrapper}`, children: _jsx("span", { className: classes.icon, children: icon }) })] }) }) }));
}
