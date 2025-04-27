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

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">Identifiants de jeu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="xbox_gamertag" className="text-sm font-medium">Xbox Live Gamertag</label>
            <Input
              id="xbox_gamertag"
              type="text"
              value={profile?.xbox_gamertag || ''}
              onChange={(e) => onChange('xbox_gamertag', e.target.value)}
              placeholder="Votre Xbox Gamertag"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="psn_username" className="text-sm font-medium">PSN Username</label>
            <Input
              id="psn_username"
              type="text"
              value={profile?.psn_username || ''}
              onChange={(e) => onChange('psn_username', e.target.value)}
              placeholder="Votre PSN Username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="epic_username" className="text-sm font-medium">Epic Games Username</label>
            <Input
              id="epic_username"
              type="text"
              value={profile?.epic_username || ''}
              onChange={(e) => onChange('epic_username', e.target.value)}
              placeholder="Votre Epic Games Username"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="activision_username" className="text-sm font-medium">Activision Username</label>
            <Input
              id="activision_username"
              type="text"
              value={profile?.activision_username || ''}
              onChange={(e) => onChange('activision_username', e.target.value)}
              placeholder="Votre Activision Username"
            />
          </div>
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
