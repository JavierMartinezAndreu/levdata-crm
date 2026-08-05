"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarClock,
  Edit3,
  Flame,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CompanyDb } from "@/features/companies/types";
import { listCompaniesForContactSelect } from "@/features/contacts/data/contacts-service";
import { listContacts } from "@/features/contacts/data/contacts-service";
import type { ContactListItem } from "@/features/contacts/types";
import {
  createOpportunity,
  listOpportunities,
  softDeleteOpportunity,
  updateOpportunity,
} from "@/features/opportunities/data/opportunities-service";
import type {
  OpportunityDbStage,
  OpportunityDbStatus,
  OpportunityDbTemperature,
  OpportunityFormValues,
  OpportunityListItem,
} from "@/features/opportunities/types";

const emptyOpportunityForm: OpportunityFormValues = {
  company_id: "",
  contact_id: "",
  title: "",
  description: "",
  status: "abierta",
  stage: "detectada",
  temperature: "templada",
  probability: "20",
  one_time_value: "0",
  expected_mrr: "0",
  estimated_cost: "0",
  source: "",
  campaign: "",
  detected_need: "",
  next_action: "",
  next_action_at: "",
  expected_close_date: "",
  lost_reason: "",
  notes: "",
};

const statusOptions: { value: OpportunityDbStatus; label: string }[] = [
  { value: "abierta", label: "Abierta" },
  { value: "ganada", label: "Ganada" },
  { value: "perdida", label: "Perdida" },
  { value: "pospuesta", label: "Pospuesta" },
  { value: "no_encaja", label: "No encaja" },
];

const stageOptions: { value: OpportunityDbStage; label: string }[] = [
  { value: "detectada", label: "Detectada" },
  { value: "contactada", label: "Contactada" },
  { value: "reunion", label: "Reunión" },
  { value: "propuesta", label: "Propuesta" },
  { value: "negociacion", label: "Negociación" },
];

const temperatureOptions: {
  value: OpportunityDbTemperature;
  label: string;
}[] = [
  { value: "fria", label: "Fría" },
  { value: "templada", label: "Templada" },
  { value: "caliente", label: "Caliente" },
];

export function OpportunitiesRealtimePage() {
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [contacts, setContacts] = useState<ContactListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingOpportunityId, setEditingOpportunityId] = useState<string | null>(
    null,
  );
  const [form, setForm] =
    useState<OpportunityFormValues>(emptyOpportunityForm);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OpportunityDbStatus | "all">(
    "all",
  );
  const [stageFilter, setStageFilter] = useState<OpportunityDbStage | "all">(
    "all",
  );

  async function loadData() {
    try {
      setLoading(true);

      const [opportunitiesData, companiesData, contactsData] =
        await Promise.all([
          listOpportunities(),
          listCompaniesForContactSelect(),
          listContacts(),
        ]);

      setOpportunities(opportunitiesData);
      setCompanies(companiesData);
      setContacts(contactsData);
    } catch (error) {
      toast.error("No se han podido cargar las oportunidades.", {
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

  const filteredContacts = useMemo(() => {
    if (!form.company_id) return contacts;

    return contacts.filter(
      (item) => item.relation?.company_id === form.company_id,
    );
  }, [contacts, form.company_id]);

  const stats = useMemo(() => {
    const open = opportunities.filter(
      (item) => item.opportunity.status === "abierta",
    );

    const openValue = open.reduce(
      (total, item) => total + Number(item.opportunity.one_time_value),
      0,
    );

    const expectedMrr = open.reduce(
      (total, item) => total + Number(item.opportunity.expected_mrr),
      0,
    );

    const withoutNextAction = open.filter(
      (item) =>
        !item.opportunity.next_action || !item.opportunity.next_action_at,
    ).length;

    const hot = open.filter(
      (item) => item.opportunity.temperature === "caliente",
    ).length;

    return {
      total: opportunities.length,
      open: open.length,
      openValue,
      expectedMrr,
      withoutNextAction,
      hot,
    };
  }, [opportunities]);

  const filteredOpportunities = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return opportunities.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.opportunity.title.toLowerCase().includes(normalizedSearch) ||
        (item.company?.commercial_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.contact?.full_name ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.opportunity.source ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.opportunity.detected_need ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "all" || item.opportunity.status === statusFilter;

      const matchesStage =
        stageFilter === "all" || item.opportunity.stage === stageFilter;

      return matchesSearch && matchesStatus && matchesStage;
    });
  }, [opportunities, search, stageFilter, statusFilter]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.company_id) {
      toast.error("Selecciona una empresa.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("El título de la oportunidad es obligatorio.");
      return;
    }

    if (
      form.status === "abierta" &&
      (!form.next_action.trim() || !form.next_action_at.trim())
    ) {
      toast.error("Toda oportunidad abierta necesita próxima acción y fecha.");
      return;
    }

    if (
      (form.status === "perdida" ||
        form.status === "pospuesta" ||
        form.status === "no_encaja") &&
      !form.lost_reason.trim()
    ) {
      toast.error("Indica el motivo al perder, posponer o marcar no encaja.");
      return;
    }

    setSaving(true);

    try {
      if (editingOpportunityId) {
        await updateOpportunity(editingOpportunityId, form);
        toast.success("Oportunidad actualizada correctamente.");
      } else {
        await createOpportunity(form);
        toast.success("Oportunidad creada correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error(
        editingOpportunityId
          ? "No se ha podido actualizar la oportunidad."
          : "No se ha podido crear la oportunidad.",
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
    setEditingOpportunityId(null);
    setForm(emptyOpportunityForm);
    setFormOpen(true);
  }

  function openEditForm(item: OpportunityListItem) {
    setEditingOpportunityId(item.opportunity.id);
    setForm(mapOpportunityToForm(item));
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setEditingOpportunityId(null);
    setForm(emptyOpportunityForm);
    setFormOpen(false);
  }

  async function handleDelete(item: OpportunityListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${item.opportunity.title}"? Se ocultará del CRM, pero quedará trazabilidad en auditoría.`,
    );

    if (!confirmed) return;

    setDeletingId(item.opportunity.id);

    try {
      await softDeleteOpportunity(item.opportunity.id);

      setOpportunities((current) =>
        current.filter(
          (opportunityItem) =>
            opportunityItem.opportunity.id !== item.opportunity.id,
        ),
      );

      toast.success("Oportunidad eliminada correctamente.", {
        description: item.opportunity.title,
      });
    } catch (error) {
      toast.error("No se ha podido eliminar la oportunidad.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function updateForm<Key extends keyof OpportunityFormValues>(
    key: Key,
    value: OpportunityFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const formTitle = editingOpportunityId
    ? "Editar oportunidad"
    : "Nueva oportunidad";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Oportunidades"
        description="Pipeline comercial real: empresa, contacto, fase, valor, MRR, margen y próxima acción."
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
              Nueva oportunidad
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Abiertas"
          value={String(stats.open)}
          description="Oportunidades en seguimiento"
          icon={Target}
          tone="primary"
          variation="pipeline"
          variationDirection="flat"
        />

        <MetricCard
          title="Pipeline abierto"
          value={<MoneyValue value={stats.openValue} size="lg" />}
          description="Valor único estimado"
          icon={Building2}
          tone="success"
          variation="real"
          variationDirection="flat"
        />

        <MetricCard
          title="MRR previsto"
          value={<MoneyValue value={stats.expectedMrr} size="lg" />}
          description="Recurrente mensual potencial"
          icon={Flame}
          tone="warning"
          variation="mensual"
          variationDirection="flat"
        />

        <MetricCard
          title="Sin acción"
          value={String(stats.withoutNextAction)}
          description="Abiertas sin siguiente paso"
          icon={CalendarClock}
          tone="danger"
          variation="urgente"
          variationDirection="flat"
        />
      </section>

      {formOpen ? (
        <SectionCard
          title={formTitle}
          description="Registra una oportunidad comercial real y deja siempre definido el siguiente paso."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <SelectField
                label="Empresa"
                value={form.company_id}
                options={[
                  { value: "", label: "Selecciona empresa" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) => {
                  updateForm("company_id", value);
                  updateForm("contact_id", "");
                }}
                required
              />

              <SelectField
                label="Contacto"
                value={form.contact_id}
                options={[
                  { value: "", label: "Sin contacto" },
                  ...filteredContacts.map((item) => ({
                    value: item.contact.id,
                    label: `${item.contact.first_name} ${
                      item.contact.last_name ?? ""
                    }`.trim(),
                  })),
                ]}
                onChange={(value) => updateForm("contact_id", value)}
              />

              <FormField
                label="Título"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                required
                placeholder="Web corporativa, app interna, dashboard..."
              />

              <SelectField
                label="Estado"
                value={form.status}
                options={statusOptions}
                onChange={(value) => updateForm("status", value)}
              />

              <SelectField
                label="Fase"
                value={form.stage}
                options={stageOptions}
                onChange={(value) => updateForm("stage", value)}
              />

              <SelectField
                label="Temperatura"
                value={form.temperature}
                options={temperatureOptions}
                onChange={(value) => updateForm("temperature", value)}
              />

              <FormField
                label="Probabilidad %"
                value={form.probability}
                type="number"
                onChange={(value) => updateForm("probability", value)}
              />

              <FormField
                label="Valor único €"
                value={form.one_time_value}
                type="number"
                onChange={(value) => updateForm("one_time_value", value)}
              />

              <FormField
                label="MRR previsto €"
                value={form.expected_mrr}
                type="number"
                onChange={(value) => updateForm("expected_mrr", value)}
              />

              <FormField
                label="Coste estimado €"
                value={form.estimated_cost}
                type="number"
                onChange={(value) => updateForm("estimated_cost", value)}
              />

              <FormField
                label="Fuente"
                value={form.source}
                onChange={(value) => updateForm("source", value)}
                placeholder="Prospección, referido, web..."
              />

              <FormField
                label="Campaña"
                value={form.campaign}
                onChange={(value) => updateForm("campaign", value)}
              />

              <FormField
                label="Próxima acción"
                value={form.next_action}
                onChange={(value) => updateForm("next_action", value)}
                placeholder="Llamar, enviar propuesta, cerrar reunión..."
              />

              <FormField
                label="Fecha próxima acción"
                value={form.next_action_at}
                type="datetime-local"
                onChange={(value) => updateForm("next_action_at", value)}
              />

              <FormField
                label="Cierre previsto"
                value={form.expected_close_date}
                type="date"
                onChange={(value) => updateForm("expected_close_date", value)}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <TextAreaField
                label="Necesidad detectada"
                value={form.detected_need}
                onChange={(value) => updateForm("detected_need", value)}
                placeholder="Qué problema tiene el cliente y qué solución espera..."
              />

              <TextAreaField
                label="Motivo pérdida / pausa / no encaja"
                value={form.lost_reason}
                onChange={(value) => updateForm("lost_reason", value)}
                placeholder="Obligatorio si no sigue abierta o ganada."
              />

              <TextAreaField
                label="Notas internas"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
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
                ) : editingOpportunityId ? (
                  <Edit3 className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}

                {saving
                  ? "Guardando..."
                  : editingOpportunityId
                    ? "Guardar cambios"
                    : "Guardar oportunidad"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Pipeline real"
        description="Oportunidades guardadas en Supabase."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white pl-11"
              placeholder="Buscar por oportunidad, empresa, contacto, fuente..."
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as OpportunityDbStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
          >
            <option value="all">Todos los estados</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={stageFilter}
            onChange={(event) =>
              setStageFilter(event.target.value as OpportunityDbStage | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
          >
            <option value="all">Todas las fases</option>
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingState />
        ) : filteredOpportunities.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-3">
            {filteredOpportunities.map((item) => (
              <OpportunityCard
                key={item.opportunity.id}
                item={item}
                deleting={deletingId === item.opportunity.id}
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

function OpportunityCard({
  item,
  deleting,
  onEdit,
  onDelete,
}: {
  item: OpportunityListItem;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const opportunity = item.opportunity;
  const margin = Number(opportunity.estimated_margin);

  return (
    <article className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-extrabold text-[#071B3A]">
              {opportunity.title}
            </h3>

            <StatusChip
              label={getStatusLabel(opportunity.status)}
              tone={getStatusTone(opportunity.status)}
            />

            <StatusChip
              label={getTemperatureLabel(opportunity.temperature)}
              tone={getTemperatureTone(opportunity.temperature)}
              dot={false}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {item.company?.commercial_name || "Sin empresa"}
            {item.contact ? ` · ${item.contact.full_name}` : ""}
          </p>

          {opportunity.detected_need ? (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
              {opportunity.detected_need}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            <InfoPill label="Fase" value={getStageLabel(opportunity.stage)} />
            <InfoPill label="Prob." value={`${opportunity.probability}%`} />
            <InfoPill
              label="Próxima"
              value={opportunity.next_action || "Sin acción"}
            />
            <InfoPill label="Fuente" value={opportunity.source || "Sin dato"} />
          </div>
        </div>

        <div className="flex min-w-72 flex-col gap-3">
          <div className="grid grid-cols-3 gap-2 text-sm xl:text-right">
            <SmallMoney label="Valor" value={Number(opportunity.one_time_value)} />
            <SmallMoney label="MRR" value={Number(opportunity.expected_mrr)} />
            <SmallMoney label="Margen" value={margin} />
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

function LoadingState() {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#F6FAFC]">
      <div className="text-center">
        <Loader2 className="mx-auto size-7 animate-spin text-[#00ABBD]" />
        <p className="mt-3 text-sm font-bold text-[#071B3A]">
          Cargando oportunidades reales...
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-[#F6FAFC] p-8 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-white text-[#00ABBD] shadow-sm">
        <Target className="size-7" />
      </div>

      <p className="mt-4 font-extrabold text-[#071B3A]">
        No hay oportunidades que coincidan
      </p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Crea una oportunidad real o ajusta los filtros.
      </p>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
      {label}: {value}
    </span>
  );
}

function SmallMoney({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <MoneyValue value={value} size="sm" />
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
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

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
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

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
        {required ? <span className="text-[#FF9933]"> *</span> : null}
      </label>

      <select
        value={value}
        required={required}
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

function mapOpportunityToForm(
  item: OpportunityListItem,
): OpportunityFormValues {
  const opportunity = item.opportunity;

  return {
    company_id: opportunity.company_id,
    contact_id: opportunity.contact_id ?? "",
    title: opportunity.title,
    description: opportunity.description ?? "",
    status: opportunity.status,
    stage:
      opportunity.stage === "ganada" || opportunity.stage === "perdida"
        ? "negociacion"
        : opportunity.stage,
    temperature: opportunity.temperature,
    probability: String(opportunity.probability),
    one_time_value: String(opportunity.one_time_value),
    expected_mrr: String(opportunity.expected_mrr),
    estimated_cost: String(opportunity.estimated_cost),
    source: opportunity.source ?? "",
    campaign: opportunity.campaign ?? "",
    detected_need: opportunity.detected_need ?? "",
    next_action: opportunity.next_action ?? "",
    next_action_at: toDatetimeLocal(opportunity.next_action_at),
    expected_close_date: opportunity.expected_close_date ?? "",
    lost_reason: opportunity.lost_reason ?? "",
    notes: opportunity.notes ?? "",
  };
}

function toDatetimeLocal(value: string | null) {
  if (!value) return "";

  return value.slice(0, 16);
}

function getStatusLabel(status: OpportunityDbStatus) {
  const labels: Record<OpportunityDbStatus, string> = {
    abierta: "Abierta",
    ganada: "Ganada",
    perdida: "Perdida",
    pospuesta: "Pospuesta",
    no_encaja: "No encaja",
  };

  return labels[status];
}

function getStatusTone(
  status: OpportunityDbStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    OpportunityDbStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    abierta: "primary",
    ganada: "success",
    perdida: "danger",
    pospuesta: "warning",
    no_encaja: "neutral",
  };

  return tones[status];
}

function getStageLabel(stage: OpportunityDbStage) {
  const labels: Record<OpportunityDbStage, string> = {
    detectada: "Detectada",
    contactada: "Contactada",
    reunion: "Reunión",
    propuesta: "Propuesta",
    negociacion: "Negociación",
    ganada: "Ganada",
    perdida: "Perdida",
  };

  return labels[stage];
}

function getTemperatureLabel(temperature: OpportunityDbTemperature) {
  const labels: Record<OpportunityDbTemperature, string> = {
    fria: "Fría",
    templada: "Templada",
    caliente: "Caliente",
  };

  return labels[temperature];
}

function getTemperatureTone(
  temperature: OpportunityDbTemperature,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    OpportunityDbTemperature,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    fria: "info",
    templada: "warning",
    caliente: "danger",
  };

  return tones[temperature];
}