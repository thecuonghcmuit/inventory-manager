"use client";

import { createContext, useContext, useState } from "react";

type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarState | null>(null);

export function useSidebar(): SidebarState {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside <AppShell>");
  return ctx;
}

/**
 * The `.gg-app` grid wrapper. Owns the sidebar collapse state, since the
 * `is-collapsed` class lives here but the toggle button lives in the topbar.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((c) => !c);

  return (
    <SidebarContext value={{ collapsed, toggle }}>
      <div className={collapsed ? "gg-app is-collapsed" : "gg-app"}>{children}</div>
    </SidebarContext>
  );
}
