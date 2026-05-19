"use client";

import { useMemo } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Banknote,
  CircleDollarSign,
  Landmark,
  PiggyBank,
  Receipt,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { DateValue } from "@/components/common/date-value";
import { MetricCard } from "@/components/common/metric-card";
import { MoneyValue } from "@/components/common/money-value";
import { SectionCard } from "@/components/common/section-card";
import { StatusChip } from "@/components/common/status-chip";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FinanceExpenseChart } from "@/features/finance/components/finance-expense-chart";
import { FinanceMonthlyChart } from "@/features/finance/components/finance-monthly-chart";
import type { Expense, Payment, Payout } from "@/features/finance/types";
import {
  getExpenseCategoryLabel,
  getExpenseCategoryTone,
  getFinanceStats,
  getFinancialMovements,
  getPaymentMethodLabel,
  getPayoutTypeLabel,
} from "@/features/finance/utils";

type FinanceClientPageProps = {
  payments: Payment[];
  expenses: Expense[];
  payouts: Payout[];
};

export function FinanceClientPage({
  payments,
  expenses,
  payouts,
}: FinanceClientPageProps) {
  const stats = useMemo(
    () => getFinanceStats({ payments, expenses, payouts }),
    [payments, expenses, payouts],
  );

  const movements = useMemo(
    () => getFinancialMovements({ payments, expenses, payouts }),
    [payments, expenses, payouts],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tesorería"
        title="Caja LevData"
        description="Control interno de ingresos, gastos, beneficio, deuda, MRR, ARR y repartos. Este módulo no sustituye contabilidad legal ni facturación oficial."
        actions={
          <>
            <Button className="rounded-2xl bg-[#00ABBD] text-white hover:bg-[#0099DD]">
              <ArrowUpCircle className="mr-2 size-4" />
              Nuevo cobro
            </Button>

            <Button
              variant="outline"
              className="rounded-2xl border-[#A1C7E0]/60 bg-white"
            >
              <ArrowDownCircle className="mr-2 size-4" />
              Nuevo gasto
            </Button>
          </>
        }
      />

      <section className="overflow-hidden rounded-[2rem] bg-[#071B3A] shadow-2xl shadow-slate-900/10">
        <div className="levdata-gradient h-2" />

        <div className="grid gap-8 p-7 text-white lg:grid-cols-[1fr_0.9fr] lg:p-10">
          <div>
            <p className="text-sm font-medium text-[#A1C7E0]">
              Resumen financiero interno
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Controla caja, deuda, gastos y repartos sin mezclar conceptos.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
              Los pagos a socios no se tratan como gastos normales. Los gastos
              de proyecto afectan al beneficio del proyecto y los gastos internos
              afectan al beneficio global de LevData.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <StatusChip label="Control interno" tone="primary" />
              <StatusChip label="No contabilidad legal" tone="warning" />
              <StatusChip label="Preparado para Supabase" tone="info" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <HeroMoney
              label="Dinero disponible estimado"
              value={stats.estimatedAvailableCash}
            />
            <HeroMoney label="Beneficio neto" value={stats.netProfit} />
            <HeroMoney label="Pendiente de cobrar" value={stats.pendingToCollect} />
            <HeroMoney label="Deuda vencida" value={stats.overdueDebt} warning />
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Ingresos cobrados"
          value={<MoneyValue value={stats.paymentsTotal} size="lg" tone="positive" />}
          description="Cobros registrados"
          icon={ArrowUpCircle}
          tone="success"
          variation="+"
          variationDirection="up"
        />

        <MetricCard
          title="Gastos totales"
          value={<MoneyValue value={stats.expensesTotal} size="lg" tone="danger" />}
          description="Internos y asociados a proyecto"
          icon={Receipt}
          tone="danger"
          variation="control"
          variationDirection="flat"
        />

        <MetricCard
          title="Beneficio neto"
          value={<MoneyValue value={stats.netProfit} size="lg" />}
          description="Ingresos menos gastos"
          icon={TrendingUp}
          tone="primary"
          variation="estimado"
          variationDirection="flat"
        />

        <MetricCard
          title="Caja estimada"
          value={<MoneyValue value={stats.estimatedAvailableCash} size="lg" />}
          description="Tras gastos y repartos"
          icon={PiggyBank}
          tone="dark"
          variation="interno"
          variationDirection="flat"
        />

        <MetricCard
          title="Gastos internos"
          value={<MoneyValue value={stats.internalExpenses} size="lg" tone="warning" />}
          description="LevData operativo"
          icon={Landmark}
          tone="warning"
          variation="base"
          variationDirection="flat"
        />

        <MetricCard
          title="Gastos proyectos"
          value={<MoneyValue value={stats.projectExpenses} size="lg" tone="warning" />}
          description="Reducen beneficio por proyecto"
          icon={WalletCards}
          tone="info"
          variation="proyectos"
          variationDirection="flat"
        />

        <MetricCard
          title="MRR"
          value={<MoneyValue value={stats.mrr} size="lg" />}
          description="Mantenimientos aproximados"
          icon={CircleDollarSign}
          tone="success"
          variation="recurrente"
          variationDirection="flat"
        />

        <MetricCard
          title="ARR"
          value={<MoneyValue value={stats.arr} size="lg" />}
          description="Proyección anual"
          icon={Banknote}
          tone="dark"
          variation="anual"
          variationDirection="flat"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Ingresos, gastos y beneficio"
          description="Evolución mensual mock de tesorería."
        >
          <FinanceMonthlyChart payments={payments} expenses={expenses} />
        </SectionCard>

        <SectionCard
          title="Gastos por categoría"
          description="Distribución de gastos internos y de proyecto."
        >
          <FinanceExpenseChart expenses={expenses} />
        </SectionCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <SectionCard
          title="Movimientos financieros"
          description="Cobros, gastos y repartos ordenados por fecha."
        >
          <div className="space-y-3">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex flex-col gap-3 rounded-2xl border border-[#DCEAF1]/70 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-[#071B3A]">
                      {movement.concept}
                    </p>
                    <StatusChip label={movement.type} tone={movement.tone} />
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {movement.related}
                  </p>

                  <DateValue value={movement.date} className="mt-2" />
                </div>

                <MoneyValue
                  value={movement.amount}
                  size="lg"
                  tone={movement.amount >= 0 ? "positive" : "danger"}
                />
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard
            title="Últimos cobros"
            description="Ingresos registrados recientemente."
          >
            <div className="space-y-3">
              {payments.slice(0, 4).map((payment) => (
                <div key={payment.id} className="rounded-2xl bg-[#F6FAFC] p-4">
                  <p className="font-bold text-[#071B3A]">{payment.concepto}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {payment.empresaNombre}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <StatusChip
                      label={getPaymentMethodLabel(payment.metodo)}
                      tone="primary"
                      dot={false}
                    />
                    <MoneyValue value={payment.importe} tone="positive" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Repartos a socios"
            description="Pagos internos separados de gastos operativos."
          >
            <div className="space-y-3">
              {payouts.map((payout) => (
                <div key={payout.id} className="rounded-2xl bg-[#F6FAFC] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#071B3A]">
                        {payout.usuarioNombre}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {payout.concepto}
                      </p>
                    </div>

                    <MoneyValue value={payout.importe} tone="warning" />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusChip
                      label={getPayoutTypeLabel(payout.tipo)}
                      tone="warning"
                      dot={false}
                    />
                    <DateValue value={payout.fecha} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Gastos recientes"
            description="Control de gastos internos y de proyecto."
          >
            <div className="space-y-3">
              {expenses.slice(0, 4).map((expense) => (
                <div key={expense.id} className="rounded-2xl bg-[#F6FAFC] p-4">
                  <p className="font-bold text-[#071B3A]">{expense.concepto}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {expense.proyectoNombre ?? expense.empresaNombre ?? "LevData interno"}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <StatusChip
                      label={getExpenseCategoryLabel(expense.categoria)}
                      tone={getExpenseCategoryTone(expense.categoria)}
                      dot={false}
                    />
                    <MoneyValue value={expense.importe} tone="danger" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </section>
    </div>
  );
}

type HeroMoneyProps = {
  label: string;
  value: number;
  warning?: boolean;
};

function HeroMoney({ label, value, warning = false }: HeroMoneyProps) {
  return (
    <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/45">
        {label}
      </p>
      <MoneyValue
        value={value}
        size="lg"
        tone={warning ? "warning" : "default"}
        className={warning ? "mt-2 block text-[#FF9933]" : "mt-2 block text-white"}
      />
    </div>
  );
}