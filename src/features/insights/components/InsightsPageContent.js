import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowDownRight, ArrowUpRight, BarChart3, CalendarRange, ChevronRight, CircleDollarSign, Info, PieChart, ReceiptText, Sparkles, Target, TrendingUp, Wallet, } from "lucide-react";
import { format, parseISO } from "date-fns";
import BalanceChart from "@/features/dashboard/components/BalanceChart";
import SpendingPie from "@/features/dashboard/components/SpendingPie";
import InsightMetricCard from "@/features/insights/components/InsightMetricCard";
import InsightSignalItem from "@/features/insights/components/InsightSignalItem";
import TransactionPreviewList from "@/features/shared/components/transaction-preview-list";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { useFinanceStore } from "@/store/useFinanceStore";
import { filterTransactions, formatCurrency, getDateRangeLabel, getExpenseBreakdown, getRecentTransactions, getSummaryMetrics, } from "@/lib/transactions";
function getMonthlySnapshots(transactions) {
    const grouped = new Map();
    transactions.forEach((transaction) => {
        const parsedDate = parseISO(transaction.date);
        const key = format(parsedDate, "yyyy-MM");
        const existing = grouped.get(key) ?? {
            key,
            label: format(parsedDate, "MMM yyyy"),
            income: 0,
            expenses: 0,
            net: 0,
            transactionCount: 0,
        };
        existing.transactionCount += 1;
        if (transaction.type === "income") {
            existing.income += transaction.amount;
            existing.net += transaction.amount;
        }
        else {
            const value = Math.abs(transaction.amount);
            existing.expenses += value;
            existing.net -= value;
        }
        grouped.set(key, existing);
    });
    return [...grouped.values()].sort((a, b) => a.key.localeCompare(b.key));
}
function formatDelta(value) {
    return value >= 0
        ? `+${formatCurrency(Math.abs(value))}`
        : `-${formatCurrency(Math.abs(value))}`;
}
export default function InsightsPageContent() {
    const { transactions } = useFinanceStore();
    const range = "quarter";
    const selectedCategories = [];
    const visibleTransactions = useMemo(() => filterTransactions(transactions, {
        range,
        categories: selectedCategories,
    }), [selectedCategories, transactions]);
    const summary = useMemo(() => getSummaryMetrics(visibleTransactions), [visibleTransactions]);
    const expenseBreakdown = useMemo(() => getExpenseBreakdown(visibleTransactions), [visibleTransactions]);
    const monthlySnapshots = useMemo(() => getMonthlySnapshots(visibleTransactions), [visibleTransactions]);
    const sortedTransactions = useMemo(() => getRecentTransactions(visibleTransactions, visibleTransactions.length), [visibleTransactions]);
    const latestDate = sortedTransactions[0]
        ? parseISO(sortedTransactions[0].date)
        : null;
    const latestLabel = latestDate ? format(latestDate, "MMM yyyy") : "No activity";
    const monthlyTransactions = latestDate
        ? visibleTransactions.filter((transaction) => transaction.date.startsWith(format(latestDate, "yyyy-MM")))
        : [];
    const latestMonthIncome = monthlyTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const latestMonthExpenses = monthlyTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const latestMonthNet = latestMonthIncome - latestMonthExpenses;
    const latestTrend = monthlySnapshots.length > 1
        ? monthlySnapshots[monthlySnapshots.length - 1].net -
            monthlySnapshots[monthlySnapshots.length - 2].net
        : 0;
    const topCategory = expenseBreakdown[0];
    const topCategoryShare = topCategory && summary.monthlyExpenses > 0
        ? (topCategory.value / summary.monthlyExpenses) * 100
        : 0;
    const largestExpense = visibleTransactions
        .filter((transaction) => transaction.type === "expense")
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
    const recentTransactions = getRecentTransactions(visibleTransactions, 6);
    const averageTransaction = visibleTransactions.length === 0
        ? 0
        : visibleTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0) / visibleTransactions.length;
    const signals = [
        latestMonthNet >= 0
            ? {
                title: "Cash flow is positive",
                description: `${latestLabel} closed with ${formatCurrency(latestMonthNet)} of net surplus.`,
                icon: _jsx(TrendingUp, { className: "size-4" }),
                tone: "success",
            }
            : {
                title: "Cash flow needs attention",
                description: `${latestLabel} ended ${formatCurrency(Math.abs(latestMonthNet))} below break-even.`,
                icon: _jsx(ArrowDownRight, { className: "size-4" }),
                tone: "warning",
            },
        topCategory
            ? {
                title: `${topCategory.name} dominates expenses`,
                description: `${topCategory.name} accounts for ${topCategoryShare.toFixed(0)}% of spending in this range.`,
                icon: _jsx(PieChart, { className: "size-4" }),
                tone: "primary",
            }
            : null,
        largestExpense
            ? {
                title: "Largest expense",
                description: `${largestExpense.title} is the biggest outflow at ${formatCurrency(Math.abs(largestExpense.amount))}.`,
                icon: _jsx(ReceiptText, { className: "size-4" }),
                tone: "warning",
            }
            : null,
    ].filter(Boolean);
    return (_jsx(TooltipProvider, { children: _jsxs("div", { className: "space-y-6", children: [_jsxs("section", { className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground", children: [_jsx(Sparkles, { className: "size-3.5 text-chart-1" }), "Insights refresh from the shared transaction store"] }), _jsxs("div", { className: "space-y-1", children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "Insights" }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("span", { children: "A deeper look at cash flow, category concentration, and month to month behavior." }), _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { className: "inline-flex cursor-help items-center text-muted-foreground/80", children: _jsx(Info, { className: "size-4" }) }), _jsx(TooltipContent, { children: "Combination of mock data and the data stored locally." })] })] })] })] }), _jsx("div", { className: "flex flex-wrap items-center gap-2", children: _jsxs(Link, { to: "/transactions", className: buttonVariants({ variant: "secondary", size: "sm" }), children: [_jsx(ChevronRight, { className: "size-3.5" }), "Open transactions"] }) })] }), _jsx(Card, { className: "overflow-hidden border-border/70 bg-linear-to-br from-card via-card to-muted/30 shadow-sm", children: _jsxs(CardContent, { className: "grid gap-0 p-0 lg:grid-cols-[1.25fr_0.75fr]", children: [_jsxs("div", { className: "space-y-5 p-6", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [_jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1", children: [_jsx(CalendarRange, { className: "size-3.5" }), getDateRangeLabel(range)] }), _jsxs("span", { className: "inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1", children: [_jsx(BarChart3, { className: "size-3.5" }), visibleTransactions.length, " transactions in view"] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-xs uppercase tracking-[0.25em] text-muted-foreground", children: "Financial pulse" }), _jsx("div", { className: "text-4xl font-semibold tracking-tight", children: formatCurrency(summary.totalBalance) }), _jsx("p", { className: "max-w-2xl text-sm leading-relaxed text-muted-foreground", children: "Net balance across the selected period, with income, expenses, and category pressure reflected from the same transaction data used by the dashboard." })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-3", children: [_jsxs("div", { className: "rounded-2xl border border-border/70 bg-background/70 p-4", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Monthly income" }), _jsx("div", { className: "mt-2 text-lg font-semibold", children: formatCurrency(summary.monthlyIncome) }), _jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [latestLabel, " snapshot"] })] }), _jsxs("div", { className: "rounded-2xl border border-border/70 bg-background/70 p-4", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Monthly expenses" }), _jsx("div", { className: "mt-2 text-lg font-semibold", children: formatCurrency(summary.monthlyExpenses) }), _jsxs("div", { className: "mt-1 text-xs text-muted-foreground", children: [latestLabel, " snapshot"] })] }), _jsxs("div", { className: "rounded-2xl border border-border/70 bg-background/70 p-4", children: [_jsx("div", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Savings rate" }), _jsxs("div", { className: "mt-2 text-lg font-semibold", children: [summary.savingsRate.toFixed(1), "%"] }), _jsx("div", { className: "mt-1 text-xs text-muted-foreground", children: "Based on total income" })] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [_jsxs("div", { className: `inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${latestMonthNet >= 0
                                                    ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                                                    : "border border-rose-500/20 bg-rose-500/10 text-rose-600"}`, children: [latestMonthNet >= 0 ? (_jsx(ArrowUpRight, { className: "size-3.5" })) : (_jsx(ArrowDownRight, { className: "size-3.5" })), formatDelta(latestMonthNet), " vs expenses"] }), _jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground", children: [_jsx(Wallet, { className: "size-3.5" }), "Average transaction ", formatCurrency(averageTransaction)] })] })] }), _jsx("div", { className: "border-t border-border/70 bg-background/60 p-6 lg:border-l lg:border-t-0", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.22em] text-muted-foreground", children: "Range summary" }), _jsx("h2", { className: "mt-2 text-lg font-semibold tracking-tight", children: latestLabel })] }), _jsx(Separator, {}), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: "Latest period net" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Income minus expenses" })] }), _jsx("div", { className: `text-right text-lg font-semibold ${latestMonthNet >= 0 ? "text-emerald-500" : "text-rose-500"}`, children: formatCurrency(latestMonthNet) })] }), _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: "Month over month shift" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Net movement vs previous month" })] }), _jsx("div", { className: `text-right text-sm font-semibold ${latestTrend >= 0 ? "text-emerald-500" : "text-rose-500"}`, children: formatDelta(latestTrend) })] }), _jsxs("div", { className: "flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium", children: "Top expense category" }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Share of total spending" })] }), _jsx("div", { className: "text-right text-sm font-semibold", children: topCategory
                                                                ? `${topCategory.name} - ${topCategoryShare.toFixed(0)}%`
                                                                : "No expenses" })] })] }), _jsx(Separator, {})] }) })] }) }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [_jsx(InsightMetricCard, { title: "Net balance", value: formatCurrency(summary.totalBalance), description: "Selected range cash position", icon: _jsx(CircleDollarSign, { className: "size-4" }), tone: "primary" }), _jsx(InsightMetricCard, { title: "Income", value: formatCurrency(summary.monthlyIncome), description: "Latest month inflow", icon: _jsx(ArrowUpRight, { className: "size-4" }), tone: "success" }), _jsx(InsightMetricCard, { title: "Expenses", value: formatCurrency(summary.monthlyExpenses), description: "Latest month outflow", icon: _jsx(ArrowDownRight, { className: "size-4" }), tone: "warning" }), _jsx(InsightMetricCard, { title: "Transactions", value: String(visibleTransactions.length), description: "Entries in the selected range", icon: _jsx(Activity, { className: "size-4" }), tone: "primary" })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.25fr_0.75fr]", children: [_jsx(BalanceChart, { transactions: visibleTransactions }), _jsxs(Card, { className: "h-full", children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(Target, { className: "size-4 text-char-1" }), "Quick signals"] }), _jsx(CardDescription, { children: "The page highlights the most useful takeaways from the current period." })] }), _jsx(CardContent, { className: "space-y-3", children: signals.map((signal) => (_jsx(InsightSignalItem, { ...signal }, signal.title))) })] })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[0.95fr_1.05fr]", children: [_jsx(SpendingPie, { transactions: visibleTransactions, size: "lg" }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: [_jsx(ReceiptText, { className: "size-4 text-char-4" }), "Recent activity"] }), _jsx(CardDescription, { children: "The most recent transactions in the current range, formatted with category color cues." })] }), _jsx(CardContent, { children: _jsx(TransactionPreviewList, { transactions: recentTransactions, emptyMessage: "No transactions found for this range." }) })] })] })] }) }));
}
