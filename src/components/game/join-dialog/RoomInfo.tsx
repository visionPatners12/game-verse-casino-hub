
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign } from "lucide-react";

interface RoomInfoProps {
  currentPlayers: number;
  maxPlayers: number;
  entryFee: number;
}

export function RoomInfo({ currentPlayers, maxPlayers, entryFee }: RoomInfoProps) {
  return (
    <div className="flex gap-2">
      <Badge variant="outline" className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {currentPlayers}/{maxPlayers} Joueurs
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1">
        <DollarSign className="h-3 w-3" />
        ${entryFee}
      </Badge>
    </div>
  );
}
