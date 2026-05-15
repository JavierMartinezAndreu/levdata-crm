"use client";

import { ReactNode, useState } from "react";

import { MobileNav } from "@/components/layout/mobile-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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