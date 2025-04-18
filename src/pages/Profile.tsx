
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { useProfile } from "@/components/profile/useProfile";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Profile() {
  const { profile, loading, updateProfile, handleFieldChange, refreshProfile } = useProfile();

  useEffect(() => {
    // S'assurer que les données du profil sont chargées au montage du composant
    console.log("Profile component mounted");
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
        <span className="text-lg">Chargement du profil...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <Card className="w-full max-w-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profil</CardTitle>
            <Button onClick={refreshProfile} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <p className="text-lg text-muted-foreground">
                  Impossible de charger les données du profil
                </p>
                <Button onClick={refreshProfile}>
                  Essayer à nouveau
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Paramètres du profil</CardTitle>
          <Button onClick={refreshProfile} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-8">
            <ProfileAvatar 
              avatarUrl={profile.avatar_url}
              firstName={profile.first_name}
              lastName={profile.last_name}
            />
            <h2 className="mt-4 text-xl font-semibold">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-muted-foreground">@{profile.username}</p>
          </div>
          
          <ProfileForm
            profile={profile}
            loading={loading}
            onSubmit={updateProfile}
            onChange={handleFieldChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
