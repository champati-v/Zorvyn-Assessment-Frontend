import { Card, CardContent } from "@/components/ui/card";

import type { Transaction } from "@/types";
import { formatCurrency, getRecentTransactions } from "@/lib/transactions";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const recentTransactions = getRecentTransactions(transactions);

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Recent Transactions</h3>
          <span className="cursor-pointer text-sm text-primary">
            View all
          </span>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between text-sm"
            >
              <div>
                <div className="font-medium">{transaction.title}</div>
                <div className="text-xs text-muted-foreground">
                  {transaction.category} · {transaction.date}
                </div>
              </div>
              <span
                className={
                  transaction.amount > 0 ? "text-emerald-500" : "text-rose-500"
                }
              >
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
