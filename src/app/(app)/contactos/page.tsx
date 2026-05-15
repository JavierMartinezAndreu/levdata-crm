import { Contact } from "lucide-react";

import { ModulePlaceholder } from "@/components/common/module-placeholder";

export default function ContactsPage() {
  return (
    <ModulePlaceholder
      eyebrow="CRM"
      title="Contactos"
      description="Gestiona personas, decisores, perfiles técnicos y relaciones con empresas."
      icon={Contact}
      nextStep="Añadiremos contactos relacionados con una o varias empresas, roles de decisión, tags y actividad reciente."
    />
  );
}