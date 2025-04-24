
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface TeamDisplayProps {
  team?: { 
    name: string; 
    image_path: string | null;
  };
  index: number;
}

function TeamPlaceholder({ index }: { index: number }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <span className="text-muted-foreground/70 text-lg font-bold">T{index + 1}</span>
      </div>
      <span className="font-medium text-center text-muted-foreground">
        Équipe {index + 1}
      </span>
    </div>
  );
}

export function TeamDisplay({ team, index }: TeamDisplayProps) {
  const [imageError, setImageError] = useState(false);
  
  if (!team) {
    return <TeamPlaceholder index={index} />;
  }
  
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-24 h-24 flex items-center justify-center">
        <Avatar className="w-20 h-20 border-2">
          {team.image_path && !imageError ? (
            <AvatarImage 
              src={team.image_path} 
              alt={team.name}
              className="object-contain p-1"
              onError={() => {
                console.error(`Team ${index} image failed to load:`, team.image_path);
                setImageError(true);
              }}
            />
          ) : null}
          <AvatarFallback className="bg-accent/10 text-lg font-bold">
            {team.name?.substring(0, 2).toUpperCase() || `T${index + 1}`}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="font-medium text-center text-sm line-clamp-2 max-w-full">
        {team.name || `Équipe ${index + 1}`}
      </span>
    </div>
  );
}
