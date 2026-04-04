import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  accentClass: string;
}

export default function SummaryCard({
  title,
  value,
  change,
  icon,
  accentClass,
}: Props) {
  return (
    <Card className="border-border/70 bg-card/90 shadow-sm">
      <CardContent className="space-y-3 px-4 py-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {title}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">{value}</h2>
            <p className="text-xs text-muted-foreground">{change}</p>
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-full border ${accentClass}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
