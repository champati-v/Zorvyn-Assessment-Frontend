import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Filter,
  LineChart,
  MoreHorizontal,
  PencilLine,
  Plus,
  ReceiptText,
  Search,
  Sparkles,
  Trash2,
  Wallet,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  filterTransactions,
  formatCurrency,
  getCategoryColor,
  getRecentTransactions,
  getSummaryMetrics,
  getDateRangeLabel,
  sortTransactionsDesc,
  type DateRangeKey,
} from "@/lib/transactions";
import type { Transaction, TransactionType } from "@/types";
import { format } from "date-fns";

type TransactionFormState = {
  title: string;
  amount: string;
  category: string;
  date: string;
  type: TransactionType;
};

type FilterType = "all" | TransactionType;

const emptyForm = (): TransactionFormState => ({
  title: "",
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  type: "expense",
});

function buildTransactionPayload(
  form: TransactionFormState,
  id: string
): Transaction {
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

function formatTypeLabel(type: TransactionType) {
  return type === "income" ? "Income" : "Expense";
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accentClass,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  accentClass: string;
}) {
  return (
    <Card size="sm" className="border-border/70 bg-card/90 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {title}
            </p>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div className={`flex size-10 items-center justify-center rounded-full border ${accentClass}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({
  transaction,
  onEdit,
  onDelete,
  canManage,
}: {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  canManage: boolean;
}) {
  const swatch = getCategoryColor(transaction.category);
  const isIncome = transaction.type === "income";

  return (
    <tr className="border-t border-border/60 transition-colors hover:bg-muted/30">
      <td className="px-4 py-4 align-middle text-sm text-muted-foreground">
        {format(new Date(transaction.date), "MMM d, yyyy")}
      </td>
      <td className="px-4 py-4 align-middle">
        <div className="flex items-center gap-3">
          <span
            className="size-9 shrink-0 rounded-full ring-1 ring-border/60"
            style={{ backgroundColor: swatch }}
          />
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">
              {transaction.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 font-medium text-background"
                style={{ backgroundColor: swatch }}
              >
                {transaction.category}
              </span>
              <span aria-hidden="true">•</span>
              <span>{formatTypeLabel(transaction.type)}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-middle text-sm text-muted-foreground">
        {transaction.category}
      </td>
      <td
        className={`px-4 py-4 align-middle text-sm font-semibold ${
          isIncome ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {formatCurrency(transaction.amount)}
      </td>
      {canManage ? (
        <td className="px-4 py-4 align-middle">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex size-7 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <PencilLine className="size-3.5" />
                Edit transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => onDelete(transaction)}
              >
                <Trash2 className="size-3.5" />
                Delete transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      ) : null}
    </tr>
  );
}

export default function TransactionsPage() {
  const {
    transactions,
    role,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinanceStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<TransactionFormState>(emptyForm);
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<FilterType>("all");
  const [dateRange, setDateRange] = React.useState<DateRangeKey>("all");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const canManage = role === "admin";
  const sortedTransactions = React.useMemo(
    () => sortTransactionsDesc(transactions),
    [transactions]
  );

  const filteredTransactions = React.useMemo(
    () =>
      filterTransactions(sortedTransactions, {
        range: dateRange,
        categories: selectedCategories,
        type: filterType,
        query: search,
      }),
    [dateRange, filterType, search, selectedCategories, sortedTransactions]
  );

  const visibleSummary = getSummaryMetrics(filteredTransactions);
  const recentEntries = getRecentTransactions(filteredTransactions, 3);
  const highestExpense = React.useMemo(
    () =>
      filteredTransactions
        .filter((transaction) => transaction.type === "expense")
        .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0],
    [filteredTransactions]
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsFormOpen(true);
  };

  const openEditForm = (transaction: Transaction) => {
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
    setForm(emptyForm());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title || !form.amount || !form.category || !form.date) {
      return;
    }

    const nextId =
      editingId ?? globalThis.crypto?.randomUUID?.() ?? `tx-${Date.now()}`;
    const payload = buildTransactionPayload(form, nextId);

    if (editingId) {
      updateTransaction(editingId, payload);
    } else {
      addTransaction(payload);
    }

    closeForm();
  };

  const handleDelete = (transaction: Transaction) => {
    const confirmed = window.confirm(
      `Delete ${transaction.title}? This will remove it from local storage.`
    );

    if (confirmed) {
      deleteTransaction(transaction.id);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-card via-card to-muted/30 shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 text-chart-1" />
              Managed transaction ledger
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                Transactions
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Browse the complete transaction history, search across entries,
                and manage records from a refined admin workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Wallet className="size-3.5" />
                {filteredTransactions.length} visible
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <CalendarDays className="size-3.5" />
                {getDateRangeLabel(dateRange)}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <ReceiptText className="size-3.5" />
                Admin-only edits
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {canManage ? (
                <Button onClick={openAddForm} className="gap-2">
                  <Plus className="size-4" />
                  Add transaction
                </Button>
              ) : (
                <div className="rounded-full border border-dashed border-border/70 bg-background/60 px-3 py-2 text-sm text-muted-foreground">
                  You are in viewer mode. Switch to admin to add or edit entries.
                </div>
              )}
              <Link
                to="/insights"
                className={buttonVariants({ variant: "outline", size: "default" })}
              >
                Open insights
                <ChevronRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="border-t border-border/70 bg-background/50 p-6 md:p-8 lg:border-l lg:border-t-0">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <MetricCard
                title="Balance"
                value={formatCurrency(visibleSummary.totalBalance)}
                description="Selected search and filter range"
                icon={<LineChart className="size-4 text-chart-1" />}
                accentClass="border-chart-1/20 bg-chart-1/10"
              />
              <MetricCard
                title="Income"
                value={formatCurrency(visibleSummary.monthlyIncome)}
                description="Latest month inflow"
                icon={<ArrowUpRight className="size-4 text-emerald-500" />}
                accentClass="border-emerald-500/20 bg-emerald-500/10"
              />
              <MetricCard
                title="Expenses"
                value={formatCurrency(visibleSummary.monthlyExpenses)}
                description="Latest month outflow"
                icon={<ArrowDownRight className="size-4 text-rose-500" />}
                accentClass="border-rose-500/20 bg-rose-500/10"
              />
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-card/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Top expense
                  </p>
                  <p className="mt-1 text-sm font-medium">
                    {highestExpense ? highestExpense.title : "No expense data"}
                  </p>
                </div>
                <div className="text-right text-sm font-semibold text-foreground">
                  {highestExpense ? formatCurrency(highestExpense.amount) : "--"}
                </div>
              </div>
              <Separator className="my-3" />
              <div className="text-xs leading-relaxed text-muted-foreground">
                Search, date range, and category filters update the summary cards,
                row counts, and the preview metrics here.
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/70">
                <Filter className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">Filters</div>
                <div className="text-xs text-muted-foreground">
                  Narrow the ledger by search term or transaction type.
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, category, or date"
                  className="pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "all", label: "All" },
                    { value: "income", label: "Income" },
                    { value: "expense", label: "Expense" },
                  ] as const
                ).map((item) => (
                  <Button
                    key={item.value}
                    type="button"
                    size="sm"
                    variant={filterType === item.value ? "default" : "outline"}
                    onClick={() => setFilterType(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
          <CardHeader className="border-b border-border/70 bg-muted/20">
            <CardTitle>Transaction ledger</CardTitle>
            <CardDescription>
              A cleaner record view with contextual actions and visual category
              cues.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-190 text-sm">
                <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    {canManage ? <th className="px-4 py-3 font-medium">Actions</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        onEdit={openEditForm}
                        onDelete={handleDelete}
                        canManage={canManage}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={canManage ? 5 : 4}
                        className="px-4 py-10 text-center text-sm text-muted-foreground"
                      >
                        No transactions match the current search and filter settings.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between border-t border-border/70 px-4 py-4">
            <div className="text-xs text-muted-foreground">
              Showing {filteredTransactions.length} of {sortedTransactions.length} entries.
            </div>
            <div className="text-xs text-muted-foreground">
              Local storage sync is automatic.
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent entries</CardTitle>
              <CardDescription>
                A quick preview of the latest filtered transactions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentEntries.length > 0 ? (
                recentEntries.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="rounded-xl border border-border/70 bg-background/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {transaction.title}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {transaction.category} •{" "}
                          {format(new Date(transaction.date), "MMM d")}
                        </div>
                      </div>
                      <div
                        className={`shrink-0 text-sm font-semibold ${
                          transaction.amount > 0
                            ? "text-emerald-500"
                            : "text-rose-500"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
                  No recent entries for this filtered view.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Monthly signal</CardTitle>
              <CardDescription>
                Current month income and expenses from the visible set.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Income</span>
                <span className="font-medium text-emerald-500">
                  {formatCurrency(visibleSummary.monthlyIncome)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Expenses</span>
                <span className="font-medium text-rose-500">
                  {formatCurrency(visibleSummary.monthlyExpenses)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Savings rate</span>
                <span className="font-medium">
                  {visibleSummary.savingsRate.toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader className="border-b border-border/70 bg-background/60 px-6 pb-4 pt-6">
            <SheetTitle>
              {editingId ? "Edit transaction" : "Add transaction"}
            </SheetTitle>
            <SheetDescription>
              {editingId
                ? "Update the existing entry and keep the dashboard in sync."
                : "Create a new entry that will immediately flow into charts and lists."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Title
                </label>
                <Input
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Salary, groceries, subscription..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Amount
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={form.amount}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, amount: event.target.value }))
                  }
                  placeholder="2500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Category
                </label>
                <Input
                  value={form.category}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, category: event.target.value }))
                  }
                  placeholder="Food, Salary, Transport..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Date
                </label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, date: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      value: "expense" as const,
                      label: "Expense",
                      variant: "destructive" as const,
                    },
                    {
                      value: "income" as const,
                      label: "Income",
                      variant: "secondary" as const,
                    },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={form.type === option.value ? "default" : option.variant}
                      className="justify-center"
                      onClick={() =>
                        setForm((current) => ({ ...current, type: option.value }))
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" className="gap-2">
                  <Plus className="size-4" />
                  {editingId ? "Save changes" : "Create transaction"}
                </Button>
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancel
                </Button>
              </div>
            </form>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
              Use this editor to add or correct entries. Every change updates the
              dashboard charts, insights, and transaction history through the
              shared Zustand store.
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
