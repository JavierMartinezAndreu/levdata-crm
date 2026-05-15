import {
  Activity,
  BarChart3,
  Building2,
  Contact,
  CreditCard,
  FolderKanban,
  Home,
  Landmark,
  Settings,
  ShieldCheck,
  Target,
  Users,
  Wrench,
} from "lucide-react";

export type NavigationItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  group: "general" | "crm" | "operaciones" | "interno";
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    group: "general",
  },
  {
    title: "Empresas",
    href: "/empresas",
    icon: Building2,
    group: "crm",
  },
  {
    title: "Contactos",
    href: "/contactos",
    icon: Contact,
    group: "crm",
  },
  {
    title: "Oportunidades",
    href: "/oportunidades",
    icon: Target,
    group: "crm",
  },
  {
    title: "Actividades",
    href: "/actividades",
    icon: Activity,
    group: "crm",
  },
  {
    title: "Proyectos",
    href: "/proyectos",
    icon: FolderKanban,
    group: "operaciones",
  },
  {
    title: "Mantenimientos",
    href: "/mantenimientos",
    icon: Wrench,
    group: "operaciones",
  },
  {
    title: "Finanzas",
    href: "/finanzas",
    icon: Landmark,
    group: "interno",
  },
  {
    title: "Equipo",
    href: "/equipo",
    icon: Users,
    group: "interno",
  },
  {
    title: "Estadísticas",
    href: "/estadisticas",
    icon: BarChart3,
    group: "interno",
  },
  {
    title: "Auditoría",
    href: "/auditoria",
    icon: ShieldCheck,
    group: "interno",
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
    group: "interno",
  },
];

export const quickActions = [
  {
    title: "Nueva oportunidad",
    href: "/oportunidades",
    icon: Target,
  },
  {
    title: "Nuevo proyecto",
    href: "/proyectos",
    icon: FolderKanban,
  },
  {
    title: "Nuevo cobro",
    href: "/finanzas",
    icon: CreditCard,
  },
];