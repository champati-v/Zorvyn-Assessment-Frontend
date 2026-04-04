import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  LineChart,
  ReceiptText,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import SummaryCard from "@/features/dashboard/components/SummaryCard";
import BalanceChart from "@/features/dashboard/components/BalanceChart";
import SpendingPie from "@/features/dashboard/components/SpendingPie";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  formatCurrency,
  getExpenseBreakdown,
  getRecentTransactions,
  getSummaryMetrics,
  sortTransactionsDesc,
} from "@/lib/transactions";
import { format, parseISO } from "date-fns";

export default function DashboardPage() {
  const { transactions } = useFinanceStore();

  const metrics = getSummaryMetrics(transactions);
  const sortedTransactions = sortTransactionsDesc(transactions);
  const recentTransactions = getRecentTransactions(transactions, 4);
  const expenseBreakdown = getExpenseBreakdown(transactions);

  const latestTransactionDate = sortedTransactions[0]
    ? parseISO(sortedTransactions[0].date)
    : null;

  return (
    <div className="space-y-6">
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Balance"
          value={formatCurrency(metrics.totalBalance)}
          change="Across seeded and local transactions"
          icon={<CircleDollarSign className="size-4 text-chart-1" />}
          accentClass="border-[var(--chart-1)]/20 bg-[var(--chart-1)]/10"
        />
        <SummaryCard
          title="Monthly Income"
          value={formatCurrency(metrics.monthlyIncome)}
          change="Latest month activity"
          icon={<ArrowUpRight className="size-4 text-emerald-500" />}
          accentClass="border-emerald-500/20 bg-emerald-500/10"
        />
        <SummaryCard
          title="Monthly Expenses"
          value={formatCurrency(metrics.monthlyExpenses)}
          change="Latest month activity"
          icon={<ArrowDownRight className="size-4 text-rose-500" />}
          accentClass="border-rose-500/20 bg-rose-500/10"
        />
        <SummaryCard
          title="Savings Rate"
          value={`${metrics.savingsRate.toFixed(1)}%`}
          change="Based on total income"
          icon={<TrendingUp className="size-4 text-chart-3" />}
          accentClass="border-[var(--chart-3)]/20 bg-[var(--chart-3)]/10"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="size-4 text-chart-1" />
              Cash flow trend
            </CardTitle>
            <CardDescription>
              Rolling balance, income, and expenses for the current transaction set.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <BalanceChart transactions={transactions} />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-4 text-chart-2" />
              Spending mix
            </CardTitle>
            <CardDescription>
              Expense distribution across the highest-impact categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SpendingPie transactions={transactions} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="size-4 text-chart-4" />
              Recent transactions
            </CardTitle>
            <CardDescription>
              The latest entries flowing into the dashboard view.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <RecentTransactions transactions={transactions} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-chart-4" />
                Quick signals
              </CardTitle>
              <CardDescription>
                A few compact notes that make the dashboard feel more alive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4">
                <div className="text-sm font-medium text-foreground">
                  Income is holding steady
                </div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Latest month income is {formatCurrency(metrics.monthlyIncome)} and
                  feeds directly into the trend chart.
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/15 bg-rose-500/8 p-4">
                <div className="text-sm font-medium text-foreground">
                  Expenses remain concentrated
                </div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Watch the leading category share, especially when it pushes above
                  the rest of the stack.
                </div>
              </div>

              <div className="rounded-2xl border border-(--chart-2)/15 bg-(--chart-2)/8 p-4">
                <div className="text-sm font-medium text-foreground">
                  Recent entries update live
                </div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Any admin changes in transactions are reflected across the page
                  immediately.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Coverage</CardTitle>
              <CardDescription>
                Where the current data set is strongest.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transactions reviewed</span>
                <span className="font-medium">{recentTransactions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expense categories</span>
                <span className="font-medium">{expenseBreakdown.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Latest period</span>
                <span className="font-medium">
                  {latestTransactionDate ? format(latestTransactionDate, "MMM yyyy") : "--"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
