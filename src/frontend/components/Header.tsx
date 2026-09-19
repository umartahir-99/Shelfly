"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, LogOut, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeaderProps {
  onOpenAddModal: () => void;
}

export function Header({ onOpenAddModal }: HeaderProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profileLabel, setProfileLabel] = useState("your profile");

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!isMounted || !user) {
        return;
      }

      const metadata = user.user_metadata as { full_name?: string; name?: string } | null;
      setProfileLabel(metadata?.full_name || metadata?.name || user.email || "your profile");
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out:", error.message);
      setIsSigningOut(false);
    }
  };

  return (
    <header className="w-full max-w-[1200px] mx-auto pt-6 pb-4 px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-9 h-9 rounded-full bg-dew-drop border border-charcoal/20 flex items-center justify-center shadow-xs transition-all duration-300 ease-out group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-md">
          <BookOpen className="w-4 h-4 text-charcoal transition-transform duration-300 ease-out group-hover:scale-110" />
        </div>
        <span className="font-serif-literary text-2xl font-bold tracking-tight text-cocoa-ink uppercase transition-all duration-300 ease-out group-hover:tracking-wide">
          shelfly<span className="text-marker-orange">.</span>
        </span>
      </div>
      

      <div className="flex items-center gap-3">
        <div
          className="hidden sm:flex items-center gap-2 rounded-full border border-charcoal/15 bg-white/40 px-3 py-2 text-sm font-sans text-charcoal/70"
          title={profileLabel}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dew-drop text-charcoal">
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="max-w-[150px] truncate">{profileLabel}</span>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 px-3 py-2 text-sm font-sans text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          <span>{isSigningOut ? "signing out..." : "sign out"}</span>
        </button>

        <div className="corner-btn-wrapper">
        <span className="corner-line horizontal top" aria-hidden="true" />
        <span className="corner-line vertical right" aria-hidden="true" />
        <span className="corner-line horizontal bottom" aria-hidden="true" />
        <span className="corner-line vertical left" aria-hidden="true" />
        <span className="corner-dot top left" aria-hidden="true" />
        <span className="corner-dot top right" aria-hidden="true" />
        <span className="corner-dot bottom right" aria-hidden="true" />
        <span className="corner-dot bottom left" aria-hidden="true" />
        <button type="button" onClick={onOpenAddModal} className="corner-btn" id="add-book-header-btn">
          <span>add book</span>
          <svg className="corner-btn-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M17.7 11.4 15.8 17.1 3.7 21l3.8-12.2 5.4-2.3 4.8 4.9Z" />
            <path d="m3.3 20.6 6.4-6.4M17.8 11.1l2.8-2.8a2 2 0 0 0 0-2.9l-2.1-2.1a2 2 0 0 0-2.8 0l-2.8 2.8" />
          </svg>
        </button>
        <style>{`
          .corner-btn-wrapper{position:relative;display:inline-flex;align-items:center;padding:.7rem .9rem;--accent:#e5ff00;--line:#999;--dot:6px}
          .corner-btn{display:inline-flex;align-items:center;gap:.4rem;padding:.6rem 1rem;border:0;background:var(--accent);color:#0008;font:600 .9rem Inter,sans-serif;text-transform:capitalize;border-radius:30%/200%;cursor:pointer;box-shadow:0 0 0 1px #0003,0 8px 7px #0307120f,0 20px 16px #0307121a;transition:background .45s ease,transform .45s cubic-bezier(.22,1,.36,1),border-radius .45s ease,box-shadow .45s ease}
          .corner-btn:hover{background:#fff;transform:translateY(-2px) scale(1.03);border-radius:10%/200%;box-shadow:0 0 0 1px #0003,0 12px 9px #03071214,0 26px 20px #03071224}.corner-btn:active{transform:translateY(0) scale(.98);transition-duration:.15s}
          .corner-btn-svg{width:20px;height:20px;stroke-width:1;stroke-linecap:round;stroke-linejoin:round;fill:#fffa;transition:transform .45s cubic-bezier(.22,1,.36,1)}.corner-btn:hover .corner-btn-svg{transform:rotate(-12deg) translate(2px,-2px)}
          .corner-line{position:absolute;opacity:0;background:var(--line)}.corner-line.horizontal{height:1px;width:100%}.corner-line.vertical{width:1px;height:100%}
          .corner-line.top{top:0;left:0}.corner-line.bottom{bottom:0;right:0}.corner-line.left{left:0;bottom:0}.corner-line.right{right:0;top:0}
          .corner-dot{position:absolute;width:var(--dot);height:var(--dot);border-radius:50%;background:#666;opacity:0}.corner-dot.top.left{top:0;left:0}.corner-dot.top.right{top:0;right:0}.corner-dot.bottom.left{bottom:0;left:0}.corner-dot.bottom.right{bottom:0;right:0}
          .corner-btn-wrapper:hover .corner-line,.corner-btn-wrapper:hover .corner-dot{opacity:1;transition:opacity .3s ease}.corner-line,.corner-dot{transition:opacity .3s ease}
        `}</style>
        </div>
      </div>
    </header>
  );
}

export default Header;
