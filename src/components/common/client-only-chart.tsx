"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type ClientOnlyChartProps = {
  children: ReactNode;
  height?: string;
};

export function ClientOnlyChart({
  children,
  height = "h-[300px]",
}: ClientOnlyChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`${height} w-full animate-pulse rounded-2xl bg-[#F6FAFC]`}
      />
    );
  }

  return <>{children}</>;
}