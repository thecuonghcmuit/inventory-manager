"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useSidebar } from "./AppShell";
import { findActiveLink } from "./nav";

export function CollapseButton() {
  const { collapsed, toggle } = useSidebar();
  return (
    <button
      type="button"
      className="gg-icon-btn"
      title="Toggle sidebar"
      aria-label="Toggle sidebar"
      aria-expanded={!collapsed}
      onClick={toggle}
    >
      <Menu />
    </button>
  );
}

/** Breadcrumb label for the current route, taken from the nav. */
export function Breadcrumb() {
  const link = findActiveLink(usePathname());
  if (!link) return null;
  return <span className="gg-breadcrumb">{link.title ?? link.label}</span>;
}
