"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { MEMBER_ORDER, type MemberKey } from "./session";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type Hangout = {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  member: MemberKey;
  createdAt: number;
};

export type BucketProgress = { value: number; total: number };

export type BucketItem = {
  id: string;
  label: string;
  note: string;
  status: "done" | "progress" | "idea";
  done: boolean;
  progress?: BucketProgress;
  createdAt: number;
};

export type Memory = {
  id: string;
  title: string;
  caption: string;
  date: string; // YYYY-MM-DD
  place: string;
  tags: string[];
  member: MemberKey;
  category: string;
  photo: string | null;
  likes: number;
  createdAt: number;
};

export type AppData = {
  hangouts: Hangout[];
  bucket: BucketItem[];
  memories: Memory[];
};

export type RsvpStatus = "going" | "maybe" | "invited";

export type Rsvp = {
  member: MemberKey;
  status: RsvpStatus;
};

const RSVP_POOL: RsvpStatus[] = ["going", "maybe", "invited"];

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/* Deterministic RSVP list: the host always goes, everyone else gets a
   stable status derived from the hangout id so it never flickers. */
export function rsvpsFor(hangout: Hangout): Rsvp[] {
  return MEMBER_ORDER.map((member) => {
    if (member === hangout.member) return { member, status: "going" as const };
    const status =
      RSVP_POOL[hashString(`${hangout.id}:${member}`) % RSVP_POOL.length];
    return { member, status };
  });
}

export function goingCount(hangout: Hangout) {
  return rsvpsFor(hangout).filter((rsvp) => rsvp.status === "going").length;
}

/* ------------------------------------------------------------------ */
/* Seed data                                                           */
/* ------------------------------------------------------------------ */

const SEED: AppData = {
  hangouts: [
    {
      id: "h-chai",
      title: "Chai & Vinyl",
      category: "Late Night Coffee",
      date: "2026-11-03",
      time: "3:00 PM",
      location: "Rooftop Studio Flat",
      description: "Drop the needle on side B and let the chai steep.",
      member: "dicky",
      createdAt: 1,
    },
    {
      id: "h-foursense",
      title: "Foursense Listening Night",
      category: "Music",
      date: "2026-11-08",
      time: "7:00 PM",
      location: "Aura's Loft",
      description: "Headphones on, phones off. Bring one track each.",
      member: "aura",
      createdAt: 2,
    },
    {
      id: "h-filmdrop",
      title: "Film Drop",
      category: "Creative Sprint",
      date: "2026-11-11",
      time: "9:00 AM",
      location: "Labo Darkroom",
      description: "Collect the Portra rolls pushed to 800.",
      member: "nadia",
      createdAt: 3,
    },
    {
      id: "h-gallery",
      title: "Nadia's Gallery Opening Night",
      category: "Milestone",
      date: "2026-11-12",
      time: "6:30 PM",
      location: "Tribeca Loft, NYC",
      description: "Dress code: Monochrome Elegant.",
      member: "nadia",
      createdAt: 4,
    },
    {
      id: "h-cabin",
      title: "Cabin Retreat Weekend",
      category: "Road Trip",
      date: "2026-11-14",
      time: "8:00 AM",
      location: "Big Bear Cabin, San Bernardino",
      description: "Three days off-grid: film stock, board games, trail snacks.",
      member: "aura",
      createdAt: 5,
    },
    {
      id: "h-return",
      title: "Return Drive",
      category: "Road Trip",
      date: "2026-11-16",
      time: "11:00 AM",
      location: "Big Bear → Home",
      description: "Slow route home with one diner stop, minimum.",
      member: "dicky",
      createdAt: 6,
    },
    {
      id: "h-coffee",
      title: "Coffee Run",
      category: "Late Night Coffee",
      date: "2026-11-21",
      time: "10:00 AM",
      location: "Kissaten",
      description: "Same table, same order. The pact holds.",
      member: "nadia",
      createdAt: 7,
    },
    {
      id: "h-zine",
      title: "Zine Layout",
      category: "Creative Sprint",
      date: "2026-11-24",
      time: "2:00 PM",
      location: "Home Studio",
      description: "Final spread edits before the print run.",
      member: "dicky",
      createdAt: 8,
    },
    {
      id: "h-santa",
      title: "Secret Santa Dinner",
      category: "Tradition",
      date: "2026-11-28",
      time: "6:00 PM",
      location: "Aura's Place",
      description: "Budget $40 limit · 5 secret keepers.",
      member: "dicky",
      createdAt: 9,
    },
  ],
  bucket: [
    {
      id: "stargazing",
      label: "Stargazing camp at Joshua Tree",
      note: "Done · Jun '25",
      status: "done",
      done: true,
      createdAt: 1,
    },
    {
      id: "sourdough",
      label: "Sourdough from scratch together",
      note: "Starter still moody — attempt #4 this Sunday.",
      status: "progress",
      done: false,
      createdAt: 2,
    },
    {
      id: "tokyo",
      label: "Tokyo 10-day ramen & thrift pilgrimage",
      note: "Spring 2027",
      status: "progress",
      done: false,
      progress: { value: 2400, total: 4500 },
      createdAt: 3,
    },
    {
      id: "zine-run",
      label: "Print the Volume 04 zine run",
      note: "42 of 50 copies bound",
      status: "progress",
      done: false,
      progress: { value: 42, total: 50 },
      createdAt: 4,
    },
    {
      id: "darkroom",
      label: "Take a film photography darkroom course",
      note: "Idea logged by Nadia",
      status: "idea",
      done: false,
      createdAt: 5,
    },
    {
      id: "moss-wall",
      label: "Build the moss terrarium wall",
      note: "Idea logged by Aura",
      status: "idea",
      done: false,
      createdAt: 6,
    },
  ],
  memories: [
    {
      id: "m-rooftop",
      title: "Rainy Rooftop Vinyl & Chai",
      caption:
        "The rain rolled in right as we dropped the needle on side B. We dragged the record player under the awning and let the whole city hum along.",
      date: "2026-10-04",
      place: "Rooftop Studio Flat",
      tags: ["#ChillNight", "#Autumn", "#VinylOnly"],
      member: "dicky",
      category: "Late Night Coffee",
      photo: null,
      likes: 12,
      createdAt: 1,
    },
    {
      id: "m-cape",
      title: "Sunrise at Cape Point",
      caption:
        "Left at 3am with cold coffee and worse directions. Worth every wrong turn — the light hit the ridge and nobody said a word for ten minutes.",
      date: "2026-09-18",
      place: "34.3572° S · Coastal Lookout",
      tags: ["#RoadTrip", "#4AMClub"],
      member: "nadia",
      category: "Road Trips",
      photo: null,
      likes: 34,
      createdAt: 2,
    },
    {
      id: "m-pottery",
      title: "Midnight Pottery Studio Crash",
      caption:
        "What began as a serene ceramics evening ended with three collapsed bowls and one very broken wheel. Gloriously unserious.",
      date: "2026-08-29",
      place: "Warehouse District",
      tags: ["#Crafts", "#Disaster"],
      member: "aura",
      category: "Milestones",
      photo: null,
      likes: 21,
      createdAt: 3,
    },
    {
      id: "m-cabin",
      title: "Pine Cabin, No Signal",
      caption:
        "Two days of no bars and no plans. We played cards by lantern light and forgot what day it was.",
      date: "2026-07-15",
      place: "Pine Cabin, Idyllwild",
      tags: ["#OffGrid", "#Cabin"],
      member: "aura",
      category: "Everyday",
      photo: null,
      likes: 18,
      createdAt: 4,
    },
  ],
};

const STORAGE_KEY = "our-spaces:data:v1";
const SEED_JSON = JSON.stringify(SEED);

/* ------------------------------------------------------------------ */
/* External store                                                      */
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

function getSnapshot(): string {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? SEED_JSON;
  } catch {
    return SEED_JSON;
  }
}

function getServerSnapshot(): string {
  return SEED_JSON;
}

function read(): AppData {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    return normalize(JSON.parse(raw) as Partial<AppData>);
  } catch {
    return SEED;
  }
}

function normalize(parsed: Partial<AppData>): AppData {
  return {
    hangouts: parsed.hangouts ?? SEED.hangouts,
    bucket: parsed.bucket ?? SEED.bucket,
    memories: parsed.memories ?? SEED.memories,
  };
}

function write(next: AppData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore storage failures */
  }
  emit();
}

function newId(prefix: string) {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

/* ------------------------------------------------------------------ */
/* Hooks                                                               */
/* ------------------------------------------------------------------ */

export function useAppData() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const data = useMemo<AppData>(() => {
    try {
      return normalize(JSON.parse(raw) as Partial<AppData>);
    } catch {
      return SEED;
    }
  }, [raw]);

  const addHangout = useCallback(
    (input: Omit<Hangout, "id" | "createdAt">) => {
      const current = read();
      write({
        ...current,
        hangouts: [
          { ...input, id: newId("h"), createdAt: Date.now() },
          ...current.hangouts,
        ],
      });
    },
    [],
  );

  const addBucketItem = useCallback(
    (input: Omit<BucketItem, "id" | "createdAt" | "done">) => {
      const current = read();
      write({
        ...current,
        bucket: [
          { ...input, id: newId("b"), done: false, createdAt: Date.now() },
          ...current.bucket,
        ],
      });
    },
    [],
  );

  const toggleBucketItem = useCallback((id: string) => {
    const current = read();
    write({
      ...current,
      bucket: current.bucket.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    });
  }, []);

  const addMemory = useCallback(
    (input: Omit<Memory, "id" | "createdAt" | "likes">) => {
      const current = read();
      write({
        ...current,
        memories: [
          { ...input, id: newId("m"), likes: 0, createdAt: Date.now() },
          ...current.memories,
        ],
      });
    },
    [],
  );

  const deleteMemory = useCallback((id: string) => {
    const current = read();
    write({
      ...current,
      memories: current.memories.filter((memory) => memory.id !== id),
    });
  }, []);

  return {
    hangouts: data.hangouts,
    bucket: data.bucket,
    memories: data.memories,
    addHangout,
    addBucketItem,
    toggleBucketItem,
    addMemory,
    deleteMemory,
  };
}
