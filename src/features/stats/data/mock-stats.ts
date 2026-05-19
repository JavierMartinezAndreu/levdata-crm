import type {
  MaintenanceMetric,
  MonthlyPerformance,
  ProjectProfitability,
  SalesFunnelItem,
  UserWorkload,
} from "@/features/stats/types";

export const monthlyPerformanceData: MonthlyPerformance[] = [
  {
    month: "Ene",
    oportunidades: 2,
    ganadas: 0,
    ingresos: 0,
    gastos: 84,
    beneficio: -84,
  },
  {
    month: "Feb",
    oportunidades: 3,
    ganadas: 1,
    ingresos: 900,
    gastos: 120,
    beneficio: 780,
  },
  {
    month: "Mar",
    oportunidades: 4,
    ganadas: 1,
    ingresos: 1480,
    gastos: 180,
    beneficio: 1300,
  },
  {
    month: "Abr",
    oportunidades: 5,
    ganadas: 2,
    ingresos: 2490,
    gastos: 84,
    beneficio: 2406,
  },
  {
    month: "May",
    oportunidades: 8,
    ganadas: 1,
    ingresos: 3760,
    gastos: 630,
    beneficio: 3130,
  },
  {
    month: "Jun",
    oportunidades: 6,
    ganadas: 2,
    ingresos: 4800,
    gastos: 900,
    beneficio: 3900,
  },
];

export const projectProfitabilityData: ProjectProfitability[] = [
  {
    projectId: "project_001",
    projectName: "CRM operativo",
    companyName: "Restaurante Costa Azul",
    budget: 6200,
    collected: 2800,
    expenses: 420,
    profit: 2380,
    margin: 85,
  },
  {
    projectId: "project_002",
    projectName: "Dashboard de datos",
    companyName: "Inmobiliaria Levante",
    budget: 4800,
    collected: 960,
    expenses: 180,
    profit: 780,
    margin: 81,
  },
  {
    projectId: "project_003",
    projectName: "Sistema de reservas",
    companyName: "Hotel Bahía Norte",
    budget: 2200,
    collected: 2200,
    expenses: 260,
    profit: 1940,
    margin: 88,
  },
  {
    projectId: "project_004",
    projectName: "Automatización de reportes",
    companyName: "Academia Nova",
    budget: 1600,
    collected: 1480,
    expenses: 120,
    profit: 1360,
    margin: 92,
  },
  {
    projectId: "project_005",
    projectName: "Portal interno",
    companyName: "Gimnasio UrbanFit",
    budget: 3000,
    collected: 900,
    expenses: 210,
    profit: 690,
    margin: 77,
  },
];

export const userWorkloadData: UserWorkload[] = [
  {
    userId: "user_javier",
    userName: "Javier Martínez",
    activities: 7,
    projects: 3,
    opportunities: 5,
    collections: 4,
  },
  {
    userId: "user_socio",
    userName: "Socio Data",
    activities: 5,
    projects: 2,
    opportunities: 3,
    collections: 2,
  },
  {
    userId: "user_dev_future",
    userName: "Lucía Moreno",
    activities: 2,
    projects: 1,
    opportunities: 0,
    collections: 0,
  },
  {
    userId: "user_finance_mock",
    userName: "Marina Ríos",
    activities: 3,
    projects: 0,
    opportunities: 0,
    collections: 3,
  },
];

export const salesFunnelData: SalesFunnelItem[] = [
  {
    stage: "Detectadas",
    count: 8,
    value: 18500,
  },
  {
    stage: "Contactadas",
    count: 6,
    value: 14200,
  },
  {
    stage: "Reunión",
    count: 4,
    value: 12300,
  },
  {
    stage: "Propuesta",
    count: 3,
    value: 9700,
  },
  {
    stage: "Negociación",
    count: 2,
    value: 7600,
  },
  {
    stage: "Ganadas",
    count: 1,
    value: 1200,
  },
];

export const maintenanceMetricsData: MaintenanceMetric[] = [
  {
    name: "Hotel Bahía Norte",
    mrr: 290,
    debt: 0,
    activeContracts: 1,
  },
  {
    name: "Gimnasio UrbanFit",
    mrr: 180,
    debt: 180,
    activeContracts: 0,
  },
  {
    name: "Academia Nova",
    mrr: 120,
    debt: 120,
    activeContracts: 1,
  },
  {
    name: "Restaurante Costa Azul",
    mrr: 390,
    debt: 0,
    activeContracts: 1,
  },
  {
    name: "Inmobiliaria Levante",
    mrr: 217,
    debt: 400,
    activeContracts: 1,
  },
];