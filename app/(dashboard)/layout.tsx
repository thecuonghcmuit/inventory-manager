import { Suspense } from "react";
import RequireSession from "@/components/auth/RequireSession";
import { AppShell } from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import "./forms.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Sidebar />
      <div className="gg-main">
        <Topbar />
        <main className="gg-content">
          {/* Second auth layer behind proxy.ts: redirects if there is no session. The
              static chrome prerenders. This does not stop the page segment from
              rendering, so each page also calls requireUser() (lib/dal.ts). */}
          <Suspense fallback={null}>
            <RequireSession>{children}</RequireSession>
          </Suspense>
          <Footer />
        </main>
      </div>
    </AppShell>
  );
}
