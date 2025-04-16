
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl?: string | null;
  firstName?: string;
  lastName?: string;
}

export const ProfileAvatar = ({ avatarUrl, firstName, lastName }: ProfileAvatarProps) => {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  
  return (
    <Avatar className="w-24 h-24">
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
      ) : (
        <AvatarFallback>{initials}</AvatarFallback>
      )}
    </Avatar>
  );
};
