"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity as ActivityIcon,
  CalendarCheck2,
  CalendarClock,
  CheckCircle2,
  Edit3,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  completeActivity,
  createActivity,
  listActivities,
  softDeleteActivity,
  updateActivity,
} from "@/features/activities/data/activities-service";
import type {
  ActivityDbStatus,
  ActivityDbType,
  ActivityFormValues,
  ActivityListItem,
  CompleteActivityValues,
} from "@/features/activities/types";
import {
  getActivityStatusLabel,
  getActivityStatusTone,
  getActivityTypeIcon,
  getActivityTypeLabel,
} from "@/features/activities/utils";
import type { CompanyDb } from "@/features/companies/types";
import {
  listCompaniesForContactSelect,
  listContacts,
} from "@/features/contacts/data/contacts-service";
import type { ContactListItem } from "@/features/contacts/types";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";

const emptyActivityForm: ActivityFormValues = {
  type: "tarea",
  title: "",
  company_id: "",
  contact_id: "",
  opportunity_id: "",
  status: "pendiente",
  scheduled_at: "",
  finished_at: "",
  description: "",
  notes: "",
};

const emptyCompleteForm: CompleteActivityValues = {
  outcome: "",
  next_action: "",
  next_action_at: "",
};

const viewOptions: Array<{
  label: string;
  value: "hoy" | "proximas" | "vencidas" | "todas";
}> = [
  { label: "Hoy", value: "hoy" },
  { label: "Próximas", value: "proximas" },
  { label: "Vencidas", value: "vencidas" },
  { label: "Todas", value: "todas" },
];

const statusOptions: Array<{ label: string; value: ActivityDbStatus | "all" }> =
  [
    { label: "Todos los estados", value: "all" },
    { label: "Pendiente", value: "pendiente" },
    { label: "Realizada", value: "realizada" },
    { label: "Cancelada", value: "cancelada" },
    { label: "Vencida", value: "vencida" },
  ];

const formStatusOptions: Array<{ label: string; value: ActivityDbStatus }> = [
  { label: "Pendiente", value: "pendiente" },
  { label: "Realizada", value: "realizada" },
  { label: "Cancelada", value: "cancelada" },
  { label: "Vencida", value: "vencida" },
];

const typeOptions: Array<{ value: ActivityDbType | "all"; label: string }> = [
  { value: "all", label: "Todos los tipos" },
  { value: "llamada", label: "Llamada" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "reunionFisica", label: "Reunión física" },
  { value: "googleMeet", label: "Google Meet" },
  { value: "notaInterna", label: "Nota interna" },
  { value: "tarea", label: "Tarea" },
  { value: "seguimiento", label: "Seguimiento" },
  { value: "envioPropuesta", label: "Envío propuesta" },
  { value: "revisionTecnica", label: "Revisión técnica" },
  { value: "soporteMantenimiento", label: "Soporte mantenimiento" },
];

const formTypeOptions: Array<{ value: ActivityDbType; label: string }> =
  typeOptions.filter(
    (option): option is { value: ActivityDbType; label: string } =>
      option.value !== "all",
  );

export function ActivitiesRealtimePage() {
  const [activities, setActivities] = useState<ActivityListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingActivityId, setEditingActivityId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<ActivityFormValues>(emptyActivityForm);

  const [selectedActivity, setSelectedActivity] =
    useState<ActivityListItem | null>(null);
  const [completeForm, setCompleteForm] =
    useState<CompleteActivityValues>(emptyCompleteForm);

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"hoy" | "proximas" | "vencidas" | "todas">(
    "hoy",
  );
  const [status, setStatus] = useState<ActivityDbStatus | "all">("all");
  const [type, setType] = useState<ActivityDbType | "all">("all");

  async function loadData() {
    try {
      setLoading(true);

      const [activitiesData, companiesData, contactsData, opportunitiesData] =
        await Promise.all([
          listActivities(),
          listCompaniesForContactSelect(),
          listContacts(),
          listOpportunities(),
        ]);

      setActivities(activitiesData);
      setCompanies(companiesData);
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      toast.error("No se han podido cargar las actividades.", {
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

  const filteredOpportunitiesForForm = useMemo(() => {
    if (!form.company_id) return opportunities;

    return opportunities.filter(
      (item) => item.opportunity.company_id === form.company_id,
    );
  }, [form.company_id, opportunities]);

  const stats = useMemo(() => getRealActivityStats(activities), [activities]);

  const filteredActivities = useMemo(() => {
    const today = getTodayKey();
    const now = Date.now();
    const normalizedSearch = search.trim().toLowerCase();

    return activities
      .filter((item) => {
        const activity = item.activity;
        const scheduledTime = activity.scheduled_at
          ? new Date(activity.scheduled_at).getTime()
          : null;

        const computedStatus =
          activity.status === "pendiente" &&
          scheduledTime &&
          scheduledTime < now
            ? "vencida"
            : activity.status;

        const matchesSearch =
          normalizedSearch.length === 0 ||
          activity.title.toLowerCase().includes(normalizedSearch) ||
          (activity.description ?? "").toLowerCase().includes(normalizedSearch) ||
          (activity.notes ?? "").toLowerCase().includes(normalizedSearch) ||
          (item.company?.commercial_name ?? "")
            .toLowerCase()
            .includes(normalizedSearch) ||
          (item.contact?.full_name ?? "")
            .toLowerCase()
            .includes(normalizedSearch) ||
          (item.opportunity?.title ?? "")
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          status === "all" ||
          activity.status === status ||
          computedStatus === status;

        const matchesType = type === "all" || activity.type === type;

        const scheduledDay = activity.scheduled_at
          ? getDateKey(new Date(activity.scheduled_at))
          : "";

        const matchesView =
          view === "todas" ||
          (view === "hoy" && scheduledDay === today) ||
          (view === "proximas" && activity.status === "pendiente") ||
          (view === "vencidas" && computedStatus === "vencida");

        return matchesSearch && matchesStatus && matchesType && matchesView;
      })
      .sort((a, b) => {
        const aTime = a.activity.scheduled_at
          ? new Date(a.activity.scheduled_at).getTime()
          : 0;
        const bTime = b.activity.scheduled_at
          ? new Date(b.activity.scheduled_at).getTime()
          : 0;

        return aTime - bTime;
      });
  }, [activities, search, status, type, view]);

  const formTitle = editingActivityId ? "Editar actividad" : "Nueva actividad";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("El título de la actividad es obligatorio.");
      return;
    }

    if (!form.scheduled_at.trim()) {
      toast.error("La fecha y hora prevista es obligatoria.");
      return;
    }

    setSaving(true);

    try {
      if (editingActivityId) {
        await updateActivity(editingActivityId, form);
        toast.success("Actividad actualizada correctamente.");
      } else {
        await createActivity(form);
        toast.success("Actividad creada correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error(
        editingActivityId
          ? "No se ha podido actualizar la actividad."
          : "No se ha podido crear la actividad.",
        {
          description:
            error instanceof Error ? error.message : "Error desconocido.",
        },
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleCompleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedActivity) return;

    if (!completeForm.outcome.trim()) {
      toast.error("Escribe una resolución antes de completar.");
      return;
    }

    setCompleting(true);

    try {
      await completeActivity(selectedActivity.activity.id, completeForm);

      toast.success("Actividad completada correctamente.", {
        description: selectedActivity.activity.title,
      });

      setSelectedActivity(null);
      setCompleteForm(emptyCompleteForm);
      await loadData();
    } catch (error) {
      toast.error("No se ha podido completar la actividad.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setCompleting(false);
    }
  }

  async function handleDelete(item: ActivityListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${item.activity.title}"? Se ocultará del CRM, pero quedará trazabilidad en auditoría.`,
    );

    if (!confirmed) return;

    setDeletingId(item.activity.id);

    try {
      await softDeleteActivity(item.activity.id);

      setActivities((current) =>
        current.filter(
          (activityItem) => activityItem.activity.id !== item.activity.id,
        ),
      );

      toast.success("Actividad eliminada correctamente.", {
        description: item.activity.title,
      });
    } catch (error) {
      toast.error("No se ha podido eliminar la actividad.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function openCreateForm() {
    setEditingActivityId(null);
    setForm({
      ...emptyActivityForm,
      scheduled_at: getDefaultDatetimeLocal(),
    });
    setFormOpen(true);
  }

  function openEditForm(item: ActivityListItem) {
    setEditingActivityId(item.activity.id);
    setForm(mapActivityToForm(item));
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setEditingActivityId(null);
    setForm(emptyActivityForm);
    setFormOpen(false);
  }

  function updateForm<Key extends keyof ActivityFormValues>(
    key: Key,
    value: ActivityFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateCompleteForm<Key extends keyof CompleteActivityValues>(
    key: Key,
    value: CompleteActivityValues[Key],
  ) {
    setCompleteForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seguimiento"
        title="Actividades"
        description="Agenda real de llamadas, emails, reuniones, tareas, propuestas y seguimientos."
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
              <ActivityIcon className="mr-2 size-4" />
              Nueva actividad
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Total"
          value={String(stats.total)}
          description="Actividades reales"
          icon={ActivityIcon}
          tone="primary"
          variation="Supabase"
          variationDirection="flat"
        />

        <MetricCard
          title="Hoy"
          value={String(stats.today)}
          description="Agenda del día"
          icon={CalendarCheck2}
          tone="info"
          variation="actual"
          variationDirection="flat"
        />

        <MetricCard
          title="Próximas"
          value={String(stats.upcoming)}
          description="Pendientes de realizar"
          icon={CalendarClock}
          tone="warning"
          variation="seguimiento"
          variationDirection="flat"
        />

        <MetricCard
          title="Vencidas"
          value={String(stats.overdue)}
          description="Requieren atención"
          icon={XCircle}
          tone="danger"
          variation="urgente"
          variationDirection="flat"
        />

        <MetricCard
          title="Realizadas"
          value={String(stats.completed)}
          description="Ya completadas"
          icon={CheckCircle2}
          tone="success"
          variation="+"
          variationDirection="up"
        />
      </section>

      {formOpen ? (
        <SectionCard
          title={formTitle}
          description="Registra una actividad real vinculada a empresa, contacto y oportunidad."
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <SelectField
                label="Tipo"
                value={form.type}
                options={formTypeOptions}
                onChange={(value) => updateForm("type", value)}
              />

              <FormField
                label="Título"
                value={form.title}
                onChange={(value) => updateForm("title", value)}
                required
                placeholder="Llamar, enviar propuesta, reunión..."
              />

              <SelectField
                label="Estado"
                value={form.status}
                options={formStatusOptions}
                onChange={(value) => updateForm("status", value)}
              />

              <SelectField
                label="Empresa"
                value={form.company_id}
                options={[
                  { value: "", label: "Sin empresa" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) => {
                  updateForm("company_id", value);
                  updateForm("contact_id", "");
                  updateForm("opportunity_id", "");
                }}
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

              <SelectField
                label="Oportunidad"
                value={form.opportunity_id}
                options={[
                  { value: "", label: "Sin oportunidad" },
                  ...filteredOpportunitiesForForm.map((item) => ({
                    value: item.opportunity.id,
                    label: item.opportunity.title,
                  })),
                ]}
                onChange={(value) => updateForm("opportunity_id", value)}
              />

              <FormField
                label="Fecha/hora inicio"
                value={form.scheduled_at}
                type="datetime-local"
                onChange={(value) => updateForm("scheduled_at", value)}
                required
              />

              <FormField
                label="Fecha/hora fin"
                value={form.finished_at}
                type="datetime-local"
                onChange={(value) => updateForm("finished_at", value)}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <TextAreaField
                label="Motivo previsto"
                value={form.description}
                onChange={(value) => updateForm("description", value)}
                placeholder="Qué hay que conseguir con esta actividad..."
              />

              <TextAreaField
                label="Notas internas"
                value={form.notes}
                onChange={(value) => updateForm("notes", value)}
                placeholder="Contexto, detalles, riesgos, recordatorios..."
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
                ) : editingActivityId ? (
                  <Edit3 className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}

                {saving
                  ? "Guardando..."
                  : editingActivityId
                    ? "Guardar cambios"
                    : "Guardar actividad"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {viewOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setView(option.value)}
              className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                view === option.value
                  ? "bg-[#071B3A] text-white"
                  : "bg-white text-slate-500 hover:bg-[#F6FAFC]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_220px_240px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, empresa, contacto, oportunidad o motivo..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ActivityDbStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(event) =>
              setType(event.target.value as ActivityDbType | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#F6FAFC]">
          <div className="text-center">
            <Loader2 className="mx-auto size-7 animate-spin text-[#00ABBD]" />
            <p className="mt-3 text-sm font-bold text-[#071B3A]">
              Cargando actividades reales...
            </p>
          </div>
        </div>
      ) : filteredActivities.length > 0 ? (
        <section className="relative space-y-5 before:absolute before:bottom-0 before:left-5 before:top-0 before:w-px before:bg-[#DCEAF1]">
          {filteredActivities.map((item) => (
            <RealActivityTimelineItem
              key={item.activity.id}
              item={item}
              deleting={deletingId === item.activity.id}
              onEdit={() => openEditForm(item)}
              onDelete={() => handleDelete(item)}
              onComplete={() => {
                setSelectedActivity(item);
                setCompleteForm(emptyCompleteForm);
              }}
            />
          ))}
        </section>
      ) : (
        <EmptyState
          icon={ActivityIcon}
          title="No hay actividades con estos filtros"
          description="Prueba a cambiar la vista, el buscador, el tipo o el estado seleccionado."
        />
      )}

      {selectedActivity ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
          <form
            onSubmit={handleCompleteSubmit}
            className="w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-950/20"
          >
            <div className="levdata-gradient h-2" />

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00ABBD]">
                    Completar actividad
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold text-[#071B3A]">
                    {selectedActivity.activity.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="rounded-2xl bg-[#F6FAFC] p-2 text-slate-500 transition hover:bg-slate-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="mt-5 rounded-2xl bg-[#F6FAFC] p-4">
                <p className="text-sm leading-6 text-slate-500">
                  {selectedActivity.activity.description ||
                    "Sin motivo previsto."}
                </p>
              </div>

              <div className="mt-5 space-y-5">
                <TextAreaField
                  label="Resolución"
                  value={completeForm.outcome}
                  onChange={(value) => updateCompleteForm("outcome", value)}
                  placeholder="Ejemplo: El cliente acepta la propuesta, pide ajustar una fase y queda pendiente enviar versión final."
                />

                <TextAreaField
                  label="Próxima acción"
                  value={completeForm.next_action}
                  onChange={(value) =>
                    updateCompleteForm("next_action", value)
                  }
                  placeholder="Ejemplo: Enviar propuesta final revisada."
                />

                <FormField
                  label="Fecha próxima acción"
                  value={completeForm.next_action_at}
                  type="datetime-local"
                  onChange={(value) =>
                    updateCompleteForm("next_action_at", value)
                  }
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={completing}
                    onClick={() => setSelectedActivity(null)}
                    className="rounded-2xl border-[#A1C7E0]/60 bg-white"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={completing}
                    className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
                  >
                    {completing ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 size-4" />
                    )}
                    {completing ? "Completando..." : "Completar actividad"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function RealActivityTimelineItem({
  item,
  deleting,
  onEdit,
  onDelete,
  onComplete,
}: {
  item: ActivityListItem;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}) {
  const activity = item.activity;
  const TypeIcon = getActivityTypeIcon(activity.type);
  const computedStatus = getComputedActivityStatus(activity.status, activity.scheduled_at);

  return (
    <article className="relative pl-9">
      <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD] ring-8 ring-white">
        <TypeIcon className="size-5" />
      </div>

      <div className="levdata-card rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                label={getActivityTypeLabel(activity.type)}
                tone="primary"
                dot={false}
              />

              <StatusChip
                label={getActivityStatusLabel(computedStatus)}
                tone={getActivityStatusTone(computedStatus)}
              />

              {item.opportunity ? (
                <StatusChip
                  label={item.opportunity.title}
                  tone="warning"
                  dot={false}
                />
              ) : null}
            </div>

            <h2 className="mt-3 text-lg font-extrabold text-[#071B3A]">
              {activity.title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {activity.description || "Sin motivo previsto."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-4 text-[#0099DD]" />
                {activity.scheduled_at
                  ? formatDateTime(activity.scheduled_at)
                  : "Sin fecha"}
              </span>

              {item.company ? (
                <span className="font-semibold text-[#071B3A]">
                  {item.company.commercial_name}
                </span>
              ) : (
                <span className="font-semibold text-[#071B3A]">
                  Actividad interna
                </span>
              )}

              {item.contact ? <span>Contacto: {item.contact.full_name}</span> : null}
            </div>

            {activity.outcome ? (
              <div className="mt-4 rounded-2xl bg-emerald-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Resolución
                </p>
                <p className="mt-1 text-sm leading-6 text-emerald-800">
                  {activity.outcome}
                </p>
              </div>
            ) : null}

            {activity.next_action ? (
              <div className="mt-4 rounded-2xl bg-[#FFF7ED] p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-[#C76A00]">
                  Próxima acción
                </p>
                <p className="mt-1 text-sm leading-6 text-[#8A4B00]">
                  {activity.next_action}
                  {activity.next_action_at
                    ? ` · ${formatDateTime(activity.next_action_at)}`
                    : ""}
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {(activity.status === "pendiente" || computedStatus === "vencida") ? (
              <Button
                type="button"
                onClick={onComplete}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                <CheckCircle2 className="mr-2 size-4" />
                Completar
              </Button>
            ) : null}

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

function mapActivityToForm(item: ActivityListItem): ActivityFormValues {
  const activity = item.activity;

  return {
    type: activity.type,
    title: activity.title,
    company_id: activity.company_id ?? "",
    contact_id: activity.contact_id ?? "",
    opportunity_id: activity.opportunity_id ?? "",
    status: activity.status,
    scheduled_at: toDatetimeLocal(activity.scheduled_at),
    finished_at: toDatetimeLocal(activity.finished_at),
    description: activity.description ?? "",
    notes: activity.notes ?? "",
  };
}

function getRealActivityStats(activities: ActivityListItem[]) {
  const today = getTodayKey();
  const now = Date.now();

  const total = activities.length;

  const todayCount = activities.filter((item) => {
    if (!item.activity.scheduled_at) return false;

    return getDateKey(new Date(item.activity.scheduled_at)) === today;
  }).length;

  const upcoming = activities.filter(
    (item) => item.activity.status === "pendiente",
  ).length;

  const overdue = activities.filter((item) => {
    if (item.activity.status !== "pendiente") return false;
    if (!item.activity.scheduled_at) return false;

    return new Date(item.activity.scheduled_at).getTime() < now;
  }).length;

  const completed = activities.filter(
    (item) => item.activity.status === "realizada",
  ).length;

  return {
    total,
    today: todayCount,
    upcoming,
    overdue,
    completed,
  };
}

function getComputedActivityStatus(
  status: ActivityDbStatus,
  scheduledAt: string | null,
): ActivityDbStatus {
  if (status !== "pendiente" || !scheduledAt) return status;

  return new Date(scheduledAt).getTime() < Date.now() ? "vencida" : status;
}

function getTodayKey() {
  return getDateKey(new Date());
}

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDefaultDatetimeLocal() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);

  return toDatetimeLocal(date.toISOString());
}

function toDatetimeLocal(value: string | null) {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);

  return localDate.toISOString().slice(0, 16);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}