"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Flame,
  Loader2,
  Plus,
  RefreshCw,
  Target,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import type { ActivityListItem } from "@/features/activities/types";
import { getActivityTypeIcon, getActivityTypeLabel } from "@/features/activities/utils";
import { getDashboardData } from "@/features/dashboard/data/dashboard-service";
import type { DashboardData, DashboardHealth } from "@/features/dashboard/types";
import type { OpportunityListItem } from "@/features/opportunities/types";

export function DashboardRealtimePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    try {
      setLoading(true);

      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (error) {
      toast.error("No se ha podido cargar el dashboard.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const focusMessage = useMemo(() => {
    if (!data) return "Cargando estado real de LevData...";

    if (data.metrics.overdueActivities > 0) {
      return `Hay ${data.metrics.overdueActivities} actividad(es) vencida(s). Empieza por recuperarlas.`;
    }

    if (data.metrics.opportunitiesWithoutNextAction > 0) {
      return `Hay ${data.metrics.opportunitiesWithoutNextAction} oportunidad(es) abiertas sin próxima acción.`;
    }

    if (data.metrics.hotOpportunities > 0) {
      return `Hay ${data.metrics.hotOpportunities} oportunidad(es) calientes. Prioriza seguimiento comercial.`;
    }

    return "No hay bloqueos urgentes. Buen momento para prospectar o avanzar entregas.";
  }, [data]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="levdata-card flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center">
          <Loader2 className="size-8 animate-spin text-[#00ABBD]" />

          <p className="mt-4 text-sm font-bold text-[#071B3A]">
            Cargando dashboard real
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Leyendo empresas, contactos, oportunidades y actividades desde
            Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Dashboard"
          title="No se ha podido cargar"
          description="Revisa la conexión con Supabase y vuelve a intentarlo."
          actions={
            <Button
              type="button"
              onClick={loadDashboard}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <RefreshCw className="mr-2 size-4" />
              Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard real"
        title="Bienvenido, Javier"
        description="Vista operativa conectada a Supabase: prioridades comerciales, agenda, pipeline y registros recientes."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadDashboard}
              disabled={loading}
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 size-4" />
              )}
              Actualizar
            </Button>

            <Button
              asChild
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <Link href="/oportunidades">
                <Target className="mr-2 size-4" />
                Nueva oportunidad
              </Link>
            </Button>

            <Button
              asChild
              className="rounded-2xl bg-[#071B3A] text-white hover:bg-[#0B2A57]"
            >
              <Link href="/actividades">
                <Plus className="mr-2 size-4" />
                Nueva actividad
              </Link>
            </Button>
          </div>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusChip
                label={getHealthLabel(data.health)}
                tone={getHealthTone(data.health)}
              />

              <StatusChip
                label="Datos reales"
                tone="success"
                dot={false}
              />

              <StatusChip
                label={`Actualizado ${formatTime(data.generatedAt)}`}
                tone="info"
                dot={false}
              />
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {focusMessage}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Esta pantalla ya no intenta enseñar todo. Te dice qué requiere
              atención ahora: actividades vencidas, oportunidades sin seguimiento,
              pipeline abierto y agenda del día.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/actividades">
                  <CalendarClock className="mr-2 size-4" />
                  Ver agenda
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
              >
                <Link href="/oportunidades">
                  <Target className="mr-2 size-4" />
                  Ver pipeline
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10 sm:grid-cols-2">
            <HeroStat
              label="Pipeline abierto"
              value={<MoneyValue value={data.metrics.openPipelineValue} size="lg" className="text-white" />}
              detail="Valor único potencial"
            />

            <HeroStat
              label="MRR previsto"
              value={<MoneyValue value={data.metrics.expectedMrr} size="lg" className="text-white" />}
              detail="Recurrente potencial"
            />

            <HeroStat
              label="Hoy"
              value={data.metrics.todayActivities}
              detail="Actividades programadas"
            />

            <HeroStat
              label="Vencidas"
              value={data.metrics.overdueActivities}
              detail="Requieren atención"
              warning={data.metrics.overdueActivities > 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Empresas"
          value={String(data.metrics.companies)}
          description="Registros reales"
          icon={Building2}
          tone="primary"
          variation="Supabase"
          variationDirection="flat"
        />

        <MetricCard
          title="Contactos"
          value={String(data.metrics.contacts)}
          description="Personas registradas"
          icon={UsersRound}
          tone="info"
          variation="CRM"
          variationDirection="flat"
        />

        <MetricCard
          title="Oportunidades abiertas"
          value={String(data.metrics.openOpportunities)}
          description="Pipeline vivo"
          icon={Target}
          tone="success"
          variation={`${data.metrics.hotOpportunities} calientes`}
          variationDirection="flat"
        />

        <MetricCard
          title="Sin próxima acción"
          value={String(data.metrics.opportunitiesWithoutNextAction)}
          description="Oportunidades abiertas"
          icon={AlertTriangle}
          tone={
            data.metrics.opportunitiesWithoutNextAction > 0 ? "danger" : "success"
          }
          variation={
            data.metrics.opportunitiesWithoutNextAction > 0
              ? "revisar"
              : "controlado"
          }
          variationDirection="flat"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          title="Prioridad de hoy"
          description="Actividades reales programadas para hoy."
          action={
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-[#A1C7E0]/60 bg-white"
            >
              <Link href="/actividades">Ver actividades</Link>
            </Button>
          }
        >
          <ActivityList
            items={data.todayActivities}
            emptyTitle="No hay actividades para hoy"
            emptyDescription="Puedes usar este hueco para prospectar, preparar propuestas o cerrar tareas pendientes."
          />
        </SectionCard>

        <SectionCard
          title="Urgencias"
          description="Actividades vencidas y oportunidades sin próximo paso."
        >
          <div className="space-y-5">
            <div>
              <SectionMiniTitle
                icon={AlertTriangle}
                title="Actividades vencidas"
                count={data.overdueActivities.length}
                danger={data.overdueActivities.length > 0}
              />

              <div className="mt-3">
                <ActivityList
                  items={data.overdueActivities}
                  compact
                  emptyTitle="Sin actividades vencidas"
                  emptyDescription="No hay seguimiento atrasado."
                />
              </div>
            </div>

            <div className="border-t border-[#DCEAF1] pt-5">
              <SectionMiniTitle
                icon={Target}
                title="Oportunidades sin acción"
                count={data.opportunitiesWithoutNextAction.length}
                danger={data.opportunitiesWithoutNextAction.length > 0}
              />

              <div className="mt-3">
                <OpportunityList
                  items={data.opportunitiesWithoutNextAction}
                  emptyTitle="Todas tienen próxima acción"
                  emptyDescription="El pipeline está correctamente calendarizado."
                />
              </div>
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <SectionCard
          title="Oportunidades calientes"
          description="Ventas abiertas con mayor prioridad comercial."
          action={
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-xl border-[#A1C7E0]/60 bg-white"
            >
              <Link href="/oportunidades">Ver pipeline</Link>
            </Button>
          }
        >
          <OpportunityList
            items={data.hotOpportunities}
            showMoney
            emptyTitle="No hay oportunidades calientes"
            emptyDescription="Marca temperatura caliente en oportunidades prioritarias."
          />
        </SectionCard>

        <SectionCard
          title="Registros recientes"
          description="Últimas empresas y contactos añadidos al CRM."
        >
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <SectionMiniTitle
                icon={Building2}
                title="Empresas"
                count={data.recentCompanies.length}
              />

              <div className="mt-3 space-y-2">
                {data.recentCompanies.length > 0 ? (
                  data.recentCompanies.map((company) => (
                    <div
                      key={company.id}
                      className="rounded-2xl bg-[#F6FAFC] p-4"
                    >
                      <p className="font-extrabold text-[#071B3A]">
                        {company.commercial_name}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {company.city || "Sin ciudad"}
                        {company.province ? `, ${company.province}` : ""}
                      </p>
                    </div>
                  ))
                ) : (
                  <SmallEmpty text="Sin empresas todavía." />
                )}
              </div>
            </div>

            <div>
              <SectionMiniTitle
                icon={UsersRound}
                title="Contactos"
                count={data.recentContacts.length}
              />

              <div className="mt-3 space-y-2">
                {data.recentContacts.length > 0 ? (
                  data.recentContacts.map((item) => (
                    <div
                      key={item.contact.id}
                      className="rounded-2xl bg-[#F6FAFC] p-4"
                    >
                      <p className="font-extrabold text-[#071B3A]">
                        {`${item.contact.first_name} ${
                          item.contact.last_name ?? ""
                        }`.trim()}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.company?.commercial_name || "Sin empresa"}
                      </p>
                    </div>
                  ))
                ) : (
                  <SmallEmpty text="Sin contactos todavía." />
                )}
              </div>
            </div>
          </div>
        </SectionCard>
      </section>
    </div>
  );
}

function HeroStat({
  label,
  value,
  detail,
  warning = false,
}: {
  label: string;
  value: React.ReactNode;
  detail: string;
  warning?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/40">
        {label}
      </p>

      <div
        className={`mt-2 text-2xl font-black ${
          warning ? "text-[#FF9933]" : "text-white"
        }`}
      >
        {value}
      </div>

      <p className="mt-1 text-xs leading-5 text-white/45">{detail}</p>
    </div>
  );
}

function ActivityList({
  items,
  emptyTitle,
  emptyDescription,
  compact = false,
}: {
  items: ActivityListItem[];
  emptyTitle: string;
  emptyDescription: string;
  compact?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-[#F6FAFC] p-6 text-center">
        <CheckCircle2 className="mx-auto size-7 text-[#00ABBD]" />
        <p className="mt-3 font-extrabold text-[#071B3A]">{emptyTitle}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const TypeIcon = getActivityTypeIcon(item.activity.type);

        return (
          <div
            key={item.activity.id}
            className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4 transition hover:border-[#00ABBD]/40 hover:shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
                <TypeIcon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-extrabold text-[#071B3A]">
                    {item.activity.title}
                  </p>

                  {!compact ? (
                    <StatusChip
                      label={getActivityTypeLabel(item.activity.type)}
                      tone="primary"
                      dot={false}
                    />
                  ) : null}
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {item.company?.commercial_name || "Actividad interna"}
                  {item.contact ? ` · ${item.contact.full_name}` : ""}
                </p>

                <p className="mt-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {item.activity.scheduled_at
                    ? formatDateTime(item.activity.scheduled_at)
                    : "Sin fecha"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OpportunityList({
  items,
  emptyTitle,
  emptyDescription,
  showMoney = false,
}: {
  items: OpportunityListItem[];
  emptyTitle: string;
  emptyDescription: string;
  showMoney?: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-3xl bg-[#F6FAFC] p-6 text-center">
        <CheckCircle2 className="mx-auto size-7 text-[#00ABBD]" />
        <p className="mt-3 font-extrabold text-[#071B3A]">{emptyTitle}</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          {emptyDescription}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.opportunity.id}
          className="rounded-2xl border border-[#DCEAF1]/70 bg-white p-4 transition hover:border-[#00ABBD]/40 hover:shadow-sm"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-extrabold text-[#071B3A]">
                  {item.opportunity.title}
                </p>

                <StatusChip
                  label={getTemperatureLabel(item.opportunity.temperature)}
                  tone={getTemperatureTone(item.opportunity.temperature)}
                  dot={false}
                />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {item.company?.commercial_name || "Sin empresa"}
                {item.contact ? ` · ${item.contact.full_name}` : ""}
              </p>

              <p className="mt-2 text-xs font-semibold text-slate-400">
                Próxima acción:{" "}
                {item.opportunity.next_action || "Sin próxima acción"}
              </p>
            </div>

            {showMoney ? (
              <div className="sm:text-right">
                <MoneyValue
                  value={Number(item.opportunity.one_time_value)}
                  size="md"
                />

                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                  Prob. {item.opportunity.probability}%
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionMiniTitle({
  icon: Icon,
  title,
  count,
  danger = false,
}: {
  icon: typeof Activity;
  title: string;
  count: number;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div
          className={`flex size-9 items-center justify-center rounded-2xl ${
            danger ? "bg-red-50 text-red-600" : "bg-[#E8F8FB] text-[#00ABBD]"
          }`}
        >
          <Icon className="size-4" />
        </div>

        <p className="font-extrabold text-[#071B3A]">{title}</p>
      </div>

      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          danger ? "bg-red-50 text-red-600" : "bg-[#F6FAFC] text-slate-500"
        }`}
      >
        {count}
      </span>
    </div>
  );
}

function SmallEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4 text-sm font-semibold text-slate-500">
      {text}
    </div>
  );
}

function getHealthLabel(health: DashboardHealth) {
  const labels: Record<DashboardHealth, string> = {
    bien: "Todo controlado",
    atencion: "Requiere atención",
    urgente: "Prioridad urgente",
  };

  return labels[health];
}

function getHealthTone(
  health: DashboardHealth,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    DashboardHealth,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    bien: "success",
    atencion: "warning",
    urgente: "danger",
  };

  return tones[health];
}

function getTemperatureLabel(
  temperature: "fria" | "templada" | "caliente",
) {
  const labels = {
    fria: "Fría",
    templada: "Templada",
    caliente: "Caliente",
  };

  return labels[temperature];
}

function getTemperatureTone(
  temperature: "fria" | "templada" | "caliente",
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones = {
    fria: "info",
    templada: "warning",
    caliente: "danger",
  } as const;

  return tones[temperature];
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}