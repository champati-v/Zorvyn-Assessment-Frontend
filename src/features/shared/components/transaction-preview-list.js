import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { formatCurrency, getCategoryColor } from "@/lib/transactions";
export default function TransactionPreviewList({ transactions, emptyMessage, }) {
    if (transactions.length === 0) {
        return (_jsx("div", { className: "rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground", children: emptyMessage }));
    }
    return (_jsx("div", { className: "space-y-3", children: transactions.map((transaction) => {
            const swatch = getCategoryColor(transaction.category);
            return (_jsx(Card, { size: "sm", className: "border-border/70 bg-background/60", children: _jsxs("div", { className: "flex items-center justify-between gap-4 p-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-3", children: [_jsx("span", { className: "size-9 shrink-0 rounded-full ring-1 ring-border/60", style: { backgroundColor: swatch } }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "truncate text-sm font-medium", children: transaction.title }), _jsxs("div", { className: "mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [_jsx("span", { children: transaction.category }), _jsx("span", { "aria-hidden": "true", children: "-" }), _jsx("span", { children: format(new Date(transaction.date), "MMM d, yyyy") })] })] })] }), _jsx("div", { className: `shrink-0 text-sm font-semibold ${transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"}`, children: formatCurrency(transaction.amount) })] }) }, transaction.id));
        }) }));
}
