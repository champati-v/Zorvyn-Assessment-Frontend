import type { ReactNode } from "react";

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
  description: string;
  icon: ReactNode;
  tone: Tone;
};

export default function InsightSignalItem({
  title,
  description,
  icon,
  tone,
}: Props) {
  const classes = toneClasses[tone];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 ${classes.wrapper}`}>
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full border ${classes.wrapper}`}
      >
        <span className={classes.icon}>{icon}</span>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}
