import { Accessibility, Type, Zap, Eye } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useAccessibility } from "@/hooks/useAccessibility";
import { cn } from "@/lib/utils";

const fontSizes = [
  { value: "small", label: "small", scale: 0.875 },
  { value: "medium", label: "medium", scale: 1 },
  { value: "large", label: "large", scale: 1.125 },
  { value: "extra-large", label: "extraLarge", scale: 1.25 },
];

export function AccessibilitySection() {
  const { t } = useTranslation();
  const { settings, updateSetting } = useAccessibility();
  const { toast } = useToast();

  const handleUpdate = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
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
            onValueChange={(value) => handleUpdate("fontSize", value)}
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
                  style={{ fontSize: `${size.scale * 14}px` }}
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
            onCheckedChange={(checked) => handleUpdate("reducedMotion", checked)}
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
            onCheckedChange={(checked) => handleUpdate("highContrast", checked)}
          />
        </div>
      </div>
    </GlassCard>
  );
}
