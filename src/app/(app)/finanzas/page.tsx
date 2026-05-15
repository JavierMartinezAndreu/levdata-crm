import { Landmark } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function FinancePage() {
  return (
    <ModulePlaceholder
      eyebrow="Tesorería"
      title="Caja LevData"
      description="Control interno de ingresos, gastos, beneficio, deuda, MRR, ARR y repartos."
      icon={Landmark}
      nextStep="Construiremos gráficas de ingresos vs gastos, movimientos, deuda pendiente, mantenimientos y repartos a socios."
    />
  );
}