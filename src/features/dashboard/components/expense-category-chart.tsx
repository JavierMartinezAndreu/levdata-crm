"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { expenseCategoryData } from "@/lib/mock-db";
import { formatCurrency } from "@/lib/formatters";

const COLORS = ["#00ABBD", "#0099DD", "#FF9933", "#A1C7E0", "#071B3A"];

export function ExpenseCategoryChart() {
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr] lg:items-center">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseCategoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={92}
              paddingAngle={4}
            >
              {expenseCategoryData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  stroke="transparent"
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #DCEAF1",
                boxShadow: "0 18px 45px rgba(7, 27, 58, 0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {expenseCategoryData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-4 rounded-2xl bg-[#F6FAFC] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-semibold text-[#071B3A]">
                {item.name}
              </span>
            </div>

            <span className="text-sm font-extrabold text-[#071B3A]">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}