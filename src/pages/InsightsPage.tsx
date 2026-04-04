import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarRange,
  Filter,
  ChevronRight,
  CircleDollarSign,
  Info,
  LineChart,
  PieChart,
  ReceiptText,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { format, parseISO } from "date-fns"
import BalanceChart from "@/features/dashboard/components/BalanceChart";
import SpendingPie from "@/features/dashboard/components/SpendingPie";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  filterTransactions,
  formatCurrency,
  getCategoryColor,
  getDateRangeLabel,
  getExpenseBreakdown,
  getRecentTransactions,
  getSummaryMetrics,
  type DateRangeKey,
} from "@/lib/transactions";
import type { Transaction } from "@/types";

type MonthlySnapshot = {
  key: string;
  label: string;
  income: number;
  expenses: number;
  net: number;
  transactionCount: number;
};

type SignalTone = "primary" | "success" | "warning";

const signalToneClasses: Record<
  SignalTone,
  { wrapper: string; icon: string }
> = {
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

function getMonthlySnapshots(transactions: Transaction[]) {
  const grouped = new Map<string, MonthlySnapshot>();

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
    } else {
      const value = Math.abs(transaction.amount);
      existing.expenses += value;
      existing.net -= value;
    }

    grouped.set(key, existing);
  });

  return [...grouped.values()].sort((a, b) => a.key.localeCompare(b.key));
}

function formatDelta(value: number) {
  return value >= 0
    ? `+${formatCurrency(Math.abs(value))}`
    : `-${formatCurrency(Math.abs(value))}`;
}

function InsightMetricCard({
  title,
  value,
  description,
  icon,
  tone = "primary",
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone?: SignalTone;
}) {
  const classes = signalToneClasses[tone];

  return (
    <Card size="sm" className="border-border/70 bg-card/90">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {title}
            </p>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-full border ${classes.wrapper}`}
          >
            <span className={classes.icon}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SignalItem({
  title,
  description,
  icon,
  tone,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  tone: SignalTone;
}) {
  const classes = signalToneClasses[tone];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${classes.wrapper}`}>
      <div className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${classes.wrapper}`}>
        <span className={classes.icon}>{icon}</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.type === "income";
  const amountTone = isIncome ? "text-emerald-500" : "text-rose-500";
  const swatch = getCategoryColor(transaction.category);

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/60 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className="size-9 shrink-0 rounded-full"
          style={{ backgroundColor: swatch }}
        />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{transaction.title}</div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{transaction.category}</span>
            <span aria-hidden="true">•</span>
            <span>{format(parseISO(transaction.date), "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>
      <div className={`shrink-0 text-sm font-semibold ${amountTone}`}>
        {formatCurrency(transaction.amount)}
      </div>
    </div>
  );
}

function CategoryBar({
  category,
  value,
  total,
}: {
  category: string;
  value: number;
  total: number;
}) {
  const percent = total === 0 ? 0 : (value / total) * 100;
  const swatch = getCategoryColor(category);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: swatch }}
          />
          <span className="truncate font-medium">{category}</span>
        </span>
        <span className="shrink-0 text-muted-foreground">
          {percent.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(percent, 4)}%`,
            backgroundColor: swatch,
          }}
        />
      </div>
      <div className="text-xs text-muted-foreground">{formatCurrency(value)}</div>
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useFinanceStore();
  const [range, setRange] = useState<DateRangeKey>("quarter");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const visibleTransactions = useMemo(
    () =>
      filterTransactions(transactions, {
        range,
        categories: selectedCategories,
      }),
    [range, selectedCategories, transactions]
  );

  const summary = useMemo(
    () => getSummaryMetrics(visibleTransactions),
    [visibleTransactions]
  );

  const expenseBreakdown = useMemo(
    () => getExpenseBreakdown(visibleTransactions),
    [visibleTransactions]
  );

  const monthlySnapshots = useMemo(
    () => getMonthlySnapshots(visibleTransactions),
    [visibleTransactions]
  );

  const sortedTransactions = useMemo(
    () => getRecentTransactions(visibleTransactions, visibleTransactions.length),
    [visibleTransactions]
  );

  const latestDate = sortedTransactions[0]
    ? parseISO(sortedTransactions[0].date)
    : null;
  const latestLabel = latestDate ? format(latestDate, "MMM yyyy") : "No activity";

  const monthlyTransactions = latestDate
    ? visibleTransactions.filter((transaction) =>
        transaction.date.startsWith(format(latestDate, "yyyy-MM"))
      )
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
  const topCategoryShare =
    topCategory && summary.monthlyExpenses > 0
      ? (topCategory.value / summary.monthlyExpenses) * 100
      : 0;
  const largestExpense = visibleTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
  const recentTransactions = getRecentTransactions(visibleTransactions, 6);
  const averageTransaction =
    visibleTransactions.length === 0
      ? 0
      : visibleTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0) /
        visibleTransactions.length;

  const signals = [
    latestMonthNet >= 0
      ? {
          title: "Cash flow is positive",
          description: `${latestLabel} closed with ${formatCurrency(latestMonthNet)} of net surplus.`,
          icon: <TrendingUp className="size-4" />,
          tone: "success" as const,
        }
      : {
          title: "Cash flow needs attention",
          description: `${latestLabel} ended ${formatCurrency(Math.abs(latestMonthNet))} below break-even.`,
          icon: <ArrowDownRight className="size-4" />,
          tone: "warning" as const,
        },
    topCategory
      ? {
          title: `${topCategory.name} dominates expenses`,
          description: `${topCategory.name} accounts for ${topCategoryShare.toFixed(
            0
          )}% of spending in this range.`,
          icon: <PieChart className="size-4" />,
          tone: "primary" as const,
        }
      : null,
    largestExpense
      ? {
          title: "Largest expense",
          description: `${largestExpense.title} is the biggest outflow at ${formatCurrency(
            Math.abs(largestExpense.amount)
          )}.`,
          icon: <ReceiptText className="size-4" />,
          tone: "warning" as const,
        }
      : null,
  ].filter(Boolean) as Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
    tone: SignalTone;
  }>;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-chart-1"  />
              Insights refresh from the shared transaction store
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">Insights</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                  A deeper look at cash flow, category concentration, and month to
                  month behavior.
                </span>
                <Tooltip>
                  <TooltipTrigger className="inline-flex cursor-help items-center text-muted-foreground/80">
                    <Info className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Data combines seeded transactions with anything saved locally.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCategories.length > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Filter className="size-3.5" />
                {selectedCategories.length} category filters
              </div>
            ) : null}
            <Link
              to="/transactions"
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              <ChevronRight className="size-3.5" />
              Open transactions
            </Link>
          </div>
        </section>

        <Card className="overflow-hidden border-border/70 bg-linear-to-br from-card via-card to-muted/30 shadow-sm">
          <CardContent className="grid gap-0 p-0 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                  <CalendarRange className="size-3.5" />
                  {getDateRangeLabel(range)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background/70 px-2.5 py-1">
                  <BarChart3 className="size-3.5" />
                  {visibleTransactions.length} transactions in view
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Financial pulse
                </p>
                <div className="text-4xl font-semibold tracking-tight">
                  {formatCurrency(summary.totalBalance)}
                </div>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Net balance across the selected period, with income, expenses, and
                  category pressure reflected from the same transaction data used by
                  the dashboard.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Monthly income
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    {formatCurrency(summary.monthlyIncome)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {latestLabel} snapshot
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Monthly expenses
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    {formatCurrency(summary.monthlyExpenses)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {latestLabel} snapshot
                  </div>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Savings rate
                  </div>
                  <div className="mt-2 text-lg font-semibold">
                    {summary.savingsRate.toFixed(1)}%
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Based on total income
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                    latestMonthNet >= 0
                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600"
                      : "border border-rose-500/20 bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {latestMonthNet >= 0 ? (
                    <ArrowUpRight className="size-3.5" />
                  ) : (
                    <ArrowDownRight className="size-3.5" />
                  )}
                  {formatDelta(latestMonthNet)} vs expenses
                </div>
                <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <Wallet className="size-3.5" />
                  Average transaction {formatCurrency(averageTransaction)}
                </div>
              </div>
            </div>

            <div className="border-t border-border/70 bg-background/60 p-6 lg:border-l lg:border-t-0">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Range summary
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight">
                    {latestLabel}
                  </h2>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">Latest period net</div>
                      <div className="text-xs text-muted-foreground">
                        Income minus expenses
                      </div>
                    </div>
                    <div
                      className={`text-right text-lg font-semibold ${
                        latestMonthNet >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {formatCurrency(latestMonthNet)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">Month over month shift</div>
                      <div className="text-xs text-muted-foreground">
                        Net movement vs previous month
                      </div>
                    </div>
                    <div
                      className={`text-right text-sm font-semibold ${
                        latestTrend >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {formatDelta(latestTrend)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium">Top expense category</div>
                      <div className="text-xs text-muted-foreground">
                        Share of total spending
                      </div>
                    </div>
                    <div className="text-right text-sm font-semibold">
                      {topCategory
                        ? `${topCategory.name} • ${topCategoryShare.toFixed(0)}%`
                        : "No expenses"}
                    </div>
                  </div>
                </div>

                <Separator />

                <CardFooter className="px-0 pb-0 pt-0">
                  <div className="text-xs leading-relaxed text-muted-foreground">
                    The insights below split the same data into trend, mix, and
                    concentration views so the page reads more like a finance brief
                    than a summary tile.
                  </div>
                </CardFooter>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InsightMetricCard
            title="Net balance"
            value={formatCurrency(summary.totalBalance)}
            description="Selected range cash position"
            icon={<CircleDollarSign className="size-4" />}
            tone="primary"
          />
          <InsightMetricCard
            title="Income"
            value={formatCurrency(summary.monthlyIncome)}
            description="Latest month inflow"
            icon={<ArrowUpRight className="size-4" />}
            tone="success"
          />
          <InsightMetricCard
            title="Expenses"
            value={formatCurrency(summary.monthlyExpenses)}
            description="Latest month outflow"
            icon={<ArrowDownRight className="size-4" />}
            tone="warning"
          />
          <InsightMetricCard
            title="Transactions"
            value={String(visibleTransactions.length)}
            description="Entries in the selected range"
            icon={<Activity className="size-4" />}
            tone="primary"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <BalanceChart transactions={visibleTransactions} />

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="size-4 text-char-1" />
                Quick signals
              </CardTitle>
              <CardDescription>
                The page highlights the most useful takeaways from the current
                period.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {signals.map((signal) => (
                <SignalItem key={signal.title} {...signal} />
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <SpendingPie transactions={visibleTransactions} />

          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-4 text-chart-2" />
                Category concentration
              </CardTitle>
              <CardDescription>
                Where your spending is clustered in the selected range.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenseBreakdown.length > 0 ? (
                expenseBreakdown.slice(0, 5).map((item) => (
                  <CategoryBar
                    key={item.name}
                    category={item.name}
                    value={item.value}
                    total={summary.monthlyExpenses}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-6 text-sm text-muted-foreground">
                  No expense activity is available for this range yet.
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border/70 pt-4">
              <div className="text-xs text-muted-foreground">
                Concentration is based on expense totals, not income.
              </div>
              <Link
                to="/transactions"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Review entries
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="size-4 text-char-3" />
              Monthly snapshot
            </CardTitle>
            <CardDescription>
              A compact view of income, expenses, and net position by month.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {monthlySnapshots.length > 0 ? (
              monthlySnapshots.slice(-4).map((month) => (
                <div
                  key={month.key}
                  className="rounded-2xl border border-border/70 bg-background/60 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-sm font-medium">{month.label}</div>
                    <div
                      className={`text-sm font-semibold ${
                        month.net >= 0 ? "text-emerald-500" : "text-rose-500"
                      }`}
                    >
                      {formatCurrency(month.net)}
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between gap-4">
                      <span>Income</span>
                      <span>{formatCurrency(month.income)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Expenses</span>
                      <span>{formatCurrency(month.expenses)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Transactions</span>
                      <span>{month.transactionCount}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 bg-background/60 p-6 text-sm text-muted-foreground">
                Monthly snapshots will appear once transactions exist for the
                selected period.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ReceiptText className="size-4 text-char-4" />
              Recent activity
            </CardTitle>
            <CardDescription>
              The most recent transactions in the current range, formatted with
              category color cues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-6 text-sm text-muted-foreground">
                No transactions found for this range.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
