import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const data = [
  { name: "Oct", value: 12000 },
  { name: "Nov", value: 10000 },
  { name: "Dec", value: 18000 },
  { name: "Jan", value: 24000 },
  { name: "Feb", value: 22000 },
  { name: "Mar", value: 28000 },
];

export default function BalanceChart() {
  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <h3 className="mb-4 font-medium">Balance trend</h3>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}