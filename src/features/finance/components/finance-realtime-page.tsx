"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CheckCircle2,
  CreditCard,
  Edit3,
  Loader2,
  PiggyBank,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { listCompanies } from "@/features/companies/data/companies-service";
import type { CompanyDb } from "@/features/companies/types";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";
import {
  createExpense,
  createPayment,
  createPayout,
  getFinanceData,
  getFinanceStats,
  isPaymentOverdue,
  softDeleteExpense,
  softDeletePayment,
  softDeletePayout,
  updateExpense,
  updatePayment,
  updatePayout,
} from "@/features/finance/data/finance-service";
import type {
  ExpenseCategory,
  ExpenseFormValues,
  ExpenseListItem,
  ExpenseType,
  FinanceData,
  PaymentFormValues,
  PaymentListItem,
  PaymentMethod,
  PaymentStatus,
  PayoutFormValues,
  PayoutListItem,
  PayoutType,
} from "@/features/finance/types";
import {
  getExpenseCategoryLabel,
  getExpenseCategoryTone,
  getExpenseTypeLabel,
  getPaymentMethodLabel,
  getPayoutTypeLabel,
} from "@/features/finance/utils";

type FinanceTab = "payments" | "expenses" | "payouts";
type FinanceFormMode = "payment" | "expense" | "payout" | null;

const emptyPaymentForm: PaymentFormValues = {
  company_id: "",
  opportunity_id: "",
  amount: "",
  payment_date: getTodayDate(),
  due_date: "",
  method: "transferencia",
  status: "cobrado",
  concept: "",
  notes: "",
};

const emptyExpenseForm: ExpenseFormValues = {
  company_id: "",
  opportunity_id: "",
  amount: "",
  expense_date: getTodayDate(),
  next_date: "",
  type: "puntual",
  category: "otro",
  concept: "",
  periodicity: "",
  is_reimbursable: false,
  notes: "",
};

const emptyPayoutForm: PayoutFormValues = {
  amount: "",
  payout_date: getTodayDate(),
  concept: "",
  type: "repartoBeneficio",
  notes: "",
};

const paymentMethodOptions: { value: PaymentMethod; label: string }[] = [
  { value: "transferencia", label: "Transferencia" },
  { value: "efectivo", label: "Efectivo" },
  { value: "bizum", label: "Bizum" },
  { value: "stripe", label: "Stripe" },
  { value: "redsys", label: "Redsys" },
  { value: "otro", label: "Otro" },
];

const paymentStatusOptions: { value: PaymentStatus; label: string }[] = [
  { value: "pendiente", label: "Pendiente" },
  { value: "cobrado", label: "Cobrado" },
  { value: "parcial", label: "Parcial" },
  { value: "vencido", label: "Vencido" },
  { value: "cancelado", label: "Cancelado" },
];

const expenseTypeOptions: { value: ExpenseType; label: string }[] = [
  { value: "puntual", label: "Puntual" },
  { value: "recurrente", label: "Recurrente" },
  { value: "internoLevData", label: "Interno LevData" },
  { value: "asociadoProyecto", label: "Asociado a proyecto" },
  { value: "asociadoMantenimiento", label: "Asociado a mantenimiento" },
];

const expenseCategoryOptions: { value: ExpenseCategory; label: string }[] = [
  { value: "dominio", label: "Dominio" },
  { value: "hosting", label: "Hosting" },
  { value: "microsoft365", label: "Microsoft 365" },
  { value: "sim", label: "SIM" },
  { value: "licencia", label: "Licencia" },
  { value: "plugin", label: "Plugin" },
  { value: "servidor", label: "Servidor" },
  { value: "diseno", label: "Diseño" },
  { value: "subcontratacion", label: "Subcontratación" },
  { value: "herramientaIA", label: "Herramienta IA" },
  { value: "publicidad", label: "Publicidad" },
  { value: "otro", label: "Otro" },
];

const payoutTypeOptions: { value: PayoutType; label: string }[] = [
  { value: "repartoBeneficio", label: "Reparto beneficio" },
  { value: "sueldo", label: "Sueldo" },
  { value: "reembolso", label: "Reembolso" },
  { value: "bonus", label: "Bonus" },
  { value: "adelanto", label: "Adelanto" },
];

export function FinanceRealtimePage() {
  const [data, setData] = useState<FinanceData | null>(null);
  const [companies, setCompanies] = useState<CompanyDb[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<FinanceTab>("payments");
  const [formMode, setFormMode] = useState<FinanceFormMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [paymentForm, setPaymentForm] =
    useState<PaymentFormValues>(emptyPaymentForm);
  const [expenseForm, setExpenseForm] =
    useState<ExpenseFormValues>(emptyExpenseForm);
  const [payoutForm, setPayoutForm] =
    useState<PayoutFormValues>(emptyPayoutForm);

  const [search, setSearch] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [financeData, companiesData, opportunitiesData] = await Promise.all([
        getFinanceData(),
        listCompanies(),
        listOpportunities(),
      ]);

      setData(financeData);
      setCompanies(companiesData);
      setOpportunities(opportunitiesData);
    } catch (error) {
      toast.error("No se han podido cargar las finanzas.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () =>
      data
        ? getFinanceStats(data)
        : {
            collected: 0,
            pending: 0,
            overdue: 0,
            expenses: 0,
            payouts: 0,
            netProfit: 0,
            estimatedCash: 0,
            reimbursableExpenses: 0,
            monthCollected: 0,
            monthExpenses: 0,
          },
    [data],
  );

  const filteredOpportunitiesForPayment = useMemo(
    () =>
      paymentForm.company_id
        ? opportunities.filter(
            (item) => item.opportunity.company_id === paymentForm.company_id,
          )
        : opportunities,
    [opportunities, paymentForm.company_id],
  );

  const filteredOpportunitiesForExpense = useMemo(
    () =>
      expenseForm.company_id
        ? opportunities.filter(
            (item) => item.opportunity.company_id === expenseForm.company_id,
          )
        : opportunities,
    [opportunities, expenseForm.company_id],
  );

  const filteredPayments = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return data.payments.filter((item) => {
      return (
        normalizedSearch.length === 0 ||
        item.payment.concept.toLowerCase().includes(normalizedSearch) ||
        (item.company?.commercial_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.opportunity?.title ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [data, search]);

  const filteredExpenses = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return data.expenses.filter((item) => {
      return (
        normalizedSearch.length === 0 ||
        item.expense.concept.toLowerCase().includes(normalizedSearch) ||
        (item.company?.commercial_name ?? "")
          .toLowerCase()
          .includes(normalizedSearch) ||
        (item.opportunity?.title ?? "")
          .toLowerCase()
          .includes(normalizedSearch)
      );
    });
  }, [data, search]);

  const filteredPayouts = useMemo(() => {
    if (!data) return [];

    const normalizedSearch = search.trim().toLowerCase();

    return data.payouts.filter((item) => {
      return (
        normalizedSearch.length === 0 ||
        item.payout.concept.toLowerCase().includes(normalizedSearch) ||
        (item.user?.full_name ?? "").toLowerCase().includes(normalizedSearch) ||
        (item.user?.email ?? "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [data, search]);

  function openCreateForm(mode: Exclude<FinanceFormMode, null>) {
    setEditingId(null);
    setFormMode(mode);

    if (mode === "payment") {
      setPaymentForm({
        ...emptyPaymentForm,
        payment_date: getTodayDate(),
      });
      setActiveTab("payments");
    }

    if (mode === "expense") {
      setExpenseForm({
        ...emptyExpenseForm,
        expense_date: getTodayDate(),
      });
      setActiveTab("expenses");
    }

    if (mode === "payout") {
      setPayoutForm({
        ...emptyPayoutForm,
        payout_date: getTodayDate(),
      });
      setActiveTab("payouts");
    }
  }

  function closeForm() {
    setFormMode(null);
    setEditingId(null);
    setPaymentForm(emptyPaymentForm);
    setExpenseForm(emptyExpenseForm);
    setPayoutForm(emptyPayoutForm);
  }

  async function handlePaymentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!paymentForm.concept.trim()) {
      toast.error("El concepto del cobro es obligatorio.");
      return;
    }

    if (!paymentForm.amount.trim()) {
      toast.error("El importe del cobro es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updatePayment(editingId, paymentForm);
        toast.success("Cobro actualizado correctamente.");
      } else {
        await createPayment(paymentForm);
        toast.success("Cobro creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar el cobro.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleExpenseSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!expenseForm.concept.trim()) {
      toast.error("El concepto del gasto es obligatorio.");
      return;
    }

    if (!expenseForm.amount.trim()) {
      toast.error("El importe del gasto es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updateExpense(editingId, expenseForm);
        toast.success("Gasto actualizado correctamente.");
      } else {
        await createExpense(expenseForm);
        toast.success("Gasto creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar el gasto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handlePayoutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!payoutForm.concept.trim()) {
      toast.error("El concepto del reparto es obligatorio.");
      return;
    }

    if (!payoutForm.amount.trim()) {
      toast.error("El importe del reparto es obligatorio.");
      return;
    }

    setSaving(true);

    try {
      if (editingId) {
        await updatePayout(editingId, payoutForm);
        toast.success("Reparto actualizado correctamente.");
      } else {
        await createPayout(payoutForm);
        toast.success("Reparto creado correctamente.");
      }

      closeForm();
      await loadData();
    } catch (error) {
      toast.error("No se ha podido guardar el reparto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setSaving(false);
    }
  }

  function openEditPayment(item: PaymentListItem) {
    setEditingId(item.payment.id);
    setFormMode("payment");
    setActiveTab("payments");
    setPaymentForm({
      company_id: item.payment.company_id ?? "",
      opportunity_id: item.payment.opportunity_id ?? "",
      amount: String(item.payment.amount),
      payment_date: item.payment.payment_date,
      due_date: item.payment.due_date ?? "",
      method: item.payment.method,
      status: item.payment.status,
      concept: item.payment.concept,
      notes: item.payment.notes ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditExpense(item: ExpenseListItem) {
    setEditingId(item.expense.id);
    setFormMode("expense");
    setActiveTab("expenses");
    setExpenseForm({
      company_id: item.expense.company_id ?? "",
      opportunity_id: item.expense.opportunity_id ?? "",
      amount: String(item.expense.amount),
      expense_date: item.expense.expense_date,
      next_date: item.expense.next_date ?? "",
      type: item.expense.type,
      category: item.expense.category,
      concept: item.expense.concept,
      periodicity: item.expense.periodicity ?? "",
      is_reimbursable: item.expense.is_reimbursable,
      notes: item.expense.notes ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openEditPayout(item: PayoutListItem) {
    setEditingId(item.payout.id);
    setFormMode("payout");
    setActiveTab("payouts");
    setPayoutForm({
      amount: String(item.payout.amount),
      payout_date: item.payout.payout_date,
      concept: item.payout.concept,
      type: item.payout.type,
      notes: item.payout.notes ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDeletePayment(item: PaymentListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el cobro "${item.payment.concept}"?`,
    );

    if (!confirmed) return;

    setDeletingId(item.payment.id);

    try {
      await softDeletePayment(item.payment.id);
      toast.success("Cobro eliminado correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar el cobro.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteExpense(item: ExpenseListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el gasto "${item.expense.concept}"?`,
    );

    if (!confirmed) return;

    setDeletingId(item.expense.id);

    try {
      await softDeleteExpense(item.expense.id);
      toast.success("Gasto eliminado correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar el gasto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  async function handleDeletePayout(item: PayoutListItem) {
    const confirmed = window.confirm(
      `¿Seguro que quieres eliminar el reparto "${item.payout.concept}"?`,
    );

    if (!confirmed) return;

    setDeletingId(item.payout.id);

    try {
      await softDeletePayout(item.payout.id);
      toast.success("Reparto eliminado correctamente.");
      await loadData();
    } catch (error) {
      toast.error("No se ha podido eliminar el reparto.", {
        description:
          error instanceof Error ? error.message : "Error desconocido.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="levdata-card flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center">
          <Loader2 className="size-8 animate-spin text-[#00ABBD]" />
          <p className="mt-4 text-sm font-bold text-[#071B3A]">
            Cargando finanzas reales
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Leyendo cobros, gastos y repartos desde Supabase.
          </p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Finanzas"
          title="No se ha podido cargar"
          description="Revisa Supabase y vuelve a intentarlo."
          actions={
            <Button
              type="button"
              onClick={loadData}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <RefreshCw className="mr-2 size-4" />
              Reintentar
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tesorería"
        title="Caja LevData"
        description="Control real de cobros, gastos y repartos internos. No sustituye facturación oficial ni contabilidad legal."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={loadData}
              disabled={loading}
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              {loading ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 size-4" />
              )}
              Actualizar
            </Button>

            <Button
              type="button"
              onClick={() => openCreateForm("payment")}
              className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
            >
              <ArrowUpCircle className="mr-2 size-4" />
              Nuevo cobro
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => openCreateForm("expense")}
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              <ArrowDownCircle className="mr-2 size-4" />
              Nuevo gasto
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => openCreateForm("payout")}
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              <WalletCards className="mr-2 size-4" />
              Nuevo reparto
            </Button>
          </div>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusChip label="Finanzas reales" tone="success" />
              <StatusChip label="Caja interna" tone="primary" dot={false} />
              {stats.overdue > 0 ? (
                <StatusChip label="Hay vencidos" tone="danger" dot={false} />
              ) : (
                <StatusChip label="Sin vencidos" tone="success" dot={false} />
              )}
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {stats.overdue > 0
                ? "Hay cobros vencidos. Prioridad: recuperar caja."
                : "Caja bajo control. Revisa ingresos, gastos y repartos."}
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Esta vista separa dinero cobrado, pendiente, gastos operativos y
              repartos. Así puedes saber cuánto entra, cuánto sale y qué caja
              estimada queda.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <HeroMoney
              label="Caja estimada"
              value={stats.estimatedCash}
              description="Cobrado - gastos - repartos"
              icon={PiggyBank}
            />

            <HeroMoney
              label="Beneficio neto"
              value={stats.netProfit}
              description="Cobrado - gastos"
              icon={Banknote}
            />

            <HeroMoney
              label="Pendiente"
              value={stats.pending}
              description="Cobros no cerrados"
              icon={CreditCard}
              warning={stats.pending > 0}
            />

            <HeroMoney
              label="Vencido"
              value={stats.overdue}
              description="Requiere seguimiento"
              icon={AlertTriangle}
              danger={stats.overdue > 0}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Cobrado"
          value={<MoneyValue value={stats.collected} size="lg" tone="positive" />}
          description="Ingresos confirmados"
          icon={ArrowUpCircle}
          tone="success"
          variation="real"
          variationDirection="up"
        />

        <MetricCard
          title="Gastos"
          value={<MoneyValue value={stats.expenses} size="lg" tone="danger" />}
          description="Operativos y proyecto"
          icon={Receipt}
          tone="danger"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Repartos"
          value={<MoneyValue value={stats.payouts} size="lg" tone="warning" />}
          description="Pagos internos"
          icon={WalletCards}
          tone="warning"
          variation="separado"
          variationDirection="flat"
        />

        <MetricCard
          title="Reembolsable"
          value={
            <MoneyValue
              value={stats.reimbursableExpenses}
              size="lg"
              tone="warning"
            />
          }
          description="Gastos a recuperar"
          icon={RefreshCw}
          tone="info"
          variation="vigilar"
          variationDirection="flat"
        />

        <MetricCard
          title="Cobrado este mes"
          value={
            <MoneyValue value={stats.monthCollected} size="lg" tone="positive" />
          }
          description="Ingresos del mes actual"
          icon={CheckCircle2}
          tone="success"
          variation="mes"
          variationDirection="flat"
        />

        <MetricCard
          title="Gastado este mes"
          value={<MoneyValue value={stats.monthExpenses} size="lg" tone="danger" />}
          description="Salidas del mes actual"
          icon={ArrowDownCircle}
          tone="danger"
          variation="mes"
          variationDirection="flat"
        />

        <MetricCard
          title="Movimientos"
          value={String(
            data.payments.length + data.expenses.length + data.payouts.length,
          )}
          description="Registros financieros"
          icon={Search}
          tone="primary"
          variation="Supabase"
          variationDirection="flat"
        />

        <MetricCard
          title="Vencido"
          value={<MoneyValue value={stats.overdue} size="lg" tone="danger" />}
          description="Cobros fuera de fecha"
          icon={AlertTriangle}
          tone={stats.overdue > 0 ? "danger" : "success"}
          variation={stats.overdue > 0 ? "urgente" : "ok"}
          variationDirection="flat"
        />
      </section>

      {formMode === "payment" ? (
        <FinanceFormCard
          title={editingId ? "Editar cobro" : "Nuevo cobro"}
          description="Registra ingresos cobrados, pendientes, parciales o vencidos."
          onClose={closeForm}
        >
          <form className="space-y-5" onSubmit={handlePaymentSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Concepto"
                value={paymentForm.concept}
                required
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, concept: value }))
                }
              />

              <FormField
                label="Importe"
                value={paymentForm.amount}
                type="number"
                required
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, amount: value }))
                }
              />

              <FormField
                label="Fecha cobro"
                value={paymentForm.payment_date}
                type="date"
                onChange={(value) =>
                  setPaymentForm((current) => ({
                    ...current,
                    payment_date: value,
                  }))
                }
              />

              <FormField
                label="Fecha vencimiento"
                value={paymentForm.due_date}
                type="date"
                onChange={(value) =>
                  setPaymentForm((current) => ({
                    ...current,
                    due_date: value,
                  }))
                }
              />

              <SelectField
                label="Estado"
                value={paymentForm.status}
                options={paymentStatusOptions}
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, status: value }))
                }
              />

              <SelectField
                label="Método"
                value={paymentForm.method}
                options={paymentMethodOptions}
                onChange={(value) =>
                  setPaymentForm((current) => ({ ...current, method: value }))
                }
              />

              <SelectField
                label="Empresa"
                value={paymentForm.company_id}
                options={[
                  { value: "", label: "Sin empresa" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) =>
                  setPaymentForm((current) => ({
                    ...current,
                    company_id: value,
                    opportunity_id: "",
                  }))
                }
              />

              <SelectField
                label="Oportunidad"
                value={paymentForm.opportunity_id}
                options={[
                  { value: "", label: "Sin oportunidad" },
                  ...filteredOpportunitiesForPayment.map((item) => ({
                    value: item.opportunity.id,
                    label: item.opportunity.title,
                  })),
                ]}
                onChange={(value) =>
                  setPaymentForm((current) => ({
                    ...current,
                    opportunity_id: value,
                  }))
                }
              />
            </div>

            <TextAreaField
              label="Notas"
              value={paymentForm.notes}
              onChange={(value) =>
                setPaymentForm((current) => ({ ...current, notes: value }))
              }
            />

            <SubmitRow saving={saving} editing={Boolean(editingId)} />
          </form>
        </FinanceFormCard>
      ) : null}

      {formMode === "expense" ? (
        <FinanceFormCard
          title={editingId ? "Editar gasto" : "Nuevo gasto"}
          description="Registra gastos internos, recurrentes o asociados a una empresa/oportunidad."
          onClose={closeForm}
        >
          <form className="space-y-5" onSubmit={handleExpenseSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Concepto"
                value={expenseForm.concept}
                required
                onChange={(value) =>
                  setExpenseForm((current) => ({ ...current, concept: value }))
                }
              />

              <FormField
                label="Importe"
                value={expenseForm.amount}
                type="number"
                required
                onChange={(value) =>
                  setExpenseForm((current) => ({ ...current, amount: value }))
                }
              />

              <FormField
                label="Fecha gasto"
                value={expenseForm.expense_date}
                type="date"
                onChange={(value) =>
                  setExpenseForm((current) => ({
                    ...current,
                    expense_date: value,
                  }))
                }
              />

              <FormField
                label="Próxima fecha"
                value={expenseForm.next_date}
                type="date"
                onChange={(value) =>
                  setExpenseForm((current) => ({ ...current, next_date: value }))
                }
              />

              <SelectField
                label="Tipo"
                value={expenseForm.type}
                options={expenseTypeOptions}
                onChange={(value) =>
                  setExpenseForm((current) => ({ ...current, type: value }))
                }
              />

              <SelectField
                label="Categoría"
                value={expenseForm.category}
                options={expenseCategoryOptions}
                onChange={(value) =>
                  setExpenseForm((current) => ({ ...current, category: value }))
                }
              />

              <SelectField
                label="Empresa"
                value={expenseForm.company_id}
                options={[
                  { value: "", label: "Sin empresa" },
                  ...companies.map((company) => ({
                    value: company.id,
                    label: company.commercial_name,
                  })),
                ]}
                onChange={(value) =>
                  setExpenseForm((current) => ({
                    ...current,
                    company_id: value,
                    opportunity_id: "",
                  }))
                }
              />

              <SelectField
                label="Oportunidad"
                value={expenseForm.opportunity_id}
                options={[
                  { value: "", label: "Sin oportunidad" },
                  ...filteredOpportunitiesForExpense.map((item) => ({
                    value: item.opportunity.id,
                    label: item.opportunity.title,
                  })),
                ]}
                onChange={(value) =>
                  setExpenseForm((current) => ({
                    ...current,
                    opportunity_id: value,
                  }))
                }
              />

              <FormField
                label="Periodicidad"
                value={expenseForm.periodicity}
                placeholder="mensual, anual..."
                onChange={(value) =>
                  setExpenseForm((current) => ({
                    ...current,
                    periodicity: value,
                  }))
                }
              />

              <div className="flex items-end">
                <label className="flex h-12 w-full cursor-pointer items-center gap-3 rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 text-sm font-semibold text-[#071B3A]">
                  <input
                    type="checkbox"
                    checked={expenseForm.is_reimbursable}
                    onChange={(event) =>
                      setExpenseForm((current) => ({
                        ...current,
                        is_reimbursable: event.target.checked,
                      }))
                    }
                    className="size-4 accent-[#00ABBD]"
                  />
                  Reembolsable
                </label>
              </div>
            </div>

            <TextAreaField
              label="Notas"
              value={expenseForm.notes}
              onChange={(value) =>
                setExpenseForm((current) => ({ ...current, notes: value }))
              }
            />

            <SubmitRow saving={saving} editing={Boolean(editingId)} />
          </form>
        </FinanceFormCard>
      ) : null}

      {formMode === "payout" ? (
        <FinanceFormCard
          title={editingId ? "Editar reparto" : "Nuevo reparto"}
          description="Registra pagos internos separados de los gastos operativos."
          onClose={closeForm}
        >
          <form className="space-y-5" onSubmit={handlePayoutSubmit}>
            <div className="grid gap-4 lg:grid-cols-3">
              <FormField
                label="Concepto"
                value={payoutForm.concept}
                required
                onChange={(value) =>
                  setPayoutForm((current) => ({ ...current, concept: value }))
                }
              />

              <FormField
                label="Importe"
                value={payoutForm.amount}
                type="number"
                required
                onChange={(value) =>
                  setPayoutForm((current) => ({ ...current, amount: value }))
                }
              />

              <FormField
                label="Fecha"
                value={payoutForm.payout_date}
                type="date"
                onChange={(value) =>
                  setPayoutForm((current) => ({
                    ...current,
                    payout_date: value,
                  }))
                }
              />

              <SelectField
                label="Tipo"
                value={payoutForm.type}
                options={payoutTypeOptions}
                onChange={(value) =>
                  setPayoutForm((current) => ({ ...current, type: value }))
                }
              />
            </div>

            <TextAreaField
              label="Notas"
              value={payoutForm.notes}
              onChange={(value) =>
                setPayoutForm((current) => ({ ...current, notes: value }))
              }
            />

            <SubmitRow saving={saving} editing={Boolean(editingId)} />
          </form>
        </FinanceFormCard>
      ) : null}

      <section className="levdata-card rounded-[1.75rem] p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          <TabButton
            active={activeTab === "payments"}
            label={`Cobros (${data.payments.length})`}
            icon={ArrowUpCircle}
            onClick={() => setActiveTab("payments")}
          />

          <TabButton
            active={activeTab === "expenses"}
            label={`Gastos (${data.expenses.length})`}
            icon={ArrowDownCircle}
            onClick={() => setActiveTab("expenses")}
          />

          <TabButton
            active={activeTab === "payouts"}
            label={`Repartos (${data.payouts.length})`}
            icon={WalletCards}
            onClick={() => setActiveTab("payouts")}
          />
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por concepto, empresa, oportunidad o persona..."
            className="h-12 rounded-2xl border-[#A1C7E0]/50 bg-white pl-11"
          />
        </div>
      </section>

      {activeTab === "payments" ? (
        <SectionCard
          title="Cobros"
          description="Ingresos reales registrados y cobros pendientes."
        >
          <PaymentList
            items={filteredPayments}
            deletingId={deletingId}
            onEdit={openEditPayment}
            onDelete={handleDeletePayment}
          />
        </SectionCard>
      ) : null}

      {activeTab === "expenses" ? (
        <SectionCard
          title="Gastos"
          description="Gastos internos, recurrentes y asociados a oportunidades."
        >
          <ExpenseList
            items={filteredExpenses}
            deletingId={deletingId}
            onEdit={openEditExpense}
            onDelete={handleDeleteExpense}
          />
        </SectionCard>
      ) : null}

      {activeTab === "payouts" ? (
        <SectionCard
          title="Repartos"
          description="Pagos internos separados de los gastos operativos."
        >
          <PayoutList
            items={filteredPayouts}
            deletingId={deletingId}
            onEdit={openEditPayout}
            onDelete={handleDeletePayout}
          />
        </SectionCard>
      ) : null}
    </div>
  );
}

function PaymentList({
  items,
  deletingId,
  onEdit,
  onDelete,
}: {
  items: PaymentListItem[];
  deletingId: string | null;
  onEdit: (item: PaymentListItem) => void;
  onDelete: (item: PaymentListItem) => void;
}) {
  if (items.length === 0) {
    return <EmptyFinanceState title="No hay cobros con estos filtros" />;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
        const overdue = isPaymentOverdue(item.payment);

        return (
          <article
            key={item.payment.id}
            className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-[#071B3A]">
                    {item.payment.concept}
                  </h3>

                  <StatusChip
                    label={overdue ? "Vencido" : getPaymentStatusLabel(item.payment.status)}
                    tone={overdue ? "danger" : getPaymentStatusTone(item.payment.status)}
                  />

                  <StatusChip
                    label={getPaymentMethodLabel(item.payment.method)}
                    tone="primary"
                    dot={false}
                  />
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {item.company?.commercial_name || "Sin empresa"}
                  {item.opportunity ? ` · ${item.opportunity.title}` : ""}
                </p>

                {item.payment.notes ? (
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {item.payment.notes}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                  <span>Cobro: {formatDate(item.payment.payment_date)}</span>
                  {item.payment.due_date ? (
                    <span>Vence: {formatDate(item.payment.due_date)}</span>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-col gap-3 xl:items-end">
                <MoneyValue
                  value={Number(item.payment.amount)}
                  size="lg"
                  tone={
                    item.payment.status === "cobrado" ? "positive" : "warning"
                  }
                />

                <ActionButtons
                  deleting={deletingId === item.payment.id}
                  onEdit={() => onEdit(item)}
                  onDelete={() => onDelete(item)}
                />
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function ExpenseList({
  items,
  deletingId,
  onEdit,
  onDelete,
}: {
  items: ExpenseListItem[];
  deletingId: string | null;
  onEdit: (item: ExpenseListItem) => void;
  onDelete: (item: ExpenseListItem) => void;
}) {
  if (items.length === 0) {
    return <EmptyFinanceState title="No hay gastos con estos filtros" />;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article
          key={item.expense.id}
          className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-[#071B3A]">
                  {item.expense.concept}
                </h3>

                <StatusChip
                  label={getExpenseCategoryLabel(item.expense.category)}
                  tone={getExpenseCategoryTone(item.expense.category)}
                  dot={false}
                />

                <StatusChip
                  label={getExpenseTypeLabel(item.expense.type)}
                  tone="primary"
                  dot={false}
                />

                {item.expense.is_reimbursable ? (
                  <StatusChip label="Reembolsable" tone="warning" dot={false} />
                ) : null}
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {item.company?.commercial_name || "LevData interno"}
                {item.opportunity ? ` · ${item.opportunity.title}` : ""}
              </p>

              {item.expense.notes ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.expense.notes}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <span>Fecha: {formatDate(item.expense.expense_date)}</span>
                {item.expense.next_date ? (
                  <span>Próxima: {formatDate(item.expense.next_date)}</span>
                ) : null}
                {item.expense.periodicity ? (
                  <span>{item.expense.periodicity}</span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <MoneyValue
                value={Number(item.expense.amount)}
                size="lg"
                tone="danger"
              />

              <ActionButtons
                deleting={deletingId === item.expense.id}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function PayoutList({
  items,
  deletingId,
  onEdit,
  onDelete,
}: {
  items: PayoutListItem[];
  deletingId: string | null;
  onEdit: (item: PayoutListItem) => void;
  onDelete: (item: PayoutListItem) => void;
}) {
  if (items.length === 0) {
    return <EmptyFinanceState title="No hay repartos con estos filtros" />;
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <article
          key={item.payout.id}
          className="rounded-3xl border border-[#DCEAF1]/80 bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-[#071B3A]">
                  {item.payout.concept}
                </h3>

                <StatusChip
                  label={getPayoutTypeLabel(item.payout.type)}
                  tone="warning"
                  dot={false}
                />
              </div>

              <p className="mt-1 text-sm text-slate-500">
                {item.user?.full_name || "Usuario actual"}
              </p>

              {item.payout.notes ? (
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {item.payout.notes}
                </p>
              ) : null}

              <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                Fecha: {formatDate(item.payout.payout_date)}
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:items-end">
              <MoneyValue
                value={Number(item.payout.amount)}
                size="lg"
                tone="warning"
              />

              <ActionButtons
                deleting={deletingId === item.payout.id}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function FinanceFormCard({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <SectionCard title={title} description={description}>
      <div className="mb-5 flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="rounded-2xl bg-white"
        >
          <X className="mr-2 size-4" />
          Cerrar formulario
        </Button>
      </div>

      {children}
    </SectionCard>
  );
}

function HeroMoney({
  label,
  value,
  description,
  icon: Icon,
  warning = false,
  danger = false,
}: {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  warning?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
          {label}
        </p>

        <Icon
          className={`size-5 ${
            danger ? "text-red-300" : warning ? "text-[#FF9933]" : "text-[#A1C7E0]"
          }`}
        />
      </div>

      <MoneyValue
        value={value}
        size="lg"
        tone={danger ? "danger" : warning ? "warning" : "default"}
        className={`mt-2 block ${
          danger ? "text-red-300" : warning ? "text-[#FF9933]" : "text-white"
        }`}
      />

      <p className="mt-1 text-xs leading-5 text-white/45">{description}</p>
    </div>
  );
}

function TabButton({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-[#071B3A] text-white"
          : "bg-white text-slate-500 hover:bg-[#F6FAFC]"
      }`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function ActionButtons({
  deleting,
  onEdit,
  onDelete,
}: {
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 xl:justify-end">
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
  );
}

function SubmitRow({
  saving,
  editing,
}: {
  saving: boolean;
  editing: boolean;
}) {
  return (
    <div className="flex justify-end">
      <Button
        type="submit"
        disabled={saving}
        className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]"
      >
        {saving ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : editing ? (
          <Edit3 className="mr-2 size-4" />
        ) : (
          <Plus className="mr-2 size-4" />
        )}

        {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar"}
      </Button>
    </div>
  );
}

function EmptyFinanceState({ title }: { title: string }) {
  return (
    <div className="rounded-3xl bg-[#F6FAFC] p-8 text-center">
      <CheckCircle2 className="mx-auto size-8 text-[#00ABBD]" />
      <p className="mt-3 font-extrabold text-[#071B3A]">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Crea un nuevo registro o cambia la búsqueda.
      </p>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
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
        step={type === "number" ? "0.01" : undefined}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="min-h-28 w-full rounded-2xl border border-[#A1C7E0]/60 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#00ABBD] focus:ring-4 focus:ring-[#00ABBD]/10"
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField<Value extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
}) {
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

function getPaymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    pendiente: "Pendiente",
    cobrado: "Cobrado",
    parcial: "Parcial",
    vencido: "Vencido",
    cancelado: "Cancelado",
  };

  return labels[status];
}

function getPaymentStatusTone(
  status: PaymentStatus,
): "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary" {
  const tones: Record<
    PaymentStatus,
    "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary"
  > = {
    pendiente: "warning",
    cobrado: "success",
    parcial: "primary",
    vencido: "danger",
    cancelado: "neutral",
  };

  return tones[status];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}