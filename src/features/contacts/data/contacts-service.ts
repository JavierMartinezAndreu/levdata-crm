import type { CompanyDb } from "@/features/companies/types";
import type {
  CompanyContactDb,
  ContactDb,
  ContactFormValues,
  ContactListItem,
} from "@/features/contacts/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ContactInsert = Database["public"]["Tables"]["contacts"]["Insert"];
type ContactUpdate = Database["public"]["Tables"]["contacts"]["Update"];

export async function listContacts() {
  const supabase = getSupabaseBrowserClient();

  const { data: contacts, error: contactsError } = await supabase
    .from("contacts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (contactsError) {
    throw new Error(contactsError.message);
  }

  const { data: relations, error: relationsError } = await supabase
    .from("company_contacts")
    .select("*");

  if (relationsError) {
    throw new Error(relationsError.message);
  }

  const { data: companies, error: companiesError } = await supabase
    .from("companies")
    .select("*")
    .is("deleted_at", null);

  if (companiesError) {
    throw new Error(companiesError.message);
  }

  const relationsByContact = new Map<string, CompanyContactDb>();
  const companiesById = new Map<string, CompanyDb>();

  for (const relation of (relations ?? []) as CompanyContactDb[]) {
    if (!relationsByContact.has(relation.contact_id)) {
      relationsByContact.set(relation.contact_id, relation);
    }
  }

  for (const company of (companies ?? []) as CompanyDb[]) {
    companiesById.set(company.id, company);
  }

  return ((contacts ?? []) as ContactDb[]).map<ContactListItem>((contact) => {
    const relation = relationsByContact.get(contact.id) ?? null;
    const company = relation ? companiesById.get(relation.company_id) : null;

    return {
      contact,
      relation,
      company: company
        ? {
            id: company.id,
            commercial_name: company.commercial_name,
          }
        : null,
    };
  });
}

export async function listCompaniesForContactSelect() {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .is("deleted_at", null)
    .order("commercial_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as CompanyDb[];
}

export async function createContact(values: ContactFormValues) {
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

  const payload: ContactInsert = {
    created_by: user.id,
    first_name: values.first_name.trim(),
    last_name: toNullable(values.last_name),
    email: toNullable(values.email),
    phone: toNullable(values.phone),
    mobile: toNullable(values.mobile),
    job_title: toNullable(values.job_title),
    preferred_channel: values.preferred_channel,
    language: values.language.trim() || "es",
    contact_schedule: toNullable(values.contact_schedule),
    consent_notes: toNullable(values.consent_notes),
    notes: toNullable(values.notes),
  };

  const { data, error } = await supabase
    .from("contacts")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const contact = data as ContactDb;

  await replaceContactCompanyRelation(contact.id, values);

  return contact;
}

export async function updateContact(id: string, values: ContactFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: ContactUpdate = {
    first_name: values.first_name.trim(),
    last_name: toNullable(values.last_name),
    email: toNullable(values.email),
    phone: toNullable(values.phone),
    mobile: toNullable(values.mobile),
    job_title: toNullable(values.job_title),
    preferred_channel: values.preferred_channel,
    language: values.language.trim() || "es",
    contact_schedule: toNullable(values.contact_schedule),
    consent_notes: toNullable(values.consent_notes),
    notes: toNullable(values.notes),
  };

  const { data, error } = await supabase
    .from("contacts")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await replaceContactCompanyRelation(id, values);

  return data as ContactDb;
}

export async function softDeleteContact(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_contact", {
    contact_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function replaceContactCompanyRelation(
  contactId: string,
  values: ContactFormValues,
) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("replace_contact_company_relation", {
    p_contact_id: contactId,
    p_company_id: values.company_id.trim() ? values.company_id : null,
    p_role: values.company_role,
    p_job_title: values.job_title,
    p_is_primary: values.is_primary,
  });

  if (error) {
    throw new Error(error.message);
  }
}

function toNullable(value: string) {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}