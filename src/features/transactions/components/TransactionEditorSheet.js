import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
export function emptyTransactionForm() {
    return {
        title: "",
        amount: "",
        category: "",
        date: new Date().toISOString().slice(0, 10),
        type: "expense",
    };
}
export default function TransactionEditorSheet({ open, onOpenChange, editingId, form, setForm, onSubmit, onCancel, }) {
    return (_jsx(Sheet, { open: open, onOpenChange: onOpenChange, children: _jsxs(SheetContent, { side: "right", className: "w-full sm:max-w-lg", children: [_jsxs(SheetHeader, { className: "border-b border-border/70 bg-background/60 px-6 pb-4 pt-6", children: [_jsx(SheetTitle, { children: editingId ? "Edit transaction" : "Add transaction" }), _jsx(SheetDescription, { children: editingId
                                ? "Update the existing entry and keep the dashboard in sync."
                                : "Create a new entry that will immediately flow into charts and lists." })] }), _jsxs("div", { className: "flex h-full flex-col gap-6 overflow-y-auto px-6 py-6", children: [_jsxs("form", { className: "space-y-5", onSubmit: onSubmit, children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Title" }), _jsx(Input, { value: form.title, onChange: (event) => setForm((current) => ({ ...current, title: event.target.value })), placeholder: "Salary, groceries, subscription..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Amount" }), _jsx(Input, { type: "number", min: "0", step: "1", value: form.amount, onChange: (event) => setForm((current) => ({ ...current, amount: event.target.value })), placeholder: "2500" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Category" }), _jsx(Input, { value: form.category, onChange: (event) => setForm((current) => ({ ...current, category: event.target.value })), placeholder: "Food, Salary, Transport..." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Date" }), _jsx(Input, { type: "date", value: form.date, onChange: (event) => setForm((current) => ({ ...current, date: event.target.value })) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: "Type" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: [
                                                {
                                                    value: "expense",
                                                    label: "Expense",
                                                    variant: "destructive",
                                                },
                                                {
                                                    value: "income",
                                                    label: "Income",
                                                    variant: "secondary",
                                                },
                                            ].map((option) => (_jsx(Button, { type: "button", variant: form.type === option.value ? "default" : option.variant, className: "justify-center", onClick: () => setForm((current) => ({ ...current, type: option.value })), children: option.label }, option.value))) })] }), _jsxs("div", { className: "flex flex-wrap gap-2 pt-2", children: [_jsxs(Button, { type: "submit", className: "gap-2", children: [_jsx(Plus, { className: "size-4" }), editingId ? "Save changes" : "Create transaction"] }), _jsx(Button, { type: "button", variant: "outline", onClick: onCancel, children: "Cancel" })] })] }), _jsx("div", { className: "rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground", children: "Use this editor to add or correct entries. Every change updates the dashboard charts, insights, and transaction history through the shared Zustand store." })] })] }) }));
}
