
import AuthForms from "@/components/AuthForms";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            GameVerse Casino
          </h1>
          <p className="text-muted-foreground">
            Jouez, affrontez-vous et gagnez dans nos jeux de casino en ligne !
          </p>
        </div>
        
        <div className="bg-card rounded-xl p-6 shadow-xl border border-border">
          <AuthForms />
        </div>
      </div>
    </div>
  );
};

export default Index;
