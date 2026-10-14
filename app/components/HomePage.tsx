"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Panel, SectionTitle } from "./ui";
import { HangoutModal } from "./HangoutModal";
import { AddGoalModal, ManageBucketModal } from "./BucketModals";
import { MemoryModal } from "./MemoryModal";
import { MEMBER_META, MEMBER_GRADIENT } from "./memberStyles";
import { useAppData, type Memory } from "./store";
import type { MemberKey } from "./session";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HeartIcon,
  ImageIcon,
  MapPinIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "./icons";

/* ------------------------------------------------------------------ */
/* Date helpers                                                        */
/* ------------------------------------------------------------------ */

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function parseIso(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

function formatShort(iso: string) {
  const { month, day } = parseIso(iso);
  return `${MONTHS_SHORT[month - 1] ?? "—"} ${day}`;
}

function formatLong(iso: string) {
  const { year, month, day } = parseIso(iso);
  return `${MONTHS_SHORT[month - 1] ?? "—"} ${day}, ${year}`;
}

const money = (value: number) => `$${value.toLocaleString("en-US")}`;

/* ------------------------------------------------------------------ */
/* Hero — DNA Circle                                                   */
/* ------------------------------------------------------------------ */

const heroPills = [
  "Est. Autumn 2021",
  "3 Members",
  "48 Shared Moments",
  "8 Bucket Items Met",
];

const triad: {
  member: MemberKey;
  name: string;
  role: string;
  variant: 0 | 1 | 2;
}[] = [
  { member: "dicky", name: "Dicky", role: "The Planner", variant: 0 },
  { member: "aura", name: "Aura", role: "The Chaos Driver", variant: 1 },
  { member: "nadia", name: "Nadia", role: "The Documentarian", variant: 2 },
];

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-black/5 p-5 shadow-soft sm:p-8">
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-peri-200 via-blush-100 to-apricot-200"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-16 -top-20 size-72 rounded-full bg-peri-300/45 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 top-2 size-64 rounded-full bg-blush-300/45 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 size-64 rounded-full bg-apricot-300/45 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-10 right-1/3 size-40 rounded-full bg-peri-200/50 blur-2xl"
      />

      <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink/50">
              • Archived Circle · Vol. 04
            </p>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-peri-400" />
              <span className="size-2 rounded-full bg-blush-400" />
              <span className="size-2 rounded-full bg-apricot-400" />
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
            DNA Circle
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/70 sm:text-base">
            Our private archive of unfiltered memories, spontaneous road trips,
            and inside jokes — three palettes, one shared story.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex -space-x-4">
              {triad.map((member) => (
                <span
                  key={member.member}
                  title={`${member.name} — ${member.role}`}
                  className={`relative size-14 rounded-full bg-gradient-to-br p-[3px] shadow-soft sm:size-[4.5rem] ${MEMBER_GRADIENT[member.member]}`}
                >
                  <span className="block size-full overflow-hidden rounded-full ring-2 ring-white">
                    <img
                      src={`/avatar/${member.member}.png`}
                      alt={`${member.name}'s avatar`}
                      className="size-full object-cover object-center"
                    />
                  </span>
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {triad.map((member) => (
                <span
                  key={member.member}
                  className="flex items-center gap-1.5 text-[11px] text-ink/65"
                >
                  <span
                    className={`size-2 rounded-full ${MEMBER_META[member.member].solid}`}
                  />
                  <span className="font-semibold text-ink/80">
                    {member.name}
                  </span>
                  <span>· {member.role}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {heroPills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/70 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-ink/75 shadow-soft backdrop-blur"
              >
                {pill}
              </span>
            ))}
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/75 p-5 shadow-soft backdrop-blur">
            <h3 className="text-sm font-semibold">
              Keeper Registry: The Triad
            </h3>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span className="inline-flex items-center gap-1.5 font-medium text-ink/75">
                <span className="size-1.5 rounded-full bg-leaf-500" />
                Status: In Sync
              </span>
              <span className="text-muted">Next Sync: Friday 7:30 PM</span>
            </div>

            <ul className="mt-4 space-y-1.5">
              {triad.map((member) => (
                <li
                  key={member.member}
                  className={`flex items-center gap-3 rounded-2xl border px-2.5 py-2 ${MEMBER_META[member.member].cell}`}
                >
                  <span
                    className={`size-9 rounded-full bg-gradient-to-br p-[2px] ${MEMBER_GRADIENT[member.member]}`}
                  >
                    <span className="block size-full overflow-hidden rounded-full ring-2 ring-white">
                      <img
                        src={`/avatar/${member.member}.png`}
                        alt={`${member.name}'s avatar`}
                        className="size-full object-cover object-center"
                      />
                    </span>
                  </span>
                  <span className="flex-1 text-sm font-medium">
                    {member.name}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${MEMBER_META[member.member].chip}`}
                  >
                    {member.role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Upcoming Gatherings                                                 */
/* ------------------------------------------------------------------ */

function UpcomingGatherings({ onPlan }: { onPlan: () => void }) {
  const router = useRouter();
  const { hangouts } = useAppData();
  const upcoming = [...hangouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <Panel className="flex flex-col">
      <SectionTitle
        icon={<CalendarIcon className="size-4" />}
        action={
          <button
            type="button"
            onClick={onPlan}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-ink/85"
          >
            <PlusIcon className="size-3.5" />
            Plan Hangouts
          </button>
        }
      >
        Upcoming Gatherings
      </SectionTitle>

      <div className="flex-1 space-y-3">
        {upcoming.length === 0 && (
          <p className="rounded-2xl border border-dashed border-black/10 bg-canvas/50 p-6 text-center text-sm text-muted">
            No hangouts planned yet. Add your first one!
          </p>
        )}

        {upcoming.map((item) => {
          const meta = MEMBER_META[item.member];
          return (
            <article
              key={item.id}
              className={`relative rounded-2xl border p-4 ${meta.cell}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.chip}`}
                >
                  {item.category}
                </span>
                <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-soft backdrop-blur">
                  {formatShort(item.date)}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink/70">
                <MapPinIcon className="size-3.5" />
                {item.location}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/55">
                <ClockIcon className="size-3.5" />
                {formatLong(item.date)} · {item.time}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
        <span className="text-xs text-muted">
          Synced to Home &amp; Calendar
        </span>
        <button
          type="button"
          onClick={() => router.push("/calendar")}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink transition hover:gap-2"
        >
          View Full Calendar
          <ArrowLeftIcon className="size-4 rotate-180" />
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Circle Bucket List                                                  */
/* ------------------------------------------------------------------ */

function CircleBucketList({
  onAdd,
  onManage,
}: {
  onAdd: () => void;
  onManage: () => void;
}) {
  const { bucket, toggleBucketItem } = useAppData();
  const doneCount = bucket.filter((item) => item.done).length;

  return (
    <Panel className="flex flex-col">
      <SectionTitle
        icon={<CheckIcon className="size-4" />}
        action={
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-ink/85"
          >
            <PlusIcon className="size-3.5" />
            Add Goal
          </button>
        }
      >
        Circle Bucket List
      </SectionTitle>

      <ul className="flex-1 space-y-2">
        {bucket.map((item) => (
          <li
            key={item.id}
            className="rounded-2xl border border-black/5 bg-canvas/50 p-3.5"
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => toggleBucketItem(item.id)}
                aria-pressed={item.done}
                className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition ${
                  item.done
                    ? "border-leaf-500 bg-leaf-500 text-white"
                    : "border-black/20 bg-white text-transparent hover:border-ink/40"
                }`}
              >
                <CheckIcon className="size-3.5" strokeWidth={2.6} />
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-medium ${
                    item.done ? "text-ink/40 line-through" : ""
                  }`}
                >
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">{item.note}</p>

                {item.progress && (
                  <div className="mt-2.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-peri-400"
                        style={{
                          width: `${
                            (item.progress.value / item.progress.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] font-medium text-ink/55">
                      {money(item.progress.value)} /{" "}
                      {money(item.progress.total)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/5 pt-4">
        <span className="text-xs text-muted">
          {doneCount} completed of {bucket.length} total
        </span>
        <button
          type="button"
          onClick={onManage}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink transition hover:gap-2"
        >
          Manage Bucket List
          <ArrowLeftIcon className="size-4 rotate-180" />
        </button>
      </div>
    </Panel>
  );
}

/* ------------------------------------------------------------------ */
/* Feed Archive — Recent Hangout Moments                               */
/* ------------------------------------------------------------------ */

const filterOptions = [
  "All Memories",
  "Road Trips",
  "Late Night Coffee",
  "Milestones",
  "Everyday",
] as const;

type Filter = (typeof filterOptions)[number];

function TimelineItem({
  memory,
  index,
  onDelete,
}: {
  memory: Memory;
  index: number;
  onDelete: (id: string) => void;
}) {
  const [liked, setLiked] = useState(false);
  const meta = MEMBER_META[memory.member];
  const alignRight = index % 2 === 0;

  return (
    <div
      className={`relative lg:flex ${
        alignRight ? "lg:justify-end" : "lg:justify-start"
      }`}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-6 hidden size-3 -translate-x-1/2 rounded-full bg-ink ring-4 ring-canvas lg:block"
      />

      <article className="w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft lg:w-[calc(50%-2rem)]">
        <div className="flex flex-col lg:flex-row">
          <div
            className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br lg:aspect-[4/3] lg:w-2/5 ${
              memory.photo ? "" : MEMBER_GRADIENT[memory.member]
            }`}
          >
            {memory.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={memory.photo}
                alt={memory.title}
                className="size-full object-cover object-center"
              />
            ) : (
              <span className="grid size-full place-items-center">
                <span className="grid size-12 place-items-center rounded-full bg-white/25 text-white backdrop-blur">
                  <ImageIcon className="size-6" />
                </span>
              </span>
            )}

            <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-1.5 bg-gradient-to-t from-black/35 to-transparent p-3 pt-8 lg:hidden">
              {memory.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-medium text-ink backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold">
                  {formatLong(memory.date)}
                </span>
                <span className="text-xs text-muted">· {memory.place}</span>
              </div>
              <button
                type="button"
                onClick={() => onDelete(memory.id)}
                className="rounded-full p-1.5 text-ink/40 transition hover:bg-canvas hover:text-ink"
                aria-label="Delete memory"
              >
                <TrashIcon className="size-4" />
              </button>
            </div>

            <h3 className="mt-2 text-base font-semibold tracking-tight">
              {memory.title}
            </h3>
            {memory.caption && (
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {memory.caption}
              </p>
            )}

            {memory.tags.length > 0 && (
              <div className="mt-3 hidden flex-wrap gap-1.5 lg:flex">
                {memory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/5 bg-canvas px-2.5 py-1 text-[11px] font-medium text-ink/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/5 pt-3">
              <span className="flex items-center gap-2">
                <span
                  className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold text-white ${meta.solid}`}
                >
                  {meta.initial}
                </span>
                <span className="text-xs font-medium text-ink/70">
                  {meta.name}
                </span>
              </span>

              <button
                type="button"
                onClick={() => setLiked((value) => !value)}
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  liked
                    ? "bg-blush-100 text-blush-500"
                    : "text-ink/55 hover:bg-canvas"
                }`}
              >
                <HeartIcon
                  className="size-3.5"
                  fill={liked ? "currentColor" : "none"}
                />
                {memory.likes + (liked ? 1 : 0)}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

function FeedArchive({ onUpload }: { onUpload: () => void }) {
  const { memories, deleteMemory } = useAppData();
  const [filter, setFilter] = useState<Filter>("All Memories");

  const visible =
    filter === "All Memories"
      ? memories
      : memories.filter((memory) => memory.category === filter);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            Feed Archive
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">
            Recent Hangout Moments
          </h2>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="no-scrollbar touch-scroll -mx-3.5 flex gap-1.5 overflow-x-auto px-3.5 pb-0.5 sm:mx-0 sm:flex-wrap sm:px-0">
            {filterOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition sm:py-1.5 ${
                  filter === option
                    ? "bg-ink text-white shadow-soft"
                    : "bg-white text-ink/60 hover:text-ink"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onUpload}
            className="flex shrink-0 items-center justify-center gap-1.5 self-start rounded-full bg-ink px-4 py-2 text-xs font-medium text-white transition hover:bg-ink/85 sm:self-auto sm:py-1.5"
          >
            <UploadIcon className="size-3.5" />
            Upload
          </button>
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="relative space-y-8">
          <span
            aria-hidden
            className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/10 lg:block"
          />
          {visible.map((memory, index) => (
            <TimelineItem
              key={memory.id}
              memory={memory}
              index={index}
              onDelete={deleteMemory}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/60 p-8 text-center text-sm text-muted">
          No memories in this collection yet.
        </p>
      )}

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onUpload}
          className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-2.5 text-xs font-semibold text-ink shadow-soft transition hover:bg-canvas"
        >
          <UploadIcon className="size-3.5" />
          Upload a memory
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export default function HomePage() {
  const [hangoutOpen, setHangoutOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <div className="space-y-6 pb-16 sm:space-y-8">
      <Hero />

      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingGatherings onPlan={() => setHangoutOpen(true)} />
        <CircleBucketList
          onAdd={() => setGoalOpen(true)}
          onManage={() => setManageOpen(true)}
        />
      </div>

      <FeedArchive onUpload={() => setUploadOpen(true)} />

      <HangoutModal
        open={hangoutOpen}
        onClose={() => setHangoutOpen(false)}
      />
      <AddGoalModal open={goalOpen} onClose={() => setGoalOpen(false)} />
      <ManageBucketModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
      />
      <MemoryModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
