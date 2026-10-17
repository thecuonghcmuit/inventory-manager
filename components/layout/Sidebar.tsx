import { Suspense } from "react";
import { Search } from "lucide-react";
import { NavTree, SidebarNav } from "./SidebarNav";

export default function Sidebar() {
  return (
    <aside className="gg-sidebar">
      <div className="gg-brand">
        <div className="gg-brand-mark">G</div>
        <span className="gg-brand-name">GildedGlow</span>
      </div>
      <div className="gg-sidebar-search">
        <div className="gg-input-icon">
          <Search />
          <input className="gg-input" type="text" placeholder="Search" />
        </div>
      </div>
      {/* usePathname suspends on routes with unknown dynamic params under cacheComponents */}
      <Suspense fallback={<NavTree activeHref={null} />}>
        <SidebarNav />
      </Suspense>
    </aside>
  );
}
