"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon, CheckIcon } from "./icons";
import {
  MEMBER_ORDER,
  MEMBER_PROFILES,
  useSession,
  type MemberKey,
} from "./session";

function LogoMark() {
  return (
    <span className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-butter-200 via-sage-200 to-peri-200 ring-1 ring-black/5">
      <span className="flex -space-x-2">
        <span className="size-[18px] rounded-full bg-white/90 ring-2 ring-white" />
        <span className="size-[18px] rounded-full bg-ink/80 ring-2 ring-white" />
      </span>
    </span>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { session, ready, signIn, signOut } = useSession();

  function enter(member: MemberKey) {
    signIn(member);
    router.push("/home");
  }

  return (
    <main className="scrapbook-bg flex min-h-screen flex-col items-center justify-center overflow-x-clip px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-10">
      <div className="animate-fade-up flex w-full max-w-5xl flex-col items-center">
        <LogoMark />

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/45 sm:mt-5 sm:text-[11px]">
          Our Spaces · Private Archive
        </p>
        <h1 className="mt-2 text-center text-3xl font-semibold tracking-tight sm:mt-3 sm:text-4xl lg:text-5xl">
          Welcome to Our Spaces
        </h1>
        <p className="mt-2 max-w-xl text-center text-xs leading-relaxed text-ink/65 sm:mt-3 sm:text-sm lg:text-base">
          Select your identity to enter the shared scrapbook archive of Dicky,
          Aura, and Nadia — a private home for unfiltered memories, road trips,
          hangout plans, and midnight inside jokes.
        </p>

        {ready && session && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-full border border-black/5 bg-white/80 px-3 py-1.5 shadow-soft backdrop-blur sm:mt-6 sm:gap-3 sm:px-4 sm:py-2">
            <span className="flex items-center gap-2 text-[10px] font-medium text-ink/70 sm:text-xs">
              <span className="grid size-5 place-items-center rounded-full bg-canvas text-[10px] font-semibold sm:size-6 sm:text-[11px]">
                {session.initial}
              </span>
              Signed in as {session.name}
            </span>
            <button
              type="button"
              onClick={() => router.push("/home")}
              className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-ink/85 sm:px-3.5 sm:py-1.5 sm:text-xs"
            >
              Continue
            </button>
            <button
              type="button"
              onClick={signOut}
              className="text-[10px] font-medium text-muted transition hover:text-ink sm:text-xs"
            >
              Switch profile
            </button>
          </div>
        )}

        <div className="mt-6 grid w-full gap-4 sm:mt-10 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MEMBER_ORDER.map((key) => {
            const member = MEMBER_PROFILES[key];
            return (
              <div
                key={member.member}
                role="button"
                tabIndex={0}
                onClick={() => enter(member.member)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    enter(member.member);
                  }
                }}
                className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-black/5 bg-white text-left shadow-soft transition duration-300 hover:-translate-y-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
              >
                <div
                  className={`relative h-20 bg-gradient-to-br sm:h-24 lg:h-28 ${member.gradient}`}
                >
                  <div className="absolute -left-6 -top-6 size-20 rounded-full bg-white/20 blur-xl sm:size-24" />
                  <div className="absolute -right-4 bottom-0 size-16 rounded-full bg-white/20 blur-xl sm:size-20" />
                </div>

                <div className="relative -mt-10 flex flex-col items-center px-4 pb-4 text-center sm:-mt-12 sm:px-5 sm:pb-6">
                  <span className="grid size-20 place-items-center overflow-hidden rounded-full bg-white ring-4 ring-white sm:size-24">
                    <img
                      src={`/avatar/${member.member}.png`}
                      alt={`${member.name}'s avatar`}
                      className="h-full w-full object-cover object-center"
                    />
                  </span>

                  <h2 className="mt-2 text-base font-semibold tracking-tight sm:mt-3 sm:text-lg">
                    {member.name}
                  </h2>
                  <p className="text-[10px] text-muted sm:text-xs">{member.handle}</p>
                  <p className="mt-1 text-xs text-ink/65 sm:mt-1.5 sm:text-sm">{member.role}</p>

                  <span
                    className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-br px-3 py-2 text-xs font-semibold text-white shadow-soft transition-all duration-300 group-hover:gap-3 sm:mt-5 sm:px-4 sm:py-2.5 sm:text-sm ${member.gradient}`}
                  >
                    Login as {member.name}
                    <ArrowLeftIcon className="size-3.5 rotate-180 sm:size-4" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center gap-2 text-[10px] text-muted sm:mt-10 sm:text-xs">
          <CheckIcon className="size-3 sm:size-3.5" />
          Your session auto-syncs member colors across the Calendar and Inner
          Board.
        </div>
      </div>
    </main>
  );
}
