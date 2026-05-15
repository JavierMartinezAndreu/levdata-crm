import { CompaniesClientPage } from "@/features/companies/components/companies-client-page";
import { mockCompanies } from "@/features/companies/data/mock-companies";

export default function CompaniesPage() {
  return <CompaniesClientPage companies={mockCompanies} />;
}