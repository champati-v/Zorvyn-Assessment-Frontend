import type { Transaction } from "../types";


export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 50000,
    date: "2026-03-01",
    category: "Salary",
    type: "income",
  },
  {
    id: "2",
    title: "Groceries",
    amount: 2500,
    date: "2026-03-05",
    category: "Food",
    type: "expense",
  },
];