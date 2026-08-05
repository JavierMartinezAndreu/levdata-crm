import type { ActivityListItem } from "@/features/activities/types";
import type { ContactListItem } from "@/features/contacts/types";
import type { OpportunityListItem } from "@/features/opportunities/types";
import type { CompanyDb } from "@/features/companies/types";

export type DashboardHealth = "bien" | "atencion" | "urgente";

export type DashboardData = {
  generatedAt: string;
  health: DashboardHealth;
  metrics: {
    companies: number;
    contacts: number;
    openOpportunities: number;
    hotOpportunities: number;
    openPipelineValue: number;
    expectedMrr: number;
    overdueActivities: number;
    todayActivities: number;
    opportunitiesWithoutNextAction: number;
  };
  todayActivities: ActivityListItem[];
  overdueActivities: ActivityListItem[];
  hotOpportunities: OpportunityListItem[];
  opportunitiesWithoutNextAction: OpportunityListItem[];
  recentCompanies: CompanyDb[];
  recentContacts: ContactListItem[];
};