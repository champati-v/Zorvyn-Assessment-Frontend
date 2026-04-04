import * as React from "react";
import {
  Check,
  LayoutGrid,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  UserRound,
} from "lucide-react";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useFinanceStore, type Role } from "@/store/useFinanceStore";
import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions: Array<{
  value: ThemeOption;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: "light",
    label: "Light",
    description: "Bright canvas with higher contrast accents.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Low-light mode tuned for extended analysis.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow the device preference automatically.",
    icon: Monitor,
  },
];

const roleOptions: Array<{
  value: Role;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: "admin",
    label: "Admin",
    description: "Can manage transactions and workspace data.",
    icon: Shield,
  },
  {
    value: "viewer",
    label: "User",
    description: "Read-only access for browsing and insights.",
    icon: UserRound,
  },
];

function roleLabel(role: Role) {
  return role === "admin" ? "Admin" : "User";
}

function themeLabel(theme: string | undefined, resolvedTheme: string | undefined) {
  if (!theme || theme === "system") {
    return `System (${resolvedTheme === "dark" ? "Dark" : "Light"})`;
  }

  return theme === "dark" ? "Dark" : "Light";
}

function ProfileBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-medium">{value}</div>
    </div>
  );
}

export default function SettingsPageContent() {
  const { role, setRole } = useFinanceStore();
  const { theme, setTheme, resolvedTheme } = useTheme();

  const activeTheme = theme ?? "system";
  const themeDisplay = themeLabel(theme, resolvedTheme);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border/70 bg-linear-to-br from-card via-card to-muted/30 shadow-sm">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 p-6 md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Palette className="size-3.5 text-chart-1" />
              Workspace preferences and account controls
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Tune the dashboard experience, switch between Admin and User
                access, and manage your app&apos;s theme.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Shield className="size-3.5" />
                {roleLabel(role)} access
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sun className="size-3.5" />
                {themeDisplay} theme
              </div>
            </div>
          </div>

          <div className="border-t border-border/70 bg-background/50 p-6 md:p-8 lg:border-l lg:border-t-0">
            <Card className="h-full border-border/70 bg-card/90 shadow-none">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-muted/40">
                    <UserRound className="size-7 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-lg font-semibold tracking-tight">
                      Vibekananda Champati
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      admin@zorvyn.com
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {roleLabel(role)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-3 sm:grid-cols-2">
                  <ProfileBadge label="Workspace" value="Zorvyn Finance" />
                  <ProfileBadge label="Storage" value="Local sync enabled" />
                  <ProfileBadge label="Theme" value={themeDisplay} />
                  <ProfileBadge label="Role" value={roleLabel(role)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="size-4 text-chart-2" />
              Access level
            </CardTitle>
            <CardDescription>
              Choose whether this dashboard behaves like an Admin workspace or a
              User view.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              const active = role === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRole(option.value)}
                  className={cn(
                    "flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors",
                    active
                      ? "border-primary/20 bg-primary/8"
                      : "border-border/70 bg-background/60 hover:bg-muted/50"
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
                      <div className="text-sm font-medium">{option.label}</div>
                      {active ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          <Check className="size-3" />
                          Active
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-card/90 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-4 text-chart-1" />
              Appearance
            </CardTitle>
            <CardDescription>
              Switch the app between light, dark, and system-aware themes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                const active = activeTheme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition-colors",
                      active
                        ? "border-primary/20 bg-primary/8"
                        : "border-border/70 bg-background/60 hover:bg-muted/50"
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border",
                        active
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-border/70 bg-background text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="mt-3 text-sm font-medium">{option.label}</div>
                    <div className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {option.description}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-border/70 bg-linear-to-r from-background/80 via-muted/20 to-background/80 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Current theme
                  </div>
                  <div className="mt-1 text-sm font-medium">{themeDisplay}</div>
                </div>
                <LayoutGrid className="size-5 text-muted-foreground" />
              </div>
              <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
                Header controls and sidebar quick actions stay in sync with the
                active theme choice.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
