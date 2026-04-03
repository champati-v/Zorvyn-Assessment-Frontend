import * as React from "react";
import { Input } from "@/components/ui/input";
import { Bell, CircleUserRound, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = React.useState(3);

  const themeIcon = theme === "dark" ? Sun : Moon;
  const ThemeIcon = themeIcon;

  return (
    <header className="flex items-center gap-3 border-b p-4">
      <SidebarTrigger className="shrink-0" />
      <Input
        placeholder="Search analytics..."
        className="max-w-sm flex-1 md:flex-none"
      />

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
          aria-label="Toggle theme"
        >
          <ThemeIcon className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => setUnreadNotifications(0)}
          className="relative flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          {unreadNotifications > 0 ? (
            <span className="absolute top-2 right-2 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground">
              {unreadNotifications}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => navigate("/settings")}
          className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
          aria-label="User profile"
        >
          <CircleUserRound className="size-4" />
        </button>
      </div>
    </header>
  );
}
