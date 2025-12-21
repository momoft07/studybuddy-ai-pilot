import { useState, useRef, useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useStudyPlanSettings } from "@/hooks/useStudyPlanSettings";
import { StudyPlanForm } from "@/components/study-plan/StudyPlanForm";
import { StudyPlanDisplay, StudyPlan } from "@/components/study-plan/StudyPlanDisplay";
import { EmptyPlanState } from "@/components/study-plan/EmptyPlanState";
import { HowItWorks } from "@/components/study-plan/HowItWorks";
import { motion, AnimatePresence } from "framer-motion";

const PLANS_STORAGE_KEY = "studypilot_generated_plans";

interface FormErrors {
  courseName?: string;
  examDate?: string;
  weeklyHours?: string;
  studyStyle?: string;
}

export default function StudyPlanPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { formData, updateFormData, resetForm, isLoaded } = useStudyPlanSettings();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const plansRef = useRef<HTMLDivElement>(null);

  // Load saved plans from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(PLANS_STORAGE_KEY);
      if (saved) {
        setPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load saved plans:", error);
    }
  }, []);

  // Save plans to localStorage when they change
  useEffect(() => {
    if (plans.length > 0) {
      localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    } else {
      localStorage.removeItem(PLANS_STORAGE_KEY);
    }
  }, [plans]);

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = "Course name is required";
    }

    if (!formData.examDate) {
      newErrors.examDate = "Exam date is required";
    } else if (new Date(formData.examDate) <= new Date()) {
      newErrors.examDate = "Exam date must be in the future";
    }

    if (!formData.studyStyle) {
      newErrors.studyStyle = "Please select a study style";
    }

    const hours = parseInt(formData.weeklyHours);
    if (isNaN(hours) || hours < 1 || hours > 100) {
      newErrors.weeklyHours = "Weekly hours must be between 1 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Validate on form data change
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched, validateForm]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleGeneratePlan = async () => {
    // Mark all fields as touched
    setTouched({
      courseName: true,
      examDate: true,
      weeklyHours: true,
      studyStyle: true,
    });

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-study-plan", {
        body: {
          courseName: formData.courseName,
          examDate: formData.examDate,
          weeklyHours: formData.weeklyHours,
          studyStyle: formData.studyStyle,
          topics: formData.topics,
          userId: user?.id,
        },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.studyPlan) {
        const newPlan: StudyPlan = {
          ...data.studyPlan,
          id: crypto.randomUUID(),
          courseName: formData.courseName,
          examDate: formData.examDate,
          generatedAt: new Date().toISOString(),
        };

        if (editingPlan) {
          // Replace existing plan
          setPlans((prev) =>
            prev.map((p) => (p.id === editingPlan.id ? newPlan : p))
          );
          setEditingPlan(null);
          toast.success("Study plan updated successfully!");
        } else {
          // Add new plan
          setPlans((prev) => [newPlan, ...prev]);
          toast.success("Your study plan is ready!");
        }

        resetForm();
        setTouched({});

        // Scroll to plans after a brief delay
        setTimeout(scrollToPlans, 300);
      }
    } catch (error) {
      console.error("Failed to generate plan:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate study plan. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditPlan = (plan: StudyPlan) => {
    setEditingPlan(plan);
    updateFormData({
      courseName: plan.courseName || plan.title.replace("Study Plan for ", ""),
      examDate: plan.examDate || "",
      weeklyHours: String(plan.hoursPerWeek || 10),
    });
    scrollToForm();
    toast.info("Edit mode: Update the form and regenerate");
  };

  const handleDeletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== planId));
    toast.success("Study plan deleted");
  };

  const handleUpdateProgress = (
    planId: string,
    dayIndex: number,
    taskId: string,
    completed: boolean
  ) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        const newSchedule = [...plan.dailySchedule];
        newSchedule[dayIndex] = {
          ...newSchedule[dayIndex],
          tasks: newSchedule[dayIndex].tasks.map((task) =>
            task.id === taskId ? { ...task, completed } : task
          ),
        };
        return { ...plan, dailySchedule: newSchedule };
      })
    );
  };

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-display font-bold md:text-3xl">
            <span className="gradient-text">{t("studyPlan.title")}</span> {t("studyPlan.creator")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("studyPlan.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form */}
          <div ref={formRef}>
            <StudyPlanForm
              formData={formData}
              onUpdateFormData={updateFormData}
              onSubmit={handleGeneratePlan}
              loading={loading}
              errors={errors}
              touched={touched}
              onBlur={handleBlur}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <HowItWorks />

            {/* Plans Section */}
            <div ref={plansRef}>
              <AnimatePresence mode="wait">
                {plans.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyPlanState onScrollToForm={scrollToForm} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="plans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-lg">Your Study Plans</h3>
                    {plans.map((plan) => (
                      <StudyPlanDisplay
                        key={plan.id}
                        plan={plan}
                        onEdit={() => handleEditPlan(plan)}
                        onDelete={() => handleDeletePlan(plan.id!)}
                        onUpdateProgress={(dayIndex, taskId, completed) =>
                          handleUpdateProgress(plan.id!, dayIndex, taskId, completed)
                        }
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
