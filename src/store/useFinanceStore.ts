import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Role = "admin" | "viewer";

interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: "income" | "expense";
  date: string;
}

interface FinanceState {
  role: Role;
  transactions: Transaction[];

  setRole: (role: Role) => void;
  addTransaction: (tx: Transaction) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: "admin",

      transactions: [
        {
          id: "1",
          title: "Amazon India",
          amount: -1249,
          category: "Shopping",
          type: "expense",
          date: "2026-03-12",
        },
      ],

      setRole: (role) => set({ role }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [tx, ...state.transactions],
        })),
    }),
    { name: "finance-storage" }
  )
);