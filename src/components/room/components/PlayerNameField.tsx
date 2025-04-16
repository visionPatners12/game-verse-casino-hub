
import { Input } from "@/components/ui/input";

type PlayerNameFieldProps = {
  username: string;
};

export function PlayerNameField({ username }: PlayerNameFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Player Name</label>
      <Input
        value={username}
        disabled
        className="bg-muted"
      />
    </div>
  );
}
