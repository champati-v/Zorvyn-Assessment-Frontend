import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useMemo } from "react";
import { format } from "date-fns";
import { DollarSign, Download, Plus, Search, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/store/useFinanceStore";
import { filterTransactions, formatCurrency, getRecentTransactions, getSummaryMetrics, sortTransactionsDesc, } from "@/lib/transactions";
import TransactionEditorSheet, { emptyTransactionForm, } from "@/features/transactions/components/TransactionEditorSheet";
import TransactionPreviewList from "@/features/shared/components/transaction-preview-list";
import TransactionTableRow from "@/features/transactions/components/TransactionTableRow";
function escapeCsvValue(value) {
    return `"${value.replaceAll('"', '""')}"`;
}
function sanitizePdfText(value) {
    return value
        .replace(/[^\x20-\x7E]/g, "?")
        .replaceAll("\\", "\\\\")
        .replaceAll("(", "\\(")
        .replaceAll(")", "\\)");
}
function createPdfBlob(transactions) {
    const rows = transactions.map((transaction) => {
        const date = format(new Date(transaction.date), "MMM d, yyyy");
        const amount = formatCurrency(transaction.amount);
        return `${date} | ${transaction.title} | ${transaction.category} | ${amount}`;
    });
    const lines = [
        "Transactions Export",
        `Generated: ${format(new Date(), "MMM d, yyyy h:mm a")}`,
        `Total entries: ${transactions.length}`,
        "",
        ...rows,
    ].map(sanitizePdfText);
    const contentLines = [
        "BT",
        "/F1 12 Tf",
        "50 760 Td",
        "14 TL",
        ...lines.flatMap((line, index) => [
            `(${line}) Tj`,
            index < lines.length - 1 ? "T*" : "",
        ]).filter(Boolean),
        "ET",
    ];
    const stream = contentLines.join("\n");
    let body = "%PDF-1.4\n";
    const offsets = [0];
    const appendObject = (object) => {
        offsets.push(body.length);
        body += `${object}\n`;
    };
    appendObject("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
    appendObject("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
    appendObject("3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj");
    appendObject("4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj");
    appendObject(`5 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`);
    const xrefOffset = body.length;
    const xrefEntries = [
        "xref",
        "0 6",
        "0000000000 65535 f ",
        ...offsets.slice(1).map((entry) => `${String(entry).padStart(10, "0")} 00000 n `),
        "trailer << /Size 6 /Root 1 0 R >>",
        "startxref",
        String(xrefOffset),
        "%%EOF",
    ].join("\n");
    return new Blob([body, `${xrefEntries}\n`], {
        type: "application/pdf",
    });
}
function downloadBlob(filename, blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}
function exportTransactionsAsCsv(transactions) {
    const header = ["id", "title", "amount", "date", "category", "type"];
    const rows = transactions.map((transaction) => [
        transaction.id,
        transaction.title,
        transaction.amount,
        transaction.date,
        transaction.category,
        transaction.type,
    ]
        .map((value) => escapeCsvValue(String(value)))
        .join(","));
    const csv = [header.join(","), ...rows].join("\n");
    downloadBlob("transactions-export.csv", new Blob([csv], { type: "text/csv;charset=utf-8" }));
}
function exportTransactionsAsPdf(transactions) {
    downloadBlob("transactions-export.pdf", createPdfBlob(transactions));
}
function buildTransactionPayload(form, id) {
    const absoluteAmount = Number(form.amount);
    const signedAmount = form.type === "income" ? absoluteAmount : -absoluteAmount;
    return {
        id,
        title: form.title.trim(),
        amount: signedAmount,
        category: form.category.trim(),
        date: form.date,
        type: form.type,
    };
}
export default function TransactionsPageContent() {
    const { transactions, role, addTransaction, updateTransaction, deleteTransaction, } = useFinanceStore();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [form, setForm] = React.useState(emptyTransactionForm);
    const [search, setSearch] = React.useState("");
    const [filterType, setFilterType] = React.useState("all");
    const [dateRange] = React.useState("all");
    const [selectedCategories] = React.useState([]);
    const canManage = role === "admin";
    const sortedTransactions = useMemo(() => sortTransactionsDesc(transactions), [transactions]);
    const filteredTransactions = useMemo(() => filterTransactions(sortedTransactions, {
        range: dateRange,
        categories: selectedCategories,
        type: filterType,
        query: search,
    }), [dateRange, filterType, search, selectedCategories, sortedTransactions]);
    const visibleSummary = getSummaryMetrics(filteredTransactions);
    const recentEntries = getRecentTransactions(filteredTransactions, 3);
    const handleExportCsv = () => exportTransactionsAsCsv(filteredTransactions);
    const handleExportPdf = () => exportTransactionsAsPdf(filteredTransactions);
    const openAddForm = () => {
        setEditingId(null);
        setForm(emptyTransactionForm());
        setIsFormOpen(true);
    };
    const openEditForm = (transaction) => {
        setEditingId(transaction.id);
        setForm({
            title: transaction.title,
            amount: Math.abs(transaction.amount).toString(),
            category: transaction.category,
            date: transaction.date,
            type: transaction.type,
        });
        setIsFormOpen(true);
    };
    const closeForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setForm(emptyTransactionForm());
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!form.title || !form.amount || !form.category || !form.date) {
            return;
        }
        const nextId = editingId ?? globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}`;
        const payload = buildTransactionPayload(form, nextId);
        if (editingId) {
            updateTransaction(editingId, payload);
        }
        else {
            addTransaction(payload);
        }
        closeForm();
    };
    const handleDelete = (transaction) => {
        const confirmed = window.confirm(`Delete ${transaction.title}? This will remove it from local storage.`);
        if (confirmed) {
            deleteTransaction(transaction.id);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: _jsx(CardContent, { className: "space-y-4 p-4 md:p-5", children: _jsxs("div", { className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/70", children: _jsx(DollarSign, { className: "size-4 text-muted-foreground" }) }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: "Transactions" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "View, search, and manage your transactions." })] })] }), _jsxs("div", { className: "flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end", children: [_jsxs("div", { className: "relative w-full md:max-w-sm", children: [_jsx(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" }), _jsx(Input, { value: search, onChange: (event) => setSearch(event.target.value), placeholder: "Search title, category, or date", className: "pl-9" })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [[
                                                { value: "all", label: "All" },
                                                { value: "income", label: "Income" },
                                                { value: "expense", label: "Expense" },
                                            ].map((item) => (_jsx(Button, { type: "button", size: "sm", variant: filterType === item.value ? "default" : "outline", onClick: () => setFilterType(item.value), children: item.label }, item.value))), canManage ? (_jsxs(Button, { type: "button", onClick: openAddForm, className: "gap-2", children: [_jsx(Plus, { className: "size-4" }), "Add transaction"] })) : null] })] })] }) }) }), _jsxs("div", { className: "grid gap-4 lg:grid-cols-[1fr_320px]", children: [_jsxs(Card, { className: "overflow-hidden border-border/70 bg-card/90 shadow-sm", children: [_jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-190 text-sm", children: [_jsx("thead", { className: "bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "Date" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Title" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Category" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Amount" }), canManage ? _jsx("th", { className: "px-4 py-3 font-medium", children: "Actions" }) : null] }) }), _jsx("tbody", { children: filteredTransactions.length > 0 ? (filteredTransactions.map((transaction) => (_jsx(TransactionTableRow, { transaction: transaction, onEdit: openEditForm, onDelete: handleDelete, canManage: canManage }, transaction.id)))) : (_jsx("tr", { children: _jsx("td", { colSpan: canManage ? 5 : 4, className: "px-4 py-10 text-center text-sm text-muted-foreground", children: "No transactions match the current search and filter settings." }) })) })] }) }) }), _jsx(CardFooter, { className: "flex items-center justify-between border-t border-border/70 px-4 py-4", children: _jsxs("div", { className: "text-xs text-muted-foreground", children: ["Showing ", filteredTransactions.length, " of ", sortedTransactions.length, " entries."] }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base", children: "Export data" }), _jsx(CardDescription, { children: "Download the currently visible transactions as CSV or PDF." })] }), _jsxs(CardContent, { className: "grid gap-2 sm:grid-cols-2", children: [_jsxs(Button, { type: "button", variant: "outline", className: "justify-start gap-2", onClick: handleExportCsv, children: [_jsx(Download, { className: "size-4" }), "Export CSV"] }), _jsxs(Button, { type: "button", variant: "secondary", className: "justify-start gap-2", onClick: handleExportPdf, children: [_jsx(Download, { className: "size-4" }), "Export PDF"] })] })] }), _jsxs(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base", children: "Recent entries" }), _jsx(CardDescription, { children: "A quick preview of the latest filtered transactions." })] }), _jsx(CardContent, { children: _jsx(TransactionPreviewList, { transactions: recentEntries, emptyMessage: "No recent entries for this filtered view." }) })] }), _jsxs(Card, { className: "border-border/70 bg-card/90 shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { className: "text-base", children: "Monthly signal" }), _jsx(CardDescription, { children: "Current month income and expenses from the visible set." })] }), _jsxs(CardContent, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Income" }), _jsx("span", { className: "font-medium text-emerald-500", children: formatCurrency(visibleSummary.monthlyIncome) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Expenses" }), _jsx("span", { className: "font-medium text-rose-500", children: formatCurrency(visibleSummary.monthlyExpenses) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Savings rate" }), _jsxs("span", { className: "font-medium", children: [visibleSummary.savingsRate.toFixed(1), "%"] })] })] })] })] })] }), _jsx(TransactionEditorSheet, { open: isFormOpen, onOpenChange: setIsFormOpen, editingId: editingId, form: form, setForm: setForm, onSubmit: handleSubmit, onCancel: closeForm })] }));
}
