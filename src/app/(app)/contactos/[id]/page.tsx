import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  mockCompanyContacts,
  mockContacts,
} from "@/features/contacts/data/mock-contacts";
import {
  getContactFullName,
  getContactRelationLabel,
  getContactRelations,
  getDecisionRoleLabel,
  getDecisionRoleTone,
} from "@/features/contacts/utils";

export function generateStaticParams() {
  return mockContacts.map((contact) => ({
    id: contact.id,
  }));
}

type ContactDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;
  const contact = mockContacts.find((item) => item.id === id);

  if (!contact) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Contacto no encontrado"
          title="No hemos encontrado este contacto"
          description="Es posible que el identificador no exista en los datos mock."
          actions={
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/contactos">
                <ArrowLeft className="mr-2 size-4" />
                Volver a contactos
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const relations = getContactRelations(contact.id, mockCompanyContacts);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalle de contacto"
        title={getContactFullName(contact)}
        description="Ficha personal, empresas asociadas, roles de decisión y actividad reciente."
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/contactos">
                <ArrowLeft className="mr-2 size-4" />
                Volver
              </Link>
            </Button>

            <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
              Nueva actividad
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
          <div>
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-white/10 text-[#00ABBD] ring-1 ring-white/10">
              <UserRound className="size-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {getContactFullName(contact)}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {contact.notas}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <StatusChip key={tag} label={tag} tone="primary" dot={false} />
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A1C7E0]">
              Empresas relacionadas
            </p>

            <div className="mt-4 space-y-3">
              {relations.map((relation) => (
                <div
                  key={relation.id}
                  className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">
                        {relation.empresaNombre}
                      </p>
                      <p className="mt-1 text-sm text-white/55">
                        {relation.cargo}
                      </p>
                    </div>

                    <StatusChip
                      label={getDecisionRoleLabel(relation.rolDecision)}
                      tone={getDecisionRoleTone(relation.rolDecision)}
                    />
                  </div>

                  {relation.esContactoPrincipal ? (
                    <p className="mt-3 text-xs font-bold text-[#FF9933]">
                      Contacto principal
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title="Datos personales"
          description="Información general del contacto."
        >
          <div className="space-y-4">
            <InfoRow icon={Mail} label="Email personal" value={contact.emailPersonal} />
            <InfoRow icon={Phone} label="Teléfono personal" value={contact.telefonoPersonal} />
            <InfoRow icon={ExternalLink} label="LinkedIn" value={contact.linkedin} />
            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Última actividad
              </p>
              <DateValue value={contact.ultimaActividad} className="mt-2" />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Relaciones con empresas"
          description="Un contacto puede pertenecer o influir en varias empresas."
        >
          <div className="space-y-4">
            {relations.map((relation) => (
              <div
                key={relation.id}
                className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-extrabold text-[#071B3A]">
                      {relation.empresaNombre}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {relation.cargo} · {getContactRelationLabel(relation.relacion)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusChip
                      label={getDecisionRoleLabel(relation.rolDecision)}
                      tone={getDecisionRoleTone(relation.rolDecision)}
                    />
                    {relation.esContactoPrincipal ? (
                      <StatusChip label="Principal" tone="warning" dot={false} />
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <InfoRow
                    icon={Mail}
                    label="Email profesional"
                    value={relation.emailProfesional}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Teléfono profesional"
                    value={relation.telefonoProfesional}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                  {relation.notasRelacion}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

type InfoRowProps = {
  icon: typeof Mail;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F6FAFC] p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-all text-sm font-semibold text-[#071B3A]">
          {value}
        </p>
      </div>
    </div>
  );
}