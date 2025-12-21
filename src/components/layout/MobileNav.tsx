import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  CheckSquare,
  Menu,
  FileText,
  Timer,
  Calendar,
  Sparkles,
  Crown,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "nav.home" },
  { href: "/study-plan", icon: BookOpen, labelKey: "nav.plan" },
  { href: "/flashcards", icon: Brain, labelKey: "nav.cards" },
  { href: "/tasks", icon: CheckSquare, labelKey: "nav.tasks" },
];

const moreNavItems = [
  { href: "/notes", icon: FileText, labelKey: "nav.notes" },
  { href: "/focus", icon: Timer, labelKey: "nav.focusMode" },
  { href: "/calendar", icon: Calendar, labelKey: "nav.calendar" },
  { href: "/ai-tutor", icon: Sparkles, labelKey: "nav.aiTutor", premium: true },
  { href: "/premium", icon: Crown, labelKey: "nav.premium" },
  { href: "/settings", icon: Settings, labelKey: "nav.settings" },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(t("common.error"));
    } else {
      setIsMenuOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      {/* Overlay Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 glass-strong border-t border-border/50 rounded-t-2xl p-4 pb-24 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">{t("nav.more")}</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {moreNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl p-3 text-xs font-medium transition-all duration-200",
                      isActive
                        ? "gradient-primary text-primary-foreground glow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-center">{t(item.labelKey)}</span>
                    {item.premium && (
                      <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] text-accent">
                        {t("common.pro")}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 mt-4 rounded-xl p-3 text-sm font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/50"
            >
              <LogOut className="h-5 w-5" />
              <span>{t("common.signOut")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/50 safe-bottom md:hidden">
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
          
          {/* More Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200",
              moreNavItems.some(item => location.pathname === item.href)
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div
              className={cn(
                "rounded-lg p-1.5 transition-all duration-200",
                moreNavItems.some(item => location.pathname === item.href) && "gradient-primary glow-sm"
              )}
            >
              <Menu
                className={cn(
                  "h-5 w-5 transition-all",
                  moreNavItems.some(item => location.pathname === item.href) && "text-primary-foreground"
                )}
              />
            </div>
            <span>{t("nav.more")}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
