import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  CheckSquare,
  Calendar,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.home" },
  { href: "/study-plan", icon: BookOpen, labelKey: "nav.plan" },
  { href: "/flashcards", icon: Brain, labelKey: "nav.cards" },
  { href: "/tasks", icon: CheckSquare, labelKey: "nav.tasks" },
  { href: "/calendar", icon: Calendar, labelKey: "nav.calendar" },
];

export function MobileNav() {
  const location = useLocation();
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border/50 safe-bottom md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-1.5 transition-all duration-200",
                  isActive && "gradient-primary glow-sm"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    isActive && "text-primary-foreground"
                  )}
                />
              </div>
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
