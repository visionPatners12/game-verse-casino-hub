
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Send } from "lucide-react";
import { EAFC25ScoreSubmission } from "../EAFC25ScoreSubmission";
import { EAFC25ProofUpload } from "../EAFC25ProofUpload";

interface MatchStatusProps {
  matchEnded: boolean;
  scoreSubmitted: boolean;
  proofSubmitted: boolean;
  onScoreSubmit: (myScore: number, opponentScore: number) => Promise<boolean>;
  onProofSubmit: (file: File) => Promise<boolean>;
}

export function MatchStatus({
  matchEnded,
  scoreSubmitted,
  proofSubmitted,
  onScoreSubmit,
  onProofSubmit
}: MatchStatusProps) {
  if (!matchEnded) return null;

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Match Completed</h3>
          <p className="text-sm text-muted-foreground">
            Please submit your final score and upload match proof
          </p>
        </div>
        {scoreSubmitted && proofSubmitted ? (
          <div className="flex items-center text-green-500">
            <CheckCircle className="mr-1 h-5 w-5" />
            <span>Submitted</span>
          </div>
        ) : (
          <div className="flex items-center text-amber-500">
            <AlertCircle className="mr-1 h-5 w-5" />
            <span>Action Required</span>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <EAFC25ScoreSubmission 
          onSubmit={onScoreSubmit}
          submitted={scoreSubmitted}
        />
        
        <EAFC25ProofUpload 
          onSubmit={onProofSubmit}
          submitted={proofSubmitted}
        />
      </div>
    </div>
  );
}
