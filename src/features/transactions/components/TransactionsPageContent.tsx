import * as React from "react";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  DollarSign,
  Download,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  filterTransactions,
  formatCurrency,
  getRecentTransactions,
  getSummaryMetrics,
  sortTransactionsDesc,
  type DateRangeKey,
} from "@/lib/transactions";
import type { Transaction, TransactionType } from "@/types";
import TransactionEditorSheet, {
  emptyTransactionForm,
  type TransactionFormState,
} from "@/features/transactions/components/TransactionEditorSheet";
import TransactionPreviewList from "@/features/shared/components/transaction-preview-list";
import TransactionTableRow from "@/features/transactions/components/TransactionTableRow";

type FilterType = "all" | TransactionType;

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

function sanitizePdfText(value: string) {
  return value
    .replace(/[^\x20-\x7E]/g, "?")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function createPdfBlob(transactions: Transaction[]) {
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
  const offsets: number[] = [0];

  const appendObject = (object: string) => {
    offsets.push(body.length);
    body += `${object}\n`;
  };

  appendObject("1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj");
  appendObject("2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj");
  appendObject(
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj"
  );
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

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportTransactionsAsCsv(transactions: Transaction[]) {
  const header = ["id", "title", "amount", "date", "category", "type"];
  const rows = transactions.map((transaction) =>
    [
      transaction.id,
      transaction.title,
      transaction.amount,
      transaction.date,
      transaction.category,
      transaction.type,
    ]
      .map((value) => escapeCsvValue(String(value)))
      .join(",")
  );

  const csv = [header.join(","), ...rows].join("\n");
  downloadBlob(
    "transactions-export.csv",
    new Blob([csv], { type: "text/csv;charset=utf-8" })
  );
}

function exportTransactionsAsPdf(transactions: Transaction[]) {
  downloadBlob("transactions-export.pdf", createPdfBlob(transactions));
}

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

export default function TransactionsPageContent() {
  const {
    transactions,
    role,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useFinanceStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<TransactionFormState>(emptyTransactionForm);
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<FilterType>("all");
  const [dateRange] = React.useState<DateRangeKey>("all");
  const [selectedCategories] = React.useState<string[]>([]);
  const [pendingDeleteTransaction, setPendingDeleteTransaction] =
    React.useState<Transaction | null>(null);

  const canManage = role === "admin";
  const sortedTransactions = useMemo(
    () => sortTransactionsDesc(transactions),
    [transactions]
  );

  const filteredTransactions = useMemo(
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

  const handleExportCsv = () => exportTransactionsAsCsv(filteredTransactions);
  const handleExportPdf = () => exportTransactionsAsPdf(filteredTransactions);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyTransactionForm());
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
    setForm(emptyTransactionForm());
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
      toast.success(`Updated "${payload.title}"`, {
        description: "The transaction was saved to local data.",
      });
    } else {
      addTransaction(payload);
      toast.success(`Added "${payload.title}"`, {
        description: "The transaction is now available across the dashboard.",
      });
    }

    closeForm();
  };

  const handleDelete = (transaction: Transaction) => {
    setPendingDeleteTransaction(transaction);
  };

  const confirmDelete = () => {
    if (!pendingDeleteTransaction) {
      return;
    }

    deleteTransaction(pendingDeleteTransaction.id);
    toast.success(`Deleted "${pendingDeleteTransaction.title}"`, {
      description: "The transaction was removed from local data.",
    });
    setPendingDeleteTransaction(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/90 shadow-sm">
        <CardContent className="space-y-4 p-4 md:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/70">
                <DollarSign className="size-4 text-muted-foreground" />
              </div>
              <div>
                <div className="text-sm font-medium">Transactions</div>
                <div className="text-xs text-muted-foreground">
                  View, search, and manage your transactions.
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:justify-end">
              <div className="relative w-full md:max-w-sm">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
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

                {canManage ? (
                  <Button type="button" onClick={openAddForm} className="gap-2">
                    <Plus className="size-4" />
                    Add transaction
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Card className="overflow-hidden border-border/70 bg-card/90 shadow-sm">
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
                      <TransactionTableRow
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
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Export data</CardTitle>
              <CardDescription>
                Download the currently visible transactions as CSV or PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2"
                onClick={handleExportCsv}
              >
                <Download className="size-4" />
                Export CSV
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="justify-start gap-2"
                onClick={handleExportPdf}
              >
                <Download className="size-4" />
                Export PDF
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Recent entries</CardTitle>
              <CardDescription>
                A quick preview of the latest filtered transactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionPreviewList
                transactions={recentEntries}
                emptyMessage="No recent entries for this filtered view."
              />
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

      <TransactionEditorSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />

      <AlertDialog
        open={pendingDeleteTransaction !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingDeleteTransaction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteTransaction
                ? `This will permanently remove "${pendingDeleteTransaction.title}" from your local data.`
                : "This will permanently remove the selected transaction from your local data."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setPendingDeleteTransaction(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete transaction
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
