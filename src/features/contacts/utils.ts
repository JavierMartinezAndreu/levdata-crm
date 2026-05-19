import type {
  CompanyContact,
  Contact,
  ContactRelation,
  DecisionRole,
} from "@/features/contacts/types";

export function getContactFullName(contact: Contact): string {
  return `${contact.nombre} ${contact.apellidos}`;
}

export function getDecisionRoleLabel(role: DecisionRole): string {
  const labels: Record<DecisionRole, string> = {
    decisor: "Decisor",
    tecnico: "Técnico",
    administracion: "Administración",
    influencer: "Influencer",
    usuarioFinal: "Usuario final",
    desconocido: "Desconocido",
  };

  return labels[role];
}

export function getContactRelationLabel(relation: ContactRelation): string {
  const labels: Record<ContactRelation, string> = {
    dueno: "Dueño",
    gerente: "Gerente",
    empleado: "Empleado",
    socio: "Socio",
    externo: "Externo",
    asesor: "Asesor",
    otro: "Otro",
  };

  return labels[relation];
}

export function getDecisionRoleTone(
  role: DecisionRole,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    DecisionRole,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    decisor: "dark",
    tecnico: "info",
    administracion: "warning",
    influencer: "primary",
    usuarioFinal: "success",
    desconocido: "neutral",
  };

  return tones[role];
}

export function getContactRelations(
  contactId: string,
  relations: CompanyContact[],
): CompanyContact[] {
  return relations.filter((relation) => relation.contactoId === contactId);
}

export function getPrimaryRelation(
  contactId: string,
  relations: CompanyContact[],
): CompanyContact | undefined {
  const contactRelations = getContactRelations(contactId, relations);

  return (
    contactRelations.find((relation) => relation.esContactoPrincipal) ??
    contactRelations[0]
  );
}

export function getContactStats(
  contacts: Contact[],
  relations: CompanyContact[],
) {
  const decisionMakers = relations.filter(
    (relation) => relation.rolDecision === "decisor",
  ).length;

  const multiCompanyContacts = contacts.filter(
    (contact) => getContactRelations(contact.id, relations).length > 1,
  ).length;

  return {
    total: contacts.length,
    decisionMakers,
    multiCompanyContacts,
    totalRelations: relations.length,
  };
}

export function filterContacts(params: {
  contacts: Contact[];
  relations: CompanyContact[];
  search: string;
  companyId: string;
  decisionRole: DecisionRole | "all";
  tag: string;
}) {
  const normalizedSearch = params.search.trim().toLowerCase();

  return params.contacts.filter((contact) => {
    const contactRelations = getContactRelations(contact.id, params.relations);

    const matchesSearch =
      normalizedSearch.length === 0 ||
      getContactFullName(contact).toLowerCase().includes(normalizedSearch) ||
      contact.emailPersonal.toLowerCase().includes(normalizedSearch) ||
      contact.telefonoPersonal.toLowerCase().includes(normalizedSearch) ||
      contact.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
      contactRelations.some((relation) =>
        relation.empresaNombre.toLowerCase().includes(normalizedSearch),
      );

    const matchesCompany =
      params.companyId === "all" ||
      contactRelations.some((relation) => relation.empresaId === params.companyId);

    const matchesDecisionRole =
      params.decisionRole === "all" ||
      contactRelations.some(
        (relation) => relation.rolDecision === params.decisionRole,
      );

    const matchesTag =
      params.tag === "all" || contact.tags.includes(params.tag);

    return matchesSearch && matchesCompany && matchesDecisionRole && matchesTag;
  });
}

export function getAllContactTags(contacts: Contact[]): string[] {
  return Array.from(new Set(contacts.flatMap((contact) => contact.tags))).sort();
}