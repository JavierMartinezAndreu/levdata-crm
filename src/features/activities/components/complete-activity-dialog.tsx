"use client";

import { useState } from "react";
import { CalendarPlus, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import type { Activity } from "@/features/activities/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type CompleteActivityDialogProps = {
  activity: Activity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CompleteActivityDialog({
  activity,
  open,
  onOpenChange,
}: CompleteActivityDialogProps) {
  const [resolution, setResolution] = useState("");
  const [createNextAction, setCreateNextAction] = useState(true);
  const [nextAction, setNextAction] = useState("");

  function handleComplete() {
    if (!activity) return;

    toast.success("Actividad completada en modo mock", {
      description: createNextAction
        ? `Se habría creado una próxima acción: ${nextAction || "sin definir"}`
        : "No se ha creado próxima acción.",
    });

    setResolution("");
    setNextAction("");
    setCreateNextAction(true);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[2rem] border-[#DCEAF1] bg-white p-0">
        <div className="levdata-gradient h-2 rounded-t-[2rem]" />

        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-[#071B3A]">
              Completar actividad
            </DialogTitle>
          </DialogHeader>

          {activity ? (
            <div className="mt-5 rounded-2xl bg-[#F6FAFC] p-4">
              <p className="font-bold text-[#071B3A]">{activity.titulo}</p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {activity.motivoPrevisto}
              </p>
            </div>
          ) : null}

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-[#071B3A]">
                Resolución
              </label>
              <Textarea
                value={resolution}
                onChange={(event) => setResolution(event.target.value)}
                placeholder="Ejemplo: El cliente acepta la propuesta pero pide dividir el proyecto en dos fases..."
                className="min-h-28 rounded-2xl border-[#A1C7E0]/60 bg-white"
              />
            </div>

            <label className="flex items-start gap-3 rounded-2xl border border-[#DCEAF1] bg-[#F6FAFC] p-4">
              <input
                type="checkbox"
                checked={createNextAction}
                onChange={(event) => setCreateNextAction(event.target.checked)}
                className="mt-1 size-4 accent-[#00ABBD]"
              />
              <span>
                <span className="block font-bold text-[#071B3A]">
                  Crear próxima acción mock
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  En backend real esto crearía otra actividad vinculada.
                </span>
              </span>
            </label>

            {createNextAction ? (
              <div>
                <label className="mb-2 block text-sm font-bold text-[#071B3A]">
                  Próxima acción
                </label>
                <Textarea
                  value={nextAction}
                  onChange={(event) => setNextAction(event.target.value)}
                  placeholder="Ejemplo: Enviar propuesta final revisada el viernes..."
                  className="min-h-24 rounded-2xl border-[#A1C7E0]/60 bg-white"
                />
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-2xl border-[#A1C7E0]/60 bg-white"
              >
                Cancelar
              </Button>

              <Button
                type="button"
                onClick={handleComplete}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                {createNextAction ? (
                  <CalendarPlus className="mr-2 size-4" />
                ) : (
                  <CheckCircle2 className="mr-2 size-4" />
                )}
                Completar actividad
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}