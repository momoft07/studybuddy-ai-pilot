import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/hooks/useAuth";
import { Settings as SettingsIcon, User, Bell, Palette, LogOut } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const { user, signOut } = useAuth();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <h1 className="text-2xl font-display font-bold"><span className="gradient-text">Settings</span></h1>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg gradient-primary p-2"><User className="h-5 w-5 text-primary-foreground" /></div>
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <p className="text-sm text-muted-foreground">Email: {user?.email}</p>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg gradient-accent p-2"><Palette className="h-5 w-5 text-accent-foreground" /></div>
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Dark Mode</span>
            <Switch defaultChecked />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-success p-2"><Bell className="h-5 w-5 text-success-foreground" /></div>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Push Notifications</span>
            <Switch />
          </div>
        </GlassCard>
        <GradientButton variant="outline" className="w-full" onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </GradientButton>
      </div>
    </AppLayout>
  );
}
