
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GameRules } from "@/components/game/GameRules";
import { RulesAcceptedBlock } from "../components/RulesAcceptedBlock";
import { UseFormReturn } from "react-hook-form";
import { CreateRoomFormData } from "../schemas/createRoomSchema";
import { useState } from "react";

interface GameFormLayoutProps {
  form: UseFormReturn<CreateRoomFormData>;
  onSubmit: (values: CreateRoomFormData) => void;
  showRules?: boolean;
  children: React.ReactNode;
}

export const GameFormLayout = ({ form, onSubmit, showRules = false, children }: GameFormLayoutProps) => {
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const handleAcceptRules = () => {
    setRulesAccepted(true);
  };

  return (
    <div className="space-y-8">
      {showRules && (
        <div className="space-y-4">
          <GameRules 
            gameType="futarena" 
            matchSettings={{
              halfLengthMinutes: form.getValues('halfLengthMinutes'),
              legacyDefending: form.getValues('legacyDefending'),
              customFormations: form.getValues('customFormations'),
              platform: form.getValues('platform'),
              mode: form.getValues('mode'),
              teamType: form.getValues('teamType'),
            }}
          />
          {!rulesAccepted && (
            <Button onClick={handleAcceptRules} className="w-full">
              J'accepte les règles
            </Button>
          )}
        </div>
      )}

      {(!showRules || rulesAccepted) && (
        <>
          {rulesAccepted && <RulesAcceptedBlock />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {children}
              <Button type="submit" className="w-full">
                Create Room
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
