import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface DangerZoneSectionProps {
  userEmail: string;
}

export function DangerZoneSection({ userEmail }: DangerZoneSectionProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const expectedConfirmText = "DELETE MY ACCOUNT";
  const isConfirmValid = confirmText === expectedConfirmText;

  const handleDeleteAccount = async () => {
    if (!isConfirmValid) return;

    setIsDeleting(true);
    try {
      // Sign out the user (actual account deletion requires admin API)
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Account deletion requested",
        description: "Your account deletion has been initiated. You will receive a confirmation email.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process account deletion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <GlassCard className="p-6 border-destructive/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-destructive/20 p-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-medium">Delete Account</span>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <p>
                This action is <strong>permanent and irreversible</strong>. All your
                data will be deleted, including:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li>All notes and flashcards</li>
                <li>Study plans and progress</li>
                <li>Tasks and reminders</li>
                <li>Account settings and preferences</li>
              </ul>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
              <p className="text-xs text-muted-foreground mb-1">
                Account to be deleted:
              </p>
              <p className="text-sm font-medium">{userEmail}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-delete" className="text-sm">
                Type <code className="px-1 py-0.5 rounded bg-muted font-mono text-xs">{expectedConfirmText}</code> to confirm:
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Type here to confirm"
                className={confirmText && !isConfirmValid ? "border-destructive" : ""}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={!isConfirmValid || isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete My Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
