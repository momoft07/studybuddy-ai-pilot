import { useState, useEffect } from "react";

export interface StudyPlanFormData {
  courseName: string;
  examDate: string;
  weeklyHours: string;
  studyStyle: string;
  topics: string;
  rememberSettings: boolean;
}

const STORAGE_KEY = "studypilot_plan_settings";

const defaultFormData: StudyPlanFormData = {
  courseName: "",
  examDate: "",
  weeklyHours: "10",
  studyStyle: "balanced",
  topics: "",
  rememberSettings: true,
};

export function useStudyPlanSettings() {
  const [formData, setFormData] = useState<StudyPlanFormData>(defaultFormData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved settings on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData({ ...defaultFormData, ...parsed });
      }
    } catch (error) {
      console.error("Failed to load saved settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings when they change (if rememberSettings is true)
  useEffect(() => {
    if (!isLoaded) return;
    
    if (formData.rememberSettings) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          weeklyHours: formData.weeklyHours,
          studyStyle: formData.studyStyle,
          rememberSettings: formData.rememberSettings,
        }));
      } catch (error) {
        console.error("Failed to save settings:", error);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [formData.weeklyHours, formData.studyStyle, formData.rememberSettings, isLoaded]);

  const updateFormData = (updates: Partial<StudyPlanFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const resetForm = () => {
    setFormData({
      ...defaultFormData,
      weeklyHours: formData.weeklyHours,
      studyStyle: formData.studyStyle,
      rememberSettings: formData.rememberSettings,
    });
  };

  return {
    formData,
    updateFormData,
    resetForm,
    isLoaded,
  };
}
