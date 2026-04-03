import { useFinanceStore } from "@/store/useFinanceStore";

export default function SettingsPage() {
  const { role, setRole } = useFinanceStore();

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Settings</h1>

      {/* Role */}
      <div>
        <p className="text-sm mb-2">Role</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as any)}
          className="bg-muted px-3 py-2 rounded"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Export */}
      <div className="flex gap-3">
        <button className="border px-4 py-2 rounded">
          Export CSV
        </button>
        <button className="border px-4 py-2 rounded">
          Export JSON
        </button>
      </div>
    </div>
  );
}