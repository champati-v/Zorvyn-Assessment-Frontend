import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getMonthlyBalanceSeries } from "@/lib/transactions";
import type { Transaction } from "@/types";

interface Props {
  transactions: Transaction[];
}

type BalanceTooltipProps = {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    value?: number;
  }>;
  label?: string | number;
};

function BalanceTooltip({ active, payload, label }: BalanceTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const balance = payload.find((entry) => entry.dataKey === "value")?.value ?? 0;
  const income = payload.find((entry) => entry.dataKey === "income")?.value ?? 0;
  const expenses = payload.find((entry) => entry.dataKey === "expenses")?.value ?? 0;

  return (
    <div className="rounded-xl border border-sidebar-border bg-popover/95 px-3 py-3 text-xs shadow-xl ring-1 ring-border/40 backdrop-blur-md">
      <div className="mb-2 font-medium text-popover-foreground">{label}</div>
      <div className="grid gap-2 text-muted-foreground">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--chart-1)]" />
            Balance
          </span>
          <span className="font-medium text-foreground">
            {formatCurrency(Number(balance))}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--chart-2)]" />
            Income
          </span>
          <span className="font-medium text-[var(--chart-2)]">
            {formatCurrency(Number(income))}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[var(--chart-4)]" />
            Expenses
          </span>
          <span className="font-medium text-[var(--chart-4)]">
            {formatCurrency(Number(expenses))}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BalanceChart({ transactions }: Props) {
  const data = getMonthlyBalanceSeries(transactions);

  return (
    <Card className="h-full">
      <CardContent className="p-5">
        <h3 className="mb-1 font-medium">Balance trend</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Rolling balance based on seeded and user-added transactions.
        </p>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" tickFormatter={formatCurrency} />
              <Tooltip content={<BalanceTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#balanceFill)"
                fillOpacity={1}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--chart-4)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
