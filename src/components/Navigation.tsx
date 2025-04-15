
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GamepadIcon, Store, BarChart3, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { NavigationDesktop } from "./navigation/NavigationDesktop";
import { NavigationMobile } from "./navigation/NavigationMobile";
import { ProfileMenu } from "./navigation/ProfileMenu";
import { NavItem } from "./navigation/types";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  
  // Mock user data - would normally come from auth context
  const user = {
    name: "Player123",
    avatar: "",
    balance: {
      real: 500,
      bonus: 100
    }
  };
  
  const navItems: NavItem[] = [
    { label: "Games", href: "/games", icon: <GamepadIcon className="h-5 w-5" /> },
    { label: "Store", href: "/store", icon: <Store className="h-5 w-5" /> },
    { label: "Dashboard", href: "/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Wallet", href: "/wallet", icon: <Wallet className="h-5 w-5" /> },
  ];
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    // Would normally handle actual logout logic here
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
            GameVerse
          </span>
          <span className="text-xl font-bold">Casino</span>
        </Link>
        
        <NavigationDesktop navItems={navItems} isActivePath={isActivePath} />
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm text-foreground/70">Balance</div>
              <div className="font-medium text-accent">
                ${user.balance.real} <span className="text-foreground/50 text-xs">+${user.balance.bonus} bonus</span>
              </div>
            </div>
          </div>
          
          <NavigationMobile
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            navItems={navItems}
            isActivePath={isActivePath}
            user={user}
            onLogout={handleLogout}
          />
          
          <ProfileMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
};

export default Navigation;
