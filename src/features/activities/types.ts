export type ActivityType =
  | "llamada"
  | "email"
  | "whatsapp"
  | "reunionFisica"
  | "googleMeet"
  | "notaInterna"
  | "tarea"
  | "seguimiento"
  | "envioPropuesta"
  | "revisionTecnica"
  | "soporteMantenimiento";

export type ActivityStatus = "pendiente" | "realizada" | "cancelada" | "vencida";

export type Activity = {
  id: string;
  tipo: ActivityType;
  titulo: string;
  empresaId: string | null;
  empresaNombre: string | null;
  contactoIds: string[];
  contactosNombres: string[];
  oportunidadId: string | null;
  oportunidadNombre: string | null;
  proyectoId: string | null;
  proyectoNombre: string | null;
  sprintId: string | null;
  responsableId: string;
  responsableNombre: string;
  participantesInternosIds: string[];
  fechaHoraInicio: string;
  fechaHoraFin: string | null;
  estado: ActivityStatus;
  motivoPrevisto: string;
  resolucion: string | null;
  proximaAccion: string | null;
  fechaProximaAccion: string | null;
  notas: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityDbType = ActivityType;

export type ActivityDbStatus = ActivityStatus;

export type ActivityDb = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  assigned_to: string | null;
  company_id: string | null;
  contact_id: string | null;
  opportunity_id: string | null;
  project_id: string | null;
  type: ActivityDbType;
  title: string;
  description: string | null;
  status: ActivityDbStatus;
  scheduled_at: string | null;
  finished_at: string | null;
  completed_at: string | null;
  outcome: string | null;
  next_action: string | null;
  next_action_at: string | null;
  notes: string | null;
  deleted_at: string | null;
};

export type ActivityFormValues = {
  type: ActivityDbType;
  title: string;
  company_id: string;
  contact_id: string;
  opportunity_id: string;
  status: ActivityDbStatus;
  scheduled_at: string;
  finished_at: string;
  description: string;
  notes: string;
};

export type CompleteActivityValues = {
  outcome: string;
  next_action: string;
  next_action_at: string;
};

export type ActivityListItem = {
  activity: ActivityDb;
  company: {
    id: string;
    commercial_name: string;
  } | null;
  contact: {
    id: string;
    full_name: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
  } | null;
};