"use client";

import { useRef, useState } from "react";
import { Panel } from "./ui";
import {
  CloseIcon,
  PinIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "./icons";
import { useSession } from "./session";

type MemberKey = "dicky" | "aura" | "nadia";

const memberMeta: Record<
  MemberKey,
  {
    name: string;
    initial: string;
    card: string;
    chip: string;
    solid: string;
    swatch: string;
  }
> = {
  dicky: {
    name: "Dicky",
    initial: "D",
    card: "border-peri-200 bg-peri-100",
    chip: "bg-peri-200 text-ink",
    solid: "bg-peri-400",
    swatch: "bg-peri-300",
  },
  aura: {
    name: "Aura",
    initial: "A",
    card: "border-blush-200 bg-blush-100",
    chip: "bg-blush-200 text-ink",
    solid: "bg-blush-400",
    swatch: "bg-blush-300",
  },
  nadia: {
    name: "Nadia",
    initial: "N",
    card: "border-apricot-200 bg-apricot-100",
    chip: "bg-apricot-200 text-ink",
    solid: "bg-apricot-400",
    swatch: "bg-apricot-300",
  },
};

const paletteOrder: MemberKey[] = ["dicky", "aura", "nadia"];

type Special =
  | { type: "progress"; label: string; value: number; max: number; caption: string }
  | {
      type: "polaroid";
      caption: string;
      gradient?: string;
      photo?: string;
    }
  | { type: "media"; caption: string };

/* Downscale an uploaded image in-browser and return a data URL */
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

type Reaction = { emoji: string; count: number };

type Note = {
  id: number;
  author: MemberKey;
  palette: MemberKey;
  tag: string;
  time: string;
  text: string;
  special?: Special;
  reactions: Reaction[];
};

const initialNotes: Note[] = [
  {
    id: 1,
    author: "dicky",
    palette: "dicky",
    tag: "Inside Joke",
    time: "Yesterday 11:42 PM",
    text: "\u201cFoursense\u201d is now legally our group\u2019s sixth sense. No further debate.",
    reactions: [
      { emoji: "\ud83d\udc9b", count: 4 },
      { emoji: "\u2764\ufe0f", count: 2 },
    ],
  },
  {
    id: 2,
    author: "aura",
    palette: "aura",
    tag: "Reminder",
    time: "3 hours ago",
    text: "Darkroom closes at 6. Bring the Portra rolls or they sit another week.",
    reactions: [{ emoji: "\ud83d\udc9b", count: 2 }],
  },
  {
    id: 3,
    author: "nadia",
    palette: "nadia",
    tag: "Spontaneous Thought",
    time: "Oct 24",
    text: "What if the zine had a scratch-and-sniff page for the cabin pine?",
    reactions: [
      { emoji: "\ud83d\udc9b", count: 3 },
      { emoji: "\u2764\ufe0f", count: 1 },
    ],
  },
  {
    id: 4,
    author: "aura",
    palette: "aura",
    tag: "Trio Goal",
    time: "Oct 22",
    text: "Tokyo in spring. Cherry blossoms, film, and way too much ramen.",
    special: {
      type: "progress",
      label: "Tokyo Trip Fund",
      value: 2400,
      max: 4500,
      caption: "$2,400 of $4,500 saved",
    },
    reactions: [{ emoji: "\ud83d\udc9b", count: 5 }],
  },
  {
    id: 5,
    author: "dicky",
    palette: "dicky",
    tag: "Coffee Pact",
    time: "Oct 21",
    text: "Same table, same order, every Friday. The pact holds.",
    special: {
      type: "polaroid",
      caption: "Kissaten \u00b7 8:15 AM",
      gradient: "from-amber-700 via-amber-900 to-stone-900",
    },
    reactions: [{ emoji: "\u2764\ufe0f", count: 4 }],
  },
  {
    id: 6,
    author: "nadia",
    palette: "nadia",
    tag: "Reminder",
    time: "Oct 20",
    text: "Secret Santa budget set at $35. No sneaky overspending, Dicky.",
    reactions: [{ emoji: "\ud83d\udc9b", count: 2 }],
  },
  {
    id: 7,
    author: "dicky",
    palette: "dicky",
    tag: "Inside Joke",
    time: "Oct 19",
    text: "Still recovering from Aura\u2019s reaction to the surprise vinyl swap.",
    reactions: [{ emoji: "\u2764\ufe0f", count: 3 }],
  },
  {
    id: 8,
    author: "aura",
    palette: "aura",
    tag: "Spontaneous Thought",
    time: "Oct 18",
    text: "Petition to rename the group chat to \u201cMoss & Morning.\u201d",
    reactions: [{ emoji: "\ud83d\udc9b", count: 3 }],
  },
  {
    id: 9,
    author: "nadia",
    palette: "nadia",
    tag: "Trio Goal",
    time: "Oct 17",
    text: "Finish the zine print run before winter. 42 down, 8 to go.",
    special: {
      type: "progress",
      label: "Zine Print Run",
      value: 42,
      max: 50,
      caption: "42 of 50 copies",
    },
    reactions: [{ emoji: "\ud83d\udc9b", count: 2 }],
  },
  {
    id: 10,
    author: "dicky",
    palette: "dicky",
    tag: "Media",
    time: "Oct 16",
    text: "Voice snippet: 0:42 of Nadia\u2019s kiln playlist at 2 AM.",
    special: { type: "media", caption: "voice-snippet.mp3 \u00b7 0:42" },
    reactions: [{ emoji: "\ud83d\udc9b", count: 1 }],
  },
];

const tagSuggestions = [
  "Reminder",
  "Inside Joke",
  "Spontaneous Thought",
  "Trio Goal",
  "Coffee Pact",
  "Media",
];

function ProfilePin({ member }: { member: MemberKey }) {
  const meta = memberMeta[member];
  return (
    <span
      className={`absolute -top-2.5 left-1/2 grid size-7 -translate-x-1/2 place-items-center rounded-full text-white shadow-soft ring-4 ring-canvas ${meta.solid}`}
    >
      <PinIcon className="size-3.5" strokeWidth={2} />
    </span>
  );
}

function PolaroidFrame({
  caption,
  gradient,
  photo,
  className = "w-40",
}: {
  caption: string;
  gradient?: string;
  photo?: string;
  className?: string;
}) {
  return (
    <figure
      className={`mx-auto rotate-[-2deg] rounded-lg border-4 border-white bg-white pb-6 shadow-note transition duration-300 hover:rotate-0 ${className}`}
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={caption || "Polaroid photo"}
          className="aspect-square w-full rounded-sm object-cover"
        />
      ) : (
        <div
          className={`aspect-square rounded-sm bg-gradient-to-br ${
            gradient ?? ""
          }`}
        />
      )}
      <figcaption className="pt-1.5 text-center text-[11px] font-medium text-ink/60">
        {caption}
      </figcaption>
    </figure>
  );
}

function SpecialBlock({ special }: { special: Special }) {
  if (special.type === "progress") {
    const percent = Math.round((special.value / special.max) * 100);
    return (
      <div className="mt-3 rounded-xl bg-white/70 p-3">
        <div className="flex items-center justify-between text-xs font-medium">
          <span>{special.label}</span>
          <span className="text-ink/50">{percent}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-ink/70"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-ink/55">{special.caption}</p>
      </div>
    );
  }

  if (special.type === "polaroid") {
    return (
      <div className="mt-3">
        <PolaroidFrame
          caption={special.caption}
          gradient={special.gradient}
          photo={special.photo}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white/70 p-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-white">
        <PlayIcon className="size-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">
          {special.caption}
        </span>
        <span className="block text-[10px] text-ink/50">
          Voice memo from the circle
        </span>
      </span>
    </div>
  );
}

function NoteCard({
  note,
  canDelete,
  onDelete,
}: {
  note: Note;
  canDelete: boolean;
  onDelete: (id: number) => void;
}) {
  const meta = memberMeta[note.palette];
  const [reactions, setReactions] = useState<Reaction[]>(note.reactions);
  const [active, setActive] = useState<Record<string, boolean>>({});

  function toggle(emoji: string) {
    setReactions((prev) =>
      prev.map((reaction) =>
        reaction.emoji === emoji
          ? { ...reaction, count: reaction.count + (active[emoji] ? -1 : 1) }
          : reaction,
      ),
    );
    setActive((prev) => ({ ...prev, [emoji]: !prev[emoji] }));
  }

  return (
    <article
      className={`relative mb-4 break-inside-avoid rounded-2xl border p-4 pt-6 shadow-note sm:p-5 sm:pt-7 ${meta.card}`}
    >
      <ProfilePin member={note.palette} />

      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${meta.chip}`}
        >
          {note.tag}
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="text-[11px] font-medium text-ink/45">
            {note.time}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label={`Delete note: ${note.tag}`}
              title="Delete your note"
              className="grid size-6 place-items-center rounded-full text-ink/40 transition hover:bg-white/80 hover:text-blush-500"
            >
              <TrashIcon className="size-3.5" />
            </button>
          )}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink/85">{note.text}</p>

      {note.special && <SpecialBlock special={note.special} />}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/5 pt-3">
        <span className="flex items-center gap-2">
          <span
            className={`grid size-7 place-items-center rounded-full text-[11px] font-semibold text-white ${meta.solid}`}
          >
            {memberMeta[note.author].initial}
          </span>
          <span className="text-xs font-medium text-ink/70">
            {memberMeta[note.author].name}
          </span>
        </span>

        <span className="flex items-center gap-1.5">
          {reactions.map((reaction) => {
            const isActive = active[reaction.emoji];
            return (
              <button
                key={reaction.emoji}
                type="button"
                onClick={() => toggle(reaction.emoji)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition ${
                  isActive
                    ? "border-ink/20 bg-white text-ink"
                    : "border-black/5 bg-white/60 text-ink/60 hover:bg-white"
                }`}
              >
                {reaction.emoji}
                <span className="font-medium">{reaction.count}</span>
              </button>
            );
          })}
        </span>
      </div>
    </article>
  );
}

const filters: ("all" | MemberKey)[] = ["all", "aura", "dicky", "nadia"];

export default function InnerBoardPage() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [filter, setFilter] = useState<"all" | MemberKey>("all");
  const [query, setQuery] = useState("");
  const { session } = useSession();

  const [draft, setDraft] = useState("");
  const [author, setAuthor] = useState<MemberKey>(session?.member ?? "aura");
  const [color, setColor] = useState<MemberKey>(session?.member ?? "aura");
  const [tag, setTag] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [polaroidCaption, setPolaroidCaption] = useState("");
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeMeta = memberMeta[author];
  const viewer = session?.member ?? null;

  const visible = notes.filter((note) => {
    const matchesMember = filter === "all" || note.author === filter;
    const keyword = query.trim().toLowerCase();
    const matchesQuery =
      keyword === "" ||
      note.text.toLowerCase().includes(keyword) ||
      note.tag.toLowerCase().includes(keyword);
    return matchesMember && matchesQuery;
  });

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setPhoto(dataUrl);
      setExpanded(true);
    } catch {
      setPhoto(null);
    }
  }

  function removePhoto() {
    setPhoto(null);
    setPolaroidCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function resetForm() {
    setDraft("");
    setTag("");
    setPhoto(null);
    setPolaroidCaption("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function pinNote() {
    const text = draft.trim();
    if (!text && !photo) return;
    const cleanTag = tag.trim();
    const next: Note = {
      id: Date.now(),
      author,
      palette: color,
      tag: cleanTag || (photo ? "Polaroid" : "Spontaneous Thought"),
      time: "Just now",
      text: text || "Pinned a fresh polaroid for the circle.",
      special: photo
        ? {
            type: "polaroid",
            caption: polaroidCaption.trim() || cleanTag || "Pinned moment",
            photo,
          }
        : undefined,
      reactions: [{ emoji: "\ud83d\udc9b", count: 0 }],
    };
    setNotes((prev) => [next, ...prev]);
    resetForm();
    setExpanded(false);
  }

  function clearForm() {
    resetForm();
  }

  function deleteNote(id: number) {
    setNotes((prev) =>
      prev.filter(
        (note) => !(note.id === id && note.author === viewer),
      ),
    );
  }

  function chooseAuthor(next: MemberKey) {
    setAuthor(next);
    setColor(next);
  }

  return (
    <div className="space-y-6 pb-16">
      <section className="rounded-3xl border border-black/5 bg-gradient-to-br from-butter-100 via-sage-100 to-peri-100 p-5 shadow-soft sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                The Inner Board
              </h1>
              <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                v2.4 Live
              </span>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-ink/70">
              Our private digital bulletin board. Drop random thoughts, voice
              snippets, polaroids, hangout reminders, or midnight inside jokes.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-leaf-400/40 bg-leaf-400/10 px-4 py-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf-500 opacity-60" />
              <span className="relative inline-flex size-2.5 rounded-full bg-leaf-500" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink/50">
                Trio Connected
              </p>
              <p className="text-xs font-medium text-ink/80">
                Instant sync enabled
              </p>
            </div>
          </div>
        </div>
      </section>

      <Panel className="overflow-hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            Visible only to Aura, Dicky &amp; Nadia
          </p>
          {expanded && (
            <button
              type="button"
              onClick={() => {
                resetForm();
                setExpanded(false);
              }}
              className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-ink/45 transition hover:bg-canvas hover:text-ink"
            >
              <CloseIcon className="size-3.5" />
              Close
            </button>
          )}
        </div>

        {!expanded ? (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="group mt-3 flex w-full items-center gap-3 rounded-2xl border border-dashed border-black/10 bg-canvas/40 px-3.5 py-3 text-left transition hover:border-peri-300 hover:bg-white hover:shadow-soft"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${activeMeta.solid}`}
            >
              {activeMeta.initial}
            </span>
            <span className="min-w-0 flex-1 text-sm text-muted">
              What&apos;s on your mind, {activeMeta.name}? Post a note or drop a
              polaroid…
            </span>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-peri-500 px-3.5 py-2 text-xs font-semibold text-white transition group-hover:bg-peri-400">
              <PlusIcon className="size-3.5" />
              <span className="hidden sm:inline">New note</span>
            </span>
          </button>
        ) : (
          <div className="animate-fade-up mt-3">
            <div className="flex gap-3">
              <span
                className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white ${activeMeta.solid}`}
              >
                {activeMeta.initial}
              </span>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Post a note or scribble to the circle..."
                autoFocus
                className="min-h-24 w-full resize-none rounded-2xl border border-black/5 bg-canvas/50 p-4 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200"
              />
            </div>

            {photo && (
              <div className="mt-3 flex items-start gap-4 rounded-2xl border border-black/5 bg-canvas/40 p-3">
                <PolaroidFrame
                  caption={
                    polaroidCaption.trim() || tag.trim() || "Pinned moment"
                  }
                  photo={photo}
                  className="w-24 shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50">
                    Polaroid caption
                  </p>
                  <input
                    value={polaroidCaption}
                    onChange={(event) => setPolaroidCaption(event.target.value)}
                    placeholder="Kissaten · 8:15 AM"
                    className="w-full rounded-full border border-black/10 bg-white px-3.5 py-2 text-xs outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200"
                  />
                  <p className="text-[11px] text-muted">
                    Your photo is auto-wrapped in this polaroid frame.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted transition hover:bg-white hover:text-ink"
                >
                  <CloseIcon className="size-3.5" />
                  Remove
                </button>
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink/60">
                    Color:
                  </span>
                  {paletteOrder.map((member) => {
                    const meta = memberMeta[member];
                    const isActive = color === member;
                    return (
                      <button
                        key={member}
                        type="button"
                        aria-label={`Use ${meta.name} palette`}
                        onClick={() => setColor(member)}
                        className={`size-6 rounded-full transition ${meta.swatch} ${
                          isActive
                            ? "ring-2 ring-ink/60 ring-offset-2 ring-offset-white"
                            : "hover:scale-110"
                        }`}
                      />
                    );
                  })}
                </div>

                <label className="flex items-center gap-2 text-xs font-medium text-ink/60">
                  Posting as:
                  <select
                    value={author}
                    onChange={(event) =>
                      chooseAuthor(event.target.value as MemberKey)
                    }
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium text-ink outline-none focus:ring-2 focus:ring-peri-200"
                  >
                    <option value="dicky">Dicky</option>
                    <option value="aura">Aura</option>
                    <option value="nadia">Nadia</option>
                  </select>
                </label>

                <label className="flex w-full items-center gap-2 text-xs font-medium text-ink/60 sm:w-auto">
                  Tag:
                  <input
                    list="board-tags"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                    placeholder="Reminder, Inside Joke..."
                    className="min-w-0 w-full flex-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200 sm:w-44 sm:flex-none"
                  />
                  <datalist id="board-tags">
                    {tagSuggestions.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-2">
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
                  className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-canvas"
                >
                  <UploadIcon className="size-4" />
                  {photo ? "Replace photo" : "Upload photo"}
                </button>
                <button
                  type="button"
                  onClick={clearForm}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-ink/70 transition hover:bg-canvas"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={pinNote}
                  disabled={!draft.trim() && !photo}
                  className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/30"
                >
                  Pin to Board
                </button>
              </div>
            </div>
          </div>
        )}
      </Panel>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {filters.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                filter === option
                  ? "bg-ink text-white"
                  : "bg-canvas text-ink/60 hover:text-ink"
              }`}
            >
              {option === "all" ? "All" : memberMeta[option].name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="🔍 Search keywords..."
            className="min-w-0 w-full flex-1 rounded-full border border-black/10 bg-canvas/60 px-4 py-2 text-xs outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200 sm:w-56 sm:flex-none"
          />
          <span className="shrink-0 rounded-full bg-butter-200 px-3 py-1.5 text-[11px] font-semibold text-ink">
            📌 {visible.length} Notes Pinned
          </span>
        </div>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {visible.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            canDelete={viewer !== null && note.author === viewer}
            onDelete={deleteNote}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="rounded-2xl border border-dashed border-black/10 bg-canvas/50 p-8 text-center text-sm text-muted">
          No notes match this view yet.
        </p>
      )}
    </div>
  );
}
