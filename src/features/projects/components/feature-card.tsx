"use client";

import { CheckCircle2, Play, Rocket, XCircle } from "lucide-react";
import { toast } from "sonner";

import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { Feature } from "@/features/projects/types";
import {
  getFeaturePriorityLabel,
  getFeaturePriorityTone,
  getFeatureStatusLabel,
  getFeatureStatusTone,
} from "@/features/projects/utils";

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  function handleMockAction(action: string) {
    toast.success("Acción mock registrada", {
      description: `${action}: ${feature.titulo}`,
    });
  }

  const isCancelled = feature.estado === "cancelada";

  return (
    <article
      className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
        isCancelled
          ? "border-red-100 bg-red-50/40 opacity-75"
          : "border-[#DCEAF1]/80"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h4
            className={`font-extrabold leading-snug text-[#071B3A] ${
              isCancelled ? "line-through decoration-red-400" : ""
            }`}
          >
            {feature.titulo}
          </h4>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {feature.descripcion}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <StatusChip
            label={getFeatureStatusLabel(feature.estado)}
            tone={getFeatureStatusTone(feature.estado)}
          />
          <StatusChip
            label={getFeaturePriorityLabel(feature.prioridad)}
            tone={getFeaturePriorityTone(feature.prioridad)}
            dot={false}
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-[#F6FAFC] p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Responsable
        </p>
        <p className="mt-1 text-sm font-semibold text-[#071B3A]">
          {feature.responsableNombre}
        </p>
      </div>

      {feature.motivoCancelacion ? (
        <div className="mt-3 rounded-2xl bg-red-50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-red-700">
            Motivo cancelación
          </p>
          <p className="mt-1 text-sm leading-6 text-red-700">
            {feature.motivoCancelacion}
          </p>
        </div>
      ) : null}

      {!isCancelled ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {feature.estado === "planificada" ? (
            <Button
              size="sm"
              className="rounded-xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              onClick={() => handleMockAction("Iniciar funcionalidad")}
            >
              <Play className="mr-2 size-4" />
              Iniciar
            </Button>
          ) : null}

          {feature.estado === "enDesarrollo" ? (
            <Button
              size="sm"
              className="rounded-xl bg-[#071B3A] text-white hover:bg-[#0B2A57]"
              onClick={() => handleMockAction("Marcar desarrollada")}
            >
              <Rocket className="mr-2 size-4" />
              Marcar desarrollada
            </Button>
          ) : null}

          {feature.estado === "desarrollada" ? (
            <Button
              size="sm"
              className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => handleMockAction("Entregar funcionalidad")}
            >
              <CheckCircle2 className="mr-2 size-4" />
              Entregar
            </Button>
          ) : null}

          {feature.estado !== "entregada" ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50"
              onClick={() => handleMockAction("Cancelar funcionalidad")}
            >
              <XCircle className="mr-2 size-4" />
              Cancelar
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}