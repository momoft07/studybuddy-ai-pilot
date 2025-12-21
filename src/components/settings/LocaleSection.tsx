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
import { useTranslation } from "react-i18next";

const timezones = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
  { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
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
  { value: "nl", label: "Nederlands", flag: "🇳🇱" },
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "es", label: "Español", flag: "🇪🇸" },
];

export function LocaleSection() {
  const { t, i18n } = useTranslation();
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem("studypilot-timezone") || 
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const { toast } = useToast();

  const currentLanguage = i18n.language?.split("-")[0] || "en";

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    localStorage.setItem("studypilot-timezone", value);
    toast({
      title: t("settings.notifications.saved"),
      description: t("settings.locale.timezoneDesc"),
    });
  };

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("studypilot-language", value);
    toast({
      title: t("settings.notifications.saved"),
      description: `Language changed to ${languages.find(l => l.value === value)?.label}`,
    });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-secondary p-2">
          <Globe className="h-5 w-5 text-secondary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">{t("settings.locale.title")}</h2>
      </div>

      <div className="space-y-5">
        {/* Timezone */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {t("settings.locale.timezone")}
          </Label>
          <Select value={timezone} onValueChange={handleTimezoneChange}>
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
            {t("settings.locale.timezoneDesc")}
          </p>
        </div>

        {/* Language */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Languages className="h-4 w-4 text-muted-foreground" />
            {t("settings.locale.language")}
          </Label>
          <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
            {t("settings.locale.languageDesc")}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
