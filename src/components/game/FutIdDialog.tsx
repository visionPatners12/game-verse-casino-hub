
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface FutIdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (futId: string) => Promise<boolean>;
  isLoading: boolean;
}

export function FutIdDialog({ open, onOpenChange, onSave, isLoading }: FutIdDialogProps) {
  const [futId, setFutId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!futId.trim()) {
      toast({ title: "FUT ID required", description: "Please enter your FUT ID", variant: "destructive" });
      return;
    }
    const success = await onSave(futId.trim());
    if (success) {
      toast({ title: "ID saved!", description: "Your FUT ID has been saved.", variant: "default" });
      onOpenChange(false);
    } else {
      toast({ title: "Error", description: "Could not save FUT ID. Please try again.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter your FUT ID</DialogTitle>
            <DialogDescription>
              To play FUTArena, you must provide your unique FUT account ID (EA/Origin ID).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              value={futId}
              onChange={e => setFutId(e.target.value)}
              placeholder="Enter your FUT ID"
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
