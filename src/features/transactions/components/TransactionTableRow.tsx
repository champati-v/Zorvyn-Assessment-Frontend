import {
  ArrowDownRight,
  ArrowUpRight,
  MoreHorizontal,
  PencilLine,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getCategoryColor, formatCurrency } from "@/lib/transactions";
import type { Transaction } from "@/types";

type Props = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  canManage: boolean;
};

function formatTypeLabel(type: Transaction["type"]) {
  return type === "income" ? "Income" : "Expense";
}

export default function TransactionTableRow({
  transaction,
  onEdit,
  onDelete,
  canManage,
}: Props) {
  const swatch = getCategoryColor(transaction.category);
  const isIncome = transaction.type === "income";
  const TypeIcon = isIncome ? ArrowUpRight : ArrowDownRight;

  return (
    <tr className="border-t border-border/60 transition-colors hover:bg-muted/30">
      <td className="px-4 py-4 align-middle text-sm text-muted-foreground">
        {format(new Date(transaction.date), "MMM d, yyyy")}
      </td>
      <td className="px-4 py-4 align-middle">
        <div className="flex items-center gap-3">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-full ring-1 ring-border/60 ${
              isIncome
                ? "bg-emerald-500/15 text-emerald-600"
                : "bg-rose-500/15 text-rose-600"
            }`}
          >
            <TypeIcon className="size-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate font-medium text-foreground">
              {transaction.title}
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span
                className="inline-flex items-center rounded-full px-2 py-0.5 font-medium text-background"
                style={{ backgroundColor: swatch }}
              >
                {transaction.category}
              </span>
              <span aria-hidden="true">-</span>
              <span>{formatTypeLabel(transaction.type)}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-middle text-sm text-muted-foreground">
        {transaction.category}
      </td>
      <td
        className={`px-4 py-4 align-middle text-sm font-semibold ${
          isIncome ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {formatCurrency(transaction.amount)}
      </td>
      {canManage ? (
        <td className="px-4 py-4 align-middle">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-7 items-center justify-center rounded-md border border-transparent bg-transparent text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <PencilLine className="size-3.5" />
                Edit transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(transaction)}>
                <Trash2 className="size-3.5" />
                Delete transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      ) : null}
    </tr>
  );
}
