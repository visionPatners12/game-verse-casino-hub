
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { SignupForm } from "./auth/SignupForm";

export const AuthForms = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="signup">Inscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <div className="space-y-4 mt-4">
            <LoginForm />
          </div>
        </TabsContent>
        
        <TabsContent value="signup">
          <div className="space-y-4 mt-4">
            <SignupForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForms;
