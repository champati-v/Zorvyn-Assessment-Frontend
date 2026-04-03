import { Card, CardContent } from "@/components/ui/card";

interface Props {
  title: string;
  value: string;
  change: string;
}

export default function SummaryCard({ title, value, change }: Props) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5 space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-semibold">{value}</h2>
        <p className="text-xs text-primary">{change}</p>
      </CardContent>
    </Card>
  );
}