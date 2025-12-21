import { useState, useRef } from "react";
import { User, Camera, Check, X, Loader2, Upload } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ProfileSectionProps {
  user: {
    id: string;
    email?: string;
    created_at?: string;
  } | null;
  profile: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
  onProfileUpdate: () => void;
}

export function ProfileSection({ user, profile, onProfileUpdate }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile?.full_name || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const userInitials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "U";

  const memberSince = user?.created_at
    ? format(new Date(user.created_at), "MMMM yyyy")
    : null;

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: displayName.trim() || null })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your display name has been saved.",
      });
      setIsEditing(false);
      onProfileUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profile?.full_name || "");
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, WebP, or GIF).",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile with new avatar URL (add timestamp to bust cache)
      const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been changed.",
      });
      onProfileUpdate();
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-lg gradient-primary p-2 glow-sm">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-lg font-semibold">Profile</h2>
      </div>

      <div className="flex items-start gap-6">
        {/* Avatar */}
        <div className="relative group">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={profile?.avatar_url || undefined} alt="Profile" />
            <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <button
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
            onClick={handleAvatarClick}
            disabled={isUploadingAvatar}
          >
            {isUploadingAvatar ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <Camera className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Display Name</label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-9"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="h-9 w-9 p-0"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4 text-success" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-9 w-9 p-0"
                >
                  <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {profile?.full_name || "Not set"}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="text-sm font-medium">{user?.email || "No email"}</p>
          </div>

          {/* Status & Member Since */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-success/30 text-success font-medium">
                Active
              </span>
            </div>
            {memberSince && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Member since:</span>
                <span className="text-xs font-medium">{memberSince}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
