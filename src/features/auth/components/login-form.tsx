"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();

  const [email, setEmail] = useState("javier@levdata.es");
  const [password, setPassword] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data } = await supabase.auth.getSession();

      if (!active) return;

      if (data.session) {
        router.replace("/dashboard");
        return;
      }

      setCheckingSession(false);
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [router, supabase]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      toast.error("Introduce tu email.");
      return;
    }

    if (!password.trim()) {
      toast.error("Introduce tu contraseña.");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSubmitting(false);

    if (error) {
      toast.error("No se ha podido iniciar sesión.", {
        description: error.message,
      });
      return;
    }

    toast.success("Sesión iniciada.");
    router.replace("/dashboard");
  }

  if (checkingSession) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-[#00ABBD]" />
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
          Email
        </label>

        <Input
          value={email}
          type="email"
          autoComplete="email"
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
          placeholder="javier@levdata.es"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[#071B3A]">
          Contraseña
        </label>

        <Input
          value={password}
          type="password"
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-2xl border-[#A1C7E0]/60 bg-white"
          placeholder="Tu contraseña"
        />
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-2xl bg-[#00ABBD] text-white shadow-lg shadow-cyan-900/10 hover:bg-[#0099DD]"
      >
        {submitting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <LockKeyhole className="mr-2 size-4" />
        )}

        {submitting ? "Entrando..." : "Entrar al CRM"}

        {!submitting ? <ArrowRight className="ml-2 size-4" /> : null}
      </Button>
    </form>
  );
}