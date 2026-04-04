import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import TransactionPreviewList from "@/features/shared/components/transaction-preview-list";
import { getRecentTransactions } from "@/lib/transactions";
import type { Transaction } from "@/types";

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
          <Link to="/transactions" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        <TransactionPreviewList
          transactions={recentTransactions}
          emptyMessage="No recent transactions available."
        />
      </CardContent>
    </Card>
  );
}
