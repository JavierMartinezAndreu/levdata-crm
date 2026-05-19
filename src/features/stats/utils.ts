import type {
  MaintenanceMetric,
  MonthlyPerformance,
  ProjectProfitability,
  SalesFunnelItem,
  UserWorkload,
} from "@/features/stats/types";

export function getStatsSummary(params: {
  monthly: MonthlyPerformance[];
  projects: ProjectProfitability[];
  workload: UserWorkload[];
  funnel: SalesFunnelItem[];
  maintenance: MaintenanceMetric[];
}) {
  const totalIncome = params.monthly.reduce(
    (total, item) => total + item.ingresos,
    0,
  );

  const totalExpenses = params.monthly.reduce(
    (total, item) => total + item.gastos,
    0,
  );

  const totalProfit = params.monthly.reduce(
    (total, item) => total + item.beneficio,
    0,
  );

  const totalOpportunities = params.monthly.reduce(
    (total, item) => total + item.oportunidades,
    0,
  );

  const totalWon = params.monthly.reduce((total, item) => total + item.ganadas, 0);

  const conversionRate =
    totalOpportunities > 0 ? Math.round((totalWon / totalOpportunities) * 100) : 0;

  const averageMargin =
    params.projects.length > 0
      ? Math.round(
          params.projects.reduce((total, item) => total + item.margin, 0) /
            params.projects.length,
        )
      : 0;

  const totalMrr = params.maintenance.reduce((total, item) => total + item.mrr, 0);

  const totalDebt = params.maintenance.reduce(
    (total, item) => total + item.debt,
    0,
  );

  const totalActivities = params.workload.reduce(
    (total, item) => total + item.activities,
    0,
  );

  return {
    totalIncome,
    totalExpenses,
    totalProfit,
    totalOpportunities,
    totalWon,
    conversionRate,
    averageMargin,
    totalMrr,
    totalArr: totalMrr * 12,
    totalDebt,
    totalActivities,
  };
}

export function getBestProjects(projects: ProjectProfitability[]) {
  return [...projects].sort((a, b) => b.profit - a.profit).slice(0, 5);
}

export function getHighestWorkloadUsers(workload: UserWorkload[]) {
  return [...workload].sort((a, b) => b.activities - a.activities);
}