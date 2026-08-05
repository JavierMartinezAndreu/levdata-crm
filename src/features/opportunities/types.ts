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

export type OpportunityDbStatus =
  | "abierta"
  | "ganada"
  | "perdida"
  | "pospuesta"
  | "no_encaja";

export type OpportunityDbStage =
  | "detectada"
  | "contactada"
  | "reunion"
  | "propuesta"
  | "negociacion"
  | "ganada"
  | "perdida";

export type OpportunityDbTemperature = "fria" | "templada" | "caliente";

export type OpportunityDb = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  assigned_to: string | null;
  company_id: string;
  contact_id: string | null;
  title: string;
  description: string | null;
  status: OpportunityDbStatus;
  stage: OpportunityDbStage;
  temperature: OpportunityDbTemperature;
  probability: number;
  one_time_value: number;
  expected_mrr: number;
  estimated_cost: number;
  estimated_margin: number;
  source: string | null;
  campaign: string | null;
  referred_by: string | null;
  competitor: string | null;
  detected_need: string | null;
  next_action: string | null;
  next_action_at: string | null;
  follow_up_activity_id: string | null;
  expected_close_date: string | null;
  lost_reason: string | null;
  won_at: string | null;
  lost_at: string | null;
  notes: string | null;
  deleted_at: string | null;
};

export type OpportunityFormValues = {
  company_id: string;
  contact_id: string;
  title: string;
  description: string;
  status: OpportunityDbStatus;
  stage: OpportunityDbStage;
  temperature: OpportunityDbTemperature;
  probability: string;
  one_time_value: string;
  expected_mrr: string;
  estimated_cost: string;
  source: string;
  campaign: string;
  detected_need: string;
  next_action: string;
  next_action_at: string;
  expected_close_date: string;
  lost_reason: string;
  notes: string;
};

export type OpportunityListItem = {
  opportunity: OpportunityDb;
  company: {
    id: string;
    commercial_name: string;
  } | null;
  contact: {
    id: string;
    full_name: string;
  } | null;
};