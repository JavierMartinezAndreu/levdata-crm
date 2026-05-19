import type { UserProfile, UserRole } from "@/features/users/types";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "dark"
  | "primary";

export function getUserFullName(user: UserProfile): string {
  return `${user.nombre} ${user.apellidos}`;
}

export function getUserInitials(user: UserProfile): string {
  const first = user.nombre.charAt(0);
  const last = user.apellidos.charAt(0);

  return `${first}${last}`.toUpperCase();
}

export function getUserRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    socio: "Socio",
    comercial: "Comercial",
    desarrollador: "Desarrollador",
    finanzas: "Finanzas",
    soloLectura: "Solo lectura",
  };

  return labels[role];
}

export function getUserRoleTone(role: UserRole): Tone {
  const tones: Record<UserRole, Tone> = {
    admin: "dark",
    socio: "primary",
    comercial: "warning",
    desarrollador: "info",
    finanzas: "success",
    soloLectura: "neutral",
  };

  return tones[role];
}

export function getTeamStats(users: UserProfile[]) {
  const activeUsers = users.filter((user) => user.activo);
  const inactiveUsers = users.filter((user) => !user.activo);

  return {
    total: users.length,
    active: activeUsers.length,
    inactive: inactiveUsers.length,
    assignedActivities: users.reduce(
      (total, user) => total + user.actividadAsignada,
      0,
    ),
    assignedProjects: users.reduce(
      (total, user) => total + user.proyectosAsignados,
      0,
    ),
    registeredPayments: users.reduce(
      (total, user) => total + user.cobrosRegistrados,
      0,
    ),
    payoutsTotal: users.reduce((total, user) => total + user.importeRepartos, 0),
  };
}

export function filterUsers(params: {
  users: UserProfile[];
  search: string;
  role: UserRole | "all";
  status: "all" | "active" | "inactive";
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.users.filter((user) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      getUserFullName(user).toLowerCase().includes(normalizedSearch) ||
      user.email.toLowerCase().includes(normalizedSearch) ||
      user.rolSecundario.toLowerCase().includes(normalizedSearch) ||
      user.especialidad.toLowerCase().includes(normalizedSearch);

    const matchesRole = params.role === "all" || user.rol === params.role;

    const matchesStatus =
      params.status === "all" ||
      (params.status === "active" && user.activo) ||
      (params.status === "inactive" && !user.activo);

    return matchesSearch && matchesRole && matchesStatus;
  });
}