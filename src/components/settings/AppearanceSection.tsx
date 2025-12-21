import { Palette, Monitor, Moon, Sun } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

export function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg gradient-accent p-2 glow-accent-sm">
          <Palette className="h-5 w-5 text-accent-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Appearance</h2>
      </div>

      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Sun className="h-4 w-4 text-warning" />
            )}
            <div>
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-muted-foreground">
                Use dark theme across the app
              </p>
            </div>
          </div>
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>

        {/* Theme Preview Cards */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200",
              !isDark
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Sun className="h-4 w-4" />
              <span className="text-sm font-medium">Light</span>
            </div>
            <div className="h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300" />
          </button>

          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "p-4 rounded-xl border-2 transition-all duration-200",
              isDark
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4" />
              <span className="text-sm font-medium">Dark</span>
            </div>
            <div className="h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
