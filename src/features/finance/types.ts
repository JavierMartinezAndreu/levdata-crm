export type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "bizum"
  | "stripe"
  | "redsys"
  | "otro";

export type ExpenseType =
  | "puntual"
  | "recurrente"
  | "internoLevData"
  | "asociadoProyecto"
  | "asociadoMantenimiento";

export type ExpenseCategory =
  | "dominio"
  | "hosting"
  | "microsoft365"
  | "sim"
  | "licencia"
  | "plugin"
  | "servidor"
  | "diseno"
  | "subcontratacion"
  | "herramientaIA"
  | "publicidad"
  | "otro";

export type PayoutType =
  | "repartoBeneficio"
  | "sueldo"
  | "reembolso"
  | "bonus"
  | "adelanto";

export type Payment = {
  id: string;
  empresaId: string;
  empresaNombre: string;
  proyectoId: string | null;
  proyectoNombre: string | null;
  sprintId: string | null;
  mantenimientoVencimientoId: string | null;
  importe: number;
  fechaCobro: string;
  metodo: PaymentMethod;
  concepto: string;
  registradoPorId: string;
  registradoPorNombre: string;
  notas: string;
  justificanteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  empresaId: string | null;
  empresaNombre: string | null;
  proyectoId: string | null;
  proyectoNombre: string | null;
  mantenimientoId: string | null;
  tipo: ExpenseType;
  categoria: ExpenseCategory;
  concepto: string;
  importe: number;
  fecha: string;
  periodicidad: string | null;
  proximaFecha: string | null;
  pagadoPorUsuarioId: string;
  pagadoPorNombre: string;
  esReembolsable: boolean;
  notas: string;
  justificanteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Payout = {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  importe: number;
  fecha: string;
  concepto: string;
  proyectoId: string | null;
  proyectoNombre: string | null;
  tipo: PayoutType;
  notas: string;
  createdAt: string;
};

export type PaymentStatus =
  | "pendiente"
  | "cobrado"
  | "parcial"
  | "vencido"
  | "cancelado";

export type PaymentDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string | null;
  opportunity_id: string | null;
  project_id: string | null;
  quote_id: string | null;
  registered_by: string | null;
  amount: number;
  payment_date: string;
  due_date: string | null;
  method: PaymentMethod;
  status: PaymentStatus;
  concept: string;
  notes: string | null;
  receipt_url: string | null;
};

export type ExpenseDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  company_id: string | null;
  opportunity_id: string | null;
  project_id: string | null;
  paid_by: string | null;
  amount: number;
  expense_date: string;
  next_date: string | null;
  type: ExpenseType;
  category: ExpenseCategory;
  concept: string;
  periodicity: string | null;
  is_reimbursable: boolean;
  notes: string | null;
  receipt_url: string | null;
};

export type PayoutDb = {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string | null;
  project_id: string | null;
  amount: number;
  payout_date: string;
  concept: string;
  type: PayoutType;
  notes: string | null;
};

export type PaymentFormValues = {
  company_id: string;
  opportunity_id: string;
  amount: string;
  payment_date: string;
  due_date: string;
  method: PaymentMethod;
  status: PaymentStatus;
  concept: string;
  notes: string;
};

export type ExpenseFormValues = {
  company_id: string;
  opportunity_id: string;
  amount: string;
  expense_date: string;
  next_date: string;
  type: ExpenseType;
  category: ExpenseCategory;
  concept: string;
  periodicity: string;
  is_reimbursable: boolean;
  notes: string;
};

export type PayoutFormValues = {
  amount: string;
  payout_date: string;
  concept: string;
  type: PayoutType;
  notes: string;
};

export type PaymentListItem = {
  payment: PaymentDb;
  company: {
    id: string;
    commercial_name: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
  } | null;
};

export type ExpenseListItem = {
  expense: ExpenseDb;
  company: {
    id: string;
    commercial_name: string;
  } | null;
  opportunity: {
    id: string;
    title: string;
  } | null;
};

export type PayoutListItem = {
  payout: PayoutDb;
  user: {
    id: string;
    full_name: string;
    email: string;
  } | null;
};

export type FinanceData = {
  payments: PaymentListItem[];
  expenses: ExpenseListItem[];
  payouts: PayoutListItem[];
};

export type FinanceStats = {
  collected: number;
  pending: number;
  overdue: number;
  expenses: number;
  payouts: number;
  netProfit: number;
  estimatedCash: number;
  reimbursableExpenses: number;
  monthCollected: number;
  monthExpenses: number;
};