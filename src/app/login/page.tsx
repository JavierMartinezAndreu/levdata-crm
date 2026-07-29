import { BrandLogo } from "@/components/common/brand-logo";
import { Card, CardContent } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/components/login-form";

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
              Acceso privado para gestionar empresas, oportunidades, proyectos,
              presupuestos y cobros.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            Acceso protegido con Supabase Auth. Los datos reales se controlarán
            con RLS en la base de datos.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}