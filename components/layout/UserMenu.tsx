"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, KeyRound, LogOut, UserRound } from "lucide-react";
import "./UserMenu.css";

export default function UserMenu({ name, email, image }: { name: string; email: string; image: string | null }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);
  const initial = (name.trim() || email).charAt(0).toUpperCase();

  return (
    <div className="user-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="gg-user"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="gg-avatar" style={image ? { overflow: "hidden" } : undefined}>
          {image ? (
            // Plain <img>: avatars are uploaded files or external URLs, not build-time assets.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initial
          )}
        </div>
        <span style={{ fontWeight: 600, color: "var(--ink)", fontSize: 14 }}>{name || email}</span>
        <ChevronDown style={{ width: 16, height: 16, color: "var(--gray-400)" }} />
      </button>
      {open && (
        <div className="gg-menu" id={menuId}>
          <Link href="/profile" className="gg-menu-item" onClick={close}>
            <UserRound /> Profile
          </Link>
          <Link href="/change-password" className="gg-menu-item" onClick={close}>
            <KeyRound /> Change Password
          </Link>
          <button
            type="button"
            className="gg-menu-item"
            onClick={() => {
              close();
              signOut({ redirectTo: "/" });
            }}
          >
            <LogOut /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
