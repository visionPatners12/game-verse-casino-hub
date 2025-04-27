
import { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateRoomFormData } from "../schemas/createRoomSchema";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface GamerTagFieldProps {
  form: UseFormReturn<CreateRoomFormData>;
}

export const GamerTagField = ({ form }: GamerTagFieldProps) => {
  const { user } = useAuth();
  const platform = form.watch("platform");

  useEffect(() => {
    const loadUserGamerTag = async () => {
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("psn_username, xbox_gamertag, ea_id")
        .eq("id", user.id)
        .single();

      if (userData) {
        if (platform === "ps5" && userData.psn_username) {
          form.setValue("gamerTag", userData.psn_username);
        } else if (platform === "xbox_series" && userData.xbox_gamertag) {
          form.setValue("gamerTag", userData.xbox_gamertag);
        } else if (platform === "cross_play" && userData.ea_id) {
          form.setValue("gamerTag", userData.ea_id);
        }
      }
    };

    loadUserGamerTag();
  }, [platform, user]);

  const getGamerTagLabel = () => {
    switch (platform) {
      case "ps5":
        return "PSN Username";
      case "xbox_series":
        return "Xbox Live Gamertag";
      case "cross_play":
        return "EA ID";
      default:
        return "Gamer Tag";
    }
  };

  return (
    <FormField
      control={form.control}
      name="gamerTag"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{getGamerTagLabel()}</FormLabel>
          <FormControl>
            <Input {...field} required />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
