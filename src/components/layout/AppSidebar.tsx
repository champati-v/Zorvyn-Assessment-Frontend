import {
  CircleUserRound,
  Check,
  ChartColumnStacked,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useFinanceStore } from "@/store/useFinanceStore";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transactions", icon: Receipt, label: "Transactions" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { role, setRole } = useFinanceStore();
  const { state: sidebarState } = useSidebar();
  const roleLabel = role === "admin" ? "Admin" : "User";
  const [footerOpen, setFooterOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (sidebarState === "collapsed") {
      setFooterOpen(false);
    }
  }, [sidebarState]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        footerRef.current &&
        !footerRef.current.contains(event.target as Node)
      ) {
        setFooterOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFooterOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/35 px-3 py-2 shadow-sm group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0 group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none">
          <div className="flex size-8 items-center justify-center rounded-xl bg-[color-mix(in_oklch,var(--sidebar-foreground)_14%,transparent)] text-sidebar-foreground ring-1 ring-sidebar-border/50 group-data-[collapsible=icon]:size-7">
            <ChartColumnStacked className="size-3.5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              Zorvyn
            </div>
            <div className="text-xs text-sidebar-foreground/70">
              Financial dashboard
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2 py-1">
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ to, icon: Icon, label }, index) => (
                <SidebarMenuItem key={to} className="mb-2">
                  <SidebarMenuButton
                    isActive={location.pathname === to}
                    render={(props) => <NavLink to={to} end {...props} />}
                    className={cn(
                      "rounded-xl transition-colors",
                      index === 0 &&
                        "bg-[color-mix(in_oklch,var(--chart-1)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--chart-1)_14%,transparent)] data-active:bg-[color-mix(in_oklch,var(--chart-1)_16%,transparent)] data-active:text-chart-1",
                      index === 1 &&
                        "bg-[color-mix(in_oklch,var(--chart-2)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--chart-2)_14%,transparent)] data-active:bg-[color-mix(in_oklch,var(--chart-2)_16%,transparent)] data-active:text-chart-2",
                      index === 2 &&
                        "bg-[color-mix(in_oklch,var(--chart-3)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--chart-3)_14%,transparent)] data-active:bg-[color-mix(in_oklch,var(--chart-3)_16%,transparent)] data-active:text-chart-3",
                      index === 3 &&
                        "bg-[color-mix(in_oklch,var(--chart-4)_10%,transparent)] hover:bg-[color-mix(in_oklch,var(--chart-4)_14%,transparent)] data-active:bg-[color-mix(in_oklch,var(--chart-4)_16%,transparent)] data-active:text-chart-4"
                    )}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-4 group-data-[collapsible=icon]:px-2">
        <div ref={footerRef} className="relative">
          <button
            type="button"
            onClick={() => setFooterOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-2xl border border-sidebar-border bg-sidebar-accent/25 px-3 py-2 text-left text-sidebar-foreground shadow-sm outline-none transition-colors hover:bg-sidebar-accent/40 focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:bg-sidebar-accent/20"
          >
            <CircleUserRound className="size-8 shrink-0 text-sidebar-foreground group-data-[collapsible=icon]:size-6 group-data-[collapsible=icon]:text-sidebar-foreground/80" />
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <div className="truncate text-sm font-medium text-sidebar-foreground">
                {roleLabel}
              </div>
              <div className="truncate text-xs text-sidebar-foreground/70">
                admin@zorvyn.com
              </div>
            </div>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform group-data-[collapsible=icon]:hidden",
                footerOpen && "rotate-180"
              )}
            />
          </button>

          {footerOpen ? (
            <div className="absolute z-20 rounded-xl border border-sidebar-border bg-sidebar/95 p-2 shadow-lg ring-1 ring-sidebar-border/60 backdrop-blur-md bottom-full left-0 right-0 mb-2 group-data-[collapsible=icon]:bottom-full group-data-[collapsible=icon]:left-full group-data-[collapsible=icon]:right-auto group-data-[collapsible=icon]:top-auto group-data-[collapsible=icon]:ml-2 group-data-[collapsible=icon]:mb-2 group-data-[collapsible=icon]:w-64">
              <div className="rounded-lg bg-sidebar-accent/30 px-3 py-2">
                <div className="text-sm font-medium text-sidebar-foreground">
                  Username
                </div>
                <div className="text-xs text-sidebar-foreground/70">
                  admin@zorvyn.com
                </div>
              </div>

              <div className="my-2 h-px bg-sidebar-border" />

              <button
                type="button"
                onClick={() => {
                  setFooterOpen(false);
                  navigate("/settings");
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
              >
                <Settings className="size-4" />
                Settings
              </button>

              <div className="mt-2 px-2 pb-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">
                Change role
              </div>
              <div className="grid gap-1 px-1">
                {(["admin", "viewer"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setRole(item);
                      setFooterOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent ${
                      role === item
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/80"
                    }`}
                  >
                    <span className="flex size-5 items-center justify-center rounded-full border border-sidebar-border bg-sidebar">
                      {role === item ? <Check className="size-3.5" /> : null}
                    </span>
                    {item === "admin" ? "Admin" : "User"}
                  </button>
                ))}
              </div>

              <div className="mt-2 px-2 pb-1 text-xs font-medium uppercase tracking-wide text-sidebar-foreground/60">
                Theme
              </div>
              <div className="grid gap-1 px-1">
                {[
                  { value: "light", label: "Light", icon: Sun },
                  { value: "dark", label: "Dark", icon: Moon },
                  { value: "system", label: "System", icon: Monitor },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTheme(value);
                      setFooterOpen(false);
                    }}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent ${
                      theme === value
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/80"
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
