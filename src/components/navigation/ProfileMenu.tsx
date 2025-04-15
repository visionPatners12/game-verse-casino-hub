
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Package2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ProfileMenuProps {
  user: {
    name: string;
    avatar: string;
  };
  onLogout: () => void;
}

export const ProfileMenu = ({ user, onLogout }: ProfileMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-primary">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{user.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/profile">
          <DropdownMenuItem className="cursor-pointer">
            Profile Settings
          </DropdownMenuItem>
        </Link>
        <Link to="/my-items">
          <DropdownMenuItem className="cursor-pointer">
            <Package2 className="h-4 w-4 mr-2" />
            <span>My Items</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem 
          className="text-destructive cursor-pointer" 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
