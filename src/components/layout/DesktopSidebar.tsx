import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/study-plan", icon: BookOpen, label: "Study Plans" },
  { href: "/notes", icon: FileText, label: "Notes" },
  { href: "/flashcards", icon: Brain, label: "Flashcards" },
  { href: "/tasks", icon: CheckSquare, label: "Tasks" },
  { href: "/focus", icon: Timer, label: "Focus Mode" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
];

const secondaryNavItems = [
  { href: "/ai-tutor", icon: Sparkles, label: "AI Tutor", premium: true },
  { href: "/premium", icon: Crown, label: "Premium" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function DesktopSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error signing out");
    } else {
      navigate("/");
    }
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 flex-col glass-strong border-r border-border/50">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-border/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
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
                <span>{item.label}</span>
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
                <span>{item.label}</span>
                {item.premium && (
                  <span className="ml-auto rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                    PRO
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
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
