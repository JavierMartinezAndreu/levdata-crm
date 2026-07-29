"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Building2,
  Edit3,
  Loader2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/common/metric-card";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCompany,
  listCompanies,
  softDeleteCompany,
  updateCompany,
} from "@/features/companies/data/companies-service";
import type {
  CompanyDb,
  CompanyDbPotential,
  CompanyDbStatus,
  CompanyFormValues,
} from "@/features/companies/types";
import {
  filterRealCompanies,
  getCompanyDbPotentialLabel,
  getCompanyDbPotentialTone,
  getCompanyDbStatusLabel,
  getCompanyDbStatusTone,
  getRealCompanyStats,
} from "@/features/companies/utils";

const emptyCompanyForm: CompanyFormValues = {
  commercial_name: "",
  legal_name: "",
  tax_id: "",
  email: "",
  phone: "",
  website: "",
  sector: "",
  source: "",
  address: "",
  city: "",
  province: "",
  postal_code: "",
  status: "prospecto",
  potential: "medio",
  notes: "",
};

const companyStatusOptions: { value: CompanyDbStatus; label: string }[] = [
  { value: "prospecto", label: "Prospecto" },
  { value: "contactado", label: "Contactado" },
  { value: "oportunidad", label: "Oportunidad" },
  { value: "cliente", label: "Cliente" },
  { value: "inactivo", label: "Inactivo" },
  { value: "descartado", label: "Descartado" },
];

const companyPotentialOptions: {
  value: CompanyDbPotential;
  label: string;
}[] = [
  { value: "bajo", label: "Bajo" },
  { value: "medio", label: "Medio" },
  { value: "alto", label: "Alto" },
  { value: "estrategico", label: "Estratégico" },
];

const statusFilterOptions: { value: CompanyDbStatus | "all"; label: string }[] =
  [{ value: "all", label: "Todos los estados" }, ...companyStatusOptions];

const potentialFilterOptions: {
  value: CompanyDbPotential | "all";
  label: string;
}[] = [
  { value: "all", label: "Todos los potenciales" },
  ...companyPotentialOptions,
];

export function CompaniesRealtimePage() {
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [form, setForm] = useState<CompanyFormValues>(emptyCompanyForm);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CompanyDbStatus | "all">("all");
  const [potential, setPotential] = useState<CompanyDbPotential | "all">("all");

  async function loadCompanies() {
    try {
      setLoading(true);
      const data = await listCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error("No se han podido cargar las empresas.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const stats = useMemo(() => getRealCompanyStats(companies), [companies]);

  const filteredCompanies = useMemo(
    () =>
      filterRealCompanies({
        companies,
        search,
        status,
        potential,
      }),
    [companies, search, status, potential],
  );

  const formTitle = editingCompanyId ? "Editar empresa" : "Nueva empresa";
  const formDescription = editingCompanyId
    ? "Actualiza los datos reales de la empresa en Supabase."
    : "Crea una empresa real en Supabase. Después podremos asociarle contactos y oportunidades.";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.commercial_name.trim()) {
      toast.error("El nombre comercial es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingCompanyId) {
        const updatedCompany = await updateCompany(editingCompanyId, form);

        setCompanies((current) =>
          current.map((company) =>
            company.id === updatedCompany.id ? updatedCompany : company,
          ),
        );

        toast.success("Empresa actualizada correctamente.", {
          description: updatedCompany.commercial_name,
        });
      } else {
        const createdCompany = await createCompany(form);

        setCompanies((current) => [createdCompany, ...current]);

        toast.success("Empresa creada correctamente.", {
          description: createdCompany.commercial_name,
        });
      }

      closeForm();
    } catch (error) {
      toast.error(
        editingCompanyId
          ? "No se ha podido actualizar la empresa."
          : "No se ha podido crear la empresa.",
        {
          description:
            error instanceof Error ? error.message : "Error desconocido.",
        },
      );
    } finally {
      setSaving(false);
    }
  }

  function openCreateForm() {
    setEditingCompanyId(null);
    setForm(emptyCompanyForm);
    setFormOpen(true);
  }

  function openEditForm(company: CompanyDb) {
    setEditingCompanyId(company.id);
    setForm(mapCompanyToForm(company));
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setEditingCompanyId(null);
    setForm(emptyCompanyForm);
    setFormOpen(false);
  }

  async function handleDelete(company: CompanyDb) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar "${company.commercial_name}"? Se ocultará del CRM, pero quedará trazabilidad en auditoría.`,
    );

    if (!confirmed) return;

    setDeletingId(company.id);

    try {
      await softDeleteCompany(company.id);

      setCompanies((current) =>
        current.filter((item) => item.id !== company.id),
      );

      toast.success("Empresa eliminada correctamente.", {
        description: company.commercial_name,
      });
    } catch (error) {
      toast.error("No se ha podido eliminar la empresa.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  function updateForm<Key extends keyof CompanyFormValues>(
    key: Key,
    value: CompanyFormValues[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="CRM"
        title="Empresas"
        description="Registro real de prospectos, clientes y partners conectado con Supabase."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadCompanies}
              disabled={loading}
              className="rounded-2xl bg-white"
            >
              <RefreshCw className="mr-2 size-4" />
              Actualizar
            </Button>

            <Button
              type="button"
              onClick={openCreateForm}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <Plus className="mr-2 size-4" />
              Nueva empresa
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Empresas"
          value={String(stats.total)}
          description="Registros reales"
          icon={Building2}
          tone="primary"
          variation="Supabase"
          variationDirection="flat"
        />

        <MetricCard
          title="Prospectos"
          value={String(stats.prospects)}
          description="Pendientes de trabajar"
          icon={Search}
          tone="info"
          variation="pipeline"
          variationDirection="flat"
        />

        <MetricCard
          title="Oportunidad"
          value={String(stats.opportunities)}
          description="Con interés detectado"
          icon={Plus}
          tone="warning"
          variation="seguimiento"
          variationDirection="flat"
        />

        <MetricCard
          title="Clientes"
          value={String(stats.clients)}
          description="Empresas activas"
          icon={Building2}
          tone="success"
          variation="real"
          variationDirection="flat"
        />
      </section>

      {formOpen ? (
        <SectionCard title={formTitle} description={formDescription}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Nombre comercial"
                value={form.commercial_name}
                onChange={(value) => updateForm("commercial_name", value)}
                required
              />

              <FormField
                label="Razón social"
                value={form.legal_name}
                onChange={(value) => updateForm("legal_name", value)}
              />

              <FormField
                label="CIF/NIF"
                value={form.tax_id}
                onChange={(value) => updateForm("tax_id", value)}
              />

              <FormField
                label="Email"
                value={form.email}
                type="email"
                onChange={(value) => updateForm("email", value)}
              />

              <FormField
                label="Teléfono"
                value={form.phone}
                onChange={(value) => updateForm("phone", value)}
              />

              <FormField
                label="Web"
                value={form.website}
                onChange={(value) => updateForm("website", value)}
                placeholder="https://..."
              />

              <FormField
                label="Sector"
                value={form.sector}
                onChange={(value) => updateForm("sector", value)}
              />

              <FormField
                label="Fuente"
                value={form.source}
                onChange={(value) => updateForm("source", value)}
                placeholder="Prospección, referido, web..."
              />

              <FormField
                label="Ciudad"
                value={form.city}
                onChange={(value) => updateForm("city", value)}
              />

              <FormField
                label="Provincia"
                value={form.province}
                onChange={(value) => updateForm("province", value)}
              />

              <FormField
                label="Código postal"
                value={form.postal_code}
                onChange={(value) => updateForm("postal_code", value)}
              />

              <FormField
                label="Dirección"
                value={form.address}
                onChange={(value) => updateForm("address", value)}
              />

              <SelectField
                label="Estado"
                value={form.status}
                options={companyStatusOptions}
                onChange={(value) => updateForm("status", value)}
              />

              <SelectField
                label="Potencial"
                value={form.potential}
                options={companyPotentialOptions}
                onChange={(value) => updateForm("potential", value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
                Notas
              </label>

              <textarea
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                rows={4}
                className="min-h-28 w-full rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
                placeholder="Contexto comercial, necesidad detectada, próximos pasos..."
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={closeForm}
                className="rounded-2xl bg-white"
              >
                <X className="mr-2 size-4" />
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={saving}
                className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
              >
                {saving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : editingCompanyId ? (
                  <Edit3 className="mr-2 size-4" />
                ) : (
                  <Plus className="mr-2 size-4" />
                )}

                {saving
                  ? "Guardando..."
                  : editingCompanyId
                    ? "Guardar cambios"
                    : "Guardar empresa"}
              </Button>
            </div>
          </form>
        </SectionCard>
      ) : null}

      <SectionCard
        title="Listado de empresas"
        description="Datos reales guardados en la tabla companies."
      >
        <div className="mb-5 grid gap-3 lg:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white pl-11"
              placeholder="Buscar por nombre, CIF, email, sector, ciudad..."
            />
          </div>

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as CompanyDbStatus | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
          >
            {statusFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={potential}
            onChange={(event) =>
              setPotential(event.target.value as CompanyDbPotential | "all")
            }
            className="h-12 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
          >
            {potentialFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center rounded-3xl bg-[#F6FAFC]">
            <div className="text-center">
              <Loader2 className="mx-auto size-7 animate-spin text-[#00ABBD]" />
              <p className="mt-3 text-sm font-bold text-[#071B3A]">
                Cargando empresas reales...
              </p>
            </div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="rounded-3xl bg-[#F6FAFC] p-8 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-white text-[#00ABBD] shadow-sm">
              <Building2 className="size-7" />
            </div>

            <p className="mt-4 font-extrabold text-[#071B3A]">
              No hay empresas que coincidan
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Crea la primera empresa real o ajusta los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredCompanies.map((company) => (
              <CompanyCard
                key={company.id}
                company={company}
                deleting={deletingId === company.id}
                onEdit={() => openEditForm(company)}
                onDelete={() => handleDelete(company)}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}

type CompanyCardProps = {
  company: CompanyDb;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function CompanyCard({
  company,
  deleting,
  onEdit,
  onDelete,
}: CompanyCardProps) {
  return (
    <article className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-extrabold text-[#071B3A]">
              {company.commercial_name}
            </h3>

            <StatusChip
              label={getCompanyDbStatusLabel(company.status)}
              tone={getCompanyDbStatusTone(company.status)}
            />

            <StatusChip
              label={getCompanyDbPotentialLabel(company.potential)}
              tone={getCompanyDbPotentialTone(company.potential)}
              dot={false}
            />
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {company.legal_name || "Sin razón social"}{" "}
            {company.tax_id ? `· ${company.tax_id}` : ""}
          </p>

          {company.notes ? (
            <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-500">
              {company.notes}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
            {company.email ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                <Mail className="size-3.5" />
                {company.email}
              </span>
            ) : null}

            {company.phone ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                <Phone className="size-3.5" />
                {company.phone}
              </span>
            ) : null}

            {company.city || company.province ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                {company.city || "Sin ciudad"}
                {company.province ? `, ${company.province}` : ""}
              </span>
            ) : null}

            {company.sector ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#F6FAFC] px-3 py-1 font-semibold">
                {company.sector}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-60 flex-col gap-3">
          <div className="grid grid-cols-2 gap-2 text-sm xl:text-right">
            <SmallInfo label="Fuente" value={company.source || "Sin dato"} />
            <SmallInfo label="Web" value={company.website || "Sin web"} />
          </div>

          <div className="flex gap-2 xl:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onEdit}
              className="rounded-2xl bg-white"
            >
              <Edit3 className="mr-2 size-4" />
              Editar
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              disabled={deleting}
              className="rounded-2xl border-red-100 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
            >
              {deleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

type SmallInfoProps = {
  label: string;
  value: string;
};

function SmallInfo({ label, value }: SmallInfoProps) {
  return (
    <div className="rounded-2xl bg-[#F6FAFC] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-extrabold text-[#071B3A]">
        {value}
      </p>
    </div>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
};

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
        {required ? <span className="text-[#FF9933]"> *</span> : null}
      </label>

      <Input
        value={value}
        type={type}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

type SelectFieldProps<Value extends string> = {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
};

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<Value>) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Value)}
        className="h-12 w-full rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A] outline-none focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function mapCompanyToForm(company: CompanyDb): CompanyFormValues {
  return {
    commercial_name: company.commercial_name,
    legal_name: company.legal_name ?? "",
    tax_id: company.tax_id ?? "",
    email: company.email ?? "",
    phone: company.phone ?? "",
    website: company.website ?? "",
    sector: company.sector ?? "",
    source: company.source ?? "",
    address: company.address ?? "",
    city: company.city ?? "",
    province: company.province ?? "",
    postal_code: company.postal_code ?? "",
    status: company.status,
    potential: company.potential,
    notes: company.notes ?? "",
  };
}