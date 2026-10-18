import { Suspense } from "react";
import Link from "next/link";
import { ChevronDown, Grid2x2, Monitor, Plus } from "lucide-react";
import { requireUser } from "@/lib/dal";
import { Breadcrumb, CollapseButton } from "./TopbarControls";
import UserMenu from "./UserMenu";

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
      {/* The session is request-time data, so the user block streams in. */}
      <Suspense fallback={<UserMenuPlaceholder />}>
        <CurrentUserMenu />
      </Suspense>
    </header>
  );
}

async function CurrentUserMenu() {
  const user = await requireUser();
  return <UserMenu name={user.name ?? ""} email={user.email ?? ""} />;
}

function UserMenuPlaceholder() {
  return (
    <div className="gg-user" aria-hidden="true">
      <div className="gg-avatar"></div>
      <ChevronDown style={{ width: 16, height: 16, color: "var(--gray-400)" }} />
    </div>
  );
}
