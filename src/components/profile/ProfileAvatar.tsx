
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
}

export const ProfileAvatar = ({ avatarUrl, firstName, lastName }: ProfileAvatarProps) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  
  return (
    <Avatar className="w-24 h-24 border-2 border-primary">
      {avatarUrl ? (
        <AvatarImage 
          src={avatarUrl} 
          alt={`${firstName} ${lastName}`} 
          className="object-cover"
          onError={(e) => {
            console.error('Failed to load avatar image:', e);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
          {initials || '?'}
        </AvatarFallback>
      )}
    </Avatar>
  );
};
