import type {
  Expense,
  ExpenseCategory,
  ExpenseType,
  Payment,
  PaymentMethod,
  Payout,
  PayoutType,
} from "@/features/finance/types";

type Tone = "neutral" | "info" | "success" | "warning" | "danger" | "dark" | "primary";

export function getPaymentMethodLabel(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    transferencia: "Transferencia",
    efectivo: "Efectivo",
    bizum: "Bizum",
    stripe: "Stripe",
    redsys: "Redsys",
    otro: "Otro",
  };

  return labels[method];
}

export function getExpenseTypeLabel(type: ExpenseType): string {
  const labels: Record<ExpenseType, string> = {
    puntual: "Puntual",
    recurrente: "Recurrente",
    internoLevData: "Interno LevData",
    asociadoProyecto: "Asociado a proyecto",
    asociadoMantenimiento: "Asociado a mantenimiento",
  };

  return labels[type];
}

export function getExpenseCategoryLabel(category: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    dominio: "Dominio",
    hosting: "Hosting",
    microsoft365: "Microsoft 365",
    sim: "SIM",
    licencia: "Licencia",
    plugin: "Plugin",
    servidor: "Servidor",
    diseno: "Diseño",
    subcontratacion: "Subcontratación",
    herramientaIA: "Herramienta IA",
    publicidad: "Publicidad",
    otro: "Otro",
  };

  return labels[category];
}

export function getPayoutTypeLabel(type: PayoutType): string {
  const labels: Record<PayoutType, string> = {
    repartoBeneficio: "Reparto beneficio",
    sueldo: "Sueldo",
    reembolso: "Reembolso",
    bonus: "Bonus",
    adelanto: "Adelanto",
  };

  return labels[type];
}

export function getExpenseCategoryTone(category: ExpenseCategory): Tone {
  const tones: Record<ExpenseCategory, Tone> = {
    dominio: "info",
    hosting: "info",
    microsoft365: "primary",
    sim: "neutral",
    licencia: "primary",
    plugin: "warning",
    servidor: "dark",
    diseno: "warning",
    subcontratacion: "danger",
    herramientaIA: "primary",
    publicidad: "warning",
    otro: "neutral",
  };

  return tones[category];
}

export function getFinanceStats(params: {
  payments: Payment[];
  expenses: Expense[];
  payouts: Payout[];
}) {
  const paymentsTotal = params.payments.reduce(
    (total, payment) => total + payment.importe,
    0,
  );

  const expensesTotal = params.expenses.reduce(
    (total, expense) => total + expense.importe,
    0,
  );

  const payoutsTotal = params.payouts.reduce(
    (total, payout) => total + payout.importe,
    0,
  );

  const internalExpenses = params.expenses
    .filter((expense) => expense.tipo === "internoLevData")
    .reduce((total, expense) => total + expense.importe, 0);

  const projectExpenses = params.expenses
    .filter((expense) => expense.tipo === "asociadoProyecto")
    .reduce((total, expense) => total + expense.importe, 0);

  const netProfit = paymentsTotal - expensesTotal;
  const estimatedAvailableCash = paymentsTotal - expensesTotal - payoutsTotal;

  const pendingToCollect = 4800;
  const overdueDebt = 1200;
  const mrr = 997;
  const arr = mrr * 12;

  return {
    paymentsTotal,
    expensesTotal,
    internalExpenses,
    projectExpenses,
    netProfit,
    payoutsTotal,
    estimatedAvailableCash,
    pendingToCollect,
    overdueDebt,
    mrr,
    arr,
  };
}

export function getFinanceMonthlyData(payments: Payment[], expenses: Expense[]) {
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"];

  return months.map((monthKey) => {
    const ingresos = payments
      .filter((payment) => payment.fechaCobro.startsWith(monthKey))
      .reduce((total, payment) => total + payment.importe, 0);

    const gastos = expenses
      .filter((expense) => expense.fecha.startsWith(monthKey))
      .reduce((total, expense) => total + expense.importe, 0);

    const monthLabels: Record<string, string> = {
      "2026-01": "Ene",
      "2026-02": "Feb",
      "2026-03": "Mar",
      "2026-04": "Abr",
      "2026-05": "May",
      "2026-06": "Jun",
    };

    return {
      month: monthLabels[monthKey],
      ingresos,
      gastos,
      beneficio: ingresos - gastos,
    };
  });
}

export function getExpenseCategoryData(expenses: Expense[]) {
  const grouped = expenses.reduce(
    (acc, expense) => {
      acc[expense.categoria] = (acc[expense.categoria] ?? 0) + expense.importe;
      return acc;
    },
    {} as Record<ExpenseCategory, number>,
  );

  return Object.entries(grouped).map(([category, value]) => ({
    name: getExpenseCategoryLabel(category as ExpenseCategory),
    value,
  }));
}

export function getFinancialMovements(params: {
  payments: Payment[];
  expenses: Expense[];
  payouts: Payout[];
}) {
  const paymentMovements = params.payments.map((payment) => ({
    id: payment.id,
    type: "Ingreso",
    concept: payment.concepto,
    related: payment.empresaNombre,
    amount: payment.importe,
    date: payment.fechaCobro,
    tone: "success" as Tone,
  }));

  const expenseMovements = params.expenses.map((expense) => ({
    id: expense.id,
    type: "Gasto",
    concept: expense.concepto,
    related: expense.empresaNombre ?? expense.proyectoNombre ?? "LevData interno",
    amount: -expense.importe,
    date: expense.fecha,
    tone: "danger" as Tone,
  }));

  const payoutMovements = params.payouts.map((payout) => ({
    id: payout.id,
    type: "Reparto",
    concept: payout.concepto,
    related: payout.usuarioNombre,
    amount: -payout.importe,
    date: payout.fecha,
    tone: "warning" as Tone,
  }));

  return [...paymentMovements, ...expenseMovements, ...payoutMovements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}