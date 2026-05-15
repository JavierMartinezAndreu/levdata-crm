import { Activity } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function ActivitiesPage() {
  return (
    <ModulePlaceholder
      eyebrow="Seguimiento"
      title="Actividades"
      description="Organiza llamadas, emails, reuniones, tareas y próximos seguimientos."
      icon={Activity}
      nextStep="Construiremos vistas de hoy, próximas, vencidas y todas, con timeline y modal de completar actividad."
    />
  );
}