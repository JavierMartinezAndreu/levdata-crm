"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CircleDollarSign,
  Edit3,
  FolderKanban,
  Loader2,
  PauseCircle,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Truck,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/common/empty-state";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listCompanies } from "@/features/companies/data/companies-service";
import type { CompanyDb } from "@/features/companies/types";
import { listContacts } from "@/features/contacts/data/contacts-service";
import type { ContactListItem } from "@/features/contacts/types";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";
import { ProjectCard } from "@/features/projects/components/project-card";
import {
  createProject,
  listProjects,
  softDeleteProject,
  updateProject,
} from "@/features/projects/data/projects-service";
import type {
  Feature,
  FeatureDb,
  Project,
  ProjectDb,
  ProjectFormValues,
  ProjectListItem,
  ProjectStatus,
  Sprint,
  SprintDb,
} from "@/features/projects/types";
import {
  getProjectStats,
  getProjectStatusLabel,
} from "@/features/projects/utils";

const statusOptions: Array<{ label: string; value: ProjectStatus | "all" }> = [
  { label: "Todos los estados", value: "all" },
  { label: "Presupuestado", value: "presupuestado" },
  { label: "Aceptado", value: "aceptado" },
  { label: "En desarrollo", value: "enDesarrollo" },
  { label: "Pausado", value: "pausado" },
  { label: "Entregado", value: "entregado" },
  { label: "En mantenimiento", value: "enMantenimiento" },
  { label: "Cerrado", value: "cerrado" },
  { label: "Cancelado", value: "cancelado" },
];

const projectStatusFormOptions: Array<{
  label: string;
  value: ProjectStatus;
}> = [
  { label: "Presupuestado", value: "presupuestado" },
  { label: "Aceptado", value: "aceptado" },
  { label: "En desarrollo", value: "enDesarrollo" },
  { label: "Pausado", value: "pausado" },
  { label: "Entregado", value: "entregado" },
  { label: "En mantenimiento", value: "enMantenimiento" },
  { label: "Cerrado", value: "cerrado" },
  { label: "Cancelado", value: "cancelado" },
];

const emptyProjectForm: ProjectFormValues = {
  company_id: "",
  opportunity_id: "",
  contact_id: "",
  name: "",
  description: "",
  status: "aceptado",
  start_date: getTodayDate(),
  target_date: "",
  delivered_at: "",
  repository_url: "",
  staging_url: "",
  production_url: "",
  private_notes: "",
  budget_total: "",
  collected_total: "0",
  expenses_total: "0",
};

export function ProjectsRealtimePage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [contacts, setContacts] = useState<ContactListItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectFormValues>(emptyProjectForm);

  async function loadData() {
    try {
      setLoading(true);

      const [projectsData, companiesData, contactsData, opportunitiesData] =
        await Promise.all([
          listProjects(),
          listCompanies(),
          listContacts(),
          listOpportunities(),
        ]);

      setProjects(projectsData);
      setCompanies(companiesData);
      setContacts(contactsData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      toast.error("No se han podido cargar los proyectos.", {
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

  const adaptedProjects = useMemo(
    () => projects.map((item) => adaptProject(item)),
    [projects],
  );

  const adaptedSprints = useMemo(
    () => projects.flatMap((item) => item.sprints.map(adaptSprint)),
    [projects],
  );

  const adaptedFeatures = useMemo(
    () => projects.flatMap((item) => item.features.map(adaptFeature)),
    [projects],
  );

  const stats = useMemo(
    () => getProjectStats(adaptedProjects),
    [adaptedProjects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return projects.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.project.name.toLowerCase().includes(normalizedSearch) ||
        (item.company?.commercial_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.project.description ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.contact?.full_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.opportunity?.title ?? "")
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        status === "all" || item.project.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, status]);

  const filteredOpportunities = useMemo(() => {
    if (!form.company_id) return opportunities;

    return opportunities.filter(
      (item) => item.opportunity.company_id === form.company_id,
    );
  }, [form.company_id, opportunities]);

  const filteredContacts = useMemo(() => {
    if (!form.company_id) return contacts;

    return contacts.filter(
      (item) => item.company?.id === form.company_id,
    );
  }, [contacts, form.company_id]);

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...emptyProjectForm,
      start_date: getTodayDate(),
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditForm(item: ProjectListItem) {
    setEditingId(item.project.id);
    setForm({
      company_id: item.project.company_id,
      opportunity_id: item.project.opportunity_id ?? "",
      contact_id: item.project.contact_id ?? "",
      name: item.project.name,
      description: item.project.description ?? "",
      status: item.project.status,
      start_date: item.project.start_date ?? "",
      target_date: item.project.target_date ?? "",
      delivered_at: item.project.delivered_at
        ? item.project.delivered_at.slice(0, 10)
        : "",
      repository_url: item.project.repository_url ?? "",
      staging_url: item.project.staging_url ?? "",
      production_url: item.project.production_url ?? "",
      private_notes:
        item.project.private_notes ?? item.project.notes ?? "",
      budget_total: String(item.project.budget_total),
      collected_total: String(item.project.collected_total),
      expenses_total: String(item.project.expenses_total),
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyProjectForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.company_id) {
      toast.error("Selecciona una empresa.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("El nombre del proyecto es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateProject(editingId, form);
        toast.success("Proyecto actualizado correctamente.");
      } else {
        await createProject(form);
        toast.success("Proyecto creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar el proyecto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: ProjectListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el proyecto "${item.project.name}"?`,
    );

    if (!confirmed) return;

    setDeletingId(item.project.id);

    try {
      await softDeleteProject(item.project.id);
      toast.success("Proyecto eliminado correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar el proyecto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="levdata-card flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center">
          <Loader2 className="size-8 animate-spin text-[#00ABBD]" />

          <p className="mt-4 text-sm font-bold text-[#071B3A]">
            Cargando proyectos reales
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Leyendo proyectos, sprints y funcionalidades desde Supabase.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operaciones"
        title="Proyectos"
        description="Controla trabajos aceptados, sprints, funcionalidades, cobros, deuda y entregas."
        actions={
          <Button
            type="button"
            onClick={openCreateForm}
            className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
          >
            <FolderKanban className="mr-2 size-4" />
            Nuevo proyecto
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          title="Activos"
          value={String(stats.active)}
          description="Aceptados, en desarrollo o mantenimiento"
          icon={FolderKanban}
          tone="primary"
          variation="operación"
          variationDirection="flat"
        />

        <MetricCard
          title="Pausados"
          value={String(stats.paused)}
          description="Requieren decisión o cobro"
          icon={PauseCircle}
          tone="warning"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Entregados"
          value={String(stats.deliveredThisMonth)}
          description="Proyectos entregados"
          icon={Truck}
          tone="success"
          variation="+"
          variationDirection="up"
        />

        <MetricCard
          title="Pendiente de cobrar"
          value={
            <MoneyValue
              value={stats.pendingPayment}
              size="lg"
              tone="warning"
            />
          }
          description="Importe total pendiente"
          icon={CircleDollarSign}
          tone="warning"
          variation="caja"
          variationDirection="flat"
        />

        <MetricCard
          title="Beneficio estimado"
          value={
            <MoneyValue
              value={stats.estimatedProfit}
              size="lg"
              tone="positive"
            />
          }
          description="Cobrado menos gastos"
          icon={TrendingUp}
          tone="success"
          variation="estimado"
          variationDirection="flat"
        />
      </section>

      {formOpen ? (
        <SectionCard
          title={editingId ? "Editar proyecto" : "Nuevo proyecto"}
          description="Asocia el proyecto a una empresa real y, si aplica, a una oportunidad ganada."
        >
          <div className="mb-5 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={closeForm}
              className="rounded-2xl bg-white"
            >
              <X className="mr-2 size-4" />
              Cerrar formulario
            </Button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <SelectField
                label="Empresa"
                value={form.company_id}
                required
                options={[
                  { value: "", label: "Selecciona empresa" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    company_id: value,
                    opportunity_id: "",
                    contact_id: "",
                  }))
                }
              />

              <SelectField
                label="Oportunidad"
                value={form.opportunity_id}
                options={[
                  { value: "", label: "Sin oportunidad" },
                  ...filteredOpportunities.map((item) => ({
                    value: item.opportunity.id,
                    label: item.opportunity.title,
                  })),
                ]}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    opportunity_id: value,
                  }))
                }
              />

              <SelectField
                label="Contacto principal"
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
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    contact_id: value,
                  }))
                }
              />

              <FormField
                label="Nombre"
                value={form.name}
                required
                onChange={(value) =>
                  setForm((current) => ({ ...current, name: value }))
                }
              />

              <SelectField
                label="Estado"
                value={form.status}
                options={projectStatusFormOptions}
                onChange={(value) =>
                  setForm((current) => ({ ...current, status: value }))
                }
              />

              <FormField
                label="Presupuesto"
                value={form.budget_total}
                type="number"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    budget_total: value,
                  }))
                }
              />

              <FormField
                label="Cobrado"
                value={form.collected_total}
                type="number"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    collected_total: value,
                  }))
                }
              />

              <FormField
                label="Gastos"
                value={form.expenses_total}
                type="number"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    expenses_total: value,
                  }))
                }
              />

              <FormField
                label="Inicio"
                value={form.start_date}
                type="date"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    start_date: value,
                  }))
                }
              />

              <FormField
                label="Fecha objetivo"
                value={form.target_date}
                type="date"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    target_date: value,
                  }))
                }
              />

              <FormField
                label="Entrega real"
                value={form.delivered_at}
                type="date"
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    delivered_at: value,
                  }))
                }
              />

              <FormField
                label="Repositorio"
                value={form.repository_url}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    repository_url: value,
                  }))
                }
              />

              <FormField
                label="Staging"
                value={form.staging_url}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    staging_url: value,
                  }))
                }
              />

              <FormField
                label="Producción"
                value={form.production_url}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    production_url: value,
                  }))
                }
              />
            </div>

            <TextAreaField
              label="Descripción"
              value={form.description}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  description: value,
                }))
              }
            />

            <TextAreaField
              label="Notas privadas"
              value={form.private_notes}
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  private_notes: value,
                }))
              }
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : editingId ? (
                  <Edit3 className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}

                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Crear proyecto"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por proyecto, empresa, descripción, contacto u oportunidad..."
              className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/50 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none transition focus:border-[#00ABBD] focus:ring-4 focus:ring-cyan-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.value === "all"
                  ? option.label
                  : getProjectStatusLabel(option.value)}
              </option>
            ))}
          </select>
        </div>
      </section>

      {filteredProjects.length > 0 ? (
        <section className="grid gap-4 2xl:grid-cols-2">
          {filteredProjects.map((item) => {
            const adaptedProject = adaptProject(item);

            return (
              <div key={item.project.id} className="space-y-3">
                <ProjectCard
                  project={adaptedProject}
                  sprints={adaptedSprints}
                  features={adaptedFeatures}
                />

                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => openEditForm(item)}
                    className="rounded-2xl bg-white"
                  >
                    <Edit3 className="mr-2 size-4" />
                    Editar
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={deletingId === item.project.id}
                    onClick={() => handleDelete(item)}
                    className="rounded-2xl border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    {deletingId === item.project.id ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 size-4" />
                    )}
                    Eliminar
                  </Button>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No hay proyectos con estos filtros"
          description="Crea un proyecto nuevo o cambia el buscador/estado seleccionado."
        />
      )}
    </div>
  );
}

function adaptProject(item: ProjectListItem): Project {
  const project = item.project;

  return {
    id: project.id,
    empresaId: project.company_id,
    empresaNombre: item.company?.commercial_name ?? "Empresa no encontrada",
    oportunidadOrigenId: project.opportunity_id,
    nombre: project.name,
    descripcion: project.description ?? "",
    estado: project.status,
    responsableId: project.assigned_to ?? project.created_by ?? "",
    responsableNombre: "LevData",
    contactoPrincipalId: project.contact_id,
    contactoPrincipalNombre: item.contact?.full_name ?? "Sin contacto principal",
    fechaInicio: project.start_date ?? project.created_at.slice(0, 10),
    fechaObjetivo: project.target_date ?? project.created_at.slice(0, 10),
    fechaEntregaReal: project.delivered_at
      ? project.delivered_at.slice(0, 10)
      : null,
    repositorioUrl: project.repository_url ?? "",
    stagingUrl: project.staging_url ?? "",
    produccionUrl: project.production_url ?? "",
    notasPrivadas: project.private_notes ?? project.notes ?? "",
    totalPresupuestado: Number(project.budget_total),
    totalCobrado: Number(project.collected_total),
    gastos: Number(project.expenses_total),
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

function adaptSprint(sprint: SprintDb): Sprint {
  return {
    id: sprint.id,
    proyectoId: sprint.project_id,
    nombre: sprint.name,
    descripcion: sprint.description ?? "",
    orden: sprint.sort_order,
    estado: sprint.status,
    fechaInicioPrevista:
      sprint.planned_start_date ?? sprint.created_at.slice(0, 10),
    fechaEntregaPrevista:
      sprint.planned_delivery_date ?? sprint.created_at.slice(0, 10),
    fechaEntregaReal: sprint.delivered_at,
    precioPresupuestado: Number(sprint.budget_amount),
    cobrado: Number(sprint.collected_amount),
    createdAt: sprint.created_at,
    updatedAt: sprint.updated_at,
  };
}

function adaptFeature(feature: FeatureDb): Feature {
  return {
    id: feature.id,
    sprintId: feature.sprint_id ?? "",
    proyectoId: feature.project_id,
    titulo: feature.title,
    descripcion: feature.description ?? "",
    estado: feature.status,
    prioridad: feature.priority,
    responsableId: feature.assigned_to ?? "",
    responsableNombre: "LevData",
    orden: feature.sort_order,
    fechaCreacion: feature.created_at.slice(0, 10),
    fechaInicio: feature.started_at,
    fechaDesarrollada: feature.developed_at,
    fechaEntregada: feature.delivered_at,
    fechaCancelada: feature.cancelled_at,
    motivoCancelacion: feature.cancellation_reason,
    notasTecnicas: feature.technical_notes ?? "",
    createdAt: feature.created_at,
    updatedAt: feature.updated_at,
  };
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
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
        step={type === "number" ? "0.01" : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}