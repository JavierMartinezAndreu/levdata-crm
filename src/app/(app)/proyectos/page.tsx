import { FolderKanban } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function ProjectsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Operaciones"
      title="Proyectos"
      description="Controla trabajos aceptados, sprints, funcionalidades, cobros y entregas."
      icon={FolderKanban}
      nextStep="Crearemos cards de proyectos con progreso técnico, progreso de cobro, beneficio estimado y detalle por tabs."
    />
  );
}