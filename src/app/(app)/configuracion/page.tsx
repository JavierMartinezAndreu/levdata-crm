import { Settings } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Sistema"
      title="Configuración"
      description="Preferencias internas del CRM, datos de empresa y ajustes visuales mock."
      icon={Settings}
      nextStep="Añadiremos perfil de LevData, preferencias visuales, roles mock y configuración preparada para Supabase."
    />
  );
}