export type CompanyStatus =
  | "prospecto"
  | "enConversacion"
  | "clienteActivo"
  | "clienteEnPausa"
  | "noEncaja"
  | "perdido"
  | "partner";

export type CompanyPotential = "bajo" | "medio" | "alto" | "estrategico";

export type Company = {
  id: string;
  nombreComercial: string;
  razonSocial: string;
  cif: string;
  web: string;
  emailGeneral: string;
  telefonoGeneral: string;
  sector: string;
  tamanoEmpresa: string;
  localidad: string;
  provincia: string;
  direccion: string;
  fuente: string;
  responsableInternoId: string;
  responsableNombre: string;
  estado: CompanyStatus;
  potencial: CompanyPotential;
  notas: string;
  contactosCount: number;
  oportunidadesAbiertas: number;
  proyectosActivos: number;
  pendienteCobro: number;
  totalCobrado: number;
  ultimaActividad: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyDbStatus =
  | "prospecto"
  | "contactado"
  | "oportunidad"
  | "cliente"
  | "inactivo"
  | "descartado";

export type CompanyDbPotential = "bajo" | "medio" | "alto" | "estrategico";

export type CompanyDbRiskLevel = "bajo" | "normal" | "alto";

export type CompanyDb = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  assigned_commercial_id: string | null;
  assigned_technical_id: string | null;
  commercial_name: string;
  legal_name: string | null;
  tax_id: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  sector: string | null;
  source: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  country: string;
  status: CompanyDbStatus;
  potential: CompanyDbPotential;
  risk_level: CompanyDbRiskLevel;
  status_reason: string | null;
  notes: string | null;
  deleted_at: string | null;
};

export type CompanyFormValues = {
  commercial_name: string;
  legal_name: string;
  tax_id: string;
  email: string;
  phone: string;
  website: string;
  sector: string;
  source: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  status: CompanyDbStatus;
  potential: CompanyDbPotential;
  notes: string;
};