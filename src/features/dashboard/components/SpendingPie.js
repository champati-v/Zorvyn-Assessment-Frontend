import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getCategoryColor } from "@/lib/transactions";
function PieTooltip({ active, payload, label }) {
    if (!active || !payload?.length) {
        return null;
    }
    const entry = payload[0];
    const category = String(label ?? entry.name ?? "");
    const rawValue = entry.value;
    const normalizedValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const value = Number(normalizedValue ?? 0);
    const swatch = getCategoryColor(category);
    return (_jsxs("div", { className: "min-w-40 rounded-xl border border-sidebar-border bg-popover/95 px-3 py-3 text-xs shadow-xl ring-1 ring-border/40 backdrop-blur-md", children: [_jsxs("div", { className: "mb-2 flex items-center gap-2", children: [_jsx("span", { className: "size-2.5 rounded-full", style: { backgroundColor: swatch } }), _jsx("div", { className: "font-medium text-popover-foreground", children: category })] }), _jsxs("div", { className: "flex items-center justify-between gap-4 text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "size-2.5 rounded-full", style: { backgroundColor: swatch } }), "Spending"] }), _jsx("span", { className: "font-medium text-foreground", children: formatCurrency(value) })] })] }));
}
export default function SpendingPie({ transactions, size = "default" }) {
    const data = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((accumulator, transaction) => {
        accumulator.set(transaction.category, (accumulator.get(transaction.category) ?? 0) + Math.abs(transaction.amount));
        return accumulator;
    }, new Map())
        .entries();
    const chartData = [...data]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    return (_jsx(Card, { children: _jsxs(CardContent, { className: "p-5", children: [_jsx("h3", { className: "mb-1 font-medium", children: "Spending Breakdown" }), _jsx("p", { className: "mb-4 text-xs text-muted-foreground", children: "Expense categories sourced from the shared transaction store." }), _jsx("div", { className: size === "lg" ? "h-70" : "h-55", children: _jsx(ResponsiveContainer, { children: _jsxs(PieChart, { children: [_jsx(Tooltip, { content: _jsx(PieTooltip, {}) }), _jsx(Pie, { data: chartData, dataKey: "value", nameKey: "name", innerRadius: size === "lg" ? 78 : 60, outerRadius: size === "lg" ? 118 : 90, paddingAngle: size === "lg" ? 6 : 4, children: chartData.map((entry) => (_jsx(Cell, { fill: getCategoryColor(entry.name) }, entry.name))) })] }) }) }), _jsx("div", { className: "mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2", children: chartData.slice(0, 4).map((entry) => (_jsxs("div", { className: "flex items-center justify-between rounded-md border border-border px-2 py-1.5", children: [_jsxs("span", { className: "flex items-center gap-2", children: [_jsx("span", { className: "size-2.5 rounded-full", style: { backgroundColor: getCategoryColor(entry.name) } }), entry.name] }), _jsx("span", { children: formatCurrency(entry.value) })] }, entry.name))) })] }) }));
}
