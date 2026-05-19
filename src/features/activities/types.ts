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