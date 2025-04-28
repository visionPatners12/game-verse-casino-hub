
import { Layout } from "@/components/Layout";
import { Loader2 } from "lucide-react";

export const JoinRoomLoading = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Chargement des informations de la salle...</p>
        </div>
      </div>
    </Layout>
  );
};
