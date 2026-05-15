import { BarChart3 } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function StatsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Análisis"
      title="Estadísticas"
      description="Analiza rendimiento comercial, operativo y financiero de LevData."
      icon={BarChart3}
      nextStep="Añadiremos gráficos de conversión, cobros, deuda, rentabilidad por proyecto y carga de trabajo."
    />
  );
}