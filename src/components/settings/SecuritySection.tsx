import { useState } from "react";
import { Shield, Key, Loader2, Smartphone, ShieldCheck, Monitor } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function SecuritySection() {
  const { t } = useTranslation();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { toast } = useToast();

  // Mock session data
  const sessions = [
    {
      id: "current",
      device: "Chrome on Windows",
      location: "Berlin, Germany",
      lastActive: new Date(),
      current: true,
    },
    {
      id: "mobile",
      device: "Safari on iPhone",
      location: "Berlin, Germany",
      lastActive: new Date(Date.now() - 86400000),
      current: false,
    },
  ];

  const resetForm = () => {
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t("common.error"),
        description: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t("common.error"),
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsChanging(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: t("settings.security.passwordUpdated"),
        description: t("settings.security.passwordUpdatedDesc"),
      });
      setIsPasswordDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: t("common.error"),
        description: error.message || "Failed to update password.",
        variant: "destructive",
      });
    } finally {
      setIsChanging(false);
    }
  };

  const handle2FAToggle = (enabled: boolean) => {
    setIs2FAEnabled(enabled);
    toast({
      title: t("common.comingSoon"),
      description: "Two-factor authentication will be available soon.",
    });
    setIs2FAEnabled(false);
  };

  return (
    <>
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-warning p-2">
            <Shield className="h-5 w-5 text-warning-foreground" />
          </div>
          <h2 className="text-lg font-semibold">{t("settings.security.title")}</h2>
        </div>

        <div className="space-y-5">
          {/* Password */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Key className="h-4 w-4 text-muted-foreground" />
              <div>
                <span className="text-sm font-medium">{t("settings.security.password")}</span>
                <p className="text-xs text-muted-foreground">
                  {t("settings.security.passwordDesc")}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPasswordDialogOpen(true)}
            >
              {t("settings.security.change")}
            </Button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {t("settings.security.twoFactor")}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {t("common.comingSoon")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.security.twoFactorDesc")}
                </p>
              </div>
            </div>
            <Switch
              checked={is2FAEnabled}
              onCheckedChange={handle2FAToggle}
            />
          </div>

          {/* Active Sessions */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {t("settings.security.activeSessions")}
              </span>
            </div>
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Monitor className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{session.device}</span>
                        {session.current && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-success/20 text-success">
                            {t("settings.security.currentSession")}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {session.location} • {t("settings.security.lastActive")}{" "}
                        {format(session.lastActive, "MMM d, HH:mm")}
                      </p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button variant="ghost" size="sm" className="text-destructive">
                      {t("settings.signOut.button")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("settings.security.changePassword")}</DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it's at least 6 characters.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">{t("settings.security.newPassword")}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t("settings.security.confirmPassword")}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsPasswordDialogOpen(false);
                resetForm();
              }}
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChanging || !newPassword || !confirmPassword}
            >
              {isChanging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.loading")}
                </>
              ) : (
                t("common.update")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
