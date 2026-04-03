import { Card, CardContent } from "@/components/ui/card";

const transactions = [
  { title: "Amazon India", amount: -1249 },
  { title: "Starbucks Coffee", amount: -450 },
  { title: "Salary Deposit", amount: 65000 },
  { title: "Uber India", amount: -320 },
  { title: "Netflix Subscription", amount: -649 },
];

export default function RecentTransactions() {
  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex justify-between">
          <h3 className="font-medium">Recent Transactions</h3>
          <span className="text-sm text-primary cursor-pointer">
            View all
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((t, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{t.title}</span>
              <span
                className={
                  t.amount > 0 ? "text-green-500" : "text-red-500"
                }
              >
                ₹{t.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}