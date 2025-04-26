
interface TrustFactorProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const TrustFactor = ({ icon, title, description }: TrustFactorProps) => {
  return (
    <div className="flex flex-col items-center text-center p-4 rounded-lg backdrop-blur-sm bg-card/60 border border-border/50">
      <div className="mb-2">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
