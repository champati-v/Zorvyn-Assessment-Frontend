import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "@/components/layout/AppShell";

// Pages
import DashboardPage from "@/pages/DashboardPage";
import TransactionsPage from "@/pages/TransactionPage";
import InsightsPage from "@/pages/InsightsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      {/* Main Layout */}
      <Route element={<AppShell />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}