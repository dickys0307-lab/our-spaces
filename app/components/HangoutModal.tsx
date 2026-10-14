"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { MEMBER_META } from "./memberStyles";
import { useSession } from "./session";
import { useAppData } from "./store";
import { CalendarIcon, MapPinIcon, PaletteIcon } from "./icons";

const CATEGORIES = [
  "Road Trip",
  "Milestone",
  "Tradition",
  "Late Night Coffee",
  "Music",
  "Creative Sprint",
];

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-canvas/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200";

function HangoutForm({ onDone }: { onDone: () => void }) {
  const { session } = useSession();
  const { addHangout } = useAppData();
  const member = session?.member ?? "dicky";
  const meta = MEMBER_META[member];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Road Trip");
  const [date, setDate] = useState("2026-11-15");
  const [time, setTime] = useState("7:30 PM");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !date) return;
    addHangout({
      title: cleanTitle,
      category: category.trim() || "Hangout",
      date,
      time: time.trim() || "TBD",
      location: location.trim() || "To be decided",
      description: description.trim(),
      member,
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-2.5 rounded-2xl bg-canvas/70 px-3.5 py-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${meta.solid}`}
        >
          {meta.initial}
        </span>
        <p className="text-xs text-muted">
          This hangout syncs to{" "}
          <span className="font-semibold text-ink">{meta.name}</span>&apos;s
          color palette across Home &amp; Calendar.
        </p>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Hangout title
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Cabin Retreat Weekend"
          autoFocus
          className={fieldClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Category / Tag
          </span>
          <input
            list="hangout-categories"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Road Trip..."
            className={fieldClass}
          />
          <datalist id="hangout-categories">
            {CATEGORIES.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Location
          </span>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Big Bear Cabin"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Time
          </span>
          <input
            value={time}
            onChange={(event) => setTime(event.target.value)}
            placeholder="7:30 PM"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Description
        </span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What's the plan? What should everyone bring?"
          className={`${fieldClass} min-h-24 resize-none`}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="flex items-center gap-1.5 text-[11px] text-muted">
          <CalendarIcon className="size-3.5" />
          Appears instantly on the Home &amp; Calendar
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDone}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-ink/55 transition hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:opacity-90 ${meta.solid}`}
          >
            <PaletteIcon className="size-4" />
            Save Hangout
          </button>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-muted">
        <MapPinIcon className="size-3.5" />
        Tip: pick a date in November 2026 to see it on the current calendar view.
      </p>
    </form>
  );
}

export function HangoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Plan a new hangout"
      subtitle="Fill in the details and it lands on everyone's Home & Calendar."
    >
      {open && <HangoutForm onDone={onClose} />}
    </Modal>
  );
}
