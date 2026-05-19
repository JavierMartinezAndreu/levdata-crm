import type {
  AppThemeMode,
  CrmMode,
  SettingsSectionStatus,
  VisualDensity,
} from "@/features/settings/types";

type Tone =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "dark"
  | "primary";

export function getCrmModeLabel(mode: CrmMode): string {
  const labels: Record<CrmMode, string> = {
    mock: "Frontend mock",
    supabaseReady: "Preparado para Supabase",
    production: "Producción",
  };

  return labels[mode];
}

export function getCrmModeTone(mode: CrmMode): Tone {
  const tones: Record<CrmMode, Tone> = {
    mock: "warning",
    supabaseReady: "primary",
    production: "success",
  };

  return tones[mode];
}

export function getThemeModeLabel(mode: AppThemeMode): string {
  const labels: Record<AppThemeMode, string> = {
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
  };

  return labels[mode];
}

export function getDensityLabel(density: VisualDensity): string {
  const labels: Record<VisualDensity, string> = {
    comfortable: "Cómoda",
    compact: "Compacta",
  };

  return labels[density];
}

export function getChecklistStatusLabel(status: SettingsSectionStatus): string {
  const labels: Record<SettingsSectionStatus, string> = {
    ready: "Listo",
    pending: "Pendiente",
    future: "Futuro",
  };

  return labels[status];
}

export function getChecklistStatusTone(status: SettingsSectionStatus): Tone {
  const tones: Record<SettingsSectionStatus, Tone> = {
    ready: "success",
    pending: "warning",
    future: "info",
  };

  return tones[status];
}