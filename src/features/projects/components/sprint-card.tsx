"use client";

import { CheckCircle2, PauseCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/features/projects/components/feature-card";
import type { Feature, Sprint } from "@/features/projects/types";
import {
  getDeliveryProgress,
  getPaymentProgress,
  getSprintFeatures,
  getSprintStatusLabel,
  getSprintStatusTone,
  getTechnicalProgress,
} from "@/features/projects/utils";

type SprintCardProps = {
  sprint: Sprint;
  features: Feature[];
};

export function SprintCard({ sprint, features }: SprintCardProps) {
  const sprintFeatures = getSprintFeatures(sprint.id, features);
  const technicalProgress = getTechnicalProgress(sprintFeatures);
  const deliveryProgress = getDeliveryProgress(sprintFeatures);
  const paymentProgress = getPaymentProgress(
    sprint.precioPresupuestado,
    sprint.cobrado,
  );
  const pending = sprint.precioPresupuestado - sprint.cobrado;

  const developedFeatures = sprintFeatures.filter(
    (feature) => feature.estado === "desarrollada",
  );

  function handleMockAction(action: string) {
    toast.success("Acción mock registrada", {
      description: `${action}: ${sprint.nombre}`,
    });
  }

  return (
    <article className="levdata-card overflow-hidden rounded-[2rem]">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusChip
                label={getSprintStatusLabel(sprint.estado)}
                tone={getSprintStatusTone(sprint.estado)}
              />
              {pending > 0 ? (
                <StatusChip label="Tiene pendiente" tone="warning" dot={false} />
              ) : (
                <StatusChip label="Cobrado" tone="success" dot={false} />
              )}
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-[#071B3A]">
              {sprint.nombre}
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {sprint.descripcion}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>
                Previsto: <DateValue value={sprint.fechaEntregaPrevista} />
              </span>
              {sprint.fechaEntregaReal ? (
                <span>
                  Entregado: <DateValue value={sprint.fechaEntregaReal} />
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl bg-[#F6FAFC] p-4 sm:grid-cols-3 lg:min-w-[420px]">
            <MiniMoney label="Presupuesto" value={sprint.precioPresupuestado} />
            <MiniMoney label="Cobrado" value={sprint.cobrado} tone="positive" />
            <MiniMoney label="Pendiente" value={pending} tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <ProgressCard
            title="Progreso técnico"
            description="Incluye desarrolladas y entregadas"
            value={technicalProgress}
            tone="primary"
          />

          <ProgressCard
            title="Progreso de entrega"
            description="Solo funcionalidades entregadas"
            value={deliveryProgress}
            tone="success"
          />

          <ProgressCard
            title="Progreso de cobro"
            description="Cobrado sobre presupuesto"
            value={paymentProgress}
            tone="warning"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            size="sm"
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={developedFeatures.length === 0}
            onClick={() => handleMockAction("Pasar desarrolladas a entregadas")}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Pasar desarrolladas a entregadas
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-[#A1C7E0]/60 bg-white"
            onClick={() => handleMockAction("Pausar sprint")}
          >
            <PauseCircle className="mr-2 size-4" />
            Pausar
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50"
            onClick={() => handleMockAction("Cancelar sprint")}
          >
            <XCircle className="mr-2 size-4" />
            Cancelar
          </Button>
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="font-extrabold text-[#071B3A]">
            Funcionalidades del sprint
          </h4>

          {sprintFeatures.length > 0 ? (
            <div className="grid gap-3 xl:grid-cols-2">
              {sprintFeatures.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-[#F6FAFC] p-4 text-sm text-slate-500">
              Este sprint todavía no tiene funcionalidades mock.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

type MiniMoneyProps = {
  label: string;
  value: number;
  tone?: "default" | "positive" | "warning" | "danger" | "muted";
};

function MiniMoney({ label, value, tone = "default" }: MiniMoneyProps) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <MoneyValue value={value} size="sm" tone={tone} />
    </div>
  );
}