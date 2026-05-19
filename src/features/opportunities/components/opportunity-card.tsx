import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarClock,
  Percent,
  Thermometer,
  UserRound,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { Opportunity } from "@/features/opportunities/types";
import {
  getOpportunityStatusLabel,
  getOpportunityStatusTone,
  getTemperatureLabel,
  getTemperatureTone,
} from "@/features/opportunities/utils";

type OpportunityCardProps = {
  opportunity: Opportunity;
  compact?: boolean;
};

export function OpportunityCard({
  opportunity,
  compact = false,
}: OpportunityCardProps) {
  return (
    <article className="rounded-2xl border border-[#DCEAF1]/80 bg-white p-4 shadow-sm transition hover:border-[#00ABBD]/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-extrabold leading-snug text-[#071B3A]">
            {opportunity.nombre}
          </h3>

          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <Building2 className="size-4 text-[#0099DD]" />
            <span className="truncate">{opportunity.empresaNombre}</span>
          </p>
        </div>

        <StatusChip
          label={getTemperatureLabel(opportunity.temperatura)}
          tone={getTemperatureTone(opportunity.temperatura)}
          dot={false}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#F6FAFC] p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Valor
          </p>
          <MoneyValue value={opportunity.valorEstimado} size="sm" />
        </div>

        <div className="rounded-2xl bg-[#F6FAFC] p-3">
          <p className="flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-slate-400">
            <Percent className="size-3.5 text-[#00ABBD]" />
            Prob.
          </p>
          <p className="text-sm font-extrabold text-[#071B3A]">
            {opportunity.probabilidad}%
          </p>
        </div>
      </div>

      {!compact ? (
        <div className="mt-4 space-y-2">
          <InfoLine
            icon={UserRound}
            value={`Responsable: ${opportunity.responsableNombre}`}
          />
          <InfoLine
            icon={CalendarClock}
            value={`Próxima acción: ${opportunity.proximaAccion}`}
          />
          <InfoLine
            icon={Thermometer}
            value={`Estado: ${getOpportunityStatusLabel(opportunity.estado)}`}
          />
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 border-t border-[#DCEAF1]/70 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DateValue value={opportunity.fechaProximaAccion} />
          <StatusChip
            label={getOpportunityStatusLabel(opportunity.estado)}
            tone={getOpportunityStatusTone(opportunity.estado)}
          />
        </div>

        <Button
          asChild
          variant="outline"
          className="w-full rounded-2xl border-[#A1C7E0]/60 bg-white"
        >
          <Link href={`/oportunidades/${opportunity.id}`}>
            Ver detalle
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

type InfoLineProps = {
  icon: typeof UserRound;
  value: string;
};

function InfoLine({ icon: Icon, value }: InfoLineProps) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-500">
      <Icon className="mt-0.5 size-4 shrink-0 text-[#00ABBD]" />
      <span className="line-clamp-2">{value}</span>
    </div>
  );
}