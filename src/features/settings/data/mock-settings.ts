import type {
  CompanySettings,
  SettingsChecklistItem,
  VisualSettings,
} from "@/features/settings/types";

export const mockCompanySettings: CompanySettings = {
  brandName: "LevData",
  legalName: "LevData Studio",
  domain: "levdata.es",
  publicEmail: "info@levdata.es",
  internalEmail: "javier@levdata.es",
  location: "Comunidad Valenciana, España",
  description:
    "LevData crea CRMs, automatizaciones, dashboards, aplicaciones, integraciones y software a medida para empresas que quieren trabajar con más claridad y control.",
  primaryColor: "#00ABBD",
  secondaryColor: "#0099DD",
  accentColor: "#FF9933",
  crmMode: "mock",
};

export const mockVisualSettings: VisualSettings = {
  themeMode: "light",
  density: "comfortable",
  useSoraFont: true,
  useBrandGradients: true,
  useRoundedCards: true,
  useCompactTablesOnDesktop: false,
};

export const mockSupabaseChecklist: SettingsChecklistItem[] = [
  {
    id: "supabase_project",
    title: "Crear proyecto Supabase",
    description:
      "Proyecto externo que actuará como backend para Auth, PostgreSQL, Storage y RLS.",
    status: "future",
  },
  {
    id: "database_schema",
    title: "Crear esquema PostgreSQL",
    description:
      "Tablas para empresas, contactos, oportunidades, actividades, proyectos, sprints, funcionalidades, cobros, gastos y auditoría.",
    status: "future",
  },
  {
    id: "auth_profiles",
    title: "Configurar Auth y profiles",
    description:
      "Usuarios reales, perfiles internos y relación entre auth.users y user_profiles.",
    status: "future",
  },
  {
    id: "rls_policies",
    title: "Activar Row Level Security",
    description:
      "Políticas por rol para admin, socio, comercial, desarrollador, finanzas y solo lectura.",
    status: "future",
  },
  {
    id: "replace_mock",
    title: "Sustituir mock por repositorios",
    description:
      "Cambiar datos locales por repositorios preparados para consultar Supabase.",
    status: "future",
  },
];

export const mockStaticDeployChecklist: SettingsChecklistItem[] = [
  {
    id: "static_export",
    title: "Configurar export estático",
    description:
      'Añadir output: "export" en next.config cuando el frontend mock esté aprobado.',
    status: "pending",
  },
  {
    id: "base_path",
    title: "Preparar basePath /crm",
    description:
      "Configurar basePath y assetPrefix para servir el CRM en levdata.es/crm.",
    status: "pending",
  },
  {
    id: "disable_image_optimization",
    title: "Desactivar optimización de imágenes",
    description:
      "Necesario para export estático si usamos next/image con imágenes locales o remotas.",
    status: "pending",
  },
  {
    id: "hostinger_upload",
    title: "Subir carpeta exportada a Hostinger",
    description:
      "Generar build estática y subir el contenido final al directorio /crm del hosting.",
    status: "future",
  },
];

export const mockFrontendChecklist: SettingsChecklistItem[] = [
  {
    id: "dashboard",
    title: "Dashboard mock",
    description: "Métricas, gráficas, oportunidades, actividades y tesorería inicial.",
    status: "ready",
  },
  {
    id: "companies",
    title: "Empresas y contactos",
    description: "CRM base con relaciones multiempresa y detalle visual.",
    status: "ready",
  },
  {
    id: "sales_pipeline",
    title: "Pipeline comercial",
    description: "Kanban de oportunidades, filtros y detalle comercial.",
    status: "ready",
  },
  {
    id: "operations",
    title: "Proyectos, sprints y funcionalidades",
    description: "Gestión visual de avance técnico, entregas y cobros por proyecto.",
    status: "ready",
  },
  {
    id: "finance",
    title: "Mantenimientos y finanzas",
    description: "Control de MRR, ARR, deuda, gastos, cobros y repartos internos.",
    status: "ready",
  },
];