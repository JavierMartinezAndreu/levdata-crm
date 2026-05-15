"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/common/brand-logo";
import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const groupLabels = {
  general: "General",
  crm: "CRM",
  operaciones: "Operaciones",
  interno: "Interno",
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-sm overflow-y-auto border-r-0 bg-[#071B3A] p-0 text-white"
      >
        <div className="levdata-gradient h-1.5" />

        <SheetHeader className="border-b border-white/10 px-5 py-5 text-left">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 p-2">
              <BrandLogo variant="symbol" className="size-8" />
            </div>

            <div>
              <BrandLogo
                variant="horizontal"
                className="h-8 w-[145px] brightness-0 invert"
              />
              <p className="mt-1 text-xs font-medium text-white/45">
                CRM interno
              </p>
            </div>
          </SheetTitle>
        </SheetHeader>

        <nav className="space-y-7 px-4 py-6">
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
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => onOpenChange(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                        active
                          ? "bg-white text-[#071B3A]"
                          : "text-white/70 hover:bg-white/10 hover:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl",
                          active
                            ? "bg-[#E8F8FB] text-[#00ABBD]"
                            : "bg-white/5 text-white/65",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>

                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}