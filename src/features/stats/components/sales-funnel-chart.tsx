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

import { ClientOnlyChart } from "@/components/common/client-only-chart";
import type { SalesFunnelItem } from "@/features/stats/types";
import { formatCurrency } from "@/lib/formatters";

type SalesFunnelChartProps = {
  data: SalesFunnelItem[];
};

export function SalesFunnelChart({ data }: SalesFunnelChartProps) {
  return (
    <ClientOnlyChart height="h-[300px]">
      <div className="h-[300px] min-h-[300px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 18 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#DCEAF1"
            />

            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#60758F", fontSize: 12 }}
            />

            <YAxis
              type="category"
              dataKey="stage"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#60758F", fontSize: 12 }}
              width={96}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "value") {
                  return [formatCurrency(Number(value)), "Valor"];
                }

                return [String(value), "Cantidad"];
              }}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #DCEAF1",
                boxShadow: "0 18px 45px rgba(7, 27, 58, 0.12)",
              }}
            />

            <Bar
              dataKey="count"
              name="Cantidad"
              fill="#00ABBD"
              radius={[0, 8, 8, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnlyChart>
  );
}