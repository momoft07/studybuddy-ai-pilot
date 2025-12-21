import { useState } from "react";
import { User, Camera, Check, X, Loader2 } from "lucide-react";
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
            className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => toast({ title: "Coming soon", description: "Avatar upload will be available soon." })}
          >
            <Camera className="h-5 w-5 text-muted-foreground" />
          </button>
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
