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