export type CrmMode = "mock" | "supabaseReady" | "production";

export type VisualDensity = "comfortable" | "compact";

export type AppThemeMode = "light" | "dark" | "system";

export type SettingsSectionStatus = "ready" | "pending" | "future";

export type CompanySettings = {
  brandName: string;
  legalName: string;
  domain: string;
  publicEmail: string;
  internalEmail: string;
  location: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  crmMode: CrmMode;
};

export type VisualSettings = {
  themeMode: AppThemeMode;
  density: VisualDensity;
  useSoraFont: boolean;
  useBrandGradients: boolean;
  useRoundedCards: boolean;
  useCompactTablesOnDesktop: boolean;
};

export type SettingsChecklistItem = {
  id: string;
  title: string;
  description: string;
  status: SettingsSectionStatus;
};