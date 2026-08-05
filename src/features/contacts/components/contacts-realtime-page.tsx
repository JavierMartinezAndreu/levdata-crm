"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Edit3,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CompanyDb } from "@/features/companies/types";
import {
  createContact,
  listCompaniesForContactSelect,
  listContacts,
  softDeleteContact,
  updateContact,
} from "@/features/contacts/data/contacts-service";
import type {
  CompanyContactDbRole,
  ContactDbPreferredChannel,
  ContactFormValues,
  ContactListItem,
} from "@/features/contacts/types";

const emptyContactForm: ContactFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  mobile: "",
  job_title: "",
  preferred_channel: "email",
  language: "es",
  contact_schedule: "",
  consent_notes: "",
  notes: "",
  company_id: "",
  company_role: "general",
  is_primary: false,
};

const channelOptions: {
  value: ContactDbPreferredChannel;
  label: string;
}[] = [
  { value: "email", label: "Email" },
  { value: "telefono", label: "Teléfono" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reunion", label: "Reunión" },
  { value: "indiferente", label: "Indiferente" },
];

const roleOptions: {
  value: CompanyContactDbRole;
  label: string;
}[] = [
  { value: "general", label: "General" },
  { value: "comercial", label: "Comercial" },
  { value: "tecnico", label: "Técnico" },
  { value: "administracion", label: "Administración" },
  { value: "emergencias", label: "Emergencias" },
  { value: "direccion", label: "Dirección" },
];

export function ContactsRealtimePage() {
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormValues>(emptyContactForm);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<CompanyContactDbRole | "all">(
    "all",
  );

  async function loadData() {
    try {
      setLoading(true);

      const [contactsData, companiesData] = await Promise.all([
        listContacts(),
        listCompaniesForContactSelect(),
      ]);

      setContacts(contactsData);
      setCompanies(companiesData);
    } catch (error) {
      toast.error("No se han podido cargar los contactos.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: contacts.length,
      withCompany: contacts.filter((item) => item.company).length,
      primary: contacts.filter((item) => item.relation?.is_primary).length,
      technical: contacts.filter((item) => item.relation?.role === "tecnico")
        .length,
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return contacts.filter((item) => {
      const fullName = `${item.contact.first_name} ${
        item.contact.last_name ?? ""
      }`.toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        fullName.includes(normalizedSearch) ||
        (item.contact.email ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.contact.phone ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.contact.mobile ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.contact.job_title ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.company?.commercial_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" || item.relation?.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [contacts, roleFilter, search]);

  const formTitle = editingContactId ? "Editar contacto" : "Nuevo contacto";
  const formDescription = editingContactId
    ? "Actualiza los datos reales del contacto y su relación con la empresa."
    : "Crea una persona de contacto y asóciala a una empresa real.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.first_name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingContactId) {
        await updateContact(editingContactId, form);

        toast.success("Contacto actualizado correctamente.");
      } else {
        await createContact(form);

        toast.success("Contacto creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error(
        editingContactId
          ? "No se ha podido actualizar el contacto."
          : "No se ha podido crear el contacto.",
        {
          description:
            error instanceof Error ? error.message : "Error desconocido.",
        },
      );
    } finally {
      setSaving(false);
    }
  }

  function openCreateForm() {
    setEditingContactId(null);
    setForm(emptyContactForm);
    setFormOpen(true);
  }

  function openEditForm(item: ContactListItem) {
    setEditingContactId(item.contact.id);
    setForm(mapContactToForm(item));
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setEditingContactId(null);
    setForm(emptyContactForm);
    setFormOpen(false);
  }

  async function handleDelete(item: ContactListItem) {
    const fullName = getFullName(item);

    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${fullName}"? Se ocultará del CRM, pero quedará trazabilidad en auditoría.`,
    );

    if (!confirmed) return;

    setDeletingId(item.contact.id);

    try {
      await softDeleteContact(item.contact.id);

      setContacts((current) =>
        current.filter((contactItem) => contactItem.contact.id !== item.contact.id),
      );

      toast.success("Contacto eliminado correctamente.", {
        description: fullName,
      });
    } catch (error) {
      toast.error("No se ha podido eliminar el contacto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function updateForm<Key extends keyof ContactFormValues>(
    key: Key,
    value: ContactFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Contactos"
        description="Personas reales asociadas a empresas, con rol, canal preferido y contacto principal."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadData}
              disabled={loading}
              className="rounded-2xl bg-white"
            >
              <RefreshCw className="mr-2 size-4" />
              Actualizar
            </Button>

            <Button
              type="button"
              onClick={openCreateForm}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <Plus className="mr-2 size-4" />
              Nuevo contacto
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Contactos"
          value={String(stats.total)}
          description="Registros reales"
          icon={UserRound}
          tone="primary"
          variation="Supabase"
          variationDirection="flat"
        />

        <MetricCard
          title="Con empresa"
          value={String(stats.withCompany)}
          description="Asociados a cliente/prospecto"
          icon={Building2}
          tone="success"
          variation="relación"
          variationDirection="flat"
        />

        <MetricCard
          title="Principales"
          value={String(stats.primary)}
          description="Marcados como contacto clave"
          icon={Star}
          tone="warning"
          variation="prioridad"
          variationDirection="flat"
        />

        <MetricCard
          title="Técnicos"
          value={String(stats.technical)}
          description="Rol técnico en empresa"
          icon={UserRound}
          tone="info"
          variation="operación"
          variationDirection="flat"
        />
      </section>

      {formOpen ? (
        <SectionCard title={formTitle} description={formDescription}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Nombre"
                value={form.first_name}
                onChange={(value) => updateForm("first_name", value)}
                required
              />

              <FormField
                label="Apellidos"
                value={form.last_name}
                onChange={(value) => updateForm("last_name", value)}
              />

              <FormField
                label="Cargo"
                value={form.job_title}
                onChange={(value) => updateForm("job_title", value)}
                placeholder="Gerente, CTO, administración..."
              />

              <FormField
                label="Email"
                value={form.email}
                type="email"
                onChange={(value) => updateForm("email", value)}
              />

              <FormField
                label="Teléfono"
                value={form.phone}
                onChange={(value) => updateForm("phone", value)}
              />

              <FormField
                label="Móvil"
                value={form.mobile}
                onChange={(value) => updateForm("mobile", value)}
              />

              <SelectField
                label="Empresa"
                value={form.company_id}
                options={[
                  { value: "", label: "Sin empresa asociada" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) => updateForm("company_id", value)}
              />

              <SelectField
                label="Rol en empresa"
                value={form.company_role}
                options={roleOptions}
                onChange={(value) => updateForm("company_role", value)}
              />

              <SelectField
                label="Canal preferido"
                value={form.preferred_channel}
                options={channelOptions}
                onChange={(value) => updateForm("preferred_channel", value)}
              />

              <FormField
                label="Idioma"
                value={form.language}
                onChange={(value) => updateForm("language", value)}
                placeholder="es"
              />

              <FormField
                label="Horario de contacto"
                value={form.contact_schedule}
                onChange={(value) => updateForm("contact_schedule", value)}
                placeholder="Mañanas, tardes, lunes-viernes..."
              />

              <div className="flex items-end">
                <label className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A]">
                  <input
                    type="checkbox"
                    checked={form.is_primary}
                    onChange={(event) =>
                      updateForm("is_primary", event.target.checked)
                    }
                    className="size-4 accent-[#00ABBD]"
                  />
                  Contacto principal
                </label>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <TextAreaField
                label="Consentimiento / notas de comunicación"
                value={form.consent_notes}
                onChange={(value) => updateForm("consent_notes", value)}
                placeholder="Canales permitidos, consentimiento, limitaciones..."
              />

              <TextAreaField
                label="Notas internas"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Contexto, personalidad, histórico, preferencias..."
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={closeForm}
                className="rounded-2xl bg-white"
              >
                <X className="mr-2 size-4" />
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : editingContactId ? (
                  <Edit3 className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}

                {saving
                  ? "Guardando..."
                  : editingContactId
                    ? "Guardar cambios"
                    : "Guardar contacto"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Listado de contactos"
        description="Contactos reales guardados en Supabase y vinculados a empresas."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white pl-11"
              placeholder="Buscar por nombre, email, teléfono, cargo o empresa..."
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) =>
              setRoleFilter(event.target.value as CompanyContactDbRole | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
          >
            <option value="all">Todos los roles</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#F6FAFC]">
            <div className="text-center">
              <Loader2 className="mx-auto size-7 animate-spin text-[#00ABBD]" />
              <p className="mt-3 text-sm font-bold text-[#071B3A]">
                Cargando contactos reales...
              </p>
            </div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="rounded-3xl bg-[#F6FAFC] p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-white text-[#00ABBD] shadow-sm">
              <UserRound className="size-7" />
            </div>

            <p className="mt-4 font-extrabold text-[#071B3A]">
              No hay contactos que coincidan
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea el primer contacto real o ajusta los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredContacts.map((item) => (
              <ContactCard
                key={item.contact.id}
                item={item}
                deleting={deletingId === item.contact.id}
                onEdit={() => openEditForm(item)}
                onDelete={() => handleDelete(item)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

type ContactCardProps = {
  item: ContactListItem;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function ContactCard({ item, deleting, onEdit, onDelete }: ContactCardProps) {
  const fullName = getFullName(item);

  return (
    <article className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-extrabold text-[#071B3A]">
              {fullName}
            </h3>

            {item.relation ? (
              <StatusChip
                label={getRoleLabel(item.relation.role)}
                tone={getRoleTone(item.relation.role)}
              />
            ) : (
              <StatusChip label="Sin empresa" tone="neutral" />
            )}

            {item.relation?.is_primary ? (
              <StatusChip label="Principal" tone="warning" dot={false} />
            ) : null}
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {item.contact.job_title || item.relation?.job_title || "Sin cargo"}
            {item.company ? ` · ${item.company.commercial_name}` : ""}
          </p>

          {item.contact.notes ? (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
              {item.contact.notes}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            {item.contact.email ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                <Mail className="size-3.5" />
                {item.contact.email}
              </span>
            ) : null}

            {item.contact.phone ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                <Phone className="size-3.5" />
                {item.contact.phone}
              </span>
            ) : null}

            {item.contact.mobile ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                <Phone className="size-3.5" />
                {item.contact.mobile}
              </span>
            ) : null}

            <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
              Canal: {getChannelLabel(item.contact.preferred_channel)}
            </span>
          </div>
        </div>

        <div className="flex min-w-60 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-sm xl:text-right">
            <SmallInfo
              label="Empresa"
              value={item.company?.commercial_name || "Sin asociar"}
            />
            <SmallInfo
              label="Horario"
              value={item.contact.contact_schedule || "Sin dato"}
            />
          </div>

          <div className="flex gap-2 xl:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="rounded-2xl bg-white"
            >
              <Edit3 className="mr-2 size-4" />
              Editar
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              disabled={deleting}
              className="rounded-2xl border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              {deleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

type SmallInfoProps = {
  label: string;
  value: string;
};

function SmallInfo({ label, value }: SmallInfoProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-extrabold text-[#071B3A]">
        {value}
      </p>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
        {required ? <span className="text-[#FF9933]"> *</span> : null}
      </label>

      <Input
        value={value}
        type={type}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

type TextAreaFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="min-h-28 w-full rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
        placeholder={placeholder}
      />
    </div>
  );
}

type SelectFieldProps<Value extends string> = {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
};

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className="h-12 w-full rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function mapContactToForm(item: ContactListItem): ContactFormValues {
  return {
    first_name: item.contact.first_name,
    last_name: item.contact.last_name ?? "",
    email: item.contact.email ?? "",
    phone: item.contact.phone ?? "",
    mobile: item.contact.mobile ?? "",
    job_title: item.relation?.job_title ?? item.contact.job_title ?? "",
    preferred_channel: item.contact.preferred_channel,
    language: item.contact.language,
    contact_schedule: item.contact.contact_schedule ?? "",
    consent_notes: item.contact.consent_notes ?? "",
    notes: item.contact.notes ?? "",
    company_id: item.relation?.company_id ?? "",
    company_role: item.relation?.role ?? "general",
    is_primary: item.relation?.is_primary ?? false,
  };
}

function getFullName(item: ContactListItem) {
  return `${item.contact.first_name} ${item.contact.last_name ?? ""}`.trim();
}

function getChannelLabel(channel: ContactDbPreferredChannel) {
  const labels: Record<ContactDbPreferredChannel, string> = {
    email: "Email",
    telefono: "Teléfono",
    whatsapp: "WhatsApp",
    reunion: "Reunión",
    indiferente: "Indiferente",
  };

  return labels[channel];
}

function getRoleLabel(role: CompanyContactDbRole) {
  const labels: Record<CompanyContactDbRole, string> = {
    general: "General",
    comercial: "Comercial",
    tecnico: "Técnico",
    administracion: "Administración",
    emergencias: "Emergencias",
    direccion: "Dirección",
  };

  return labels[role];
}

function getRoleTone(
  role: CompanyContactDbRole,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    CompanyContactDbRole,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    general: "neutral",
    comercial: "primary",
    tecnico: "info",
    administracion: "warning",
    emergencias: "danger",
    direccion: "dark",
  };

  return tones[role];
}