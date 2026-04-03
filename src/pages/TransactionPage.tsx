import { useFinanceStore } from "@/store/useFinanceStore";

export default function TransactionsPage() {
  const { transactions } = useFinanceStore();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Transactions</h1>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t">
                <td className="p-3">{tx.date}</td>
                <td className="p-3">{tx.title}</td>
                <td className="p-3">
                  ₹{tx.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}