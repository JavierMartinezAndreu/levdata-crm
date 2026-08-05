export type ContactDbPreferredChannel =
  | "email"
  | "telefono"
  | "whatsapp"
  | "reunion"
  | "indiferente";

export type CompanyContactDbRole =
  | "comercial"
  | "tecnico"
  | "administracion"
  | "emergencias"
  | "direccion"
  | "general";

export type ContactDb = {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  job_title: string | null;
  preferred_channel: ContactDbPreferredChannel;
  language: string;
  contact_schedule: string | null;
  consent_notes: string | null;
  notes: string | null;
  deleted_at: string | null;
};

export type CompanyContactDb = {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  contact_id: string;
  role: CompanyContactDbRole;
  job_title: string | null;
  is_primary: boolean;
  notes: string | null;
};

export type ContactFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  mobile: string;
  job_title: string;
  preferred_channel: ContactDbPreferredChannel;
  language: string;
  contact_schedule: string;
  consent_notes: string;
  notes: string;
  company_id: string;
  company_role: CompanyContactDbRole;
  is_primary: boolean;
};

export type ContactListItem = {
  contact: ContactDb;
  relation: CompanyContactDb | null;
  company: {
    id: string;
    commercial_name: string;
  } | null;
};