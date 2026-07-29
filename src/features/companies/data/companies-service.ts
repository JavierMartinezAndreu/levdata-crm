import type {
  CompanyDb,
  CompanyFormValues,
} from "@/features/companies/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type CompanyInsert = Database["public"]["Tables"]["companies"]["Insert"];

export async function listCompanies() {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CompanyDb[];
}

export async function createCompany(values: CompanyFormValues) {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    throw new Error("No hay sesión activa.");
  }

  const payload: CompanyInsert = {
    created_by: user.id,
    assigned_commercial_id: user.id,
    commercial_name: values.commercial_name.trim(),
    legal_name: toNullable(values.legal_name),
    tax_id: toNullable(values.tax_id),
    email: toNullable(values.email),
    phone: toNullable(values.phone),
    website: toNullable(values.website),
    sector: toNullable(values.sector),
    source: toNullable(values.source),
    address: toNullable(values.address),
    city: toNullable(values.city),
    province: toNullable(values.province),
    postal_code: toNullable(values.postal_code),
    country: "España",
    status: values.status,
    potential: values.potential,
    risk_level: "normal",
    notes: toNullable(values.notes),
  };

  const { data, error } = await supabase
    .from("companies")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as CompanyDb;
}

function toNullable(value: string) {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}