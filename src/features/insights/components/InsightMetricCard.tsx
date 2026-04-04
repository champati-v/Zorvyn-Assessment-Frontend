import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

type Tone = "primary" | "success" | "warning";

const toneClasses: Record<Tone, { wrapper: string; icon: string }> = {
  primary: {
    wrapper: "border-primary/15 bg-primary/5",
    icon: "text-primary",
  },
  success: {
    wrapper: "border-emerald-500/15 bg-emerald-500/8",
    icon: "text-emerald-500",
  },
  warning: {
    wrapper: "border-amber-500/15 bg-amber-500/8",
    icon: "text-amber-500",
  },
};

type Props = {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  tone?: Tone;
};

export default function InsightMetricCard({
  title,
  value,
  description,
  icon,
  tone = "primary",
}: Props) {
  const classes = toneClasses[tone];

  return (
    <Card size="sm" className="border-border/70 bg-card/90">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {title}
            </p>
            <div className="text-2xl font-semibold tracking-tight">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
          <div
            className={`flex size-10 items-center justify-center rounded-full border ${classes.wrapper}`}
          >
            <span className={classes.icon}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
