
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { GamepadIcon, Store, BarChart3, Wallet, Package2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NavigationDesktop } from "./navigation/NavigationDesktop";
import { NavigationMobile } from "./navigation/NavigationMobile";
import { ProfileMenu } from "./navigation/ProfileMenu";
import { NavItem } from "./navigation/types";
import { useWallet } from "@/hooks/useWallet";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const { wallet, isLoading } = useWallet();
  
  // Mock user data - would normally come from auth context
  const user = {
    name: "Player123",
    avatar: "",
    balance: {
      real: wallet?.real_balance ?? 0,
      bonus: wallet?.bonus_balance ?? 0
    }
  };
  
  const navItems: NavItem[] = [
    { label: "Games", href: "/games", icon: <GamepadIcon className="h-5 w-5" /> },
    { label: "Store", href: "/store", icon: <Store className="h-5 w-5" /> },
    { label: "Dashboard", href: "/dashboard", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Wallet", href: "/wallet", icon: <Wallet className="h-5 w-5" /> },
    { label: "My Items", href: "/my-items", icon: <Package2 className="h-5 w-5" /> },
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
                ${isLoading ? "..." : user.balance.real} 
                <span className="text-foreground/50 text-xs">
                  +${isLoading ? "..." : user.balance.bonus} bonus
                </span>
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
