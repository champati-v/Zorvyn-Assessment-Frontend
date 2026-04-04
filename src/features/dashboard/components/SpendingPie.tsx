import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getCategoryColor } from "@/lib/transactions";
import type { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

type PieTooltipProps = {
  active?: boolean;
  payload?: Array<{
    name?: string | number;
    value?: number | number[];
  }>;
  label?: string | number;
  coordinate?: unknown;
  accessibilityLayer?: boolean;
  activeIndex?: unknown;
};

function PieTooltip({ active, payload, label }: PieTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const entry = payload[0];
  const category = String(label ?? entry.name ?? "");
  const rawValue = entry.value;
  const normalizedValue = Array.isArray(rawValue) ? rawValue[0] : rawValue;
  const value = Number(normalizedValue ?? 0);
  const swatch = getCategoryColor(category);

  return (
    <div className="min-w-40 rounded-xl border border-sidebar-border bg-popover/95 px-3 py-3 text-xs shadow-xl ring-1 ring-border/40 backdrop-blur-md">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="size-2.5 rounded-full"
          style={{ backgroundColor: swatch }}
        />
        <div className="font-medium text-popover-foreground">{category}</div>
      </div>
      <div className="flex items-center justify-between gap-4 text-muted-foreground">
        <span className="flex items-center gap-2">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: swatch }}
          />
          Spending
        </span>
        <span className="font-medium text-foreground">
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
}

export default function SpendingPie({ transactions }: Props) {
  const data = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce<Map<string, number>>((accumulator, transaction) => {
      accumulator.set(
        transaction.category,
        (accumulator.get(transaction.category) ?? 0) + Math.abs(transaction.amount)
      );
      return accumulator;
    }, new Map())
    .entries();

  const chartData = [...data]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="mb-1 font-medium">Spending Breakdown</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Expense categories sourced from the shared transaction store.
        </p>

        <div className="h-[220px]">
          <ResponsiveContainer>
            <PieChart>
              <Tooltip content={<PieTooltip />} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
          {chartData.slice(0, 4).map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between rounded-md border border-border px-2 py-1.5"
            >
              <span className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryColor(entry.name) }}
                />
                {entry.name}
              </span>
              <span>{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
