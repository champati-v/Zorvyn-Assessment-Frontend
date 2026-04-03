import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { name: "Food", value: 13387 },
  { name: "Transport", value: 7650 },
  { name: "Housing", value: 5737 },
  { name: "Entertainment", value: 5737 },
];

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
];

export default function SpendingPie() {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-4 font-medium">Spending Breakdown</h3>

        <div className="h-[220px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}