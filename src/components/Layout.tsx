
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useActiveRoomGuard();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};
