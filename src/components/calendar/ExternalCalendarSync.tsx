import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar, Link2, Loader2, Check } from "lucide-react";

interface CalendarConnection {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  color: string;
}

export function ExternalCalendarSync() {
  const [calendars, setCalendars] = useState<CalendarConnection[]>([
    {
      id: "google",
      name: "Google Calendar",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      connected: false,
      color: "bg-blue-500/10 border-blue-500/30",
    },
    {
      id: "outlook",
      name: "Outlook Calendar",
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#0078D4"
            d="M24 7.387v10.478c0 .23-.08.424-.238.576-.16.154-.352.232-.578.232h-8.66V6.58h8.66c.226 0 .418.077.578.23.159.153.238.347.238.577z"
          />
          <path
            fill="#0078D4"
            d="M14.524 6.58v12.094H5.667c-.2 0-.37-.07-.512-.21a.689.689 0 0 1-.213-.51V7.298c0-.2.07-.37.213-.51.142-.14.312-.21.512-.21h8.857z"
          />
          <path
            fill="#28A8EA"
            d="M14.524 11.588v3.75H9.86v-3.75h4.664z"
          />
          <path
            fill="#0078D4"
            d="M9.047 4v16l-9-2.667V6.667L9.047 4z"
          />
          <path
            fill="#fff"
            d="M5.714 9.333c-.666 0-1.19.524-1.19 1.19v2.954c0 .666.524 1.19 1.19 1.19s1.19-.524 1.19-1.19v-2.953c0-.667-.524-1.191-1.19-1.191z"
          />
        </svg>
      ),
      connected: false,
      color: "bg-sky-500/10 border-sky-500/30",
    },
  ]);

  const [connecting, setConnecting] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    const calendar = calendars.find((c) => c.id === id);
    if (!calendar) return;

    if (calendar.connected) {
      // Disconnect
      setCalendars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, connected: false } : c))
      );
      toast.success(`${calendar.name} disconnected`);
    } else {
      // Connect (simulated)
      setConnecting(id);
      
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setCalendars((prev) =>
        prev.map((c) => (c.id === id ? { ...c, connected: true } : c))
      );
      setConnecting(null);
      toast.success(`${calendar.name} connected! Syncing events...`);
    }
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-lg bg-primary/20 p-2">
          <Link2 className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Sync External Calendars</h3>
          <p className="text-xs text-muted-foreground">
            Import classes & exams automatically
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {calendars.map((calendar) => (
          <div
            key={calendar.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${calendar.color}`}
          >
            <div className="flex items-center gap-3">
              {calendar.icon}
              <div>
                <p className="text-sm font-medium">{calendar.name}</p>
                <p className="text-xs text-muted-foreground">
                  {calendar.connected ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <Check className="h-3 w-3" /> Synced
                    </span>
                  ) : (
                    "Not connected"
                  )}
                </p>
              </div>
            </div>
            
            {connecting === calendar.id ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={calendar.connected}
                onCheckedChange={() => handleToggle(calendar.id)}
              />
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Connected calendars will auto-import your schedule
      </p>
    </GlassCard>
  );
}
