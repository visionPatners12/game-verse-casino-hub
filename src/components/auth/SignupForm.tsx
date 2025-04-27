
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock, User, Phone, Globe, Gamepad, Monitor, Play, Loader2 } from "lucide-react";

export const SignupForm = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await signUp({
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        username: formData.get('username') as string,
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        phone: formData.get('phone') as string,
        country: formData.get('country') as string,
        xbox_gamertag: formData.get('xbox_gamertag') as string,
        psn_username: formData.get('psn_username') as string,
        epic_username: formData.get('epic_username') as string,
        activision_username: formData.get('activision_username') as string,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Nom d'utilisateur</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="username"
            name="username"
            type="text"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="votre.email@example.com"
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Numéro de téléphone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="pl-10"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country">Pays</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="country"
            name="country"
            type="text"
            className="pl-10"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="xbox_gamertag">Xbox Live Gamertag</Label>
          <div className="relative">
            <Monitor className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="xbox_gamertag"
              name="xbox_gamertag"
              type="text"
              placeholder="Xbox Gamertag"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="psn_username">PSN Username</Label>
          <div className="relative">
            <Play className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="psn_username"
              name="psn_username"
              type="text"
              placeholder="PlayStation Network Username"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="epic_username">Epic Games Username</Label>
          <div className="relative">
            <Gamepad className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="epic_username"
              name="epic_username"
              type="text"
              placeholder="Epic Games Username"
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="activision_username">Activision Username</Label>
          <div className="relative">
            <Gamepad className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="activision_username"
              name="activision_username"
              type="text"
              placeholder="Activision Username"
              className="pl-10"
            />
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création du compte...
          </>
        ) : (
          "Créer un compte"
        )}
      </Button>
    </form>
  );
};
