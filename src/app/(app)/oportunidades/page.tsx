import { OpportunitiesClientPage } from "@/features/opportunities/components/opportunities-client-page";
import { mockOpportunities } from "@/features/opportunities/data/mock-opportunities";

export default function OpportunitiesPage() {
  return <OpportunitiesClientPage opportunities={mockOpportunities} />;
}