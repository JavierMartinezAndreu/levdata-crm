import { listActivities } from "@/features/activities/data/activities-service";
import type { ActivityListItem } from "@/features/activities/types";
import { listCompanies } from "@/features/companies/data/companies-service";
import { listContacts } from "@/features/contacts/data/contacts-service";
import {
  getFinanceData,
  getFinanceStats,
} from "@/features/finance/data/finance-service";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { DashboardData, DashboardHealth } from "@/features/dashboard/types";

export async function getDashboardData(): Promise<DashboardData> {
  const [companies, contacts, opportunities, activities, financeData] =
    await Promise.all([
      listCompanies(),
      listContacts(),
      listOpportunities(),
      listActivities(),
      getFinanceData(),
    ]);

  const todayKey = getDateKey(new Date());
  const now = Date.now();

  const openOpportunities = opportunities.filter(
    (item) => item.opportunity.status === "abierta",
  );

  const hotOpportunities = openOpportunities
    .filter((item) => item.opportunity.temperature === "caliente")
    .sort(
      (a, b) =>
        Number(b.opportunity.one_time_value) -
        Number(a.opportunity.one_time_value),
    )
    .slice(0, 5);

  const opportunitiesWithoutNextAction = openOpportunities
    .filter(
      (item) =>
        !item.opportunity.next_action || !item.opportunity.next_action_at,
    )
    .slice(0, 6);

  const todayActivities = activities
    .filter((item) => {
      if (!item.activity.scheduled_at) return false;

      return getDateKey(new Date(item.activity.scheduled_at)) === todayKey;
    })
    .sort(compareActivitiesByDate)
    .slice(0, 8);

  const overdueActivities = activities
    .filter((item) => {
      if (item.activity.status !== "pendiente") return false;
      if (!item.activity.scheduled_at) return false;

      return new Date(item.activity.scheduled_at).getTime() < now;
    })
    .sort(compareActivitiesByDate)
    .slice(0, 8);

  const openPipelineValue = openOpportunities.reduce(
    (total, item) => total + Number(item.opportunity.one_time_value),
    0,
  );

  const expectedMrr = openOpportunities.reduce(
    (total, item) => total + Number(item.opportunity.expected_mrr),
    0,
  );

  const finance = getFinanceStats(financeData);

  const health = getDashboardHealth({
    overdueActivities: overdueActivities.length,
    opportunitiesWithoutNextAction: opportunitiesWithoutNextAction.length,
    overdueMoney: finance.overdue,
    pendingMoney: finance.pending,
  });

  return {
    generatedAt: new Date().toISOString(),
    health,
    metrics: {
      companies: companies.length,
      contacts: contacts.length,
      openOpportunities: openOpportunities.length,
      hotOpportunities: hotOpportunities.length,
      openPipelineValue,
      expectedMrr,
      overdueActivities: overdueActivities.length,
      todayActivities: todayActivities.length,
      opportunitiesWithoutNextAction: opportunitiesWithoutNextAction.length,
    },
    finance,
    todayActivities,
    overdueActivities,
    hotOpportunities,
    opportunitiesWithoutNextAction,
    recentCompanies: companies.slice(0, 5),
    recentContacts: contacts.slice(0, 5),
  };
}

function compareActivitiesByDate(a: ActivityListItem, b: ActivityListItem) {
  const aTime = a.activity.scheduled_at
    ? new Date(a.activity.scheduled_at).getTime()
    : 0;

  const bTime = b.activity.scheduled_at
    ? new Date(b.activity.scheduled_at).getTime()
    : 0;

  return aTime - bTime;
}

function getDashboardHealth(params: {
  overdueActivities: number;
  opportunitiesWithoutNextAction: number;
  overdueMoney: number;
  pendingMoney: number;
}): DashboardHealth {
  if (
    params.overdueActivities >= 3 ||
    params.opportunitiesWithoutNextAction >= 3 ||
    params.overdueMoney > 0
  ) {
    return "urgente";
  }

  if (
    params.overdueActivities > 0 ||
    params.opportunitiesWithoutNextAction > 0 ||
    params.pendingMoney > 0
  ) {
    return "atencion";
  }

  return "bien";
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}