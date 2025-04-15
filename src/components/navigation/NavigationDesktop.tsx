
import { Link } from "react-router-dom";
import { NavItem } from "./types";

interface NavigationDesktopProps {
  navItems: NavItem[];
  isActivePath: (path: string) => boolean;
}

export const NavigationDesktop = ({ navItems, isActivePath }: NavigationDesktopProps) => {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {navItems.map((item) => (
        <Link
          key={item.label}
          to={item.href}
          className={`flex items-center gap-1.5 transition-colors ${
            isActivePath(item.href)
              ? "text-primary font-medium"
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
