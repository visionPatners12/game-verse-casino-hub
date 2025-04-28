
import { Card } from "@/components/ui/card";

export function MatchInstructions() {
  return (
    <div className="border rounded-lg p-4 bg-muted/10">
      <h3 className="text-lg font-medium mb-2">Match Instructions</h3>
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
          <span>Both players must click the "Get Ready" button to prepare for the match.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
          <span>Once ready, one player can start the match by clicking "Start Match".</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
          <span>Find your opponent on EA FC 25 using their EA ID/platform username and play your match.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
          <span>When the match ends, take a screenshot of the final score and submit it along with the score.</span>
        </li>
      </ul>
    </div>
  );
}
