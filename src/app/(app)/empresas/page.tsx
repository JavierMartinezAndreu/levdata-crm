import { Building2 } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function CompaniesPage() {
  return (
    <ModulePlaceholder
      eyebrow="CRM"
      title="Empresas"
      description="Gestiona clientes, prospectos y partners de LevData."
      icon={Building2}
      nextStep="Construiremos buscador, filtros por estado, sector, responsable y potencial, cards resumen y listado responsive."
    />
  );
}