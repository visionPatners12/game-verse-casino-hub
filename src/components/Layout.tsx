
import { PropsWithChildren } from "react";
import Navigation from "@/components/Navigation";
import { Footer } from "./Footer";
import { useRouteGuard } from "@/hooks/room/useRouteGuard";
import { useIsInGameRoom } from "@/hooks/room/useIsInGameRoom";

interface LayoutProps extends PropsWithChildren {
  hideNavigation?: boolean;
  hideFooter?: boolean;
}

export const Layout = ({
  children,
  hideNavigation = false,
  hideFooter = false,
}: LayoutProps) => {
  // Apply the route guard to every layout
  useRouteGuard();
  
  // Détecte si l'utilisateur est dans une room de jeu
  const isInGameRoom = useIsInGameRoom();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideNavigation && <Navigation disableNavigation={isInGameRoom} />}
      <main className="flex-grow container py-8">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
