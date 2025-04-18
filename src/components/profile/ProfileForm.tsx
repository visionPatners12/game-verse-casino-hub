
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileData } from "./types";
import { Save } from "lucide-react";

interface ProfileFormProps {
  profile: ProfileData;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ProfileData, value: string) => void;
}

export const ProfileForm = ({ profile, loading, onSubmit, onChange }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">Nom d'utilisateur</label>
          <Input
            id="username"
            type="text"
            value={profile?.username || ''}
            onChange={(e) => onChange('username', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            disabled
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">Prénom</label>
          <Input
            id="firstName"
            type="text"
            value={profile?.first_name || ''}
            onChange={(e) => onChange('first_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">Nom</label>
          <Input
            id="lastName"
            type="text"
            value={profile?.last_name || ''}
            onChange={(e) => onChange('last_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Téléphone</label>
          <Input
            id="phone"
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">Pays</label>
          <Input
            id="country"
            type="text"
            value={profile?.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-white rounded-full"></span>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Enregistrer
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
