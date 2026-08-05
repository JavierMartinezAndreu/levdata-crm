"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Edit3,
  FolderKanban,
  Loader2,
  Plus,
  Rocket,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { DateValue } from "@/components/common/date-value";
import { MoneyValue } from "@/components/common/money-value";
import { ProgressCard } from "@/components/common/progress-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createFeature,
  createSprint,
  getProjectById,
  softDeleteFeature,
  softDeleteSprint,
  updateFeature,
  updateSprint,
} from "@/features/projects/data/projects-service";
import type {
  FeatureDb,
  FeatureFormValues,
  FeaturePriority,
  FeatureStatus,
  ProjectDetailData,
  SprintDb,
  SprintFormValues,
  SprintStatus,
} from "@/features/projects/types";
import {
  getDeliveryProgress,
  getFeaturePriorityLabel,
  getFeaturePriorityTone,
  getFeatureStatusLabel,
  getFeatureStatusTone,
  getPaymentProgress,
  getProjectStatusLabel,
  getProjectStatusTone,
  getSprintStatusLabel,
  getSprintStatusTone,
  getTechnicalProgress,
} from "@/features/projects/utils";

type DetailTab = "resumen" | "sprints" | "funcionalidades" | "cobros" | "notas";
type FormMode = "sprint" | "feature" | null;

const tabs: Array<{ value: DetailTab; label: string }> = [
  { value: "resumen", label: "Resumen" },
  { value: "sprints", label: "Sprints" },
  { value: "funcionalidades", label: "Funcionalidades" },
  { value: "cobros", label: "Cobros" },
  { value: "notas", label: "Notas" },
];

const sprintStatusOptions: Array<{ value: SprintStatus; label: string }> = [
  { value: "planificado", label: "Planificado" },
  { value: "enCurso", label: "En curso" },
  { value: "entregado", label: "Entregado" },
  { value: "pausado", label: "Pausado" },
  { value: "cancelado", label: "Cancelado" },
];

const featureStatusOptions: Array<{ value: FeatureStatus; label: string }> = [
  { value: "planificada", label: "Planificada" },
  { value: "enDesarrollo", label: "En desarrollo" },
  { value: "desarrollada", label: "Desarrollada" },
  { value: "entregada", label: "Entregada" },
  { value: "cancelada", label: "Cancelada" },
];

const featurePriorityOptions: Array<{ value: FeaturePriority; label: string }> = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "critica", label: "Crítica" },
];

const emptySprintForm: SprintFormValues = {
  project_id: "",
  name: "",
  description: "",
  sort_order: "1",
  status: "planificado",
  planned_start_date: "",
  planned_delivery_date: "",
  delivered_at: "",
  budget_amount: "0",
  collected_amount: "0",
};

const emptyFeatureForm: FeatureFormValues = {
  project_id: "",
  sprint_id: "",
  title: "",
  description: "",
  status: "planificada",
  priority: "media",
  sort_order: "1",
  started_at: "",
  developed_at: "",
  delivered_at: "",
  cancelled_at: "",
  cancellation_reason: "",
  technical_notes: "",
};

export function ProjectDetailRealtimePage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const [data, setData] = useState<ProjectDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DetailTab>("resumen");

  const [formMode, setFormMode] = useState<FormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sprintForm, setSprintForm] = useState<SprintFormValues>(emptySprintForm);
  const [featureForm, setFeatureForm] =
    useState<FeatureFormValues>(emptyFeatureForm);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadData() {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const projectData = await getProjectById(projectId);
      setData(projectData);
    } catch (error) {
      toast.error("No se ha podido cargar el proyecto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [projectId]);

  const adaptedFeatures = useMemo(
    () => data?.features.map(adaptFeature) ?? [],
    [data],
  );

  const technicalProgress = useMemo(
    () => getTechnicalProgress(adaptedFeatures),
    [adaptedFeatures],
  );

  const deliveryProgress = useMemo(
    () => getDeliveryProgress(adaptedFeatures),
    [adaptedFeatures],
  );

  const paymentProgress = useMemo(() => {
    if (!data) return 0;

    return getPaymentProgress(
      Number(data.project.budget_total),
      Number(data.project.collected_total),
    );
  }, [data]);

  function openCreateSprint() {
    if (!projectId) return;

    setEditingId(null);
    setFormMode("sprint");
    setActiveTab("sprints");
    setSprintForm({
      ...emptySprintForm,
      project_id: projectId,
      sort_order: String((data?.sprints.length ?? 0) + 1),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditSprint(sprint: SprintDb) {
    setEditingId(sprint.id);
    setFormMode("sprint");
    setActiveTab("sprints");
    setSprintForm({
      project_id: sprint.project_id,
      name: sprint.name,
      description: sprint.description ?? "",
      sort_order: String(sprint.sort_order),
      status: sprint.status,
      planned_start_date: sprint.planned_start_date ?? "",
      planned_delivery_date: sprint.planned_delivery_date ?? "",
      delivered_at: sprint.delivered_at ?? "",
      budget_amount: String(sprint.budget_amount),
      collected_amount: String(sprint.collected_amount),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openCreateFeature(sprintId = "") {
    if (!projectId) return;

    setEditingId(null);
    setFormMode("feature");
    setActiveTab("funcionalidades");
    setFeatureForm({
      ...emptyFeatureForm,
      project_id: projectId,
      sprint_id: sprintId,
      sort_order: String((data?.features.length ?? 0) + 1),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditFeature(feature: FeatureDb) {
    setEditingId(feature.id);
    setFormMode("feature");
    setActiveTab("funcionalidades");
    setFeatureForm({
      project_id: feature.project_id,
      sprint_id: feature.sprint_id ?? "",
      title: feature.title,
      description: feature.description ?? "",
      status: feature.status,
      priority: feature.priority,
      sort_order: String(feature.sort_order),
      started_at: feature.started_at ?? "",
      developed_at: feature.developed_at ?? "",
      delivered_at: feature.delivered_at ?? "",
      cancelled_at: feature.cancelled_at ?? "",
      cancellation_reason: feature.cancellation_reason ?? "",
      technical_notes: feature.technical_notes ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setSprintForm(emptySprintForm);
    setFeatureForm(emptyFeatureForm);
  }

  async function handleSprintSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!sprintForm.name.trim()) {
      toast.error("El nombre del sprint es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateSprint(editingId, sprintForm);
        toast.success("Sprint actualizado correctamente.");
      } else {
        await createSprint(sprintForm);
        toast.success("Sprint creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar el sprint.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleFeatureSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!featureForm.title.trim()) {
      toast.error("El título de la funcionalidad es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateFeature(editingId, featureForm);
        toast.success("Funcionalidad actualizada correctamente.");
      } else {
        await createFeature(featureForm);
        toast.success("Funcionalidad creada correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar la funcionalidad.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteSprint(sprint: SprintDb) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el sprint "${sprint.name}"?`,
    );

    if (!confirmed) return;

    setDeletingId(sprint.id);

    try {
      await softDeleteSprint(sprint.id);
      toast.success("Sprint eliminado correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar el sprint.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteFeature(feature: FeatureDb) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar la funcionalidad "${feature.title}"?`,
    );

    if (!confirmed) return;

    setDeletingId(feature.id);

    try {
      await softDeleteFeature(feature.id);
      toast.success("Funcionalidad eliminada correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar la funcionalidad.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="levdata-card flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center">
          <Loader2 className="size-8 animate-spin text-[#00ABBD]" />
          <p className="mt-4 text-sm font-bold text-[#071B3A]">
            Cargando detalle real
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Leyendo proyecto, sprints y funcionalidades desde Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (!projectId || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Proyecto no encontrado"
          title="No hemos encontrado este proyecto"
          description="Vuelve al listado y abre el detalle desde una tarjeta real."
          actions={
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/proyectos">
                <ArrowLeft className="mr-2 size-4" />
                Volver a proyectos
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  const project = data.project;
  const pending = Number(project.budget_total) - Number(project.collected_total);
  const estimatedProfit =
    Number(project.collected_total) - Number(project.expenses_total);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Detalle de proyecto"
        title={project.name}
        description={`${data.company?.commercial_name ?? "Empresa no encontrada"} · ${
          data.contact?.full_name ?? "Sin contacto principal"
        }`}
        actions={
          <>
            <Button asChild variant="outline" className="rounded-2xl bg-white">
              <Link href="/proyectos">
                <ArrowLeft className="mr-2 size-4" />
                Volver
              </Link>
            </Button>

            <Button
              type="button"
              onClick={openCreateSprint}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <Plus className="mr-2 size-4" />
              Nuevo sprint
            </Button>

            <Button
              type="button"
              onClick={() => openCreateFeature()}
              className="rounded-2xl bg-[#071B3A] text-white hover:bg-[#0B2A57]"
            >
              <Plus className="mr-2 size-4" />
              Nueva funcionalidad
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.85fr] lg:p-10">
          <div>
            <div className="mb-5 flex size-16 items-center justify-center rounded-3xl bg-white/10 text-[#00ABBD] ring-1 ring-white/10">
              <FolderKanban className="size-8" />
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight">
              {project.name}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
              {project.description || "Proyecto sin descripción todavía."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip
                label={getProjectStatusLabel(project.status)}
                tone={getProjectStatusTone(project.status)}
              />
              <StatusChip
                label={data.opportunity?.title ?? "Sin oportunidad origen"}
                tone="primary"
                dot={false}
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10 sm:grid-cols-2">
            <ProjectHeroFinanceBox
                label="Presupuesto"
                value={Number(project.budget_total)}
                detail="Total del proyecto"
            />

            <ProjectHeroFinanceBox
                label="Cobrado"
                value={Number(project.collected_total)}
                detail="Registrado"
                positive
            />

            <ProjectHeroFinanceBox
                label="Pendiente"
                value={pending}
                detail="Por cobrar"
                warning
            />

            <ProjectHeroFinanceBox
                label="Beneficio est."
                value={estimatedProfit}
                detail="Cobrado - gastos"
                positive={estimatedProfit >= 0}
                danger={estimatedProfit < 0}
            />
            </div>
        </div>
      </section>

      {formMode === "sprint" ? (
        <SectionCard
          title={editingId ? "Editar sprint" : "Nuevo sprint"}
          description="Define fases de entrega, presupuesto previsto y cobro asociado."
        >
          <FormHeader onClose={closeForm} />

          <form className="space-y-5" onSubmit={handleSprintSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Nombre"
                value={sprintForm.name}
                required
                onChange={(value) =>
                  setSprintForm((current) => ({ ...current, name: value }))
                }
              />

              <SelectField
                label="Estado"
                value={sprintForm.status}
                options={sprintStatusOptions}
                onChange={(value) =>
                  setSprintForm((current) => ({ ...current, status: value }))
                }
              />

              <FormField
                label="Orden"
                value={sprintForm.sort_order}
                type="number"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    sort_order: value,
                  }))
                }
              />

              <FormField
                label="Inicio previsto"
                value={sprintForm.planned_start_date}
                type="date"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    planned_start_date: value,
                  }))
                }
              />

              <FormField
                label="Entrega prevista"
                value={sprintForm.planned_delivery_date}
                type="date"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    planned_delivery_date: value,
                  }))
                }
              />

              <FormField
                label="Entrega real"
                value={sprintForm.delivered_at}
                type="date"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    delivered_at: value,
                  }))
                }
              />

              <FormField
                label="Presupuesto"
                value={sprintForm.budget_amount}
                type="number"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    budget_amount: value,
                  }))
                }
              />

              <FormField
                label="Cobrado"
                value={sprintForm.collected_amount}
                type="number"
                onChange={(value) =>
                  setSprintForm((current) => ({
                    ...current,
                    collected_amount: value,
                  }))
                }
              />
            </div>

            <TextAreaField
              label="Descripción"
              value={sprintForm.description}
              onChange={(value) =>
                setSprintForm((current) => ({
                  ...current,
                  description: value,
                }))
              }
            />

            <SubmitButton saving={saving} editing={Boolean(editingId)} />
          </form>
        </SectionCard>
      ) : null}

      {formMode === "feature" ? (
        <SectionCard
          title={editingId ? "Editar funcionalidad" : "Nueva funcionalidad"}
          description="Controla estado, prioridad y notas técnicas de cada entrega."
        >
          <FormHeader onClose={closeForm} />

          <form className="space-y-5" onSubmit={handleFeatureSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <SelectField
                label="Sprint"
                value={featureForm.sprint_id}
                options={[
                  { value: "", label: "Sin sprint" },
                  ...data.sprints.map((sprint) => ({
                    value: sprint.id,
                    label: sprint.name,
                  })),
                ]}
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    sprint_id: value,
                  }))
                }
              />

              <FormField
                label="Título"
                value={featureForm.title}
                required
                onChange={(value) =>
                  setFeatureForm((current) => ({ ...current, title: value }))
                }
              />

              <SelectField
                label="Estado"
                value={featureForm.status}
                options={featureStatusOptions}
                onChange={(value) =>
                  setFeatureForm((current) => ({ ...current, status: value }))
                }
              />

              <SelectField
                label="Prioridad"
                value={featureForm.priority}
                options={featurePriorityOptions}
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    priority: value,
                  }))
                }
              />

              <FormField
                label="Orden"
                value={featureForm.sort_order}
                type="number"
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    sort_order: value,
                  }))
                }
              />

              <FormField
                label="Inicio"
                value={featureForm.started_at}
                type="date"
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    started_at: value,
                  }))
                }
              />

              <FormField
                label="Desarrollada"
                value={featureForm.developed_at}
                type="date"
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    developed_at: value,
                  }))
                }
              />

              <FormField
                label="Entregada"
                value={featureForm.delivered_at}
                type="date"
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    delivered_at: value,
                  }))
                }
              />

              <FormField
                label="Cancelada"
                value={featureForm.cancelled_at}
                type="date"
                onChange={(value) =>
                  setFeatureForm((current) => ({
                    ...current,
                    cancelled_at: value,
                  }))
                }
              />
            </div>

            <TextAreaField
              label="Descripción"
              value={featureForm.description}
              onChange={(value) =>
                setFeatureForm((current) => ({
                  ...current,
                  description: value,
                }))
              }
            />

            <TextAreaField
              label="Motivo de cancelación"
              value={featureForm.cancellation_reason}
              onChange={(value) =>
                setFeatureForm((current) => ({
                  ...current,
                  cancellation_reason: value,
                }))
              }
            />

            <TextAreaField
              label="Notas técnicas"
              value={featureForm.technical_notes}
              onChange={(value) =>
                setFeatureForm((current) => ({
                  ...current,
                  technical_notes: value,
                }))
              }
            />

            <SubmitButton saving={saving} editing={Boolean(editingId)} />
          </form>
        </SectionCard>
      ) : null}

      <section className="space-y-6">
        <div className="levdata-card w-full rounded-[1.75rem] p-2">
          <div className="flex w-full gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={[
                    "shrink-0 rounded-2xl px-5 py-3 text-sm font-extrabold transition",
                    "min-w-[130px] text-center",
                    isActive
                      ? "bg-[#071B3A] text-white shadow-lg shadow-slate-900/10"
                      : "bg-white text-slate-500 hover:bg-[#F6FAFC] hover:text-[#071B3A]",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "resumen" ? (
          <div className="space-y-6">
            <section className="grid gap-4 lg:grid-cols-3">
              <ProgressCard
                title="Progreso técnico"
                description="Avance funcional"
                value={technicalProgress}
                icon={Rocket}
                tone="primary"
              />

              <ProgressCard
                title="Progreso de entrega"
                description="Funcionalidades entregadas"
                value={deliveryProgress}
                icon={CheckCircle2}
                tone="success"
              />

              <ProgressCard
                title="Progreso de cobro"
                description="Cobrado sobre presupuesto"
                value={paymentProgress}
                tone="warning"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <SectionCard
                title="Información del proyecto"
                description="Datos operativos principales."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    label="Empresa"
                    value={data.company?.commercial_name ?? "Sin empresa"}
                  />
                  <InfoBox
                    label="Contacto"
                    value={data.contact?.full_name ?? "Sin contacto"}
                  />
                  <InfoBox
                    label="Oportunidad"
                    value={data.opportunity?.title ?? "Sin oportunidad"}
                  />
                  <InfoBox
                    label="Fecha objetivo"
                    value={
                      project.target_date ? (
                        <DateValue value={project.target_date} />
                      ) : (
                        "Sin fecha"
                      )
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Enlaces técnicos"
                description="Repositorio, staging y producción si existen."
              >
                <div className="space-y-3">
                  <LinkBox label="Repositorio" value={project.repository_url} />
                  <LinkBox label="Staging" value={project.staging_url} />
                  <LinkBox label="Producción" value={project.production_url} />
                </div>
              </SectionCard>
            </section>
          </div>
        ) : null}

        {activeTab === "sprints" ? (
          <SectionCard
            title="Sprints"
            description="Fases de trabajo y entrega del proyecto."
          >
            <div className="mb-5 flex justify-end">
              <Button
                type="button"
                onClick={openCreateSprint}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                <Plus className="mr-2 size-4" />
                Nuevo sprint
              </Button>
            </div>

            <div className="space-y-4">
              {data.sprints.length > 0 ? (
                data.sprints.map((sprint) => (
                  <SprintRealtimeCard
                    key={sprint.id}
                    sprint={sprint}
                    features={data.features.filter(
                      (feature) => feature.sprint_id === sprint.id,
                    )}
                    deleting={deletingId === sprint.id}
                    onCreateFeature={() => openCreateFeature(sprint.id)}
                    onEdit={() => openEditSprint(sprint)}
                    onDelete={() => handleDeleteSprint(sprint)}
                  />
                ))
              ) : (
                <EmptyBox text="Este proyecto todavía no tiene sprints." />
              )}
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "funcionalidades" ? (
          <SectionCard
            title="Funcionalidades"
            description="Vista global de funcionalidades de todos los sprints."
          >
            <div className="mb-5 flex justify-end">
              <Button
                type="button"
                onClick={() => openCreateFeature()}
                className="rounded-2xl bg-[#071B3A] text-white hover:bg-[#0B2A57]"
              >
                <Plus className="mr-2 size-4" />
                Nueva funcionalidad
              </Button>
            </div>

            <FeatureGrid
              features={data.features}
              deletingId={deletingId}
              onEdit={openEditFeature}
              onDelete={handleDeleteFeature}
            />
          </SectionCard>
        ) : null}

        {activeTab === "cobros" ? (
          <SectionCard
            title="Resumen de cobros"
            description="Resumen operativo del presupuesto del proyecto."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoBox
                label="Presupuestado"
                value={
                  <MoneyValue value={Number(project.budget_total)} size="lg" />
                }
              />
              <InfoBox
                label="Cobrado"
                value={
                  <MoneyValue
                    value={Number(project.collected_total)}
                    size="lg"
                    tone="positive"
                  />
                }
              />
              <InfoBox
                label="Pendiente"
                value={<MoneyValue value={pending} size="lg" tone="warning" />}
              />
            </div>
          </SectionCard>
        ) : null}

        {activeTab === "notas" ? (
          <SectionCard
            title="Notas privadas"
            description="Notas internas de LevData sobre alcance, riesgos y próximos pasos."
          >
            <p className="text-sm leading-7 text-slate-500">
              {project.private_notes || project.notes || "Sin notas privadas."}
            </p>
          </SectionCard>
        ) : null}
      </section>
    </div>
  );
}

function SprintRealtimeCard({
  sprint,
  features,
  deleting,
  onCreateFeature,
  onEdit,
  onDelete,
}: {
  sprint: SprintDb;
  features: FeatureDb[];
  deleting: boolean;
  onCreateFeature: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const adaptedFeatures = features.map(adaptFeature);
  const technicalProgress = getTechnicalProgress(adaptedFeatures);
  const deliveryProgress = getDeliveryProgress(adaptedFeatures);
  const paymentProgress = getPaymentProgress(
    Number(sprint.budget_amount),
    Number(sprint.collected_amount),
  );
  const pending = Number(sprint.budget_amount) - Number(sprint.collected_amount);

  return (
    <article className="levdata-card overflow-hidden rounded-[2rem]">
      <div className="levdata-gradient h-1.5" />

      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <StatusChip
                label={getSprintStatusLabel(sprint.status)}
                tone={getSprintStatusTone(sprint.status)}
              />
              {pending > 0 ? (
                <StatusChip label="Tiene pendiente" tone="warning" dot={false} />
              ) : (
                <StatusChip label="Cobrado" tone="success" dot={false} />
              )}
            </div>

            <h3 className="text-xl font-extrabold tracking-tight text-[#071B3A]">
              {sprint.name}
            </h3>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {sprint.description || "Sin descripción."}
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              {sprint.planned_delivery_date ? (
                <span>
                  Previsto: <DateValue value={sprint.planned_delivery_date} />
                </span>
              ) : null}
              {sprint.delivered_at ? (
                <span>
                  Entregado: <DateValue value={sprint.delivered_at} />
                </span>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl bg-[#F6FAFC] p-4 sm:grid-cols-3 lg:min-w-[420px]">
            <MiniMoney label="Presupuesto" value={Number(sprint.budget_amount)} />
            <MiniMoney
              label="Cobrado"
              value={Number(sprint.collected_amount)}
              tone="positive"
            />
            <MiniMoney label="Pendiente" value={pending} tone="warning" />
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <ProgressCard
            title="Progreso técnico"
            description="Incluye desarrolladas y entregadas"
            value={technicalProgress}
            tone="primary"
          />

          <ProgressCard
            title="Progreso de entrega"
            description="Solo funcionalidades entregadas"
            value={deliveryProgress}
            tone="success"
          />

          <ProgressCard
            title="Progreso de cobro"
            description="Cobrado sobre presupuesto"
            value={paymentProgress}
            tone="warning"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onCreateFeature}
            className="rounded-xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
          >
            <Plus className="mr-2 size-4" />
            Añadir funcionalidad
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="rounded-xl border-[#A1C7E0]/60 bg-white"
          >
            <Edit3 className="mr-2 size-4" />
            Editar
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={deleting}
            onClick={onDelete}
            className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50"
          >
            {deleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Eliminar
          </Button>
        </div>

        <div className="mt-6">
          <FeatureGrid
            features={features}
            compact
            deletingId={null}
            onEdit={() => undefined}
            onDelete={() => undefined}
          />
        </div>
      </div>
    </article>
  );
}

function FeatureGrid({
  features,
  deletingId,
  onEdit,
  onDelete,
  compact = false,
}: {
  features: FeatureDb[];
  deletingId: string | null;
  onEdit: (feature: FeatureDb) => void;
  onDelete: (feature: FeatureDb) => void;
  compact?: boolean;
}) {
  if (features.length === 0) {
    return <EmptyBox text="No hay funcionalidades todavía." />;
  }

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {features.map((feature) => (
        <article
          key={feature.id}
          className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md ${
            feature.status === "cancelada"
              ? "border-red-100 bg-red-50/40 opacity-75"
              : "border-[#DCEAF1]/80"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h4
                className={`font-extrabold leading-snug text-[#071B3A] ${
                  feature.status === "cancelada"
                    ? "line-through decoration-red-400"
                    : ""
                }`}
              >
                {feature.title}
              </h4>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {feature.description || "Sin descripción."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusChip
                label={getFeatureStatusLabel(feature.status)}
                tone={getFeatureStatusTone(feature.status)}
              />
              <StatusChip
                label={getFeaturePriorityLabel(feature.priority)}
                tone={getFeaturePriorityTone(feature.priority)}
                dot={false}
              />
            </div>
          </div>

          {feature.cancellation_reason ? (
            <div className="mt-3 rounded-2xl bg-red-50 p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-red-700">
                Motivo cancelación
              </p>
              <p className="mt-1 text-sm leading-6 text-red-700">
                {feature.cancellation_reason}
              </p>
            </div>
          ) : null}

          {feature.technical_notes ? (
            <div className="mt-3 rounded-2xl bg-[#F6FAFC] p-3">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Notas técnicas
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {feature.technical_notes}
              </p>
            </div>
          ) : null}

          {!compact ? (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEdit(feature)}
                className="rounded-xl border-[#A1C7E0]/60 bg-white"
              >
                <Edit3 className="mr-2 size-4" />
                Editar
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={deletingId === feature.id}
                onClick={() => onDelete(feature)}
                className="rounded-xl border-red-200 bg-white text-red-600 hover:bg-red-50"
              >
                {deletingId === feature.id ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                Eliminar
              </Button>
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ProjectHeroFinanceBox({
  label,
  value,
  detail,
  positive = false,
  warning = false,
  danger = false,
}: {
  label: string;
  value: number;
  detail: string;
  positive?: boolean;
  warning?: boolean;
  danger?: boolean;
}) {
  const safeValue = Number.isFinite(value) ? value : 0;

  const valueClass = danger
    ? "text-red-300"
    : warning
      ? "text-[#FF9933]"
      : positive
        ? "text-emerald-300"
        : "text-white";

  return (
    <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-white/45">
        {label}
      </p>

      <p className={`mt-3 text-2xl font-black tracking-tight ${valueClass}`}>
        {formatCurrency(safeValue)}
      </p>

      <p className="mt-1 text-xs font-semibold text-white/45">
        {detail}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function FormHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="mb-5 flex justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="rounded-2xl bg-white"
      >
        <X className="mr-2 size-4" />
        Cerrar formulario
      </Button>
    </div>
  );
}

function SubmitButton({
  saving,
  editing,
}: {
  saving: boolean;
  editing: boolean;
}) {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={saving}
        className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
      >
        {saving ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : editing ? (
          <Edit3 className="mr-2 size-4" />
        ) : (
          <Plus className="mr-2 size-4" />
        )}

        {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear"}
      </Button>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold text-[#071B3A]">{value}</div>
    </div>
  );
}

function LinkBox({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 break-all text-sm font-semibold text-[#071B3A]">
        {value || "No definido todavía"}
      </p>
    </div>
  );
}

function EmptyBox({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4 text-sm text-slate-500">
      {text}
    </div>
  );
}

function MiniMoney({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "positive" | "warning" | "danger" | "muted";
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <MoneyValue value={value} size="sm" tone={tone} />
    </div>
  );
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
}: {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
}) {
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

function adaptFeature(feature: FeatureDb) {
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