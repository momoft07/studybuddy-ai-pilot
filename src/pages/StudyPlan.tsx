import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/glass-card";
import { GradientButton } from "@/components/ui/gradient-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BookOpen,
  Sparkles,
  Calendar,
  Clock,
  Plus,
  Loader2,
  Target,
} from "lucide-react";

export default function StudyPlanPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseName: "",
    examDate: "",
    weeklyHours: "10",
    studyStyle: "balanced",
    topics: "",
  });

  const handleGeneratePlan = async () => {
    if (!formData.courseName || !formData.examDate) {
      toast.error("Please fill in the course name and exam date");
      return;
    }

    setLoading(true);
    toast.info("AI Study Plan generation coming soon! This feature will use Lovable AI.");
    
    // TODO: Implement AI study plan generation
    setTimeout(() => {
      setLoading(false);
      toast.success("Study plan feature will be implemented with Lovable AI!");
    }, 2000);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold md:text-3xl">
            <span className="gradient-text">AI Study Plan</span> Creator
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate a personalized study plan powered by AI
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <GlassCard className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg gradient-primary p-2">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <h2 className="text-lg font-semibold">Course Details</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    placeholder="e.g., Introduction to Psychology"
                    value={formData.courseName}
                    onChange={(e) =>
                      setFormData({ ...formData, courseName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="examDate"
                      type="date"
                      className="pl-10"
                      value={formData.examDate}
                      onChange={(e) =>
                        setFormData({ ...formData, examDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeklyHours">Weekly Study Hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      value={formData.weeklyHours}
                      onValueChange={(value) =>
                        setFormData({ ...formData, weeklyHours: value })
                      }
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 hours</SelectItem>
                        <SelectItem value="10">10 hours</SelectItem>
                        <SelectItem value="15">15 hours</SelectItem>
                        <SelectItem value="20">20 hours</SelectItem>
                        <SelectItem value="25">25+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studyStyle">Study Style</Label>
                  <Select
                    value={formData.studyStyle}
                    onValueChange={(value) =>
                      setFormData({ ...formData, studyStyle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intensive">Intensive (more hours per session)</SelectItem>
                      <SelectItem value="balanced">Balanced (mix of long and short)</SelectItem>
                      <SelectItem value="light">Light (shorter, frequent sessions)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topics">Key Topics (optional)</Label>
                  <Textarea
                    id="topics"
                    placeholder="Enter key topics separated by commas..."
                    value={formData.topics}
                    onChange={(e) =>
                      setFormData({ ...formData, topics: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <GradientButton
                  className="w-full"
                  onClick={handleGeneratePlan}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Plan...
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

          {/* Preview / Tips */}
          <div className="space-y-6">
            <GlassCard variant="neon" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-lg gradient-accent p-2">
                  <Target className="h-5 w-5 text-accent-foreground" />
                </div>
                <h2 className="text-lg font-semibold">How it works</h2>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  Enter your course details and exam date
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  Set your weekly available study hours
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  Our AI generates a personalized daily schedule
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">4.</span>
                  Track your progress and adjust as needed
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="font-semibold mb-3">Your Study Plans</h3>
              <div className="py-8 text-center">
                <p className="text-muted-foreground mb-4">No study plans yet</p>
                <p className="text-sm text-muted-foreground">
                  Generate your first AI-powered study plan above!
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
