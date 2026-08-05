import type { CompanyDb } from "@/features/companies/types";
import { listContacts } from "@/features/contacts/data/contacts-service";
import type {
  OpportunityDb,
  OpportunityFormValues,
  OpportunityListItem,
} from "@/features/opportunities/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type OpportunityInsert =
  Database["public"]["Tables"]["opportunities"]["Insert"];

type OpportunityUpdate =
  Database["public"]["Tables"]["opportunities"]["Update"];

export async function listOpportunities() {
  const supabase = getSupabaseBrowserClient();

  const { data: opportunities, error: opportunitiesError } = await supabase
    .from("opportunities")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (opportunitiesError) {
    throw new Error(opportunitiesError.message);
  }

  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("*")
    .is("deleted_at", null);

  if (companiesError) {
    throw new Error(companiesError.message);
  }

  const contacts = await listContacts();

  const companiesById = new Map<string, CompanyDb>();
  const contactsById = new Map<string, { id: string; full_name: string }>();

  for (const company of (companies ?? []) as CompanyDb[]) {
    companiesById.set(company.id, company);
  }

  for (const item of contacts) {
    contactsById.set(item.contact.id, {
      id: item.contact.id,
      full_name: `${item.contact.first_name} ${
        item.contact.last_name ?? ""
      }`.trim(),
    });
  }

  return ((opportunities ?? []) as OpportunityDb[]).map<OpportunityListItem>(
    (opportunity) => {
      const company = companiesById.get(opportunity.company_id) ?? null;
      const contact = opportunity.contact_id
        ? contactsById.get(opportunity.contact_id) ?? null
        : null;

      return {
        opportunity,
        company: company
          ? {
              id: company.id,
              commercial_name: company.commercial_name,
            }
          : null,
        contact,
      };
    },
  );
}

export async function createOpportunity(values: OpportunityFormValues) {
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

  const payload: OpportunityInsert = {
    created_by: user.id,
    assigned_to: user.id,
    company_id: values.company_id,
    contact_id: toNullable(values.contact_id),
    title: values.title.trim(),
    description: toNullable(values.description),
    status: values.status,
    stage: normalizeStage(values.status, values.stage),
    temperature: values.temperature,
    probability: toInteger(values.probability),
    one_time_value: toNumber(values.one_time_value),
    expected_mrr: toNumber(values.expected_mrr),
    estimated_cost: toNumber(values.estimated_cost),
    estimated_margin: calculateMargin(values),
    source: toNullable(values.source),
    campaign: toNullable(values.campaign),
    detected_need: toNullable(values.detected_need),
    next_action: toNullable(values.next_action),
    next_action_at: toNullableDateTime(values.next_action_at),
    expected_close_date: toNullable(values.expected_close_date),
    lost_reason: toNullable(values.lost_reason),
    won_at: values.status === "ganada" ? new Date().toISOString() : null,
    lost_at:
      values.status === "perdida" || values.status === "no_encaja"
        ? new Date().toISOString()
        : null,
    notes: toNullable(values.notes),
  };

  const { data, error } = await supabase
    .from("opportunities")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as OpportunityDb;
}

export async function updateOpportunity(
  id: string,
  values: OpportunityFormValues,
) {
  const supabase = getSupabaseBrowserClient();

  const payload: OpportunityUpdate = {
    company_id: values.company_id,
    contact_id: toNullable(values.contact_id),
    title: values.title.trim(),
    description: toNullable(values.description),
    status: values.status,
    stage: normalizeStage(values.status, values.stage),
    temperature: values.temperature,
    probability: toInteger(values.probability),
    one_time_value: toNumber(values.one_time_value),
    expected_mrr: toNumber(values.expected_mrr),
    estimated_cost: toNumber(values.estimated_cost),
    estimated_margin: calculateMargin(values),
    source: toNullable(values.source),
    campaign: toNullable(values.campaign),
    detected_need: toNullable(values.detected_need),
    next_action: toNullable(values.next_action),
    next_action_at: toNullableDateTime(values.next_action_at),
    expected_close_date: toNullable(values.expected_close_date),
    lost_reason: toNullable(values.lost_reason),
    won_at: values.status === "ganada" ? new Date().toISOString() : null,
    lost_at:
      values.status === "perdida" || values.status === "no_encaja"
        ? new Date().toISOString()
        : null,
    notes: toNullable(values.notes),
  };

  const { data, error } = await supabase
    .from("opportunities")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as OpportunityDb;
}

export async function softDeleteOpportunity(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_opportunity", {
    opportunity_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function toNullable(value: string) {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

function toNullableDateTime(value: string) {
  if (!value.trim()) return null;

  return new Date(value).toISOString();
}

function toNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function toInteger(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 0;

  return Math.min(Math.max(Math.round(number), 0), 100);
}

function calculateMargin(values: OpportunityFormValues) {
  const value = toNumber(values.one_time_value);
  const cost = toNumber(values.estimated_cost);

  return value - cost;
}

function normalizeStage(
  status: OpportunityFormValues["status"],
  stage: OpportunityFormValues["stage"],
) {
  if (status === "ganada") return "ganada";
  if (status === "perdida" || status === "no_encaja") return "perdida";

  return stage;
}