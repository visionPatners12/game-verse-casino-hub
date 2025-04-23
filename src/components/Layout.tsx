
import { PropsWithChildren } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard"; // Ajout du hook

interface LayoutProps extends PropsWithChildren {
  hideNavigation?: boolean;
  hideFooter?: boolean;
}

export const Layout = ({
  children,
  hideNavigation = false,
  hideFooter = false,
}: LayoutProps) => {
  // Appliquer le hook de garde de room active sur chaque layout
  // Cela assurera que toutes les pages utilisant le Layout seront protégées
  useActiveRoomGuard();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideNavigation && <Navigation />}
      <main className="flex-grow container py-8">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
