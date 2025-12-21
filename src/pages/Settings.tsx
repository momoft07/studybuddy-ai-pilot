import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/hooks/useAuth";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut, Shield, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-display font-bold md:text-3xl">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg gradient-primary p-2 glow-sm">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Account Status</span>
              <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">Active</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg gradient-accent p-2 glow-accent-sm">
              <Palette className="h-5 w-5 text-accent-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-medium">Dark Mode</span>
              <p className="text-xs text-muted-foreground">Use dark theme across the app</p>
            </div>
            <Switch defaultChecked />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-success p-2">
              <Bell className="h-5 w-5 text-success-foreground" />
            </div>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium">Push Notifications</span>
                <p className="text-xs text-muted-foreground">Get notified about study reminders</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-sm font-medium">Email Digest</span>
                <p className="text-xs text-muted-foreground">Weekly summary of your progress</p>
              </div>
              <Switch />
            </div>
          </div>
        </GlassCard>

        <Link to="/premium">
          <GlassCard variant="neon" hover className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg gradient-accent p-2 glow-accent">
                  <Sparkles className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Upgrade to Premium</h2>
                  <p className="text-sm text-muted-foreground">Unlock all features</p>
                </div>
              </div>
              <span className="text-sm font-bold gradient-text">€5/mo</span>
            </div>
          </GlassCard>
        </Link>

        <GradientButton variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </GradientButton>
      </div>
    </AppLayout>
  );
}
