
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useMatchSubmissions(roomId: string | undefined, currentUserId: string | null) {
  const submitScore = async (myScore: number, opponentScore: number) => {
    if (!roomId || !currentUserId) return false;
    
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ current_score: myScore })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) throw error;
      
      toast.success("Score submitted successfully");
      return true;
    } catch (error) {
      console.error('Error submitting score:', error);
      toast.error('Failed to submit score');
      return false;
    }
  };

  const submitProof = async (file: File) => {
    if (!roomId || !currentUserId) return false;
    
    try {
      const { data: bucketExists } = await supabase
        .storage
        .getBucket('match-proofs');
        
      if (!bucketExists) {
        console.log("Creating match-proofs bucket");
      }
      
      const filePath = `${roomId}/${currentUserId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('match-proofs')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Use type assertion to inform TypeScript that these properties exist
      const updateData: any = {
        proof_submitted: true,
        proof_path: filePath
      };
      
      const { error: updateError } = await supabase
        .from('game_players')
        .update(updateData)
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (updateError) throw updateError;
      
      toast.success("Match proof uploaded successfully");
      return true;
    } catch (error) {
      console.error('Error submitting proof:', error);
      toast.error('Failed to upload match proof');
      return false;
    }
  };

  return {
    submitScore,
    submitProof,
  };
}
