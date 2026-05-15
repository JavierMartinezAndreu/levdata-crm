import { Target } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function OpportunitiesPage() {
  return (
    <ModulePlaceholder
      eyebrow="Comercial"
      title="Oportunidades"
      description="Visualiza el pipeline comercial de LevData desde la detección hasta la venta."
      icon={Target}
      nextStep="Crearemos un kanban por estado, tarjetas de oportunidad, valor ponderado, temperatura comercial y acciones mock."
    />
  );
}