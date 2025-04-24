
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";
import { useState } from "react";

interface LeagueAvatarProps {
  image: string | null;
  name: string;
}

export function LeagueAvatar({ image, name }: LeagueAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Avatar className="h-10 w-10 border">
      {image && !imageError ? (
        <AvatarImage 
          src={image} 
          alt={name || "League"}
          className="object-contain p-1"
          onError={() => {
            console.error("League image failed to load:", image);
            setImageError(true);
          }}
        />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
        {name?.substring(0, 2).toUpperCase() || <ImageIcon className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}
