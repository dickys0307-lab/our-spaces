"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type MemberKey = "dicky" | "aura" | "nadia";

export type MemberProfile = {
  member: MemberKey;
  name: string;
  handle: string;
  role: string;
  initial: string;
  face: 0 | 1 | 2;
  gradient: string;
  accent: string;
};

export const MEMBER_PROFILES: Record<MemberKey, MemberProfile> = {
  dicky: {
    member: "dicky",
    name: "Dicky",
    handle: "@dicky",
    role: "Frontend Architect & Zine Editor",
    initial: "D",
    face: 0,
    gradient: "from-peri-300 to-peri-500",
    accent: "bg-peri-400",
  },
  aura: {
    member: "aura",
    name: "Aura",
    handle: "@aura",
    role: "The Botanist & Visual Poet",
    initial: "A",
    face: 1,
    gradient: "from-blush-300 to-blush-500",
    accent: "bg-blush-400",
  },
  nadia: {
    member: "nadia",
    name: "Nadia",
    handle: "@nadia",
    role: "Ceramicist & Systems Thinker",
    initial: "N",
    face: 2,
    gradient: "from-apricot-300 to-apricot-500",
    accent: "bg-apricot-400",
  },
};

export const MEMBER_ORDER: MemberKey[] = ["dicky", "aura", "nadia"];

const STORAGE_KEY = "our-spaces:session";

/* ------------------------------------------------------------------ */
/* Tiny external store around localStorage                             */
/* ------------------------------------------------------------------ */

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function noopSubscribe() {
  return () => {};
}

function getTrue() {
  return true;
}

function getFalse() {
  return false;
}

type SessionContextValue = {
  session: MemberProfile | null;
  ready: boolean;
  signIn: (member: MemberKey) => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    getTrue,
    getFalse,
  );

  const session = useMemo<MemberProfile | null>(() => {
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { member?: MemberKey };
      const member = parsed?.member;
      if (member && MEMBER_PROFILES[member]) return MEMBER_PROFILES[member];
    } catch {
      /* ignore malformed storage */
    }
    return null;
  }, [raw]);

  const signIn = useCallback((member: MemberKey) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(MEMBER_PROFILES[member]),
      );
    } catch {
      /* ignore storage failures */
    }
    emit();
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore storage failures */
    }
    emit();
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, ready: hydrated, signIn, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
