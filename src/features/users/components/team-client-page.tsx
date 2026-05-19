"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CircleDollarSign,
  FolderKanban,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamMemberCard } from "@/features/users/components/team-member-card";
import type { UserProfile, UserRole } from "@/features/users/types";
import {
  filterUsers,
  getTeamStats,
  getUserRoleLabel,
} from "@/features/users/utils";

type TeamClientPageProps = {
  users: UserProfile[];
};

const roleOptions: Array<{ label: string; value: UserRole | "all" }> = [
  { label: "Todos los roles", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Socio", value: "socio" },
  { label: "Comercial", value: "comercial" },
  { label: "Desarrollador", value: "desarrollador" },
  { label: "Finanzas", value: "finanzas" },
  { label: "Solo lectura", value: "soloLectura" },
];

export function TeamClientPage({ users }: TeamClientPageProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "all">("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const stats = useMemo(() => getTeamStats(users), [users]);

  const filteredUsers = useMemo(
    () => filterUsers({ users, search, role, status }),
    [users, search, role, status],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interno"
        title="Equipo"
        description="Gestiona usuarios, roles, asignaciones, actividad, cobros registrados y repartos internos."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <UserPlus className="mr-2 size-4" />
            Nuevo usuario
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Usuarios activos"
          value={String(stats.active)}
          description={`${stats.inactive} usuarios inactivos`}
          icon={Users}
          tone="primary"
          variation="equipo"
          variationDirection="flat"
        />

        <MetricCard
          title="Actividades asignadas"
          value={String(stats.assignedActivities)}
          description="Tareas y seguimientos actuales"
          icon={Activity}
          tone="info"
          variation="operación"
          variationDirection="flat"
        />

        <MetricCard
          title="Proyectos asignados"
          value={String(stats.assignedProjects)}
          description="Responsabilidades activas"
          icon={FolderKanban}
          tone="warning"
          variation="carga"
          variationDirection="flat"
        />

        <MetricCard
          title="Repartos registrados"
          value={<MoneyValue value={stats.payoutsTotal} size="lg" tone="warning" />}
          description="Pagos internos mock"
          icon={CircleDollarSign}
          tone="dark"
          variation="interno"
          variationDirection="flat"
        />
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.7fr] lg:p-10">
          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Roles preparados para Supabase
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Cada persona tendrá permisos según su rol cuando conectemos Auth y RLS.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              En esta fase mock solo simulamos roles. Más adelante Supabase Auth
              y políticas RLS harán que cada usuario vea y modifique únicamente
              lo que le corresponda.
            </p>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-5 ring-1 ring-white/10">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10 text-[#00ABBD]">
              <ShieldCheck className="size-6" />
            </div>

            <p className="font-extrabold text-white">Roles actuales</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {roleOptions
                .filter((option) => option.value !== "all")
                .map((option) => (
                  <span
                    key={option.value}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/75"
                  >
                    {option.label}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email, rol o especialidad..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole | "all")}
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getUserRoleLabel(option.value)}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | "active" | "inactive")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </section>

      {filteredUsers.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredUsers.map((user) => (
            <TeamMemberCard key={user.id} user={user} />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={Users}
          title="No hay usuarios con estos filtros"
          description="Prueba a cambiar el buscador, el rol o el estado seleccionado."
        />
      )}
    </div>
  );
}