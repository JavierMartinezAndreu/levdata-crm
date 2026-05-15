import {
  Activity,
  Building2,
  CreditCard,
  FolderKanban,
  Landmark,
  Target,
} from "lucide-react";

export const dashboardMetrics = [
  {
    title: "Cobrado este mes",
    value: "3.200 €",
    description: "Ingresos registrados en mayo",
    icon: CreditCard,
    variation: "+18%",
    variationDirection: "up" as const,
    tone: "success" as const,
  },
  {
    title: "Pendiente de cobrar",
    value: "4.800 €",
    description: "Entre proyectos y mantenimientos",
    icon: Landmark,
    variation: "2 vencidos",
    variationDirection: "flat" as const,
    tone: "warning" as const,
  },
  {
    title: "Oportunidades abiertas",
    value: "8",
    description: "Pipeline comercial activo",
    icon: Target,
    variation: "+3",
    variationDirection: "up" as const,
    tone: "primary" as const,
  },
  {
    title: "Proyectos activos",
    value: "5",
    description: "Trabajos en desarrollo o mantenimiento",
    icon: FolderKanban,
    variation: "estable",
    variationDirection: "flat" as const,
    tone: "info" as const,
  },
  {
    title: "Empresas gestionadas",
    value: "10",
    description: "Clientes, prospectos y partners",
    icon: Building2,
    variation: "+2",
    variationDirection: "up" as const,
    tone: "dark" as const,
  },
  {
    title: "Actividades hoy",
    value: "7",
    description: "Tareas, llamadas y seguimientos",
    icon: Activity,
    variation: "3 urgentes",
    variationDirection: "flat" as const,
    tone: "primary" as const,
  },
];

export const dashboardSummary = {
  estimatedCash: 7200,
  mrr: 890,
  arr: 10680,
  openPipelineValue: 18500,
  weightedPipelineValue: 9200,
  overdueDebt: 1200,
  netProfit: 4100,
  activeMaintenances: 4,
};

export const monthlyFinanceData = [
  {
    month: "Ene",
    ingresos: 1200,
    gastos: 280,
    beneficio: 920,
  },
  {
    month: "Feb",
    ingresos: 1800,
    gastos: 420,
    beneficio: 1380,
  },
  {
    month: "Mar",
    ingresos: 2600,
    gastos: 730,
    beneficio: 1870,
  },
  {
    month: "Abr",
    ingresos: 2100,
    gastos: 610,
    beneficio: 1490,
  },
  {
    month: "May",
    ingresos: 3200,
    gastos: 890,
    beneficio: 2310,
  },
  {
    month: "Jun",
    ingresos: 4800,
    gastos: 1150,
    beneficio: 3650,
  },
];

export const expenseCategoryData = [
  {
    name: "Microsoft 365",
    value: 240,
  },
  {
    name: "Hosting",
    value: 180,
  },
  {
    name: "Herramientas IA",
    value: 320,
  },
  {
    name: "Publicidad",
    value: 210,
  },
  {
    name: "Subcontratación",
    value: 650,
  },
];

export const hotOpportunities = [
  {
    id: "opp_001",
    name: "CRM a medida",
    company: "Restaurante Costa Azul",
    amount: 6200,
    probability: 75,
    status: "Propuesta enviada",
    tone: "warning" as const,
    nextAction: "Llamar hoy",
  },
  {
    id: "opp_002",
    name: "Dashboard de ventas",
    company: "Inmobiliaria Levante",
    amount: 4800,
    probability: 60,
    status: "Negociación",
    tone: "primary" as const,
    nextAction: "Enviar ajuste de alcance",
  },
  {
    id: "opp_003",
    name: "Automatización administrativa",
    company: "Clínica Mediterránea",
    amount: 3500,
    probability: 45,
    status: "Reunión agendada",
    tone: "info" as const,
    nextAction: "Preparar demo",
  },
];

export const activeProjects = [
  {
    id: "project_001",
    name: "CRM operativo",
    company: "Restaurante Costa Azul",
    status: "En desarrollo",
    technicalProgress: 72,
    paymentProgress: 45,
    budget: 6200,
    collected: 2800,
    pending: 3400,
    nextMilestone: "Sprint 2 · Gestión avanzada",
  },
  {
    id: "project_002",
    name: "Dashboard de datos",
    company: "Inmobiliaria Levante",
    status: "Aceptado",
    technicalProgress: 38,
    paymentProgress: 20,
    budget: 4800,
    collected: 960,
    pending: 3840,
    nextMilestone: "Definir KPIs finales",
  },
];

export const todayActivities = [
  {
    id: "act_001",
    title: "Llamar a Restaurante Costa Azul",
    detail: "Seguimiento de propuesta enviada",
    type: "Llamada",
    priority: "Alta",
    tone: "warning" as const,
  },
  {
    id: "act_002",
    title: "Revisar mantenimiento mensual",
    detail: "Vencimiento próximo en 3 días",
    type: "Mantenimiento",
    priority: "Media",
    tone: "primary" as const,
  },
  {
    id: "act_003",
    title: "Preparar demo para Clínica Mediterránea",
    detail: "Reunión comercial pendiente",
    type: "Reunión",
    priority: "Media",
    tone: "info" as const,
  },
];

export const recentFinancialMovements = [
  {
    id: "mov_001",
    concept: "Pago parcial CRM operativo",
    company: "Restaurante Costa Azul",
    type: "Ingreso",
    amount: 1800,
    date: "2026-05-12",
    tone: "success" as const,
  },
  {
    id: "mov_002",
    concept: "Microsoft 365 Business Standard",
    company: "LevData interno",
    type: "Gasto",
    amount: -96,
    date: "2026-05-10",
    tone: "danger" as const,
  },
  {
    id: "mov_003",
    concept: "Mantenimiento mensual",
    company: "Hotel Bahía Norte",
    type: "Ingreso recurrente",
    amount: 290,
    date: "2026-05-08",
    tone: "primary" as const,
  },
];

export const upcomingMaintenances = [
  {
    id: "mnt_001",
    company: "Hotel Bahía Norte",
    project: "Sistema de reservas",
    amount: 290,
    dueDate: "2026-05-19",
    status: "Próximo",
    tone: "info" as const,
  },
  {
    id: "mnt_002",
    company: "Gimnasio UrbanFit",
    project: "Portal interno",
    amount: 180,
    dueDate: "2026-05-21",
    status: "Pendiente",
    tone: "warning" as const,
  },
  {
    id: "mnt_003",
    company: "Academia Nova",
    project: "Automatización de reportes",
    amount: 120,
    dueDate: "2026-05-14",
    status: "Vencido",
    tone: "danger" as const,
  },
];