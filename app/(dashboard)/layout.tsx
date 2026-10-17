import { AppShell } from "@/components/layout/AppShell";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <Sidebar />
      <div className="gg-main">
        <Topbar />
        <main className="gg-content">
          {children}
          <Footer />
        </main>
      </div>
    </AppShell>
  );
}
