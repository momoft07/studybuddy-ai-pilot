import { useState, useEffect } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const NOTIFICATIONS_KEY = "studypilot-notifications";

interface NotificationSettings {
  push: boolean;
  emailDigest: boolean;
}

export function NotificationsSection() {
  const [settings, setSettings] = useState<NotificationSettings>({
    push: false,
    emailDigest: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(newSettings));
    
    toast({
      title: "Settings saved",
      description: `${key === "push" ? "Push notifications" : "Email digest"} ${value ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-success p-2">
          <Bell className="h-5 w-5 text-success-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Notifications</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Push Notifications</span>
              <p className="text-xs text-muted-foreground">
                Get notified about study reminders
              </p>
            </div>
          </div>
          <Switch
            checked={settings.push}
            onCheckedChange={(checked) => updateSetting("push", checked)}
          />
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">Email Digest</span>
              <p className="text-xs text-muted-foreground">
                Weekly summary of your progress
              </p>
            </div>
          </div>
          <Switch
            checked={settings.emailDigest}
            onCheckedChange={(checked) => updateSetting("emailDigest", checked)}
          />
        </div>
      </div>
    </GlassCard>
  );
}
