import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { BrandLogo } from "@/components/common/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <Card className="levdata-card w-full max-w-md overflow-hidden rounded-[2rem]">
        <div className="levdata-gradient h-2" />

        <CardContent className="p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-3xl bg-[#071B3A] p-4 shadow-xl shadow-slate-900/10">
            <BrandLogo variant="symbol" className="size-12" priority />
            </div>

            <div className="mx-auto flex justify-center">
            <BrandLogo
                variant="horizontal"
                className="h-12 w-[210px]"
                priority
            />
            </div>

            <p className="mt-2 text-sm font-bold tracking-wide text-[#071B3A]">
            CRM interno
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Acceso interno para gestionar empresas, proyectos, cobros y
              operaciones.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
                Email
              </label>
              <Input
                defaultValue="javier@levdata.es"
                className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
                Contraseña
              </label>
              <Input
                defaultValue="levdata-demo"
                type="password"
                className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
              />
            </div>

            <Button
              asChild
              className="h-12 w-full rounded-2xl bg-[#00ABBD] text-white shadow-lg shadow-cyan-900/10 hover:bg-[#0099DD]"
            >
              <Link href="/dashboard">
                <LockKeyhole className="mr-2 size-4" />
                Entrar en modo mock
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Este login todavía no autentica usuarios reales. La seguridad real
            llegará en la fase de Supabase Auth + RLS.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}