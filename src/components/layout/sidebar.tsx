"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { BrandLogo } from "@/components/common/brand-logo";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

const groupLabels = {
  general: "General",
  crm: "CRM",
  operaciones: "Operaciones",
  interno: "Interno",
};

export function Sidebar() {
  const pathname = usePathname();

  const groups = navigationItems.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<string, typeof navigationItems>,
  );

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-72 flex-col overflow-hidden bg-[#071B3A] text-white shadow-2xl shadow-slate-950/20 lg:flex">
      <div className="levdata-gradient h-1.5" />

      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 p-2 ring-1 ring-white/10">
            <BrandLogo variant="symbol" className="size-8" priority />
          </div>

          <div>
            <BrandLogo
              variant="horizontal"
              className="h-8 w-[145px] brightness-0 invert"
              priority
            />
            <p className="mt-1 text-[11px] font-medium text-white/45">
              CRM interno
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-6">
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
              {groupLabels[group as keyof typeof groupLabels]}
            </p>

            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
                      active
                        ? "bg-white text-[#071B3A] shadow-lg shadow-black/10"
                        : "text-white/70 hover:bg-white/10 hover:text-white",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl transition",
                          active
                            ? "bg-[#E8F8FB] text-[#00ABBD]"
                            : "bg-white/5 text-white/65 group-hover:bg-white/10 group-hover:text-white",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>

                      <span className="truncate">{item.title}</span>
                    </span>

                    {active ? (
                      <ChevronRight className="size-4 text-[#00ABBD]" />
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
          <p className="text-sm font-bold">Modo prototipo</p>
          <p className="mt-1 text-xs leading-5 text-white/50">
            Datos mock. Sin backend real todavía.
          </p>
        </div>
      </div>
    </aside>
  );
}