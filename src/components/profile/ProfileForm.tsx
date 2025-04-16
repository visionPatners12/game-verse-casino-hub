
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileData } from "./types";

interface ProfileFormProps {
  profile: ProfileData;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (field: keyof ProfileData, value: string) => void;
}

export const ProfileForm = ({ profile, loading, onSubmit, onChange }: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">Username</label>
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
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
          <Input
            id="firstName"
            type="text"
            value={profile?.first_name || ''}
            onChange={(e) => onChange('first_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
          <Input
            id="lastName"
            type="text"
            value={profile?.last_name || ''}
            onChange={(e) => onChange('last_name', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">Phone</label>
          <Input
            id="phone"
            type="tel"
            value={profile?.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="country" className="text-sm font-medium">Country</label>
          <Input
            id="country"
            type="text"
            value={profile?.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
