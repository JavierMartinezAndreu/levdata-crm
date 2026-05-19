import Link from "next/link";
import { ArrowRight, Building2, Mail, Phone, Tags, UserRound } from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { StatusChip } from "@/components/common/status-chip";
import { Button } from "@/components/ui/button";
import type { CompanyContact, Contact } from "@/features/contacts/types";
import {
  getContactFullName,
  getContactRelations,
  getDecisionRoleLabel,
  getDecisionRoleTone,
  getPrimaryRelation,
} from "@/features/contacts/utils";

type ContactCardProps = {
  contact: Contact;
  relations: CompanyContact[];
};

export function ContactCard({ contact, relations }: ContactCardProps) {
  const contactRelations = getContactRelations(contact.id, relations);
  const primaryRelation = getPrimaryRelation(contact.id, relations);

  return (
    <article className="levdata-card group overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
              <UserRound className="size-6" />
            </div>

            <h2 className="truncate text-lg font-extrabold tracking-tight text-[#071B3A]">
              {getContactFullName(contact)}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {primaryRelation?.cargo ?? "Sin cargo principal"}
            </p>
          </div>

          {primaryRelation ? (
            <StatusChip
              label={getDecisionRoleLabel(primaryRelation.rolDecision)}
              tone={getDecisionRoleTone(primaryRelation.rolDecision)}
            />
          ) : null}
        </div>

        <div className="mt-5 space-y-2">
          <InfoLine icon={Mail} value={primaryRelation?.emailProfesional || contact.emailPersonal} />
          <InfoLine icon={Phone} value={primaryRelation?.telefonoProfesional || contact.telefonoPersonal} />
          <InfoLine
            icon={Building2}
            value={
              contactRelations.length > 1
                ? `${contactRelations.length} empresas relacionadas`
                : primaryRelation?.empresaNombre ?? "Sin empresa asociada"
            }
          />
        </div>

        <div className="mt-5 rounded-2xl bg-[#F6FAFC] p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            <Tags className="size-4 text-[#0099DD]" />
            Tags
          </div>

          <div className="flex flex-wrap gap-2">
            {contact.tags.slice(0, 4).map((tag) => (
              <StatusChip key={tag} label={tag} tone="neutral" dot={false} />
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-[#DCEAF1]/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Última actividad
            </p>
            <DateValue value={contact.ultimaActividad} className="mt-1" />
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-2xl border-[#A1C7E0]/60 bg-white"
          >
            <Link href={`/contactos/${contact.id}`}>
              Ver detalle
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

type InfoLineProps = {
  icon: typeof Mail;
  value: string;
};

function InfoLine({ icon: Icon, value }: InfoLineProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-500">
      <Icon className="size-4 shrink-0 text-[#00ABBD]" />
      <span className="truncate">{value}</span>
    </div>
  );
}