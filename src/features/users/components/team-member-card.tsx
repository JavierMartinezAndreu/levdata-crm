import {
  Activity,
  CircleDollarSign,
  FolderKanban,
  Mail,
  ReceiptText,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { StatusChip } from "@/components/common/status-chip";
import type { UserProfile } from "@/features/users/types";
import {
  getUserFullName,
  getUserInitials,
  getUserRoleLabel,
  getUserRoleTone,
} from "@/features/users/utils";

type TeamMemberCardProps = {
  user: UserProfile;
};

export function TeamMemberCard({ user }: TeamMemberCardProps) {
  return (
    <article className="levdata-card overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-3xl bg-[#071B3A] text-base font-extrabold text-white shadow-lg shadow-slate-900/10">
              {getUserInitials(user)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-extrabold tracking-tight text-[#071B3A]">
                {getUserFullName(user)}
              </h2>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {user.rolSecundario}
              </p>

              <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Mail className="size-4 text-[#00ABBD]" />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusChip
              label={getUserRoleLabel(user.rol)}
              tone={getUserRoleTone(user.rol)}
            />

            <StatusChip
              label={user.activo ? "Activo" : "Inactivo"}
              tone={user.activo ? "success" : "neutral"}
              dot={false}
            />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-[#F6FAFC] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Especialidad
          </p>
          <p className="mt-2 text-sm leading-6 text-[#071B3A]">
            {user.especialidad}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat
            icon={Activity}
            label="Actividades"
            value={String(user.actividadAsignada)}
          />

          <MiniStat
            icon={FolderKanban}
            label="Proyectos"
            value={String(user.proyectosAsignados)}
          />

          <MiniStat
            icon={ReceiptText}
            label="Cobros"
            value={String(user.cobrosRegistrados)}
          />

          <div className="rounded-2xl bg-[#F6FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <CircleDollarSign className="size-4 text-[#FF9933]" />
              Repartos
            </div>
            <MoneyValue
              value={user.importeRepartos}
              size="sm"
              tone={user.importeRepartos > 0 ? "warning" : "muted"}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-[#DCEAF1]/70 pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Última actividad
          </p>
          <DateValue value={user.ultimaActividad} className="mt-1" />
        </div>
      </div>
    </article>
  );
}

type MiniStatProps = {
  icon: typeof Activity;
  label: string;
  value: string;
};

function MiniStat({ icon: Icon, label, value }: MiniStatProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
        <Icon className="size-4 text-[#00ABBD]" />
        {label}
      </div>
      <p className="text-lg font-extrabold text-[#071B3A]">{value}</p>
    </div>
  );
}