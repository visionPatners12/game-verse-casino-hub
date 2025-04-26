
import { CheckCircle } from "lucide-react";

export const RulesAcceptedBlock = () => {
  return (
    <div className="bg-[#F6F6F7] rounded-lg p-4 mt-4 flex items-center gap-3">
      <CheckCircle className="text-[#9b87f5] h-5 w-5" />
      <span className="text-sm font-medium text-[#1A1F2C]">
        C'est réglé ! Vous pouvez maintenant créer votre room
      </span>
    </div>
  );
};
