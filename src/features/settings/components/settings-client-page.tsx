"use client";

import {
  BadgeCheck,
  Database,
  FileCode2,
  Globe,
  Mail,
  Palette,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { StatGroup } from "@/components/common/stat-group";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { SettingsChecklist } from "@/features/settings/components/settings-checklist";
import {
  mockCompanySettings,
  mockFrontendChecklist,
  mockStaticDeployChecklist,
  mockSupabaseChecklist,
  mockVisualSettings,
} from "@/features/settings/data/mock-settings";
import {
  getCrmModeLabel,
  getCrmModeTone,
  getDensityLabel,
  getThemeModeLabel,
} from "@/features/settings/utils";

export function SettingsClientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Sistema"
        title="Configuración"
        description="Preferencias internas del CRM, datos de LevData, estado del prototipo y preparación para Supabase."
        actions={
          <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
            <Settings className="mr-2 size-4" />
            Guardar cambios mock
          </Button>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.85fr] lg:p-10">
          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Configuración global
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              LevData CRM está funcionando como prototipo frontend completo.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Todavía no hay backend real. Todo funciona con datos mock, pero la
              arquitectura está preparada para sustituir estos datos por Supabase
              cuando el flujo visual esté validado.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip
                label={getCrmModeLabel(mockCompanySettings.crmMode)}
                tone={getCrmModeTone(mockCompanySettings.crmMode)}
              />
              <StatusChip label="Export estático futuro" tone="info" />
              <StatusChip label="Hostinger /crm" tone="warning" />
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white/8 p-4 ring-1 ring-white/10">
            <StatGroup
              className="border-white/10 bg-white/5 xl:grid-cols-2"
              items={[
                {
                  label: "Marca",
                  value: mockCompanySettings.brandName,
                  detail: "Sistema interno",
                },
                {
                  label: "Dominio",
                  value: mockCompanySettings.domain,
                  detail: "Landing pública",
                },
                {
                  label: "Email público",
                  value: mockCompanySettings.publicEmail,
                  detail: "Contacto comercial",
                },
                {
                  label: "Ruta CRM",
                  value: "/crm",
                  detail: "Deploy futuro",
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Frontend mock"
          value="100%"
          description="Módulos principales creados"
          icon={FileCode2}
          tone="success"
          variation="base lista"
          variationDirection="up"
        />

        <MetricCard
          title="Backend real"
          value="0%"
          description="Supabase aún no conectado"
          icon={Database}
          tone="warning"
          variation="fase futura"
          variationDirection="flat"
        />

        <MetricCard
          title="Auth real"
          value="0%"
          description="Login todavía simulado"
          icon={ShieldCheck}
          tone="warning"
          variation="RLS después"
          variationDirection="flat"
        />

        <MetricCard
          title="Deploy /crm"
          value="Pendiente"
          description="Se configurará al final"
          icon={Server}
          tone="info"
          variation="Hostinger"
          variationDirection="flat"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard
          title="Perfil de LevData"
          description="Información de empresa usada por el CRM."
        >
          <div className="space-y-4">
            <InfoRow
              icon={Globe}
              label="Nombre de marca"
              value={mockCompanySettings.brandName}
            />
            <InfoRow
              icon={BadgeCheck}
              label="Nombre interno/legal"
              value={mockCompanySettings.legalName}
            />
            <InfoRow
              icon={Mail}
              label="Email público"
              value={mockCompanySettings.publicEmail}
            />
            <InfoRow
              icon={Globe}
              label="Ubicación"
              value={mockCompanySettings.location}
            />

            <div className="rounded-2xl bg-[#F6FAFC] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Descripción
              </p>
              <p className="mt-2 text-sm leading-7 text-[#071B3A]">
                {mockCompanySettings.description}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Preferencias visuales"
          description="Ajustes mock de UI. Más adelante podrían guardarse por usuario."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <VisualPreference
              label="Tema"
              value={getThemeModeLabel(mockVisualSettings.themeMode)}
            />
            <VisualPreference
              label="Densidad"
              value={getDensityLabel(mockVisualSettings.density)}
            />
            <VisualPreference
              label="Tipografía Sora"
              value={mockVisualSettings.useSoraFont ? "Activa" : "Inactiva"}
            />
            <VisualPreference
              label="Gradientes LevData"
              value={mockVisualSettings.useBrandGradients ? "Activos" : "Inactivos"}
            />
            <VisualPreference
              label="Cards redondeadas"
              value={mockVisualSettings.useRoundedCards ? "Activas" : "Inactivas"}
            />
            <VisualPreference
              label="Tablas compactas"
              value={
                mockVisualSettings.useCompactTablesOnDesktop
                  ? "Activas"
                  : "Desactivadas"
              }
            />
          </div>

          <div className="mt-5 rounded-2xl border border-[#DCEAF1]/70 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Paleta LevData
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-5">
              <ColorSwatch label="Aqua" value="#00ABBD" />
              <ColorSwatch label="Sky Blue" value="#0099DD" />
              <ColorSwatch label="Orange" value="#FF9933" />
              <ColorSwatch label="Ice Blue" value="#A1C7E0" />
              <ColorSwatch label="Navy" value="#071B3A" />
            </div>
          </div>
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Frontend mock"
          description="Estado actual del prototipo visual."
        >
          <SettingsChecklist items={mockFrontendChecklist} />
        </SectionCard>

        <SectionCard
          title="Preparación Supabase"
          description="Tareas de la fase futura de backend."
        >
          <SettingsChecklist items={mockSupabaseChecklist} />
        </SectionCard>

        <SectionCard
          title="Deploy estático"
          description="Checklist para publicar en levdata.es/crm."
        >
          <SettingsChecklist items={mockStaticDeployChecklist} />
        </SectionCard>
      </section>

      <SectionCard
        title="Notas técnicas importantes"
        description="Decisiones que debemos respetar para no romper Hostinger básico."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <TechnicalNote
            icon={Server}
            title="Sin servidor Node"
            description="Hostinger básico no debe depender de SSR crítico, API Routes ni Server Actions obligatorias."
          />
          <TechnicalNote
            icon={Database}
            title="Backend externo"
            description="Supabase será el backend real externo: Auth, PostgreSQL, Storage y RLS."
          />
          <TechnicalNote
            icon={Sparkles}
            title="Primero validar UX"
            description="El CRM debe parecer final con datos mock antes de conectar base de datos real."
          />
        </div>
      </SectionCard>
    </div>
  );
}

type InfoRowProps = {
  icon: typeof Globe;
  label: string;
  value: string;
};

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#F6FAFC] p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-5" />
      </div>

      <div>
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

type VisualPreferenceProps = {
  label: string;
  value: string;
};

function VisualPreference({ label, value }: VisualPreferenceProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-extrabold text-[#071B3A]">{value}</p>
    </div>
  );
}

type ColorSwatchProps = {
  label: string;
  value: string;
};

function ColorSwatch({ label, value }: ColorSwatchProps) {
  return (
    <div>
      <div
        className="h-16 rounded-2xl shadow-sm ring-1 ring-black/5"
        style={{ backgroundColor: value }}
      />
      <p className="mt-2 text-xs font-bold text-[#071B3A]">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}

type TechnicalNoteProps = {
  icon: typeof Server;
  title: string;
  description: string;
};

function TechnicalNote({ icon: Icon, title, description }: TechnicalNoteProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-5">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-[#E8F8FB] text-[#00ABBD]">
        <Icon className="size-5" />
      </div>

      <p className="font-extrabold text-[#071B3A]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}