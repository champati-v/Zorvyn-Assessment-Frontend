import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
export default function InsightSignalItem({ title, description, icon, tone, }) {
    const classes = toneClasses[tone];
    return (_jsxs("div", { className: `flex items-start gap-3 rounded-xl border p-3 ${classes.wrapper}`, children: [_jsx("div", { className: `flex size-9 shrink-0 items-center justify-center rounded-full border ${classes.wrapper}`, children: _jsx("span", { className: classes.icon, children: icon }) }), _jsxs("div", { className: "space-y-1", children: [_jsx("div", { className: "text-sm font-medium text-foreground", children: title }), _jsx("div", { className: "text-xs leading-relaxed text-muted-foreground", children: description })] })] }));
}
