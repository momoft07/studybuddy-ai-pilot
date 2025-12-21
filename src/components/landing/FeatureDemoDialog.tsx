import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";

interface FeatureDemoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "primary" | "accent" | "teal";
  children: ReactNode;
}

export function FeatureDemoDialog({
  open,
  onOpenChange,
  title,
  description,
  icon: Icon,
  variant,
  children,
}: FeatureDemoDialogProps) {
  const iconVariants = {
    primary: "gradient-primary shadow-[0_0_20px_hsl(220_100%_60%/0.4)]",
    accent: "gradient-accent shadow-[0_0_20px_hsl(270_100%_65%/0.4)]",
    teal: "gradient-teal shadow-[0_0_20px_hsl(180_100%_50%/0.4)]",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border/50 max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-2.5 ${iconVariants[variant]}`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="font-display text-lg">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="p-6 pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
