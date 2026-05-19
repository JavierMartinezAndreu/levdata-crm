"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlyPerformance } from "@/features/stats/types";
import { formatCurrency } from "@/lib/formatters";

type StatsMonthlyChartProps = {
  data: MonthlyPerformance[];
};

export function StatsMonthlyChart({ data }: StatsMonthlyChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={6}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCEAF1" />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#60758F", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#60758F", fontSize: 12 }}
            tickFormatter={(value) => `${Number(value) / 1000}k`}
          />

          <Tooltip
            cursor={{ fill: "rgba(161, 199, 224, 0.15)" }}
            formatter={(value, name) => {
              if (name === "oportunidades" || name === "ganadas") {
                return [String(value), name];
              }

              return [formatCurrency(Number(value)), name];
            }}
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #DCEAF1",
              boxShadow: "0 18px 45px rgba(7, 27, 58, 0.12)",
            }}
          />

          <Bar
            dataKey="ingresos"
            name="Ingresos"
            fill="#00ABBD"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="gastos"
            name="Gastos"
            fill="#FF9933"
            radius={[8, 8, 0, 0]}
          />

          <Bar
            dataKey="beneficio"
            name="Beneficio"
            fill="#0099DD"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}