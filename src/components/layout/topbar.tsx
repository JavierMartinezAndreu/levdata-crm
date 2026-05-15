"use client";

import { useState } from "react";
import { Bell, ChevronDown, Command, Menu, Plus, Search } from "lucide-react";

import { BrandLogo } from "@/components/common/brand-logo";
import { currentUser } from "@/features/users/data/mock-current-user";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TopbarProps = {
  onOpenMobileMenu: () => void;
};

const mockResults = [
  {
    type: "Empresa",
    title: "Restaurante Costa Azul",
    detail: "Cliente activo · CRM operativo",
  },
  {
    type: "Oportunidad",
    title: "Dashboard de ventas",
    detail: "Inmobiliaria Levante · 4.800 €",
  },
  {
    type: "Proyecto",
    title: "Automatización administrativa",
    detail: "Clínica Mediterránea · En desarrollo",
  },
];

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const [search, setSearch] = useState("");

  const showResults = search.trim().length > 1;

  return (
    <header className="sticky top-0 z-30 border-b border-[#DCEAF1]/70 bg-[#F6FAFC]/82 backdrop-blur-2xl">
      <div className="flex h-20 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onOpenMobileMenu}
          className="rounded-2xl border-[#A1C7E0]/50 bg-white lg:hidden"
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex items-center gap-3 lg:hidden">
          <BrandLogo variant="symbol" className="size-10" />
          <div className="hidden sm:block">
            <p className="text-sm font-extrabold text-[#071B3A]">LevData CRM</p>
            <p className="text-xs text-slate-500">Sistema interno</p>
          </div>
        </div>

        <div className="relative ml-auto hidden w-full max-w-xl md:block lg:ml-0">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar empresas, contactos, proyectos..."
            className="h-12 rounded-2xl border-[#A1C7E0]/45 bg-white/85 pl-11 pr-24 shadow-sm"
          />

          <div className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-xl border border-[#DCEAF1] bg-[#F6FAFC] px-2 py-1 text-xs font-semibold text-slate-400 xl:flex">
            <Command className="size-3" /> K
          </div>

          {showResults ? (
            <div className="absolute left-0 right-0 top-14 overflow-hidden rounded-3xl border border-[#DCEAF1] bg-white shadow-2xl shadow-slate-900/10">
              <div className="levdata-gradient h-1" />

              <div className="p-2">
                {mockResults.map((result) => (
                  <button
                    key={`${result.type}-${result.title}`}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-2xl p-3 text-left transition hover:bg-[#F6FAFC]"
                    onClick={() => setSearch("")}
                  >
                    <span className="mt-1 rounded-full bg-[#E8F8FB] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#00ABBD]">
                      {result.type}
                    </span>

                    <span>
                      <span className="block text-sm font-bold text-[#071B3A]">
                        {result.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {result.detail}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            className="hidden rounded-2xl bg-[#00ABBD] text-white shadow-lg shadow-cyan-900/10 hover:bg-[#0099DD] sm:inline-flex"
          >
            <Plus className="mr-2 size-4" />
            Acción rápida
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-2xl border-[#A1C7E0]/50 bg-white"
          >
            <Bell className="size-5 text-[#071B3A]" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-[#A1C7E0]/45 bg-white px-2 py-2 shadow-sm transition hover:bg-[#F6FAFC]",
                )}
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-[#071B3A] text-xs font-extrabold text-white">
                  {currentUser.initials}
                </span>

                <span className="hidden text-left xl:block">
                  <span className="block text-sm font-bold leading-none text-[#071B3A]">
                    {currentUser.name}
                  </span>
                  <span className="mt-1 block text-xs leading-none text-slate-500">
                    {currentUser.role}
                  </span>
                </span>

                <ChevronDown className="hidden size-4 text-slate-400 sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64 rounded-2xl">
              <DropdownMenuLabel>
                <span className="block text-sm">{currentUser.fullName}</span>
                <span className="block text-xs font-normal text-slate-500">
                  {currentUser.email}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil mock</DropdownMenuItem>
              <DropdownMenuItem>Preferencias</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Cerrar sesión mock
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}