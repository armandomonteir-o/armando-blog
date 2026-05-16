import type { Metadata } from "next";
import { AeroElements } from "@/components/ui/AeroElements";
import { LoginCard } from "./LoginCard";

export const metadata: Metadata = {
  title: "Login — Armando",
  description: "Acesse sua conta no blog Armando.",
};

export default function LoginPage() {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--arm-bg)", transition: "background-color 0.3s ease" }}
    >
      {/* Pixel grid background — identical to homepage */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--arm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--arm-grid) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Aero floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AeroElements />
      </div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-sm px-4">
        <LoginCard />
      </div>
    </div>
  );
}
