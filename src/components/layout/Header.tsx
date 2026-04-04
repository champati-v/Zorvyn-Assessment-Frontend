import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  CircleUserRound,
  LayoutDashboard,
  Moon,
  Search,
  Receipt,
  Settings,
  Sun,
  Bell,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

type SearchItem = {
  label: string;
  description: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

const searchItems: SearchItem[] = [
  {
    label: "Dashboard",
    description: "Open the main overview and summary cards.",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Transactions",
    description: "Browse, filter, and manage the transaction ledger.",
    to: "/transactions",
    icon: Receipt,
  },
  {
    label: "Insights",
    description: "Review trends, monthly snapshots, and spending mix.",
    to: "/insights",
    icon: BarChart3,
  },
  {
    label: "Settings",
    description: "Adjust role, theme, and export preferences.",
    to: "/settings",
    icon: Settings,
  },
];

function matchesSearch(item: SearchItem, query: string) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return (
    item.label.toLowerCase().includes(normalized) ||
    item.description.toLowerCase().includes(normalized)
  );
}

export default function Header() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const themeIcon = theme === "dark" ? Sun : Moon;
  const ThemeIcon = themeIcon;
  const filteredItems = searchItems.filter((item) =>
    matchesSearch(item, searchQuery)
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!searchOpen) {
      setSearchQuery("");
    }
  }, [searchOpen]);

  const goTo = (to: string) => {
    navigate(to);
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/95 p-4 backdrop-blur supports-backdrop-filter:bg-background/80">
        <SidebarTrigger className="shrink-0" />

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-2xl"
          )}
          aria-label="Open search"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate">
            Search sections, settings, and transactions
          </span>
          <span className="hidden items-center gap-1 md:flex">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted md:hidden"
          aria-label="Open search"
        >
          <Search className="size-4" />
        </button>

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
            className="relative flex size-9 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute top-0.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium leading-4 text-primary-foreground">
              3
            </span>
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

      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent
          side="right"
          className="overflow-hidden p-0 data-[side=right]:left-1/2 data-[side=right]:top-1/2 data-[side=right]:right-auto data-[side=right]:bottom-auto data-[side=right]:h-auto data-[side=right]:w-[min(92vw,48rem)] data-[side=right]:max-h-[80vh] data-[side=right]:-translate-x-1/2 data-[side=right]:-translate-y-1/2 data-[side=right]:rounded-3xl data-[side=right]:border data-[side=right]:shadow-2xl"
        >
          <div className="flex w-full flex-col gap-4 overflow-hidden px-4 py-5">
            <SheetHeader className="px-0 pb-0">
              <SheetTitle>Quick search</SheetTitle>
              <SheetDescription>
                Jump between dashboard sections with a keyboard-first search.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search Dashboard, Transactions, Insights, Settings..."
                  className="h-10 pl-9 pr-20"
                />
                <div className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 items-center gap-1 md:flex">
                  <Kbd>Esc</Kbd>
                </div>
              </div>

              <div className="grid gap-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const Icon = item.icon;
                    const active = location.pathname === item.to;

                    return (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => goTo(item.to)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                          active
                            ? "border-primary/20 bg-primary/8"
                            : "border-border/70 bg-background/70 hover:bg-muted/60"
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border",
                            active
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "border-border/70 bg-background text-muted-foreground"
                          )}
                        >
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {item.label}
                            </span>
                            {active ? (
                              <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                Open
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 bg-background/70 p-6 text-sm text-muted-foreground">
                    No sections match this search.
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1">
                  <Kbd>Ctrl</Kbd>
                  <span>+</span>
                  <Kbd>K</Kbd>
                  <span>to open</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1">
                  <Kbd>Esc</Kbd>
                  <span>to close</span>
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
