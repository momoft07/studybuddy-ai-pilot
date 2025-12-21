import { useState } from "react";
import { Link2, Calendar, Chrome, Apple, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  connected: boolean;
  comingSoon?: boolean;
}

export function IntegrationsSection() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<string | null>(null);

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "google-calendar",
      name: t("settings.integrations.googleCalendar"),
      description: t("settings.integrations.googleCalendarDesc"),
      icon: <Calendar className="h-5 w-5" />,
      connected: false,
      comingSoon: true,
    },
    {
      id: "google-signin",
      name: "Google Sign-In",
      description: "Sign in with your Google account",
      icon: <Chrome className="h-5 w-5" />,
      connected: false,
      comingSoon: true,
    },
    {
      id: "apple-signin",
      name: "Apple Sign-In",
      description: "Sign in with your Apple ID",
      icon: <Apple className="h-5 w-5" />,
      connected: false,
      comingSoon: true,
    },
  ]);

  const handleConnect = async (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (integration?.comingSoon) {
      toast({
        title: t("common.comingSoon"),
        description: `${integration.name} integration will be available soon.`,
      });
      return;
    }

    setConnecting(id);
    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
    
    toast({
      title: integration?.connected ? "Disconnected" : "Connected",
      description: `${integration?.name} has been ${
        integration?.connected ? "disconnected" : "connected"
      }.`,
    });
    setConnecting(null);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg gradient-teal p-2">
          <Link2 className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t("settings.integrations.title")}</h2>
          <p className="text-xs text-muted-foreground">
            {t("settings.integrations.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={cn(
              "flex items-center justify-between py-3 px-4 rounded-xl border transition-colors",
              integration.connected
                ? "border-success/50 bg-success/5"
                : "border-border"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  integration.connected ? "bg-success/20" : "bg-muted"
                )}
              >
                {integration.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{integration.name}</span>
                  {integration.comingSoon && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      {t("common.comingSoon")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {integration.description}
                </p>
              </div>
            </div>
            <Button
              variant={integration.connected ? "outline" : "default"}
              size="sm"
              onClick={() => handleConnect(integration.id)}
              disabled={connecting === integration.id}
              className={cn(
                integration.connected &&
                  "border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              )}
            >
              {connecting === integration.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : integration.connected ? (
                t("settings.integrations.disconnect")
              ) : (
                t("settings.integrations.connect")
              )}
            </Button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
