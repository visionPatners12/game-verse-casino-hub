
import { Link } from "react-router-dom";
import { NavItem } from "./types";
import { toast } from "sonner";

interface NavigationDesktopProps {
  navItems: NavItem[];
  isActivePath: (path: string) => boolean;
  disableNavigation?: boolean;
}

export const NavigationDesktop = ({ navItems, isActivePath, disableNavigation = false }: NavigationDesktopProps) => {
  const handleDisabledClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (disableNavigation) {
      e.preventDefault();
      toast.error("Vous devez d'abord quitter la salle de jeu", {
        description: "Terminez votre partie avant de naviguer ailleurs."
      });
    }
  };

  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          onClick={(e) => handleDisabledClick(e, item.label)}
          className={`flex items-center gap-1.5 transition-colors ${
            isActivePath(item.href)
              ? "text-primary font-medium"
              : disableNavigation 
                ? "text-foreground/40 pointer-events-none"
                : "text-foreground/80 hover:text-accent"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
