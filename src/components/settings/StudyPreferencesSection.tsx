import { useState, useEffect } from "react";
import { BookOpen, Target, Clock, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface StudyPreferencesSectionProps {
  userId: string;
  initialWeeklyHours?: number | null;
  initialStudyPreference?: string | null;
  onUpdate: () => void;
}

const studyStyles = [
  {
    value: "intensive",
    label: "Intensive",
    description: "Long focused sessions",
    icon: "🔥",
  },
  {
    value: "balanced",
    label: "Balanced",
    description: "Mix of focus & breaks",
    icon: "⚖️",
  },
  {
    value: "relaxed",
    label: "Relaxed",
    description: "Short sessions, more breaks",
    icon: "🌿",
  },
];

export function StudyPreferencesSection({
  userId,
  initialWeeklyHours,
  initialStudyPreference,
  onUpdate,
}: StudyPreferencesSectionProps) {
  const [weeklyHours, setWeeklyHours] = useState(initialWeeklyHours ?? 20);
  const [studyPreference, setStudyPreference] = useState(
    initialStudyPreference ?? "balanced"
  );
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Debounced save for slider
  useEffect(() => {
    const timer = setTimeout(() => {
      if (weeklyHours !== initialWeeklyHours) {
        savePreferences({ weekly_study_hours: weeklyHours });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [weeklyHours]);

  const savePreferences = async (updates: Record<string, any>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Preferences saved",
        description: "Your study preferences have been updated.",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStudyStyleChange = (value: string) => {
    setStudyPreference(value);
    savePreferences({ study_preference: value });
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg gradient-teal p-2">
          <BookOpen className="h-5 w-5 text-secondary-foreground" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">Study Preferences</h2>
          <p className="text-xs text-muted-foreground">
            Customize your learning experience
          </p>
        </div>
        {isSaving && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="space-y-6">
        {/* Weekly Study Goal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Weekly Study Goal</Label>
            </div>
            <span className="text-sm font-bold gradient-text">
              {weeklyHours} hrs/week
            </span>
          </div>
          <Slider
            value={[weeklyHours]}
            onValueChange={([value]) => setWeeklyHours(value)}
            min={5}
            max={60}
            step={5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5 hrs</span>
            <span>Light</span>
            <span>Moderate</span>
            <span>Intensive</span>
            <span>60 hrs</span>
          </div>
        </div>

        {/* Study Style */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Label className="text-sm font-medium">Study Style</Label>
          </div>
          <RadioGroup
            value={studyPreference}
            onValueChange={handleStudyStyleChange}
            className="grid grid-cols-3 gap-3"
          >
            {studyStyles.map((style) => (
              <Label
                key={style.value}
                htmlFor={style.value}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  studyPreference === style.value
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-muted-foreground/50"
                )}
              >
                <RadioGroupItem
                  value={style.value}
                  id={style.value}
                  className="sr-only"
                />
                <span className="text-2xl">{style.icon}</span>
                <span className="text-sm font-medium">{style.label}</span>
                <span className="text-xs text-muted-foreground text-center">
                  {style.description}
                </span>
              </Label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </GlassCard>
  );
}
