
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RulesDialog } from "@/components/game/RulesDialog";
import { RulesAcceptedBlock } from "../components/RulesAcceptedBlock";
import { UseFormReturn } from "react-hook-form";
import { CreateRoomFormData } from "../schemas/createRoomSchema";
import { useState } from "react";

interface GameFormLayoutProps {
  form: UseFormReturn<CreateRoomFormData>;
  onSubmit: (values: CreateRoomFormData) => void;
  showRulesDialog?: boolean;
  children: React.ReactNode;
}

export const GameFormLayout = ({ form, onSubmit, showRulesDialog = false, children }: GameFormLayoutProps) => {
  const [showDialog, setShowDialog] = useState(showRulesDialog);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const handleAcceptRules = () => {
    setShowDialog(false);
    setRulesAccepted(true);
  };

  return (
    <>
      <RulesDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
        onAccept={handleAcceptRules}
      />

      {rulesAccepted && <RulesAcceptedBlock />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {children}
          <Button type="submit" className="w-full">
            Create Room
          </Button>
        </form>
      </Form>
    </>
  );
};
