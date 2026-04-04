import { Button } from "@/components/ui/button";
import { useFinanceStore, type Role } from "@/store/useFinanceStore";

export default function SettingsPage() {
  const { role, setRole } = useFinanceStore();

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Profile, export, and role controls.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Role</p>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="outline">Export CSV</Button>
        <Button variant="secondary">Export JSON</Button>
      </div>
    </div>
  );
}
