"use client";

import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { MEMBER_META, MEMBER_GRADIENT } from "./memberStyles";
import { useSession } from "./session";
import { useAppData } from "./store";
import { CloseIcon, ImageIcon, UploadIcon } from "./icons";

const CATEGORIES = [
  "Road Trips",
  "Late Night Coffee",
  "Milestones",
  "Everyday",
];

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-canvas/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const original = reader.result as string;
      const image = new Image();
      image.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(original);
          return;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.onerror = () => resolve(original);
      image.src = original;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function MemoryForm({ onDone }: { onDone: () => void }) {
  const { session } = useSession();
  const { addMemory } = useAppData();
  const member = session?.member ?? "dicky";
  const meta = MEMBER_META[member];
  const fileRef = useRef<HTMLInputElement>(null);

  const [photo, setPhoto] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState("2026-11-15");
  const [place, setPlace] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Everyday");

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
    } catch {
      setPhoto(null);
    }
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    addMemory({
      title: cleanTitle,
      caption: caption.trim(),
      date,
      place: place.trim() || "Somewhere together",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
      member,
      category,
      photo,
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl bg-canvas/70 px-3.5 py-3">
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${meta.solid}`}
        >
          {meta.initial}
        </span>
        <p className="text-xs text-muted">
          Uploading as{" "}
          <span className="font-semibold text-ink">{meta.name}</span> — saved to
          the archive and persisted across pages.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br ${
            photo ? "" : MEMBER_GRADIENT[member]
          }`}
        >
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt="preview"
              className="size-full object-cover"
            />
          ) : (
            <ImageIcon className="size-7 text-white/80" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink shadow-soft transition hover:bg-canvas"
          >
            <UploadIcon className="size-4" />
            {photo ? "Replace photo" : "Upload photo"}
          </button>
          {photo && (
            <button
              type="button"
              onClick={() => {
                setPhoto(null);
                if (fileRef.current) fileRef.current.value = "";
              }}
              className="ml-2 inline-flex items-center gap-1 text-xs font-medium text-muted transition hover:text-ink"
            >
              <CloseIcon className="size-3.5" />
              Remove
            </button>
          )}
          <p className="mt-2 text-[11px] text-muted">
            Photos are downscaled in-browser. Optional — a pastel placeholder is
            used if omitted.
          </p>
        </div>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Title
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Sunrise at Cape Point"
          autoFocus
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Caption / story
        </span>
        <textarea
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="Tell the story behind this moment..."
          className={`${fieldClass} min-h-24 resize-none`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
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
            Location
          </span>
          <input
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Coastal Lookout"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Tags
          </span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="#RoadTrip, #4AMClub"
            className={fieldClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
            Collection
          </span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={fieldClass}
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
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
          <UploadIcon className="size-4" />
          Publish moment
        </button>
      </div>
    </form>
  );
}

export function MemoryModal({
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
      title="Upload a new moment"
      subtitle="Add a photo and story to the Feed Archive."
    >
      {open && <MemoryForm onDone={onClose} />}
    </Modal>
  );
}
