import {
  CircleUserRound,
  Check,
  LayoutDashboard,
  Receipt,
  BarChart3,
  Settings,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
} from "lucide-react";
import * as React from "react";
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
} from "@/components/ui/sidebar";

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
  const roleLabel = role === "admin" ? "Admin" : "Viewer";
  const [footerOpen, setFooterOpen] = React.useState(false);
  const footerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
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
      <SidebarHeader className="gap-1 px-4 py-4">
        <div className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          Zorvyn
        </div>
        <div className="text-xs text-sidebar-foreground/70">
          Financial dashboard
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(({ to, icon: Icon, label }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    isActive={location.pathname === to}
                    render={(props) => <NavLink to={to} end {...props} />}
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

      <SidebarFooter className="px-4 pb-4">
        <div ref={footerRef} className="relative">
          <button
            type="button"
            onClick={() => setFooterOpen((open) => !open)}
            className="flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 text-left text-sidebar-foreground shadow-sm outline-none transition-colors hover:bg-sidebar-accent focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <CircleUserRound className="size-9 shrink-0 text-sidebar-foreground" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-sidebar-foreground">
                {roleLabel}
              </div>
              <div className="truncate text-xs text-sidebar-foreground/70">
                admin@zorvyn.com
              </div>
            </div>
            <ChevronDown
              className={`size-4 shrink-0 transition-transform ${
                footerOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {footerOpen ? (
            <div className="absolute bottom-full left-0 right-0 z-20 mb-2 rounded-xl border border-sidebar-border bg-sidebar/95 p-2 shadow-lg ring-1 ring-sidebar-border/60 backdrop-blur-md">
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
                onClick={() => navigate("/settings")}
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
                    onClick={() => setRole(item)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-sidebar-accent ${
                      role === item
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/80"
                    }`}
                  >
                    <span className="flex size-5 items-center justify-center rounded-full border border-sidebar-border bg-sidebar">
                      {role === item ? <Check className="size-3.5" /> : null}
                    </span>
                    {item === "admin" ? "Admin" : "Viewer"}
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
                    onClick={() => setTheme(value)}
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
