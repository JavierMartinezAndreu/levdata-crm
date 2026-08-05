import { listCompanies } from "@/features/companies/data/companies-service";
import type { CompanyDb } from "@/features/companies/types";
import { listOpportunities } from "@/features/opportunities/data/opportunities-service";
import type { OpportunityListItem } from "@/features/opportunities/types";
import type {
  ExpenseDb,
  ExpenseFormValues,
  ExpenseListItem,
  FinanceData,
  FinanceStats,
  PaymentDb,
  PaymentFormValues,
  PaymentListItem,
  PayoutDb,
  PayoutFormValues,
  PayoutListItem,
} from "@/features/finance/types";
import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];
type PaymentUpdate = Database["public"]["Tables"]["payments"]["Update"];
type ExpenseInsert = Database["public"]["Tables"]["expenses"]["Insert"];
type ExpenseUpdate = Database["public"]["Tables"]["expenses"]["Update"];
type PayoutInsert = Database["public"]["Tables"]["payouts"]["Insert"];
type PayoutUpdate = Database["public"]["Tables"]["payouts"]["Update"];

export async function getFinanceData(): Promise<FinanceData> {
  const supabase = getSupabaseBrowserClient();

  const [
    paymentsResponse,
    expensesResponse,
    payoutsResponse,
    companies,
    opportunities,
    profilesResponse,
  ] = await Promise.all([
    supabase
      .from("payments")
      .select("*")
      .is("deleted_at", null)
      .order("payment_date", { ascending: false }),
    supabase
      .from("expenses")
      .select("*")
      .is("deleted_at", null)
      .order("expense_date", { ascending: false }),
    supabase
      .from("payouts")
      .select("*")
      .is("deleted_at", null)
      .order("payout_date", { ascending: false }),
    listCompanies(),
    listOpportunities(),
    supabase.from("profiles").select("*"),
  ]);

  if (paymentsResponse.error) {
    throw new Error(paymentsResponse.error.message);
  }

  if (expensesResponse.error) {
    throw new Error(expensesResponse.error.message);
  }

  if (payoutsResponse.error) {
    throw new Error(payoutsResponse.error.message);
  }

  if (profilesResponse.error) {
    throw new Error(profilesResponse.error.message);
  }

  const companiesById = new Map<string, CompanyDb>();
  const opportunitiesById = new Map<string, { id: string; title: string }>();
  const profilesById = new Map<string, { id: string; full_name: string; email: string }>();

  for (const company of companies) {
    companiesById.set(company.id, company);
  }

  for (const item of opportunities as OpportunityListItem[]) {
    opportunitiesById.set(item.opportunity.id, {
      id: item.opportunity.id,
      title: item.opportunity.title,
    });
  }

  for (const profile of profilesResponse.data ?? []) {
    profilesById.set(profile.id, {
      id: profile.id,
      full_name: profile.full_name ?? profile.email,
      email: profile.email,
    });
  }

  const payments = ((paymentsResponse.data ?? []) as PaymentDb[]).map<PaymentListItem>(
    (payment) => {
      const company = payment.company_id
        ? companiesById.get(payment.company_id) ?? null
        : null;

      const opportunity = payment.opportunity_id
        ? opportunitiesById.get(payment.opportunity_id) ?? null
        : null;

      return {
        payment,
        company: company
          ? {
              id: company.id,
              commercial_name: company.commercial_name,
            }
          : null,
        opportunity,
      };
    },
  );

  const expenses = ((expensesResponse.data ?? []) as ExpenseDb[]).map<ExpenseListItem>(
    (expense) => {
      const company = expense.company_id
        ? companiesById.get(expense.company_id) ?? null
        : null;

      const opportunity = expense.opportunity_id
        ? opportunitiesById.get(expense.opportunity_id) ?? null
        : null;

      return {
        expense,
        company: company
          ? {
              id: company.id,
              commercial_name: company.commercial_name,
            }
          : null,
        opportunity,
      };
    },
  );

  const payouts = ((payoutsResponse.data ?? []) as PayoutDb[]).map<PayoutListItem>(
    (payout) => ({
      payout,
      user: payout.user_id ? profilesById.get(payout.user_id) ?? null : null,
    }),
  );

  return {
    payments,
    expenses,
    payouts,
  };
}

export function getFinanceStats(data: FinanceData): FinanceStats {
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const collected = data.payments
    .filter((item) => item.payment.status === "cobrado")
    .reduce((total, item) => total + Number(item.payment.amount), 0);

  const pending = data.payments
    .filter(
      (item) =>
        item.payment.status === "pendiente" ||
        item.payment.status === "parcial",
    )
    .reduce((total, item) => total + Number(item.payment.amount), 0);

  const overdue = data.payments
    .filter((item) => isPaymentOverdue(item.payment))
    .reduce((total, item) => total + Number(item.payment.amount), 0);

  const expenses = data.expenses.reduce(
    (total, item) => total + Number(item.expense.amount),
    0,
  );

  const payouts = data.payouts.reduce(
    (total, item) => total + Number(item.payout.amount),
    0,
  );

  const reimbursableExpenses = data.expenses
    .filter((item) => item.expense.is_reimbursable)
    .reduce((total, item) => total + Number(item.expense.amount), 0);

  const monthCollected = data.payments
    .filter(
      (item) =>
        item.payment.status === "cobrado" &&
        item.payment.payment_date.startsWith(currentMonth),
    )
    .reduce((total, item) => total + Number(item.payment.amount), 0);

  const monthExpenses = data.expenses
    .filter((item) => item.expense.expense_date.startsWith(currentMonth))
    .reduce((total, item) => total + Number(item.expense.amount), 0);

  const netProfit = collected - expenses;
  const estimatedCash = collected - expenses - payouts;

  return {
    collected,
    pending,
    overdue,
    expenses,
    payouts,
    netProfit,
    estimatedCash,
    reimbursableExpenses,
    monthCollected,
    monthExpenses,
  };
}

export async function createPayment(values: PaymentFormValues) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const payload: PaymentInsert = {
    registered_by: userId,
    company_id: toNullable(values.company_id),
    opportunity_id: toNullable(values.opportunity_id),
    amount: toNumber(values.amount),
    payment_date: values.payment_date || getTodayDate(),
    due_date: toNullable(values.due_date),
    method: values.method,
    status: values.status,
    concept: values.concept.trim(),
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("payments").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePayment(id: string, values: PaymentFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: PaymentUpdate = {
    company_id: toNullable(values.company_id),
    opportunity_id: toNullable(values.opportunity_id),
    amount: toNumber(values.amount),
    payment_date: values.payment_date || getTodayDate(),
    due_date: toNullable(values.due_date),
    method: values.method,
    status: values.status,
    concept: values.concept.trim(),
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("payments").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createExpense(values: ExpenseFormValues) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const payload: ExpenseInsert = {
    paid_by: userId,
    company_id: toNullable(values.company_id),
    opportunity_id: toNullable(values.opportunity_id),
    amount: toNumber(values.amount),
    expense_date: values.expense_date || getTodayDate(),
    next_date: toNullable(values.next_date),
    type: values.type,
    category: values.category,
    concept: values.concept.trim(),
    periodicity: toNullable(values.periodicity),
    is_reimbursable: values.is_reimbursable,
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("expenses").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updateExpense(id: string, values: ExpenseFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: ExpenseUpdate = {
    company_id: toNullable(values.company_id),
    opportunity_id: toNullable(values.opportunity_id),
    amount: toNumber(values.amount),
    expense_date: values.expense_date || getTodayDate(),
    next_date: toNullable(values.next_date),
    type: values.type,
    category: values.category,
    concept: values.concept.trim(),
    periodicity: toNullable(values.periodicity),
    is_reimbursable: values.is_reimbursable,
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("expenses").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createPayout(values: PayoutFormValues) {
  const supabase = getSupabaseBrowserClient();
  const userId = await getCurrentUserId();

  const payload: PayoutInsert = {
    user_id: userId,
    amount: toNumber(values.amount),
    payout_date: values.payout_date || getTodayDate(),
    concept: values.concept.trim(),
    type: values.type,
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("payouts").insert(payload);

  if (error) {
    throw new Error(error.message);
  }
}

export async function updatePayout(id: string, values: PayoutFormValues) {
  const supabase = getSupabaseBrowserClient();

  const payload: PayoutUpdate = {
    amount: toNumber(values.amount),
    payout_date: values.payout_date || getTodayDate(),
    concept: values.concept.trim(),
    type: values.type,
    notes: toNullable(values.notes),
  };

  const { error } = await supabase.from("payouts").update(payload).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeletePayment(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_payment", {
    payment_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeleteExpense(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_expense", {
    expense_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function softDeletePayout(id: string) {
  const supabase = getSupabaseBrowserClient();

  const { error } = await supabase.rpc("soft_delete_payout", {
    payout_id: id,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export function isPaymentOverdue(payment: PaymentDb) {
  if (payment.status === "cobrado" || payment.status === "cancelado") {
    return false;
  }

  if (!payment.due_date) return false;

  return new Date(payment.due_date).getTime() < startOfToday().getTime();
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

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  return date;
}