import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  FolderKanban,
  MapPin,
  Target,
  Users,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { Company } from "@/features/companies/types";
import {
  getCompanyPotentialLabel,
  getCompanyPotentialTone,
  getCompanyStatusLabel,
  getCompanyStatusTone,
} from "@/features/companies/utils";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="levdata-card group overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
              <Building2 className="size-6" />
            </div>

            <h2 className="truncate text-lg font-extrabold tracking-tight text-[#071B3A]">
              {company.nombreComercial}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {company.sector} · {company.tamanoEmpresa}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusChip
              label={getCompanyStatusLabel(company.estado)}
              tone={getCompanyStatusTone(company.estado)}
            />
            <StatusChip
              label={getCompanyPotentialLabel(company.potencial)}
              tone={getCompanyPotentialTone(company.potencial)}
              dot={false}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-[#0099DD]" />
            {company.localidad}, {company.provincia}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <MiniStat
            icon={Users}
            label="Contactos"
            value={String(company.contactosCount)}
          />
          <MiniStat
            icon={Target}
            label="Oportunidades"
            value={String(company.oportunidadesAbiertas)}
          />
          <MiniStat
            icon={FolderKanban}
            label="Proyectos"
            value={String(company.proyectosActivos)}
          />
          <div className="rounded-2xl bg-[#F6FAFC] p-3">
            <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
              <CircleDollarSign className="size-4 text-[#FF9933]" />
              Pendiente
            </div>
            <MoneyValue
              value={company.pendienteCobro}
              size="sm"
              tone={company.pendienteCobro > 0 ? "warning" : "muted"}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#DCEAF1]/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Última actividad
            </p>
            <DateValue value={company.ultimaActividad} className="mt-1" />
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-[#A1C7E0]/60 bg-white"
          >
            <Link href={`/empresas/${company.id}`}>
              Ver detalle
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

type MiniStatProps = {
  icon: typeof Users;
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