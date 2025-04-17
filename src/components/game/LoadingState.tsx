
import { Loader2 } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <h2 className="text-xl font-medium">Loading game room...</h2>
    </div>
  );
};

export default LoadingState;
