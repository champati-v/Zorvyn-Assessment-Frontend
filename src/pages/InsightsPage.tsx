export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Insights</h1>

      <div className="grid lg:grid-cols-3 gap-4">
        <InsightCard title="Top Category" value="₹12,400" />
        <InsightCard title="Monthly Change" value="+₹3,150" />
        <InsightCard title="Best Savings" value="₹18,500" />
      </div>
    </div>
  );
}

function InsightCard({ title, value }: any) {
  return (
    <div className="p-5 bg-card border rounded-lg">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h2 className="text-xl font-semibold">{value}</h2>
    </div>
  );
}