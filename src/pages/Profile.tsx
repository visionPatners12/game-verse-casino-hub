
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useProfile } from "@/components/profile/useProfile";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const { profile, loading, updateProfile, handleFieldChange } = useProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <ProfileAvatar 
              avatarUrl={profile?.avatar_url}
              firstName={profile?.first_name}
              lastName={profile?.last_name}
            />
          </div>
          {profile && (
            <ProfileForm
              profile={profile}
              loading={loading}
              onSubmit={updateProfile}
              onChange={handleFieldChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
