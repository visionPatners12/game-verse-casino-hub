
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavItem } from "./types";

interface NavigationMobileProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  navItems: NavItem[];
  isActivePath: (path: string) => boolean;
  user: {
    name: string;
    avatar: string;
    balance: {
      real: number;
      bonus: number;
    };
  };
  onLogout: () => void;
}

export const NavigationMobile = ({
  isOpen,
  setIsOpen,
  navItems,
  isActivePath,
  user,
  onLogout,
}: NavigationMobileProps) => {
  return (
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
                    className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
                      isActivePath(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-primary/10"
                    }`}
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
              onClick={onLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
