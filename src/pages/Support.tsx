
import { Layout } from "@/components/Layout";
import { SupportTickets } from "@/components/support/SupportTickets";

export default function Support() {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <SupportTickets />
      </div>
    </Layout>
  );
}
