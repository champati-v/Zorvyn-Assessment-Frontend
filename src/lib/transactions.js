import { compareDesc, eachMonthOfInterval, format, parseISO, startOfMonth, endOfMonth } from "date-fns";
export const dateRangeOptions = [
    { key: "all", label: "All time" },
    { key: "month", label: "This month" },
    { key: "quarter", label: "3 months" },
    { key: "half", label: "6 months" },
    { key: "year", label: "12 months" },
];
export const categoryFilterOptions = [
    "Food",
    "Salary",
    "Shopping",
    "Transport",
    "Housing",
    "Utilities",
    "Investments",
    "Freelance",
    "Education",
    "Entertainment",
    "Health",
    "Gifts",
];
const rangeMonths = {
    month: 1,
    quarter: 3,
    half: 6,
    year: 12,
};
export function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}
const categoryColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "color-mix(in oklch, var(--chart-1) 88%, black)",
    "color-mix(in oklch, var(--chart-2) 88%, black)",
    "color-mix(in oklch, var(--chart-3) 88%, black)",
    "color-mix(in oklch, var(--chart-4) 88%, black)",
    "color-mix(in oklch, var(--chart-5) 88%, black)",
];
export function getCategoryColor(category) {
    const index = category
        .split("")
        .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return categoryColors[index % categoryColors.length];
}
export function sortTransactionsDesc(transactions) {
    return [...transactions].sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
}
export function getRecentTransactions(transactions, limit = 5) {
    return sortTransactionsDesc(transactions).slice(0, limit);
}
export function getMonthlyBalanceSeries(transactions, monthsBack = 6) {
    if (transactions.length === 0) {
        return [];
    }
    const sorted = sortTransactionsDesc(transactions);
    const latestDate = parseISO(sorted[0].date);
    const startDate = startOfMonth(new Date(latestDate.getFullYear(), latestDate.getMonth() - (monthsBack - 1), 1));
    const endDate = endOfMonth(latestDate);
    const months = eachMonthOfInterval({ start: startDate, end: endDate });
    let runningBalance = 0;
    return months.map((month) => {
        const monthKey = format(month, "yyyy-MM");
        const monthTransactions = transactions.filter((transaction) => transaction.date.startsWith(monthKey));
        const monthIncome = monthTransactions
            .filter((transaction) => transaction.type === "income")
            .reduce((sum, transaction) => sum + transaction.amount, 0);
        const monthExpenses = monthTransactions
            .filter((transaction) => transaction.type === "expense")
            .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
        runningBalance += monthIncome - monthExpenses;
        return {
            name: format(month, "MMM"),
            income: monthIncome,
            expenses: monthExpenses,
            value: runningBalance,
        };
    });
}
export function getExpenseBreakdown(transactions) {
    const breakdown = new Map();
    transactions
        .filter((transaction) => transaction.type === "expense")
        .forEach((transaction) => {
        breakdown.set(transaction.category, (breakdown.get(transaction.category) ?? 0) + Math.abs(transaction.amount));
    });
    return [...breakdown.entries()]
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
}
export function getSummaryMetrics(transactions) {
    if (transactions.length === 0) {
        return {
            totalBalance: 0,
            monthlyIncome: 0,
            monthlyExpenses: 0,
            savingsRate: 0,
        };
    }
    const sorted = sortTransactionsDesc(transactions);
    const latestDate = parseISO(sorted[0].date);
    const monthKey = format(latestDate, "yyyy-MM");
    const monthlyTransactions = transactions.filter((transaction) => transaction.date.startsWith(monthKey));
    const monthlyIncome = monthlyTransactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const monthlyExpenses = monthlyTransactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const totalIncome = transactions
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = transactions
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
    const totalBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome === 0 ? 0 : (totalBalance / totalIncome) * 100;
    return {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        savingsRate,
    };
}
export function getDateRangeLabel(range) {
    return dateRangeOptions.find((option) => option.key === range)?.label ?? "All time";
}
export function filterTransactionsByRange(transactions, range) {
    if (range === "all" || transactions.length === 0) {
        return transactions;
    }
    const sorted = sortTransactionsDesc(transactions);
    const latestDate = parseISO(sorted[0].date);
    const months = rangeMonths[range];
    const startDate = startOfMonth(new Date(latestDate.getFullYear(), latestDate.getMonth() - (months - 1), 1));
    const endDate = endOfMonth(latestDate);
    return transactions.filter((transaction) => transaction.date >= format(startDate, "yyyy-MM-dd") &&
        transaction.date <= format(endDate, "yyyy-MM-dd"));
}
export function filterTransactions(transactions, filters = {}) {
    const { range = "all", categories = [], type = "all", query = "", } = filters;
    const normalizedQuery = query.trim().toLowerCase();
    let result = filterTransactionsByRange(transactions, range);
    if (categories.length > 0) {
        result = result.filter((transaction) => categories.includes(transaction.category));
    }
    if (type !== "all") {
        result = result.filter((transaction) => transaction.type === type);
    }
    if (normalizedQuery.length > 0) {
        result = result.filter((transaction) => transaction.title.toLowerCase().includes(normalizedQuery) ||
            transaction.category.toLowerCase().includes(normalizedQuery) ||
            transaction.date.includes(normalizedQuery));
    }
    return result;
}
export function getActiveFilterCount(filters) {
    const categoryCount = filters.categories?.length ?? 0;
    const rangeCount = filters.range && filters.range !== "all" ? 1 : 0;
    return categoryCount + rangeCount;
}
