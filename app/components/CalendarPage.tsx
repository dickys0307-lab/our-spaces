"use client";

import { useState } from "react";
import { Panel, SectionTitle } from "./ui";
import { HangoutModal } from "./HangoutModal";
import { HangoutDetailModal } from "./HangoutDetailModal";
import { MEMBER_META } from "./memberStyles";
import { useSession, type MemberKey } from "./session";
import { goingCount, useAppData, type Hangout } from "./store";
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  MapPinIcon,
  PlusIcon,
  UsersIcon,
} from "./icons";

type ViewMode = "Month" | "Week" | "Upcoming";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTHS_SHORT = MONTHS.map((month) => month.slice(0, 3));
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PAGE_DAYS = [14, 15, 16];

function monthKey(cursor: Date) {
  return `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
}

function dayOf(iso: string) {
  return Number(iso.slice(8, 10));
}

/* Monday-first weekday index: Monday = 0 … Sunday = 6 */
function weekdayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

/* Real number of days in a month (handles leap years) */
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/* Safely move a cursor by whole months, clamping the day to avoid rollover */
function addMonths(date: Date, delta: number) {
  const target = date.getMonth() + delta;
  const year = date.getFullYear() + Math.floor(target / 12);
  const month = ((target % 12) + 12) % 12;
  const day = Math.min(date.getDate(), daysInMonth(year, month));
  return new Date(year, month, day);
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS_SHORT[month - 1]} ${day}, ${year}`;
}

function formatShort(iso: string) {
  const [, month, day] = iso.split("-").map(Number);
  return `${MONTHS_SHORT[month - 1]} ${day}`;
}

function eventsForMonth(cursor: Date, hangouts: Hangout[]): Hangout[] {
  const key = monthKey(cursor);
  return hangouts.filter((hangout) => hangout.date.startsWith(key));
}

function buildMonthCells(cursor: Date): (number | null)[] {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const leading = weekdayIndex(first);
  const total = daysInMonth(year, month);

  const cells: (number | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= total; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function weekOf(cursor: Date): Date[] {
  const start = new Date(cursor);
  const offset = weekdayIndex(start);
  start.setDate(start.getDate() - offset);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function isoOf(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getDate()).padStart(2, "0")}`;
}

function MemberAvatar({
  member,
  size = "size-7",
}: {
  member: MemberKey;
  size?: string;
}) {
  const meta = MEMBER_META[member];
  return (
    <span
      title={meta.name}
      className={`grid ${size} place-items-center rounded-full text-[11px] font-semibold text-white ring-2 ring-white ${meta.solid}`}
    >
      {meta.initial}
    </span>
  );
}

function LegendDot({ member }: { member: MemberKey }) {
  const meta = MEMBER_META[member];
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink/60">
      <span className={`size-2.5 rounded-full ${meta.solid}`} />
      {meta.name}
    </span>
  );
}

function MonthGrid({
  cursor,
  hangouts,
  onSelect,
}: {
  cursor: Date;
  hangouts: Hangout[];
  onSelect: (hangout: Hangout) => void;
}) {
  const cells = buildMonthCells(cursor);
  const monthEvents = eventsForMonth(cursor, hangouts);
  const dayEvents = (day: number) =>
    monthEvents.filter((event) => dayOf(event.date) === day);

  return (
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {WEEKDAYS.map((day) => (
        <div
          key={day}
          className="pb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted sm:text-[11px]"
        >
          {day}
        </div>
      ))}

      {cells.map((day, index) => {
        if (day === null) {
          return (
            <div
              key={`empty-${index}`}
              className="min-h-[64px] rounded-2xl border border-transparent sm:min-h-[86px]"
            />
          );
        }

        const items = dayEvents(day);
        const first = items[0];
        const meta = first ? MEMBER_META[first.member] : null;
        const isPageDay = PAGE_DAYS.includes(day);
        const hasEvents = items.length > 0;

        return (
          <div
            key={day}
            role={hasEvents ? "button" : undefined}
            tabIndex={hasEvents ? 0 : undefined}
            aria-label={
              hasEvents
                ? `${day}: ${items.map((item) => item.title).join(", ")}`
                : undefined
            }
            onClick={hasEvents ? () => onSelect(first) : undefined}
            onKeyDown={
              hasEvents
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelect(first);
                    }
                  }
                : undefined
            }
            className={`min-h-[64px] rounded-2xl border p-1 transition sm:min-h-[86px] sm:p-2 ${
              meta
                ? meta.cell
                : "border-black/5 bg-canvas/40 text-ink/50 hover:bg-canvas"
            } ${isPageDay ? "ring-2 ring-ink/10" : ""} ${
              hasEvents
                ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-peri-400"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid size-5 place-items-center rounded-full text-[11px] font-semibold sm:size-7 sm:text-sm ${
                  meta ? meta.number : "text-ink/50"
                }`}
              >
                {day}
              </span>
              {items.length > 1 && (
                <span className="text-[10px] font-medium text-ink/40">
                  {items.length}
                </span>
              )}
            </div>

            <div className="mt-1 space-y-1">
              {items.map((item) => {
                const itemMeta = MEMBER_META[item.member];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSelect(item);
                    }}
                    className={`hidden w-full truncate rounded-md px-1.5 py-0.5 text-left text-[10px] font-medium transition hover:brightness-95 sm:block ${itemMeta.chip}`}
                    title={`${item.title} · ${itemMeta.name}`}
                  >
                    {item.title}
                  </button>
                );
              })}
              {first && (
                <span
                  className={`block size-1.5 rounded-full sm:hidden ${MEMBER_META[first.member].dot}`}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekGrid({
  cursor,
  hangouts,
  onSelect,
}: {
  cursor: Date;
  hangouts: Hangout[];
  onSelect: (hangout: Hangout) => void;
}) {
  const days = weekOf(cursor);

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-7">
      {days.map((date) => {
        const iso = isoOf(date);
        const items = hangouts.filter((event) => event.date === iso);
        const first = items[0];
        const meta = first ? MEMBER_META[first.member] : null;
        return (
          <div
            key={iso}
            className={`min-h-[120px] rounded-2xl border p-3 ${
              meta ? meta.cell : "border-black/5 bg-canvas/40"
            }`}
          >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              {WEEKDAYS[weekdayIndex(date)]}
            </p>
            <p className="mt-0.5 text-xl font-semibold">{date.getDate()}</p>
            <div className="mt-2 space-y-1.5">
              {items.map((item) => {
                const itemMeta = MEMBER_META[item.member];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item)}
                    className={`w-full rounded-lg px-2 py-1 text-left text-[11px] font-medium transition hover:brightness-95 ${itemMeta.chip}`}
                  >
                    <p className="truncate">{item.title}</p>
                    <p className="text-[10px] font-normal text-ink/50">
                      {item.time}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function UpcomingList({
  cursor,
  hangouts,
  onSelect,
}: {
  cursor: Date;
  hangouts: Hangout[];
  onSelect: (hangout: Hangout) => void;
}) {
  const monthEvents = eventsForMonth(cursor, hangouts)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  if (monthEvents.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-black/10 bg-canvas/50 p-6 text-center text-sm text-muted">
        No hangouts scheduled this month.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {monthEvents.map((event) => {
        const meta = MEMBER_META[event.member];
        return (
          <li key={event.id}>
            <button
              type="button"
              onClick={() => onSelect(event)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${meta.cell}`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-xl text-sm font-semibold ${meta.number}`}
              >
                {dayOf(event.date)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {event.title}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted">
                  <ClockIcon className="size-3.5" />
                  {formatDate(event.date)} · {event.time}
                </span>
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${meta.chip}`}
              >
                {meta.name}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function ProposeCard({ onPropose }: { onPropose: () => void }) {
  const { session } = useSession();
  const meta = MEMBER_META[session?.member ?? "dicky"];
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-soft">
      <button
        type="button"
        onClick={onPropose}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-peri-500 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-peri-400"
      >
        <PlusIcon className="size-4" />
        Propose New Hangout
      </button>
      <p className="mt-3 flex items-center gap-2 text-[11px] text-muted">
        <span className={`size-2.5 rounded-full ${meta.solid}`} />
        New hangouts sync to {meta.name}&apos;s color palette across Home &amp;
        Calendar.
      </p>
    </div>
  );
}

function UpcomingHangouts({
  onSelect,
}: {
  onSelect: (hangout: Hangout) => void;
}) {
  const { hangouts } = useAppData();
  const next = [...hangouts]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <Panel>
      <SectionTitle
        icon={<CalendarIcon className="size-4" />}
        action={
          <span className="rounded-full bg-canvas px-2.5 py-1 text-[11px] font-semibold text-ink/60">
            {hangouts.length} Scheduled
          </span>
        }
      >
        Upcoming Hangouts &amp; RSVP
      </SectionTitle>

      <div className="space-y-3">
        {next.map((item) => {
          const meta = MEMBER_META[item.member];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${meta.cell}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${meta.chip}`}
                >
                  {item.category}
                </span>
                <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-ink/60">
                  {formatShort(item.date)}
                </span>
              </div>

              <h3 className="mt-3 text-sm font-semibold leading-snug">
                {item.title}
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                {formatDate(item.date)} · {item.time}
              </p>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/70">
                <MapPinIcon className="size-3.5" />
                {item.location}
              </p>
              {item.description && (
                <p className="mt-1 text-xs text-ink/55">{item.description}</p>
              )}

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MemberAvatar member={item.member} />
                  <span className="text-xs font-medium text-ink/60">
                    {meta.name} hosting
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-ink/60">
                  <UsersIcon className="size-3.5" />
                  {goingCount(item)} going
                </span>
              </div>
            </button>
          );
        })}

        {next.length === 0 && (
          <p className="rounded-2xl border border-dashed border-black/10 bg-canvas/50 p-6 text-center text-sm text-muted">
            Nothing on the books yet.
          </p>
        )}
      </div>
    </Panel>
  );
}

const pollOptions = [
  { label: "Fri, Dec 12 · 6:00 PM", votes: 3 },
  { label: "Sat, Dec 13 · 5:30 PM", votes: 1 },
  { label: "Sun, Dec 14 · 4:00 PM", votes: 1 },
];

function DatePolling() {
  const [options, setOptions] = useState(pollOptions);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const total = options.reduce((sum, option) => sum + option.votes, 0);

  function submitVote() {
    if (selected === null || submitted) return;
    setOptions((prev) =>
      prev.map((option, index) =>
        index === selected ? { ...option, votes: option.votes + 1 } : option,
      ),
    );
    setSubmitted(true);
  }

  return (
    <Panel>
      <SectionTitle
        icon={<CheckIcon className="size-4" />}
        action={
          <span className="rounded-full bg-butter-200 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
            Poll open
          </span>
        }
      >
        Date Polling &amp; Proposals
      </SectionTitle>

      <div className="rounded-2xl border border-black/5 bg-canvas/50 p-4">
        <h3 className="text-sm font-semibold">
          Joshua Tree Stargazing &amp; Dark Screening
        </h3>
        <p className="mt-0.5 text-xs text-muted">
          Vote for the window that works best for you.
        </p>

        <div className="mt-3 space-y-2.5">
          {options.map((option, index) => {
            const percent = Math.round((option.votes / total) * 100);
            const isSelected = selected === index;
            return (
              <button
                key={option.label}
                type="button"
                disabled={submitted}
                onClick={() => setSelected(index)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-peri-300 bg-peri-50"
                    : "border-black/5 bg-white hover:border-peri-200"
                } ${submitted ? "cursor-default" : ""}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span
                      className={`grid size-4 place-items-center rounded-full border ${
                        isSelected
                          ? "border-peri-500 bg-peri-500 text-white"
                          : "border-black/20"
                      }`}
                    >
                      {isSelected && <CheckIcon className="size-2.5" />}
                    </span>
                    {option.label}
                  </span>
                  <span className="text-[11px] font-medium text-ink/55">
                    {option.votes} {option.votes === 1 ? "vote" : "votes"} ·{" "}
                    {percent}%
                  </span>
                </span>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-black/5">
                  <span
                    className="block h-full rounded-full bg-peri-400 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={submitVote}
          disabled={selected === null || submitted}
          className="mt-3 w-full rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/30"
        >
          {submitted ? "Vote submitted" : "Submit Vote"}
        </button>

        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2">
          <MemberAvatar member="aura" size="size-6" />
          <p className="text-xs text-muted">
            {submitted
              ? "Thanks! Waiting for Aura's vote"
              : "Waiting for Aura's vote"}
          </p>
        </div>
      </div>
    </Panel>
  );
}

export default function CalendarPage() {
  const [cursor, setCursor] = useState(() => new Date(2026, 10, 14));
  const [view, setView] = useState<ViewMode>("Month");
  const [proposeOpen, setProposeOpen] = useState(false);
  const [selected, setSelected] = useState<Hangout | null>(null);
  const { hangouts } = useAppData();

  function shift(direction: number) {
    setCursor((prev) => {
      if (view === "Week") {
        const next = new Date(prev);
        next.setDate(next.getDate() + direction * 7);
        return next;
      }
      return addMonths(prev, direction);
    });
  }

  const monthLabel = `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
  const controls = ["Month", "Week", "Upcoming"] as ViewMode[];

  return (
    <div className="space-y-6 pb-16">
      <section className="relative overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-peri-100 via-blush-50 to-apricot-100 p-5 shadow-soft sm:p-8">
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/50">
              Schedule
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Our Calendar &amp; Hangout Schedule
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Shared dates, planned road trips, film development deadlines, and
              spontaneous coffee runs — colored by whoever&apos;s planning.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-leaf-400/40 bg-leaf-400/10 px-4 py-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf-500 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-leaf-500" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                Sync Status
              </p>
              <p className="text-xs font-medium text-ink/80">
                All 3 members free this weekend (Nov 14–16)
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Panel>
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous"
                onClick={() => shift(-1)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-ink/70 transition hover:bg-canvas"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <span className="min-w-0 flex-1 text-center text-sm font-semibold sm:min-w-[9.5rem] sm:flex-none sm:text-base">
                {monthLabel}
              </span>
              <button
                type="button"
                aria-label="Next"
                onClick={() => shift(1)}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-ink/70 transition hover:bg-canvas"
              >
                <ChevronRightIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date(2026, 10, 14))}
                className="ml-1 shrink-0 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium text-ink/70 transition hover:bg-canvas sm:px-3.5"
              >
                Today
              </button>
            </div>

            <div className="grid w-full grid-cols-3 rounded-full bg-canvas p-1 sm:flex sm:w-auto">
              {controls.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setView(option)}
                  className={`rounded-full px-3 py-1.5 text-center text-xs font-medium transition ${
                    view === option
                      ? "bg-white text-ink shadow-soft"
                      : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {option === "Upcoming" ? "Upcoming List" : option}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-4 rounded-2xl border border-black/5 bg-canvas/40 px-4 py-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              Members
            </span>
            <LegendDot member="dicky" />
            <LegendDot member="aura" />
            <LegendDot member="nadia" />
          </div>

          {view === "Month" && (
            <MonthGrid cursor={cursor} hangouts={hangouts} onSelect={setSelected} />
          )}
          {view === "Week" && (
            <WeekGrid cursor={cursor} hangouts={hangouts} onSelect={setSelected} />
          )}
          {view === "Upcoming" && (
            <UpcomingList
              cursor={cursor}
              hangouts={hangouts}
              onSelect={setSelected}
            />
          )}
        </Panel>

        <div className="space-y-6">
          <ProposeCard onPropose={() => setProposeOpen(true)} />
          <UpcomingHangouts onSelect={setSelected} />
          <DatePolling />
        </div>
      </div>

      <HangoutModal
        open={proposeOpen}
        onClose={() => setProposeOpen(false)}
      />
      <HangoutDetailModal
        hangout={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
