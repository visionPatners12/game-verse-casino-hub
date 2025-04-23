
import { PropsWithChildren } from "react";
import Navigation from "@/components/Navigation"; // Changed to default import
import { Footer } from "./Footer";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";

interface LayoutProps extends PropsWithChildren {
  hideNavigation?: boolean;
  hideFooter?: boolean;
}

export const Layout = ({
  children,
  hideNavigation = false,
  hideFooter = false,
}: LayoutProps) => {
  // Apply the active room guard to every layout
  // This ensures all pages using the Layout will be protected
  useActiveRoomGuard();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideNavigation && <Navigation />}
      <main className="flex-grow container py-8">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
