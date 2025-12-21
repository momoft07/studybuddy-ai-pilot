import { useState, useEffect } from "react";
import { Accessibility, Type, Zap, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const ACCESSIBILITY_KEY = "studypilot-accessibility";

interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large" | "xl";
  reducedMotion: boolean;
  highContrast: boolean;
}

const fontSizes = [
  { value: "small", scale: "0.875", label: "small" },
  { value: "medium", scale: "1", label: "medium" },
  { value: "large", scale: "1.125", label: "large" },
  { value: "xl", scale: "1.25", label: "extraLarge" },
];

export function AccessibilitySection() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: "medium",
    reducedMotion: false,
    highContrast: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem(ACCESSIBILITY_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings(parsed);
        applySettings(parsed);
      } catch {
        // ignore
      }
    }
  }, []);

  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Apply font size
    const fontScale = fontSizes.find((f) => f.value === s.fontSize)?.scale || "1";
    root.style.setProperty("--font-scale", fontScale);
    root.style.fontSize = `${parseFloat(fontScale) * 100}%`;

    // Apply reduced motion
    if (s.reducedMotion) {
      root.classList.add("reduce-motion");
    } else {
      root.classList.remove("reduce-motion");
    }

    // Apply high contrast
    if (s.highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }
  };

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(newSettings));
    applySettings(newSettings);

    toast({
      title: t("notifications.saved"),
      description: t("settings.accessibility.title"),
    });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg bg-accent/20 p-2">
          <Accessibility className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t("settings.accessibility.title")}</h2>
          <p className="text-xs text-muted-foreground">
            {t("settings.accessibility.subtitle")}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Font Size */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Type className="h-4 w-4 text-muted-foreground" />
            {t("settings.accessibility.fontSize")}
          </Label>
          <RadioGroup
            value={settings.fontSize}
            onValueChange={(value) =>
              updateSetting("fontSize", value as AccessibilitySettings["fontSize"])
            }
            className="grid grid-cols-4 gap-2"
          >
            {fontSizes.map((size) => (
              <Label
                key={size.value}
                htmlFor={`font-${size.value}`}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all text-center",
                  settings.fontSize === size.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                <RadioGroupItem
                  value={size.value}
                  id={`font-${size.value}`}
                  className="sr-only"
                />
                <span
                  className="font-semibold"
                  style={{ fontSize: `${parseFloat(size.scale) * 14}px` }}
                >
                  Aa
                </span>
                <span className="text-xs text-muted-foreground">
                  {t(`settings.accessibility.${size.label}`)}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Reduced Motion */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">
                {t("settings.accessibility.reducedMotion")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("settings.accessibility.reducedMotionDesc")}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.reducedMotion}
            onCheckedChange={(checked) => updateSetting("reducedMotion", checked)}
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-sm font-medium">
                {t("settings.accessibility.highContrast")}
              </span>
              <p className="text-xs text-muted-foreground">
                {t("settings.accessibility.highContrastDesc")}
              </p>
            </div>
          </div>
          <Switch
            checked={settings.highContrast}
            onCheckedChange={(checked) => updateSetting("highContrast", checked)}
          />
        </div>
      </div>
    </GlassCard>
  );
}
