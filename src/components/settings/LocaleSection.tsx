import { useState, useEffect } from "react";
import { Globe, Languages } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const LOCALE_KEY = "studypilot-locale";

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Chicago", label: "Chicago (CST/CDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

const languages = [
  { value: "en", label: "English", flag: "🇬🇧" },
  { value: "de", label: "Deutsch", flag: "🇩🇪" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
  { value: "it", label: "Italiano", flag: "🇮🇹" },
  { value: "pt", label: "Português", flag: "🇵🇹" },
  { value: "zh", label: "中文", flag: "🇨🇳" },
  { value: "ja", label: "日本語", flag: "🇯🇵" },
];

interface LocaleSettings {
  timezone: string;
  language: string;
}

export function LocaleSection() {
  const [settings, setSettings] = useState<LocaleSettings>({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    language: "en",
  });
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  const updateSetting = (key: keyof LocaleSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(LOCALE_KEY, JSON.stringify(newSettings));

    toast({
      title: "Settings saved",
      description: key === "timezone" 
        ? "Timezone updated. Times will reflect your selection."
        : "Language preference saved.",
    });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-secondary p-2">
          <Globe className="h-5 w-5 text-secondary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Region & Language</h2>
      </div>

      <div className="space-y-5">
        {/* Timezone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            Timezone
          </Label>
          <Select
            value={settings.timezone}
            onValueChange={(value) => updateSetting("timezone", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Used for calendar events and study reminders
          </p>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            Language
          </Label>
          <Select
            value={settings.language}
            onValueChange={(value) => updateSetting("language", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            App interface language (coming soon)
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
