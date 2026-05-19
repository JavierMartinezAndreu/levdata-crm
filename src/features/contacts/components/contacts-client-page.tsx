"use client";

import { useMemo, useState } from "react";
import { Building2, Network, Search, UserCheck, UserRound } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContactCard } from "./contract-card";
import type {
  CompanyContact,
  Contact,
  DecisionRole,
} from "@/features/contacts/types";
import {
  filterContacts,
  getAllContactTags,
  getContactStats,
} from "@/features/contacts/utils";

type ContactsClientPageProps = {
  contacts: Contact[];
  relations: CompanyContact[];
};

const roleOptions: Array<{ label: string; value: DecisionRole | "all" }> = [
  { label: "Todos los roles", value: "all" },
  { label: "Decisor", value: "decisor" },
  { label: "Técnico", value: "tecnico" },
  { label: "Administración", value: "administracion" },
  { label: "Influencer", value: "influencer" },
  { label: "Usuario final", value: "usuarioFinal" },
  { label: "Desconocido", value: "desconocido" },
];

export function ContactsClientPage({
  contacts,
  relations,
}: ContactsClientPageProps) {
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("all");
  const [decisionRole, setDecisionRole] = useState<DecisionRole | "all">("all");
  const [tag, setTag] = useState("all");

  const stats = useMemo(() => getContactStats(contacts, relations), [
    contacts,
    relations,
  ]);

  const companyOptions = useMemo(() => {
    const uniqueCompanies = Array.from(
      new Map(
        relations.map((relation) => [
          relation.empresaId,
          {
            id: relation.empresaId,
            name: relation.empresaNombre,
          },
        ]),
      ).values(),
    ).sort((a, b) => a.name.localeCompare(b.name));

    return uniqueCompanies;
  }, [relations]);

  const tagOptions = useMemo(() => getAllContactTags(contacts), [contacts]);

  const filteredContacts = useMemo(
    () =>
      filterContacts({
        contacts,
        relations,
        search,
        companyId,
        decisionRole,
        tag,
      }),
    [contacts, relations, search, companyId, decisionRole, tag],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Contactos"
        description="Gestiona personas, decisores, perfiles técnicos y relaciones con varias empresas."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <UserRound className="mr-2 size-4" />
            Nuevo contacto
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total contactos"
          value={String(stats.total)}
          description="Personas registradas en el CRM"
          icon={UserRound}
          tone="primary"
          variation="mock"
          variationDirection="flat"
        />

        <MetricCard
          title="Decisores"
          value={String(stats.decisionMakers)}
          description="Relaciones con capacidad de decisión"
          icon={UserCheck}
          tone="dark"
          variation="clave"
          variationDirection="flat"
        />

        <MetricCard
          title="Multiempresa"
          value={String(stats.multiCompanyContacts)}
          description="Contactos vinculados a varias empresas"
          icon={Network}
          tone="warning"
          variation="importante"
          variationDirection="flat"
        />

        <MetricCard
          title="Relaciones"
          value={String(stats.totalRelations)}
          description="Vínculos contacto-empresa"
          icon={Building2}
          tone="info"
          variation="+ relaciones"
          variationDirection="up"
        />
      </section>

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 xl:grid-cols-[1fr_240px_220px_200px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, email, teléfono, empresa o tag..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Todas las empresas</option>
            {companyOptions.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>

          <select
            value={decisionRole}
            onChange={(event) =>
              setDecisionRole(event.target.value as DecisionRole | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            <option value="all">Todos los tags</option>
            {tagOptions.map((tagOption) => (
              <option key={tagOption} value={tagOption}>
                {tagOption}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredContacts.length > 0 ? (
        <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              relations={relations}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={UserRound}
          title="No hay contactos con estos filtros"
          description="Prueba a cambiar el buscador, la empresa, el rol de decisión o el tag seleccionado."
        />
      )}
    </div>
  );
}