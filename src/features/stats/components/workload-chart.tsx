"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ClientOnlyChart } from "@/components/common/client-only-chart";
import type { UserWorkload } from "@/features/stats/types";

type WorkloadChartProps = {
  data: UserWorkload[];
};

export function WorkloadChart({ data }: WorkloadChartProps) {
  return (
    <ClientOnlyChart height="h-[300px]">
      <div className="h-[300px] min-h-[300px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={6}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#DCEAF1"
            />

            <XAxis
              dataKey="userName"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#60758F", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#60758F", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #DCEAF1",
                boxShadow: "0 18px 45px rgba(7, 27, 58, 0.12)",
              }}
            />

            <Legend />

            <Bar
              dataKey="activities"
              name="Actividades"
              fill="#00ABBD"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="projects"
              name="Proyectos"
              fill="#0099DD"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="opportunities"
              name="Oportunidades"
              fill="#FF9933"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnlyChart>
  );
}