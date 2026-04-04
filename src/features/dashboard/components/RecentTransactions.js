import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import TransactionPreviewList from "@/features/shared/components/transaction-preview-list";
import { getRecentTransactions } from "@/lib/transactions";
export default function RecentTransactions({ transactions }) {
    const recentTransactions = getRecentTransactions(transactions);
    return (_jsx(Card, { children: _jsxs(CardContent, { className: "space-y-4 p-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-medium", children: "Recent Transactions" }), _jsx(Link, { to: "/transactions", className: "text-sm text-primary hover:underline", children: "View all" })] }), _jsx(TransactionPreviewList, { transactions: recentTransactions, emptyMessage: "No recent transactions available." })] }) }));
}
