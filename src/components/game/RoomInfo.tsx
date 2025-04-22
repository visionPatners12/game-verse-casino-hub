
import { DollarSign } from "lucide-react";

interface RoomInfoProps {
  entryFee: number;
  totalPot: number;
  roomId: string;
}

const RoomInfo = ({ entryFee, totalPot, roomId }: RoomInfoProps) => {
  return (
    <div className="flex justify-between items-center mb-4 p-3 bg-muted rounded-md">
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-accent" />
        <div>
          <div className="text-sm font-medium">Mise</div>
          <div className="text-xl font-semibold">${entryFee}</div>
        </div>
      </div>
      
      <div>
        <div className="text-sm font-medium text-right">Cagnotte</div>
        <div className="text-xl font-semibold text-accent">
          ${totalPot.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
