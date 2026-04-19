"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div
      className="flex h-screen w-full overflow-hidden"
      style={{
        backgroundColor: "var(--arm-bg)",
        fontFamily: "'Space Grotesk', sans-serif",
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={!isHomePage}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        onNotifyClick={() => setNotifyOpen(true)}
      />

      <div id="main-content-area" className="flex-1 flex flex-col min-w-0 min-h-0">
        <Header onMobileMenuToggle={() => setMobileOpen((v) => !v)} />
        <div id="main-scroll-container" ref={scrollRef} className="flex-1 overflow-auto min-h-0">
          {children}
          <Footer />
        </div>
      </div>

      {/* NewsletterModal added in issue #7 */}
      {notifyOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center lg:hidden"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setNotifyOpen(false)}
        >
          <div
            className="px-6 py-4"
            style={{
              backgroundColor: "#0347c1",
              border: "3px solid #022a6e",
              boxShadow: "4px 4px 0 #022a6e",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              style={{ fontFamily: "'Space Mono', monospace", fontSize: "12px", color: "#c8e0ff" }}
            >
              NEWSLETTER.EXE — em breve
            </p>
          </div>
        </div>
      )}

      <ScrollToTop />
    </div>
  );
}
