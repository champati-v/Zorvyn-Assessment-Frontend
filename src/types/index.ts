export type TransactionType = "income" | "expense";
export type UserRole = "admin" | "viewer";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
}
