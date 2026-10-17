"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { useSidebar } from "./AppShell";
import { NAV, findActiveLink, isGroup, type NavGroup, type NavLink } from "./nav";

/** Nav with the current route highlighted and its group expanded. */
export function SidebarNav() {
  const pathname = usePathname();
  return <NavTree activeHref={findActiveLink(pathname)?.href ?? null} />;
}

/**
 * Renders the nav tree. Used directly (with no active item) as the Suspense
 * fallback while the pathname is unknown during prerendering.
 */
export function NavTree({ activeHref }: { activeHref: string | null }) {
  const { collapsed } = useSidebar();
  // Groups the user has explicitly toggled. Untouched groups follow the route:
  // open if they contain the active link.
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  return (
    <nav className="gg-nav">
      {NAV.map((entry) => {
        if (!isGroup(entry)) {
          return (
            <NavItem key={entry.href} link={entry} active={entry.href === activeHref} collapsed={collapsed} />
          );
        }
        const containsActive = entry.children.some((c) => c.href === activeHref);
        const open = toggled[entry.label] ?? containsActive;
        return (
          <NavGroupItem
            key={entry.label}
            group={entry}
            open={open}
            activeHref={activeHref}
            collapsed={collapsed}
            onToggle={() => setToggled((t) => ({ ...t, [entry.label]: !open }))}
          />
        );
      })}
    </nav>
  );
}

function NavGroupItem({
  group,
  open,
  activeHref,
  collapsed,
  onToggle,
}: {
  group: NavGroup;
  open: boolean;
  activeHref: string | null;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const Icon = group.icon;
  return (
    <div className={open ? "gg-nav-group is-open" : "gg-nav-group"}>
      <div
        className="gg-nav-item"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        title={collapsed ? group.label : undefined}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <Icon className="gg-nav-ico" />
        <span className="gg-nav-label">{group.label}</span>
        <ChevronRight className="gg-nav-chev" />
      </div>
      <div className="gg-nav-sub">
        {group.children.map((link) => (
          <NavItem key={link.href} link={link} active={link.href === activeHref} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

function NavItem({ link, active, collapsed }: { link: NavLink; active: boolean; collapsed: boolean }) {
  const Icon = link.icon;
  return (
    <Link
      href={link.href}
      className={active ? "gg-nav-item is-active" : "gg-nav-item"}
      aria-current={active ? "page" : undefined}
      title={collapsed ? link.label : undefined}
    >
      {Icon && <Icon className="gg-nav-ico" />}
      <span className="gg-nav-label">{link.label}</span>
    </Link>
  );
}
