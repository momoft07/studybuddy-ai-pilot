import { ReactNode } from "react";
import { MobileNav } from "./MobileNav";
import { DesktopSidebar } from "./DesktopSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="container max-w-6xl py-6 px-4 md:px-6">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
