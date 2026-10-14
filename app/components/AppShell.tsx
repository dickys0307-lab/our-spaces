"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { useSession } from "./session";
import type { View } from "./types";

const VIEW_PATH = {
  home: "/home",
  calender: "/calendar",
  members: "/home",
  "inner-board": "/inner-board",
  dicky: "/dicky",
  aura: "/aura",
  nadia: "/nadia",
} satisfies Record<View, string>;

function viewFromPath(pathname: string): View {
  if (pathname.startsWith("/calendar")) return "calender";
  if (pathname.startsWith("/inner-board")) return "inner-board";
  if (pathname.startsWith("/dicky")) return "dicky";
  if (pathname.startsWith("/aura")) return "aura";
  if (pathname.startsWith("/nadia")) return "nadia";
  return "home";
}

export default function AppShell({ children }: { children: ReactNode }) {
  const { session, ready } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !session) router.replace("/");
  }, [ready, session, router]);

  const authed = ready && session !== null;
  const view = viewFromPath(pathname);

  return (
    <div className="scrapbook-bg animate-fade-up flex min-h-full flex-1 flex-col overflow-x-clip">
      <Navbar
        view={view}
        onNavigate={(next) => router.push(VIEW_PATH[next])}
      />

      <main className="mx-auto w-full max-w-7xl px-3.5 pt-5 sm:px-6 sm:pt-6">
        {children}
      </main>

      {authed ? null : (
        <div className="fixed inset-0 z-50 grid place-items-center bg-canvas text-sm text-muted">
          Loading your space…
        </div>
      )}
    </div>
  );
}
