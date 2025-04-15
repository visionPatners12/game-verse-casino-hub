
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  User, 
  Home, 
  GamepadIcon, 
  Store, 
  BarChart3, 
  Wallet, 
  LogOut 
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
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
    { label: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
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

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
            GameVerse
          </span>
          <span className="text-xl font-bold">Casino</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-foreground/80 hover:text-accent transition-colors flex items-center gap-1.5"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm text-foreground/70">Balance</div>
              <div className="font-medium text-accent">
                ${user.balance.real} <span className="text-foreground/50 text-xs">+${user.balance.bonus} bonus</span>
              </div>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card">
              <div className="flex flex-col h-full">
                <div className="border-b border-border py-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-foreground/70">
                        ${user.balance.real} <span className="text-foreground/50">+${user.balance.bonus} bonus</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <nav className="flex-1">
                  <ul className="space-y-3">
                    {navItems.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-primary/10 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                <div className="border-t border-border pt-4 mt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link to="/profile">
            <Avatar>
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
