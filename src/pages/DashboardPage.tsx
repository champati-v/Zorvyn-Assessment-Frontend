import SummaryCard from "@/features/dashboard/components/SummaryCard";
import BalanceChart from "@/features/dashboard/components/BalanceChart";
import SpendingPie from "@/features/dashboard/components/SpendingPie";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Balance" value="₹2,84,750" change="+₹12,400" />
        <SummaryCard title="Monthly Income" value="₹65,000" change="+8.2%" />
        <SummaryCard title="Monthly Expenses" value="₹38,250" change="+3.1%" />
        <SummaryCard title="Savings Rate" value="41.2%" change="+2.4pp" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceChart />
        </div>
        <SpendingPie />
      </div>

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
}