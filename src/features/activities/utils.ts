import {
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Mail,
  MessageCircle,
  Mic,
  Monitor,
  Phone,
  RefreshCcw,
  Settings2,
  UsersRound,
  Wrench,
  XCircle,
} from "lucide-react";

import type {
  Activity,
  ActivityStatus,
  ActivityType,
} from "@/features/activities/types";

export function getActivityTypeLabel(type: ActivityType): string {
  const labels: Record<ActivityType, string> = {
    llamada: "Llamada",
    email: "Email",
    whatsapp: "WhatsApp",
    reunionFisica: "Reunión física",
    googleMeet: "Google Meet",
    notaInterna: "Nota interna",
    tarea: "Tarea",
    seguimiento: "Seguimiento",
    envioPropuesta: "Envío propuesta",
    revisionTecnica: "Revisión técnica",
    soporteMantenimiento: "Soporte mantenimiento",
  };

  return labels[type];
}

export function getActivityStatusLabel(status: ActivityStatus): string {
  const labels: Record<ActivityStatus, string> = {
    pendiente: "Pendiente",
    realizada: "Realizada",
    cancelada: "Cancelada",
    vencida: "Vencida",
  };

  return labels[status];
}

export function getActivityStatusTone(
  status: ActivityStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    ActivityStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    pendiente: "primary",
    realizada: "success",
    cancelada: "neutral",
    vencida: "danger",
  };

  return tones[status];
}

export function getActivityTypeIcon(type: ActivityType) {
  const icons: Record<ActivityType, typeof Phone> = {
    llamada: Phone,
    email: Mail,
    whatsapp: MessageCircle,
    reunionFisica: UsersRound,
    googleMeet: Monitor,
    notaInterna: ClipboardList,
    tarea: CheckCircle2,
    seguimiento: RefreshCcw,
    envioPropuesta: Mail,
    revisionTecnica: Settings2,
    soporteMantenimiento: Wrench,
  };

  return icons[type];
}

export function getActivityStatusIcon(status: ActivityStatus) {
  const icons: Record<ActivityStatus, typeof CheckCircle2> = {
    pendiente: CalendarClock,
    realizada: CheckCircle2,
    cancelada: XCircle,
    vencida: XCircle,
  };

  return icons[status];
}

export function getActivityStats(activities: Activity[]) {
  return {
    total: activities.length,
    today: activities.filter((activity) =>
      activity.fechaHoraInicio.startsWith("2026-05-19"),
    ).length,
    upcoming: activities.filter((activity) => activity.estado === "pendiente")
      .length,
    overdue: activities.filter((activity) => activity.estado === "vencida").length,
    completed: activities.filter((activity) => activity.estado === "realizada")
      .length,
  };
}

export function filterActivities(params: {
  activities: Activity[];
  search: string;
  status: ActivityStatus | "all";
  type: ActivityType | "all";
  view: "hoy" | "proximas" | "vencidas" | "todas";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.activities.filter((activity) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      activity.titulo.toLowerCase().includes(normalizedSearch) ||
      activity.motivoPrevisto.toLowerCase().includes(normalizedSearch) ||
      activity.empresaNombre?.toLowerCase().includes(normalizedSearch) ||
      activity.contactosNombres.some((contact) =>
        contact.toLowerCase().includes(normalizedSearch),
      ) ||
      activity.responsableNombre.toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      params.status === "all" || activity.estado === params.status;

    const matchesType = params.type === "all" || activity.tipo === params.type;

    const matchesView =
      params.view === "todas" ||
      (params.view === "hoy" &&
        activity.fechaHoraInicio.startsWith("2026-05-19")) ||
      (params.view === "proximas" && activity.estado === "pendiente") ||
      (params.view === "vencidas" && activity.estado === "vencida");

    return matchesSearch && matchesStatus && matchesType && matchesView;
  });
}

export function sortActivitiesByDate(activities: Activity[]): Activity[] {
  return [...activities].sort(
    (a, b) =>
      new Date(a.fechaHoraInicio).getTime() -
      new Date(b.fechaHoraInicio).getTime(),
  );
}