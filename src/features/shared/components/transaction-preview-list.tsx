import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { formatCurrency, getCategoryColor } from "@/lib/transactions";
import type { Transaction } from "@/types";

type Props = {
  transactions: Transaction[];
  emptyMessage: string;
};

export default function TransactionPreviewList({
  transactions,
  emptyMessage,
}: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/70 bg-background/60 p-4 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => {
        const swatch = getCategoryColor(transaction.category);

        return (
          <Card key={transaction.id} size="sm" className="border-border/70 bg-background/60">
            <div className="flex items-center justify-between gap-4 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="size-9 shrink-0 rounded-full ring-1 ring-border/60"
                  style={{ backgroundColor: swatch }}
                />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {transaction.title}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{transaction.category}</span>
                    <span aria-hidden="true">-</span>
                    <span>{format(new Date(transaction.date), "MMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <div
                className={`shrink-0 text-sm font-semibold ${
                  transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"
                }`}
              >
                {formatCurrency(transaction.amount)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
