import { Wrench } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function MaintenancePage() {
  return (
    <ModulePlaceholder
      eyebrow="Recurrentes"
      title="Mantenimientos"
      description="Gestiona contratos recurrentes, vencimientos, deuda y MRR."
      icon={Wrench}
      nextStep="Añadiremos vencimientos próximos, mantenimientos activos, deuda acumulada, cobro parcial y estados visuales."
    />
  );
}