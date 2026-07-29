"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [checkingSession, setCheckingSession] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (!data.session) {
        router.replace("/login");
        return;
      }

      setCheckingSession(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.replace("/login");
        return;
      }

      setCheckingSession(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6FAFC] px-6">
        <div className="levdata-card flex w-full max-w-sm flex-col items-center rounded-[2rem] p-8 text-center">
          <Loader2 className="size-8 animate-spin text-[#00ABBD]" />

          <p className="mt-4 text-sm font-bold text-[#071B3A]">
            Comprobando sesión
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Validando acceso al CRM interno de LevData.
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFC]">
      <Sidebar />

      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <div className="lg:pl-72">
        <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

        <main className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}