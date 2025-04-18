
export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
      </div>
    </footer>
  );
};
