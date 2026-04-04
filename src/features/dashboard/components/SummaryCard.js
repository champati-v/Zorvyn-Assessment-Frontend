import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
export default function SummaryCard({ title, value, change, icon, accentClass, }) {
    return (_jsx(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: _jsx(CardContent, { className: "space-y-3 px-4 py-2", children: _jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.22em] text-muted-foreground", children: title }), _jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: value }), _jsx("p", { className: "text-xs text-muted-foreground", children: change })] }), _jsx("div", { className: `flex size-10 items-center justify-center rounded-full border ${accentClass}`, children: icon })] }) }) }));
}
