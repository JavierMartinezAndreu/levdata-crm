export type MonthlyPerformance = {
  month: string;
  oportunidades: number;
  ganadas: number;
  ingresos: number;
  gastos: number;
  beneficio: number;
};

export type ProjectProfitability = {
  projectId: string;
  projectName: string;
  companyName: string;
  budget: number;
  collected: number;
  expenses: number;
  profit: number;
  margin: number;
};

export type UserWorkload = {
  userId: string;
  userName: string;
  activities: number;
  projects: number;
  opportunities: number;
  collections: number;
};

export type SalesFunnelItem = {
  stage: string;
  count: number;
  value: number;
};

export type MaintenanceMetric = {
  name: string;
  mrr: number;
  debt: number;
  activeContracts: number;
};