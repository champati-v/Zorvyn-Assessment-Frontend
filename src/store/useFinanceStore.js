import { create } from "zustand";
import { persist } from "zustand/middleware";
import { transactions as seededTransactions } from "@/data/transactions";
export const useFinanceStore = create()(persist((set) => ({
    role: "admin",
    transactions: seededTransactions,
    setRole: (role) => set({ role }),
    addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions],
    })),
    updateTransaction: (id, tx) => set((state) => ({
        transactions: state.transactions.map((item) => item.id === id ? tx : item),
    })),
    deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((item) => item.id !== id),
    })),
    resetTransactions: () => set({
        transactions: seededTransactions,
    }),
}), { name: "finance-storage-v2" }));
