export type DecisionRole =
  | "decisor"
  | "tecnico"
  | "administracion"
  | "influencer"
  | "usuarioFinal"
  | "desconocido";

export type ContactRelation =
  | "dueno"
  | "gerente"
  | "empleado"
  | "socio"
  | "externo"
  | "asesor"
  | "otro";

export type Contact = {
  id: string;
  nombre: string;
  apellidos: string;
  emailPersonal: string;
  telefonoPersonal: string;
  linkedin: string;
  notas: string;
  tags: string[];
  ultimaActividad: string;
  createdAt: string;
  updatedAt: string;
};

export type CompanyContact = {
  id: string;
  contactoId: string;
  empresaId: string;
  empresaNombre: string;
  cargo: string;
  emailProfesional: string;
  telefonoProfesional: string;
  rolDecision: DecisionRole;
  relacion: ContactRelation;
  esContactoPrincipal: boolean;
  notasRelacion: string;
};