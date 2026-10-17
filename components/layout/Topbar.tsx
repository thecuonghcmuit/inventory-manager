import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, Grid2x2, Monitor, Plus } from "lucide-react";
import { Breadcrumb, CollapseButton } from "./TopbarControls";

export default function Topbar() {
  return (
    <header className="gg-topbar">
      <CollapseButton />
      <div className="gg-topbar-title">
        <span className="gg-page-chip">
          <Plus />
        </span>
        <Suspense fallback={null}>
          <Breadcrumb />
        </Suspense>
      </div>
      <div className="gg-topbar-spacer"></div>
      <Link href="/pos" className="gg-pos-btn">
        <Monitor style={{ width: 16, height: 16 }} /> POS
      </Link>
      <button type="button" className="gg-icon-btn">
        <Grid2x2 />
      </button>
      <div className="gg-user">
        <div className="gg-avatar">A</div>
        <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>admin</span>
        <ChevronDown style={{ width: 16, height: 16, color: "var(--gray-400)" }} />
      </div>
    </header>
  );
}
