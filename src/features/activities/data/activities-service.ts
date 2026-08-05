import type { CompanyDb } from "@/features/companies/types";
import { listCompaniesForContactSelect } from "@/features/contacts/data/contacts-service";
import { listContacts } from "@/features/contacts/data/contacts-service";
import type { ContactListItem } from "@/features/contacts/types";
import {
  listOpportunities,
} from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";
import type {
  ActivityDb,
  ActivityFormValues,
  ActivityListItem,
  CompleteActivityValues,
} from "@/features/activities/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];
type ActivityUpdate = Database["public"]["Tables"]["activities"]["Update"];

export async function listActivities() {
  const supabase = getSupabaseBrowserClient();

  const { data: activities, error } = await supabase
    .from("activities")
    .select("*")
    .is("deleted_at", null)
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  const [companies, contacts, opportunities] = await Promise.all([
    listCompaniesForContactSelect(),
    listContacts(),
    listOpportunities(),
  ]);

  const companiesById = new Map<string, CompanyDb>();
  const contactsById = new Map<string, { id: string; full_name: string }>();
  const opportunitiesById = new Map<string, { id: string; title: string }>();

  for (const company of companies) {
    companiesById.set(company.id, company);
  }

  for (const item of contacts as ContactListItem[]) {
    contactsById.set(item.contact.id, {
      id: item.contact.id,
      full_name: `${item.contact.first_name} ${
        item.contact.last_name ?? ""
      }`.trim(),
    });
  }

  for (const item of opportunities as OpportunityListItem[]) {
    opportunitiesById.set(item.opportunity.id, {
      id: item.opportunity.id,
      title: item.opportunity.title,
    });
  }

  return ((activities ?? []) as ActivityDb[]).map<ActivityListItem>(
    (activity) => {
      const company = activity.company_id
        ? companiesById.get(activity.company_id) ?? null
        : null;

      const contact = activity.contact_id
        ? contactsById.get(activity.contact_id) ?? null
        : null;

      const opportunity = activity.opportunity_id
        ? opportunitiesById.get(activity.opportunity_id) ?? null
        : null;

      return {
        activity,
        company: company
          ? {
              id: company.id,
              commercial_name: company.commercial_name,
            }
          : null,
        contact,
        opportunity,
      };
    },
  );
}

export async function createActivity(values: ActivityFormValues) {
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

  const cleanTitle = values.title.trim();

    const payload: ActivityInsert = {
    created_by: user.id,
    assigned_to: user.id,
    company_id: toNullable(values.company_id),
    contact_id: toNullable(values.contact_id),
    opportunity_id: toNullable(values.opportunity_id),
    type: values.type,
    title: cleanTitle,
    subject: cleanTitle,
    description: toNullable(values.description),
    status: values.status,
    scheduled_at: toNullableDateTime(values.scheduled_at),
    finished_at: toNullableDateTime(values.finished_at),
    notes: toNullable(values.notes),
    };

  const { data, error } = await supabase
    .from("activities")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ActivityDb;
}

export async function updateActivity(id: string, values: ActivityFormValues) {
  const supabase = getSupabaseBrowserClient();

  const cleanTitle = values.title.trim();

    const payload: ActivityUpdate = {
    company_id: toNullable(values.company_id),
    contact_id: toNullable(values.contact_id),
    opportunity_id: toNullable(values.opportunity_id),
    type: values.type,
    title: cleanTitle,
    subject: cleanTitle,
    description: toNullable(values.description),
    status: values.status,
    scheduled_at: toNullableDateTime(values.scheduled_at),
    finished_at: toNullableDateTime(values.finished_at),
    notes: toNullable(values.notes),
    };

  const { data, error } = await supabase
    .from("activities")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ActivityDb;
}

export async function completeActivity(
  id: string,
  values: CompleteActivityValues,
) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("complete_activity", {
    activity_id: id,
    p_outcome: values.outcome,
    p_next_action: values.next_action,
    p_next_action_at: toNullableDateTime(values.next_action_at),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeleteActivity(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_activity", {
    activity_id: id,
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