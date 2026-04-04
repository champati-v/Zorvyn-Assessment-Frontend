import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { TransactionType } from "@/types";

export type TransactionFormState = {
  title: string;
  amount: string;
  category: string;
  date: string;
  type: TransactionType;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingId: string | null;
  form: TransactionFormState;
  setForm: React.Dispatch<React.SetStateAction<TransactionFormState>>;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function emptyTransactionForm(): TransactionFormState {
  return {
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    type: "expense",
  };
}

export default function TransactionEditorSheet({
  open,
  onOpenChange,
  editingId,
  form,
  setForm,
  onSubmit,
  onCancel,
}: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader className="border-b border-border/70 bg-background/60 px-6 pb-4 pt-6">
          <SheetTitle>
            {editingId ? "Edit transaction" : "Add transaction"}
          </SheetTitle>
          <SheetDescription>
            {editingId
              ? "Update the existing entry and keep the dashboard in sync."
              : "Create a new entry that will immediately flow into charts and lists."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col gap-6 overflow-y-auto px-6 py-6">
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Title
              </label>
              <Input
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({ ...current, title: event.target.value }))
                }
                placeholder="Salary, groceries, subscription..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Amount
              </label>
              <Input
                type="number"
                min="0"
                step="1"
                value={form.amount}
                onChange={(event) =>
                  setForm((current) => ({ ...current, amount: event.target.value }))
                }
                placeholder="2500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Category
              </label>
              <Input
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                placeholder="Food, Salary, Transport..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Date
              </label>
              <Input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((current) => ({ ...current, date: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    value: "expense" as const,
                    label: "Expense",
                    variant: "destructive" as const,
                  },
                  {
                    value: "income" as const,
                    label: "Income",
                    variant: "secondary" as const,
                  },
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={form.type === option.value ? "default" : option.variant}
                    className="justify-center"
                    onClick={() =>
                      setForm((current) => ({ ...current, type: option.value }))
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="submit" className="gap-2">
                <Plus className="size-4" />
                {editingId ? "Save changes" : "Create transaction"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>

          <div className="rounded-2xl border border-border/70 bg-muted/20 p-4 text-xs leading-relaxed text-muted-foreground">
            Use this editor to add or correct entries. Every change updates the
            dashboard charts, insights, and transaction history through the shared
            Zustand store.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
