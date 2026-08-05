import { listCompanies } from "@/features/companies/data/companies-service";
import type { CompanyDb } from "@/features/companies/types";
import { listContacts } from "@/features/contacts/data/contacts-service";
import type { ContactListItem } from "@/features/contacts/types";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";
import type {
  FeatureDb,
  FeatureFormValues,
  ProjectDb,
  ProjectDetailData,
  ProjectFormValues,
  ProjectListItem,
  SprintDb,
  SprintFormValues,
} from "@/features/projects/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];
type SprintInsert = Database["public"]["Tables"]["project_sprints"]["Insert"];
type SprintUpdate = Database["public"]["Tables"]["project_sprints"]["Update"];
type FeatureInsert = Database["public"]["Tables"]["project_features"]["Insert"];
type FeatureUpdate = Database["public"]["Tables"]["project_features"]["Update"];

export async function listProjects(): Promise<ProjectListItem[]> {
  const supabase = getSupabaseBrowserClient();

  const [
    projectsResponse,
    sprintsResponse,
    featuresResponse,
    companies,
    contacts,
    opportunities,
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("project_sprints")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("project_features")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    listCompanies(),
    listContacts(),
    listOpportunities(),
  ]);

  if (projectsResponse.error) {
    throw new Error(projectsResponse.error.message);
  }

  if (sprintsResponse.error) {
    throw new Error(sprintsResponse.error.message);
  }

  if (featuresResponse.error) {
    throw new Error(featuresResponse.error.message);
  }

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

  const sprints = (sprintsResponse.data ?? []) as SprintDb[];
  const features = (featuresResponse.data ?? []) as FeatureDb[];

  return ((projectsResponse.data ?? []) as ProjectDb[]).map<ProjectListItem>(
    (project) => {
      const company = project.company_id
        ? companiesById.get(project.company_id) ?? null
        : null;

      const contact = project.contact_id
        ? contactsById.get(project.contact_id) ?? null
        : null;

      const opportunity = project.opportunity_id
        ? opportunitiesById.get(project.opportunity_id) ?? null
        : null;

      return {
        project,
        company: company
          ? {
              id: company.id,
              commercial_name: company.commercial_name,
            }
          : null,
        contact,
        opportunity,
        sprints: sprints.filter((sprint) => sprint.project_id === project.id),
        features: features.filter((feature) => feature.project_id === project.id),
      };
    },
  );
}

export async function getProjectById(
  id: string,
): Promise<ProjectDetailData | null> {
  const projects = await listProjects();

  return projects.find((item) => item.project.id === id) ?? null;
}

export async function createProject(values: ProjectFormValues) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const payload: ProjectInsert = {
    created_by: userId,
    assigned_to: userId,
    company_id: values.company_id,
    opportunity_id: toNullable(values.opportunity_id),
    contact_id: toNullable(values.contact_id),
    name: values.name.trim(),
    description: toNullable(values.description),
    status: values.status,
    start_date: toNullable(values.start_date),
    target_date: toNullable(values.target_date),
    delivered_at: toNullable(values.delivered_at),
    repository_url: toNullable(values.repository_url),
    staging_url: toNullable(values.staging_url),
    production_url: toNullable(values.production_url),
    private_notes: toNullable(values.private_notes),
    notes: toNullable(values.private_notes),
    budget_total: toNumber(values.budget_total),
    collected_total: toNumber(values.collected_total),
    expenses_total: toNumber(values.expenses_total),
  };

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectDb;
}

export async function updateProject(id: string, values: ProjectFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: ProjectUpdate = {
    company_id: values.company_id,
    opportunity_id: toNullable(values.opportunity_id),
    contact_id: toNullable(values.contact_id),
    name: values.name.trim(),
    description: toNullable(values.description),
    status: values.status,
    start_date: toNullable(values.start_date),
    target_date: toNullable(values.target_date),
    delivered_at: toNullable(values.delivered_at),
    repository_url: toNullable(values.repository_url),
    staging_url: toNullable(values.staging_url),
    production_url: toNullable(values.production_url),
    private_notes: toNullable(values.private_notes),
    notes: toNullable(values.private_notes),
    budget_total: toNumber(values.budget_total),
    collected_total: toNumber(values.collected_total),
    expenses_total: toNumber(values.expenses_total),
  };

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as ProjectDb;
}

export async function softDeleteProject(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_project", {
    project_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function createSprint(values: SprintFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: SprintInsert = {
    project_id: values.project_id,
    name: values.name.trim(),
    description: toNullable(values.description),
    sort_order: toInteger(values.sort_order),
    status: values.status,
    planned_start_date: toNullable(values.planned_start_date),
    planned_delivery_date: toNullable(values.planned_delivery_date),
    delivered_at: toNullable(values.delivered_at),
    budget_amount: toNumber(values.budget_amount),
    collected_amount: toNumber(values.collected_amount),
  };

  const { data, error } = await supabase
    .from("project_sprints")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SprintDb;
}

export async function updateSprint(id: string, values: SprintFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: SprintUpdate = {
    project_id: values.project_id,
    name: values.name.trim(),
    description: toNullable(values.description),
    sort_order: toInteger(values.sort_order),
    status: values.status,
    planned_start_date: toNullable(values.planned_start_date),
    planned_delivery_date: toNullable(values.planned_delivery_date),
    delivered_at: toNullable(values.delivered_at),
    budget_amount: toNumber(values.budget_amount),
    collected_amount: toNumber(values.collected_amount),
  };

  const { data, error } = await supabase
    .from("project_sprints")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as SprintDb;
}

export async function softDeleteSprint(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_project_sprint", {
    sprint_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function createFeature(values: FeatureFormValues) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const payload: FeatureInsert = {
    project_id: values.project_id,
    sprint_id: toNullable(values.sprint_id),
    title: values.title.trim(),
    description: toNullable(values.description),
    status: values.status,
    priority: values.priority,
    assigned_to: userId,
    sort_order: toInteger(values.sort_order),
    started_at: toNullable(values.started_at),
    developed_at: toNullable(values.developed_at),
    delivered_at: toNullable(values.delivered_at),
    cancelled_at: toNullable(values.cancelled_at),
    cancellation_reason: toNullable(values.cancellation_reason),
    technical_notes: toNullable(values.technical_notes),
  };

  const { data, error } = await supabase
    .from("project_features")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeatureDb;
}

export async function updateFeature(id: string, values: FeatureFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: FeatureUpdate = {
    project_id: values.project_id,
    sprint_id: toNullable(values.sprint_id),
    title: values.title.trim(),
    description: toNullable(values.description),
    status: values.status,
    priority: values.priority,
    sort_order: toInteger(values.sort_order),
    started_at: toNullable(values.started_at),
    developed_at: toNullable(values.developed_at),
    delivered_at: toNullable(values.delivered_at),
    cancelled_at: toNullable(values.cancelled_at),
    cancellation_reason: toNullable(values.cancellation_reason),
    technical_notes: toNullable(values.technical_notes),
  };

  const { data, error } = await supabase
    .from("project_features")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as FeatureDb;
}

export async function softDeleteFeature(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_project_feature", {
    feature_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function getCurrentUserId() {
  const supabase = getSupabaseBrowserClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("No hay sesión activa.");
  }

  return user.id;
}

function toNullable(value: string) {
  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
}

function toNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}

function toInteger(value: string) {
  const number = Number(value);

  if (!Number.isFinite(number)) return 1;

  return Math.max(1, Math.round(number));
}