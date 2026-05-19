export type UserRole =
  | "admin"
  | "socio"
  | "comercial"
  | "desarrollador"
  | "finanzas"
  | "soloLectura";

export type UserProfile = {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  rol: UserRole;
  rolSecundario: string;
  avatarUrl: string;
  activo: boolean;
  especialidad: string;
  actividadAsignada: number;
  proyectosAsignados: number;
  cobrosRegistrados: number;
  repartosRecibidos: number;
  importeRepartos: number;
  ultimaActividad: string;
  createdAt: string;
  updatedAt: string;
};