export type OpportunityStatus =
  | "detectada"
  | "contactada"
  | "reunionAgendada"
  | "diagnosticoHecho"
  | "propuestaEnviada"
  | "negociacion"
  | "ganada"
  | "perdida"
  | "pospuesta"
  | "noEncaja";

export type OpportunityTemperature = "fria" | "templada" | "caliente";

export type Opportunity = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  nombre: string;
  descripcion: string;
  valorEstimado: number;
  probabilidad: number;
  estado: OpportunityStatus;
  temperatura: OpportunityTemperature;
  fuente: string;
  responsableId: string;
  responsableNombre: string;
  fechaApertura: string;
  fechaCierreEstimada: string;
  fechaCierreReal: string | null;
  motivoPerdida: string | null;
  proximaAccion: string;
  fechaProximaAccion: string;
  ultimaActividad: string;
  contactosRelacionados: string[];
  notas: string;
  createdAt: string;
  updatedAt: string;
};