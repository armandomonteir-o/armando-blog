import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AeroElements } from "@/components/ui/AeroElements";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = {
  title: "Minha Conta — Armando",
  description: "Configure seu nome de exibição e avatar para comentários.",
};

export default async function MinhaContaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div
      className="flex-1 relative flex items-center justify-center p-6"
      style={{ backgroundColor: "var(--arm-bg)", minHeight: "100vh" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AeroElements />
      </div>
      <div className="relative z-10 w-full">
        <ProfileForm />
      </div>
    </div>
  );
}
