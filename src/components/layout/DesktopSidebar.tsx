import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  CheckSquare,
  Calendar,
  Settings,
  FileText,
  Timer,
  Sparkles,
  Crown,
  LogOut,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  { href: "/study-plan", icon: BookOpen, labelKey: "nav.studyPlans" },
  { href: "/notes", icon: FileText, labelKey: "nav.notes" },
  { href: "/flashcards", icon: Brain, labelKey: "nav.flashcards" },
  { href: "/tasks", icon: CheckSquare, labelKey: "nav.tasks" },
  { href: "/focus", icon: Timer, labelKey: "nav.focusMode" },
  { href: "/calendar", icon: Calendar, labelKey: "nav.calendar" },
];

const secondaryNavItems = [
  { href: "/ai-tutor", icon: Sparkles, labelKey: "nav.aiTutor", premium: true },
  { href: "/premium", icon: Crown, labelKey: "nav.premium" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
];

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t("common.error"));
    } else {
      navigate("/");
    }
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col glass-strong border-r border-border/30">
      {/* Logo */}
      <div className="flex h-18 items-center gap-3 px-6 py-4 border-b border-border/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-[0_0_20px_hsl(220_100%_60%/0.4)]">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-display font-bold gradient-text">StudyPilot</span>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </div>

        <div className="my-4 h-px bg-border/50" />

        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "gradient-primary text-primary-foreground glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{t(item.labelKey)}</span>
                {item.premium && (
                  <span className="ml-auto rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                    {t("common.pro")}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Sign Out */}
      <div className="border-t border-border/50 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/50"
        >
          <LogOut className="h-5 w-5" />
          <span>{t("common.signOut")}</span>
        </button>
      </div>
    </aside>
  );
}
