import { ShieldCheck } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function AuditPage() {
  return (
    <ModulePlaceholder
      eyebrow="Historial"
      title="Auditoría"
      description="Consulta cambios de estado, cobros, gastos, entregas y acciones internas."
      icon={ShieldCheck}
      nextStep="Crearemos timeline de auditoría con antes/después, usuario responsable, entidad afectada y fecha."
    />
  );
}