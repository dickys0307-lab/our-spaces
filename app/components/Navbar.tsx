"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { View, MemberName } from "./types";
import { useSession } from "./session";
import {
  BoardIcon,
  CalendarIcon,
  ChevronDownIcon,
  HomeIcon,
  UsersIcon,
} from "./icons";

const MEMBERS: { name: MemberName; handle: string; tone: string }[] = [
  { name: "Dicky", handle: "@dicky", tone: "from-peri-300 to-peri-500" },
  { name: "Aura", handle: "@aura", tone: "from-blush-300 to-blush-500" },
  { name: "Nadia", handle: "@nadia", tone: "from-apricot-300 to-apricot-500" },
];

const NAV: { label: string; view: View; icon: React.ReactNode }[] = [
  { label: "Home", view: "home", icon: <HomeIcon className="size-[18px]" /> },
  {
    label: "Calendar",
    view: "calender",
    icon: <CalendarIcon className="size-[18px]" />,
  },
  { label: "Members", view: "members", icon: <UsersIcon className="size-[18px]" /> },
  {
    label: "Inner Board",
    view: "inner-board",
    icon: <BoardIcon className="size-[18px]" />,
  },
];

function LogoMark() {
  return (
    <span className="relative grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-butter-200 via-sage-200 to-peri-200 ring-1 ring-black/5">
      <span className="flex -space-x-2">
        <span className="size-4 rounded-full bg-white/90 ring-2 ring-white" />
        <span className="size-4 rounded-full bg-ink/80 ring-2 ring-white" />
      </span>
    </span>
  );
}

export default function Navbar({
  view,
  onNavigate,
}: {
  view: View;
  onNavigate: (view: View) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLLIElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { session, signOut } = useSession();
  const router = useRouter();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function switchProfile() {
    setProfileOpen(false);
    signOut();
    router.push("/");
  }

  const isMemberView =
    view === "dicky" || view === "aura" || view === "nadia";

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-canvas/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5 sm:gap-x-4 sm:px-6 sm:py-3">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 sm:gap-3"
        >
          <LogoMark />
          <span className="text-[15px] font-semibold tracking-tight sm:text-[17px]">
            Our Spaces
          </span>
        </button>

        <ul className="order-3 grid w-full grid-cols-4 gap-1 sm:order-none sm:mx-auto sm:flex sm:w-auto sm:items-center">
          {NAV.map((item) => {
            const active =
              item.view === "members" ? isMemberView : view === item.view;

            if (item.view === "members") {
              return (
                <li key={item.label} className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-2 text-[10px] font-medium leading-tight transition sm:flex-none sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2 sm:text-sm ${
                      active
                        ? "bg-white text-ink shadow-soft ring-1 ring-black/5"
                        : "text-muted hover:bg-white/70 hover:text-ink"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                    <ChevronDownIcon
                      className={`hidden size-4 transition-transform sm:block ${
                        menuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute left-1/2 top-full z-50 mt-2 w-52 max-w-[calc(100vw-1.5rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-soft">
                      {MEMBERS.map((member) => (
                        <button
                          key={member.name}
                          type="button"
                          onClick={() => {
                            onNavigate(member.name.toLowerCase() as View);
                            setMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition hover:bg-canvas"
                        >
                          <span
                            className={`grid size-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br ring-2 ring-white ${member.tone}`}
                          >
                            <img
                              src={`/avatar/${member.name.toLowerCase()}.png`}
                              alt={`${member.name}'s avatar`}
                              className="size-full object-cover object-center"
                            />
                          </span>
                          <span className="leading-tight">
                            <span className="block text-sm font-medium">
                              {member.name}
                            </span>
                            <span className="block text-xs text-muted">
                              {member.handle}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.view)}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl px-1.5 py-2 text-[10px] font-medium leading-tight transition sm:flex-none sm:flex-row sm:gap-1.5 sm:rounded-full sm:px-3.5 sm:py-2 sm:text-sm ${
                    active
                      ? "bg-white text-ink shadow-soft ring-1 ring-black/5"
                      : "text-muted hover:bg-white/70 hover:text-ink"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2.5 sm:ml-0">
          <div ref={profileRef} className="relative">
            <button
              type="button"
              aria-label="Profile"
              onClick={() => setProfileOpen((open) => !open)}
              className={`relative grid size-9 place-items-center overflow-hidden rounded-full bg-gradient-to-br ring-2 ring-white transition ${
                session?.gradient ?? "from-peri-200 to-peri-400"
              }`}
            >
              {session?.member ? (
                <img
                  src={`/avatar/${session.member}.png`}
                  alt={`${session.name}'s avatar`}
                  className="size-full object-cover object-center"
                />
              ) : (
                <span className="text-sm font-semibold text-white">
                  {session?.initial ?? "?"}
                </span>
              )}
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-56 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-soft">
                <div className="flex items-center gap-3 rounded-xl px-2.5 py-2">
                  <span
                    className={`relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-to-br ring-2 ring-white ${
                      session?.gradient ?? "from-peri-200 to-peri-400"
                    }`}
                  >
                    {session?.member ? (
                      <img
                        src={`/avatar/${session.member}.png`}
                        alt={`${session.name}'s avatar`}
                        className="size-full object-cover object-center"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-white">
                        {session?.initial ?? "?"}
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-medium">
                      {session?.name ?? "Guest"}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {session?.role ?? "Not signed in"}
                    </span>
                  </span>
                </div>
                <div className="my-1 h-px bg-black/5" />
                <button
                  type="button"
                  onClick={switchProfile}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm font-medium text-ink/75 transition hover:bg-canvas"
                >
                  <UsersIcon className="size-4" />
                  Switch Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
