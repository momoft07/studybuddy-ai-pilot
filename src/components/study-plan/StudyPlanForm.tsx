import { useMemo } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  Loader2,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { StudyPlanFormData } from "@/hooks/useStudyPlanSettings";

interface FormErrors {
  courseName?: string;
  examDate?: string;
  weeklyHours?: string;
  studyStyle?: string;
}

interface StudyPlanFormProps {
  formData: StudyPlanFormData;
  onUpdateFormData: (updates: Partial<StudyPlanFormData>) => void;
  onSubmit: () => void;
  loading: boolean;
  errors: FormErrors;
  touched: Record<string, boolean>;
  onBlur: (field: string) => void;
}

export function StudyPlanForm({
  formData,
  onUpdateFormData,
  onSubmit,
  loading,
  errors,
  touched,
  onBlur,
}: StudyPlanFormProps) {
  const isFormValid = useMemo(() => {
    return (
      formData.courseName.trim() !== "" &&
      formData.examDate !== "" &&
      new Date(formData.examDate) > new Date() &&
      formData.studyStyle !== "" &&
      parseInt(formData.weeklyHours) >= 1 &&
      parseInt(formData.weeklyHours) <= 100
    );
  }, [formData]);

  const showError = (field: keyof FormErrors) => touched[field] && errors[field];

  return (
    <GlassCard className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg gradient-primary p-2">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold">Course Details</h2>
        </div>

        <div className="space-y-4">
          {/* Course Name */}
          <div className="space-y-2">
            <Label htmlFor="courseName" className="flex items-center gap-1">
              Course Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="courseName"
              placeholder="e.g., Introduction to Psychology (required)"
              value={formData.courseName}
              onChange={(e) => onUpdateFormData({ courseName: e.target.value })}
              onBlur={() => onBlur("courseName")}
              aria-describedby="courseName-error"
              aria-invalid={!!showError("courseName")}
              className={showError("courseName") ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {showError("courseName") && (
              <p id="courseName-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.courseName}
              </p>
            )}
          </div>

          {/* Exam Date */}
          <div className="space-y-2">
            <Label htmlFor="examDate" className="flex items-center gap-1">
              Exam Date <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="examDate"
                type="date"
                className={`pl-10 ${showError("examDate") ? "border-destructive focus-visible:ring-destructive" : ""}`}
                value={formData.examDate}
                onChange={(e) => onUpdateFormData({ examDate: e.target.value })}
                onBlur={() => onBlur("examDate")}
                min={new Date().toISOString().split("T")[0]}
                aria-describedby="examDate-error"
                aria-invalid={!!showError("examDate")}
              />
            </div>
            {showError("examDate") && (
              <p id="examDate-error" className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.examDate}
              </p>
            )}
          </div>

          {/* Weekly Hours */}
          <div className="space-y-2">
            <Label htmlFor="weeklyHours" className="flex items-center gap-1">
              Weekly Study Hours <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Select
                value={formData.weeklyHours}
                onValueChange={(value) => onUpdateFormData({ weeklyHours: value })}
              >
                <SelectTrigger className="pl-10" id="weeklyHours">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 hours</SelectItem>
                  <SelectItem value="10">10 hours</SelectItem>
                  <SelectItem value="15">15 hours</SelectItem>
                  <SelectItem value="20">20 hours</SelectItem>
                  <SelectItem value="25">25 hours</SelectItem>
                  <SelectItem value="30">30+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Study Style */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="studyStyle" className="flex items-center gap-1">
                Study Style <span className="text-destructive">*</span>
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p><strong>Intensive:</strong> Longer study blocks (90+ min) with fewer breaks</p>
                    <p><strong>Balanced:</strong> Mix of 45-60 min sessions with regular breaks</p>
                    <p><strong>Light:</strong> Shorter 20-30 min sessions, more frequent</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={formData.studyStyle}
              onValueChange={(value) => onUpdateFormData({ studyStyle: value })}
            >
              <SelectTrigger id="studyStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intensive">Intensive (longer sessions)</SelectItem>
                <SelectItem value="balanced">Balanced (mix of long and short)</SelectItem>
                <SelectItem value="light">Light (shorter, frequent sessions)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="topics">Key Topics (optional)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Enter comma-separated topics to prioritize (e.g., "Memory, Cognition, Neurotransmitters")</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="topics"
              placeholder="Optional: Enter topics to focus on first..."
              value={formData.topics}
              onChange={(e) => onUpdateFormData({ topics: e.target.value })}
              rows={3}
              aria-describedby="topics-hint"
            />
            <p id="topics-hint" className="text-xs text-muted-foreground">
              Separate multiple topics with commas
            </p>
          </div>

          {/* Remember Settings */}
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="rememberSettings"
              checked={formData.rememberSettings}
              onCheckedChange={(checked) =>
                onUpdateFormData({ rememberSettings: checked as boolean })
              }
            />
            <Label
              htmlFor="rememberSettings"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Remember my settings for next time
            </Label>
          </div>

          {/* Submit Button */}
          <GradientButton
            className="w-full mt-4"
            onClick={onSubmit}
            disabled={loading || !isFormValid}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating your plan...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Study Plan
              </>
            )}
          </GradientButton>
        </div>
      </div>
    </GlassCard>
  );
}
