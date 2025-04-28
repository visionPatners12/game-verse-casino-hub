
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

interface EAFC25ScoreSubmissionProps {
  onSubmit: (myScore: number, opponentScore: number) => Promise<boolean>;
  submitted: boolean;
}

export function EAFC25ScoreSubmission({ 
  onSubmit,
  submitted
}: EAFC25ScoreSubmissionProps) {
  const [myScore, setMyScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!submitted) {
      setIsSubmitting(true);
      try {
        const success = await onSubmit(myScore, opponentScore);
        if (!success) {
          throw new Error("Failed to submit score");
        }
      } catch (error) {
        console.error("Error submitting score:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmitScore}>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Submit Final Score</h4>
            <p className="text-xs text-muted-foreground mb-4">
              Enter the final match score. This should match the screenshot you'll provide.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 items-center">
            <div>
              <Label htmlFor="my-score">Your Score</Label>
              <Input
                id="my-score"
                type="number"
                min="0"
                max="99"
                value={myScore}
                onChange={(e) => setMyScore(parseInt(e.target.value) || 0)}
                disabled={submitted || isSubmitting}
                className="mt-1"
              />
            </div>
            
            <div className="flex items-center justify-center">
              <span className="text-xl font-bold">:</span>
            </div>
            
            <div>
              <Label htmlFor="opponent-score">Opponent's Score</Label>
              <Input
                id="opponent-score"
                type="number"
                min="0"
                max="99"
                value={opponentScore}
                onChange={(e) => setOpponentScore(parseInt(e.target.value) || 0)}
                disabled={submitted || isSubmitting}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={submitted || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : submitted ? (
                <>
                  <Send className="h-4 w-4" />
                  Submitted
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Score
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
