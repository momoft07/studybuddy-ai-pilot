import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { NotificationsSection } from "@/components/settings/NotificationsSection";
import { SecuritySection } from "@/components/settings/SecuritySection";
import { StudyPreferencesSection } from "@/components/settings/StudyPreferencesSection";
import { LocaleSection } from "@/components/settings/LocaleSection";
import { DataExportSection } from "@/components/settings/DataExportSection";
import { KeyboardShortcutsSection } from "@/components/settings/KeyboardShortcutsSection";
import { PremiumCard } from "@/components/settings/PremiumCard";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { SignOutButton } from "@/components/settings/SignOutButton";
import { motion } from "framer-motion";

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  is_premium: boolean | null;
  weekly_study_hours: number | null;
  study_preference: string | null;
}

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, is_premium, weekly_study_hours, study_preference")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching profile:", error);
      }
      setProfile(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const SectionSkeleton = () => (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  );

  return (
    <AppLayout>
      <motion.div
        className="max-w-2xl mx-auto space-y-6 pb-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl font-display font-bold md:text-3xl">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <div className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          ) : (
            <ProfileSection
              user={user}
              profile={profile}
              onProfileUpdate={fetchProfile}
            />
          )}
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Study Preferences Section */}
        <motion.div variants={itemVariants}>
          {isLoading ? (
            <SectionSkeleton />
          ) : user ? (
            <StudyPreferencesSection
              userId={user.id}
              initialWeeklyHours={profile?.weekly_study_hours}
              initialStudyPreference={profile?.study_preference}
              onUpdate={fetchProfile}
            />
          ) : null}
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Appearance Section */}
        <motion.div variants={itemVariants}>
          <AppearanceSection />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Region & Language Section */}
        <motion.div variants={itemVariants}>
          <LocaleSection />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Notifications Section */}
        <motion.div variants={itemVariants}>
          <NotificationsSection />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Security Section */}
        <motion.div variants={itemVariants}>
          <SecuritySection />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Data Export Section */}
        <motion.div variants={itemVariants}>
          {user && <DataExportSection userId={user.id} />}
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Keyboard Shortcuts Section */}
        <motion.div variants={itemVariants}>
          <KeyboardShortcutsSection />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Premium Card */}
        <motion.div variants={itemVariants}>
          {!profile?.is_premium && <PremiumCard />}
        </motion.div>

        {/* Sign Out */}
        <motion.div variants={itemVariants}>
          <SignOutButton onSignOut={signOut} />
        </motion.div>

        <Separator className="bg-border/50" />

        {/* Danger Zone */}
        <motion.div variants={itemVariants}>
          {user?.email && <DangerZoneSection userEmail={user.email} />}
        </motion.div>

        {/* Footer Links */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-4 pt-4 text-xs text-muted-foreground"
        >
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-foreground transition-colors">
            Help Center
          </a>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
