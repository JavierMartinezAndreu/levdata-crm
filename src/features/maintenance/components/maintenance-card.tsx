"use client";

import { CalendarClock, CheckCircle2, Gift, PauseCircle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type {
  MaintenanceContract,
  MaintenanceDue,
} from "@/features/maintenance/types";
import {
  getContractCurrentDue,
  getMaintenanceDueStatusLabel,
  getMaintenanceDueStatusTone,
  getMaintenanceStatusLabel,
  getMaintenanceStatusTone,
  getPeriodicityLabel,
} from "@/features/maintenance/utils";

type MaintenanceCardProps = {
  contract: MaintenanceContract;
  dues: MaintenanceDue[];
};

export function MaintenanceCard({ contract, dues }: MaintenanceCardProps) {
  const currentDue = getContractCurrentDue(contract.id, dues);

  function handleMockAction(action: string) {
    toast.success("Acción mock registrada", {
      description: `${action}: ${contract.nombre}`,
    });
  }

  return (
    <article className="levdata-card overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusChip
                label={getMaintenanceStatusLabel(contract.estado)}
                tone={getMaintenanceStatusTone(contract.estado)}
              />
              <StatusChip
                label={getPeriodicityLabel(contract.periodicidad)}
                tone="info"
                dot={false}
              />
            </div>

            <h2 className="text-lg font-extrabold tracking-tight text-[#071B3A]">
              {contract.nombre}
            </h2>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {contract.empresaNombre} · {contract.proyectoNombre}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              {contract.descripcion}
            </p>
          </div>

          <div className="rounded-3xl bg-[#F6FAFC] p-4 lg:min-w-64">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Precio por periodo
            </p>
            <MoneyValue value={contract.precioPorPeriodo} size="lg" />

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <CalendarClock className="size-4 text-[#0099DD]" />
              Próximo cobro:
            </div>
            <DateValue value={contract.proximaFechaCobro} className="mt-1" />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <MiniBox label="Horas incluidas" value={`${contract.horasIncluidas} h`} />
          <MiniBox
            label="Deuda acumulada"
            value={<MoneyValue value={contract.deudaAcumulada} size="sm" tone={contract.deudaAcumulada > 0 ? "warning" : "positive"} />}
          />
          <MiniBox
            label="Estado vencimiento"
            value={
              currentDue ? (
                <StatusChip
                  label={getMaintenanceDueStatusLabel(currentDue.estado)}
                  tone={getMaintenanceDueStatusTone(currentDue.estado)}
                />
              ) : (
                <StatusChip label="Sin vencimiento" tone="neutral" />
              )
            }
          />
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-[#F6FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Incluye
            </p>
            <ul className="mt-3 space-y-2">
              {contract.queIncluye.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#071B3A]">
                  <span className="mt-1 size-1.5 rounded-full bg-[#00ABBD]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-[#F6FAFC] p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              No incluye
            </p>
            <ul className="mt-3 space-y-2">
              {contract.queNoIncluye.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[#071B3A]">
                  <span className="mt-1 size-1.5 rounded-full bg-[#FF9933]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {currentDue ? (
          <div className="mt-5 rounded-2xl border border-[#DCEAF1]/70 bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Vencimiento actual
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <DateValue value={currentDue.fechaVencimiento} />
                  <MoneyValue
                    value={currentDue.importeEsperado - currentDue.importeCobrado}
                    size="md"
                    tone={
                      currentDue.importeEsperado - currentDue.importeCobrado > 0
                        ? "warning"
                        : "positive"
                    }
                  />
                </div>
              </div>

              <StatusChip
                label={getMaintenanceDueStatusLabel(currentDue.estado)}
                tone={getMaintenanceDueStatusTone(currentDue.estado)}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#DCEAF1]/70 pt-4">
          <Button
            size="sm"
            className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
            onClick={() => handleMockAction("Marcar cobrado")}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Marcar cobrado
          </Button>

          <Button
            size="sm"
            className="rounded-xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            onClick={() => handleMockAction("Registrar cobro parcial")}
          >
            Cobro parcial
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="rounded-xl border-[#A1C7E0]/60 bg-white"
            onClick={() => handleMockAction("Perdonar periodo")}
          >
            <Gift className="mr-2 size-4" />
            Perdonar
          </Button>

          {contract.estado === "pausado" ? (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-[#A1C7E0]/60 bg-white"
              onClick={() => handleMockAction("Reanudar mantenimiento")}
            >
              <RotateCcw className="mr-2 size-4" />
              Reanudar
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl border-[#A1C7E0]/60 bg-white"
              onClick={() => handleMockAction("Pausar mantenimiento")}
            >
              <PauseCircle className="mr-2 size-4" />
              Pausar
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}

type MiniBoxProps = {
  label: string;
  value: React.ReactNode;
};

function MiniBox({ label, value }: MiniBoxProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-extrabold text-[#071B3A]">{value}</div>
    </div>
  );
}