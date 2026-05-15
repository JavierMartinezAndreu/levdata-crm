import { Users } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function TeamPage() {
  return (
    <ModulePlaceholder
      eyebrow="Interno"
      title="Equipo"
      description="Gestiona usuarios, roles, asignaciones, actividad y repartos internos."
      icon={Users}
      nextStep="Simularemos Javier, socio data/comercial, futuro desarrollador y usuario finanzas con roles y métricas."
    />
  );
}