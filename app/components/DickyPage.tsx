"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Badge, Panel, SectionTitle, Tag } from "./ui";
import { useSession, type MemberKey } from "./session";
import {
  CameraIcon,
  CheckIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  MoreIcon,
  MountainIcon,
  MusicIcon,
  PauseIcon,
  PenIcon,
  PinIcon,
  PlayIcon,
  PlusIcon,
  RepeatIcon,
  SendIcon,
  ShuffleIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SparkleIcon,
  TerminalIcon,
  TrashIcon,
} from "./icons";

const noteTones = {
  peri: "bg-peri-100",
  butter: "bg-butter-100",
  sage: "bg-sage-100",
} as const;

type NoteTone = keyof typeof noteTones;

type Note = {
  id: number;
  text: string;
  author: string;
  tone: NoteTone;
};

const initialNotes: Note[] = [
  {
    id: 1,
    text: "Your API docs read like poetry. Sofa review of the sync service later?",
    author: "Maya",
    tone: "peri",
  },
  {
    id: 2,
    text: "Shipped the design tokens you speced — buttons finally feel consistent.",
    author: "Leo",
    tone: "butter",
  },
  {
    id: 3,
    text: "The build pipeline you set up saved us hours. Legend behaviour.",
    author: "Nadia",
    tone: "sage",
  },
  {
    id: 4,
    text: "Quiet terminals, loud ideas. Keep architecting, Dicky.",
    author: "Aura",
    tone: "peri",
  },
];

const stats = [
  { label: "Circle Member", value: "Oct 2021" },
  { label: "Projects Shipped", value: "17 Builds" },
  { label: "Sticky Notes", value: "32 Pinned" },
  { label: "Current Stack", value: "Next.js · Go" },
];

const about = [
  { label: "Primary Gear", value: "MacBook Pro M4 · HHKB Keyboard" },
  { label: "Favorite Sanctuary", value: "A quiet room at 3 AM deploy time" },
  { label: "Circle Superpower", value: "Turning messy ideas into shipped systems" },
  { label: "Current Obsession", value: "Edge rendering & system design" },
];

const interests = [
  "System Architecture",
  "TypeScript",
  "Distributed Systems",
  "DevOps & CI/CD",
  "API Design",
  "Database Tuning",
  "Cloud Infrastructure",
  "Open Source",
  "UI Engineering",
];

const activity = [
  {
    title: "Shipped Scrapbook v3",
    meta: "Closed 14 pull requests",
    icon: <TerminalIcon className="size-4" />,
    tone: "bg-peri-100",
    time: "2d",
  },
  {
    title: "Auth Service Refactor",
    meta: "Cut p95 latency by 38%",
    icon: <SparkleIcon className="size-4" />,
    tone: "bg-butter-100",
    time: "1w",
  },
  {
    title: "Tech Guild Meetup",
    meta: "Gave a talk on rendering pipelines",
    icon: <MountainIcon className="size-4" />,
    tone: "bg-sage-100",
    time: "3w",
  },
];

const frames = [
  {
    title: "Edge Cache Rewrite",
    cat: "Deploys",
    gradient: "from-peri-200 to-peri-400",
  },
  {
    title: "Design Tokens v2",
    cat: "Prototypes",
    gradient: "from-butter-200 to-butter-300",
  },
  {
    title: "Realtime Board Sync",
    cat: "Prototypes",
    gradient: "from-sage-200 to-leaf-400",
  },
  {
    title: "CI Pipeline Overhaul",
    cat: "Deploys",
    gradient: "from-stone-400 to-stone-600",
  },
  {
    title: "Dark Mode System",
    cat: "Prototypes",
    gradient: "from-stone-300 to-stone-500",
  },
  {
    title: "Postgres Sharding",
    cat: "Deploys",
    gradient: "from-peri-300 to-peri-500",
  },
];

const filters = ["All Work", "Deploys", "Prototypes"] as const;

const audioClips = [
  "/audio/sample-15s.mp3",
  "/audio/sample-12s.mp3",
  "/audio/sample-9s.mp3",
  "/audio/sample-6s.mp3",
  "/audio/sample-3s.mp3",
];

const heavyRotation = [
  { title: "No Surprises", artist: "Radiohead", dur: "3:49", tone: "from-peri-200 to-peri-400", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f0/2a/fa/f02afaad-0a7f-9ceb-1236-55ef3d388061/mzaf_10063872040766906863.plus.aac.p.m4a" },
  { title: "Karma Police", artist: "Radiohead", dur: "4:21", tone: "from-stone-300 to-stone-500", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/46/21/35/46213520-da4a-1806-0c59-5ca6ad008b4e/mzaf_5277404092043261430.plus.aac.p.m4a" },
  { title: "Creep", artist: "Radiohead", dur: "3:58", tone: "from-sage-200 to-leaf-400", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1f/18/e2/1f18e22b-264e-88f8-ee89-c196fa9abd7a/mzaf_14184372154331980897.plus.aac.p.m4a" },
  { title: "Every Summertime", artist: "NIKI", dur: "3:36", tone: "from-butter-200 to-butter-300", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/03/d0/7d03d033-6695-f88e-c1ac-07570b266838/mzaf_17862565613249948966.plus.aac.p.m4a" },
  { title: "Lowkey", artist: "NIKI", dur: "3:24", tone: "from-peri-300 to-peri-500", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/67/86/b7/6786b7b3-9674-e619-5200-14d3268db2cf/mzaf_12067754837546733181.plus.aac.p.m4a" },
  { title: "High School in Jakarta", artist: "NIKI", dur: "4:10", tone: "from-butter-100 to-butter-200", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/ce/11/f3/ce11f396-9ebe-30fc-95ec-71bc3adce657/mzaf_18058958338436207223.plus.aac.p.m4a" },
];

const waveform = Array.from({ length: 56 }, (_, i) =>
  Math.round(22 + Math.abs(Math.sin(i * 1.24)) * 58 + (i % 3) * 6),
);

function ProfileHeader() {
  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-butter-100 via-sage-100 to-peri-100 sm:h-56">
        <div className="absolute -left-10 top-6 size-40 rounded-full bg-butter-200/50 blur-2xl" />
        <div className="absolute right-10 -top-6 size-44 rounded-full bg-peri-200/50 blur-2xl" />
        <div className="absolute bottom-0 right-20 size-32 rounded-full bg-sage-200/60 blur-2xl" />
      </div>

      <div className="px-4 pb-6 sm:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative -mt-12 w-fit shrink-0 sm:-mt-14">
                <div className="relative grid size-24 place-items-center overflow-hidden rounded-full sm:size-28 border-4 border-leaf-500 bg-gradient-to-br from-peri-300 to-peri-400 ring-2 ring-white shadow-soft">
                  <img
                    src="/avatar/dicky.png"
                    alt="Dicky's avatar"
                    className="size-full object-cover object-center"
                  />
                </div>
                <span className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full border-4 border-white sm:size-8 bg-leaf-500 text-white">
                  <CheckIcon className="size-3.5" strokeWidth={2.4} />
                </span>
              </div>

              <div className="min-w-0 pb-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Dicky
                  </h1>
                  <span className="text-sm text-muted">@dicky</span>
                  <Badge tone="butter">
                    <SparkleIcon className="size-3" />
                    Inner Circle
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  Information Technology · Systems Architect &amp; Co-Founder
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <MapPinIcon className="size-3.5" />
                  Bandung · Remote Lab · Code Atelier
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-peri-300 px-4 py-2.5 text-sm font-medium text-ink shadow-soft transition hover:bg-peri-400 sm:flex-none sm:py-2"
              >
                <PenIcon className="size-4" />
                Leave a Note
              </button>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-ink/85 sm:flex-none sm:py-2"
              >
                <SendIcon className="size-4" />
                Send Message
              </button>
              <button
                type="button"
                aria-label="Bookmark"
                className="grid size-10 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-ink/70 transition hover:bg-canvas sm:size-9"
              >
                <PinIcon className="size-4" />
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-black/5 bg-canvas/70 p-3.5"
              >
                <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  {stat.label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function StickyNotes({ owner }: { owner: MemberKey }) {
  const { session } = useSession();
  const isOwner = session?.member === owner;
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState("");

  function addNote() {
    const text = draft.trim();
    if (!text || !isOwner) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now(), text, author: "You", tone: "peri" },
    ]);
    setDraft("");
    setWriting(false);
  }

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/80">
          <PinIcon className="size-4" />
          Sticky Notes
        </h2>
        <span className="flex items-center gap-2 text-xs text-muted">
          <span>{notes.length} pinned thoughts</span>
          <span>· swipe →</span>
        </span>
      </div>

      <div className="-mx-3.5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-3.5 pb-3 pt-6 no-scrollbar touch-scroll sm:mx-0 sm:gap-4 sm:px-1">
        {notes.map((note) => (
          <article
            key={note.id}
            className={`relative flex h-60 w-44 shrink-0 snap-start flex-col rounded-2xl p-4 pt-6 shadow-note sm:h-64 sm:w-48 ${noteTones[note.tone]}`}
          >
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-ink text-white shadow-soft ring-4 ring-canvas">
              <PinIcon className="size-3" strokeWidth={2} />
            </span>
            {isOwner ? (
              <button
                type="button"
                aria-label={`Delete note from ${note.author}`}
                onClick={() =>
                  setNotes((prev) =>
                    prev.filter((item) => item.id !== note.id),
                  )
                }
                className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-white/80 text-ink/50 shadow-soft transition hover:bg-white hover:text-red-500"
              >
                <TrashIcon className="size-3.5" />
              </button>
            ) : null}
            <p className="flex-1 overflow-y-auto pr-1 text-sm leading-relaxed text-ink/85">
              {note.text}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
              — {note.author}
            </p>
          </article>
        ))}

        {isOwner ? (
          <article className="relative flex h-60 w-44 shrink-0 snap-start flex-col rounded-2xl border-2 border-dashed border-peri-300 bg-peri-50/60 p-4 text-left shadow-note sm:h-64 sm:w-48">
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-peri-300 text-white shadow-soft ring-4 ring-canvas">
              <PinIcon className="size-3" strokeWidth={2} />
            </span>

            {writing ? (
              <div className="flex h-full flex-col gap-2 pt-2">
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write on your profile..."
                  className="min-h-0 flex-1 resize-none rounded-xl border border-peri-200 bg-white/80 p-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-300"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addNote}
                    className="rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white transition hover:bg-ink/85"
                  >
                    Pin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWriting(false);
                      setDraft("");
                    }}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setWriting(true)}
                className="flex h-full flex-1 flex-col items-start justify-center gap-2 text-left"
              >
                <span className="grid size-9 place-items-center rounded-full bg-peri-300 text-white shadow-soft transition hover:bg-peri-400">
                  <PlusIcon className="size-4" />
                </span>
                <span className="text-sm font-medium text-ink/80">
                  Pin a thought...
                </span>
                <span className="text-xs text-muted">
                  Tap to write on your profile
                </span>
              </button>
            )}
          </article>
        ) : (
          <article className="relative flex h-60 w-44 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/10 bg-canvas/40 p-4 text-center shadow-note sm:h-64 sm:w-48">
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-ink/30 text-white shadow-soft ring-4 ring-canvas">
              <PinIcon className="size-3" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-ink/50">Read-only</span>
            <span className="text-xs text-muted">
              Only Dicky can pin thoughts on this profile.
            </span>
          </article>
        )}
      </div>
    </section>
  );
}

function AboutPanel() {
  return (
    <Panel>
      <SectionTitle icon={<PenIcon className="size-4" />}>
        About Dicky
      </SectionTitle>

      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        Field Notes
      </p>
      <p className="mt-2 text-lg font-medium italic leading-snug">
        &ldquo;Good architecture is quiet — it just keeps working.&rdquo;
      </p>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {about.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-black/5 bg-canvas/70 p-3.5"
          >
            <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              {item.label}
            </dt>
            <dd className="mt-1 text-sm font-medium">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function InterestsPanel() {
  return (
    <Panel>
      <SectionTitle icon={<SparkleIcon className="size-4" />}>
        Interests &amp; Disciplines
      </SectionTitle>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <Tag key={interest}>{interest}</Tag>
        ))}
      </div>
    </Panel>
  );
}

function ActivityPanel() {
  return (
    <Panel>
      <SectionTitle
        icon={<ClockIcon className="size-4" />}
        action={
          <button
            type="button"
            className="text-xs font-medium text-muted transition hover:text-ink"
          >
            Recent Contributions
          </button>
        }
      >
        Circle Activity
      </SectionTitle>

      <ul className="space-y-1">
        {activity.map((item) => (
          <li
            key={item.title}
            className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-canvas/70"
          >
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-full ${item.tone}`}
            >
              {item.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {item.title}
              </span>
              <span className="block truncate text-xs text-muted">
                {item.meta}
              </span>
            </span>
            <span className="shrink-0 rounded-full bg-canvas px-2.5 py-1 text-xs font-medium text-muted">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ProjectLog() {
  const [active, setActive] = useState<(typeof filters)[number]>("All Work");
  const visible =
    active === "All Work"
      ? frames
      : frames.filter((frame) => frame.cat === active);

  return (
    <Panel>
      <SectionTitle
        icon={<CameraIcon className="size-4" />}
        action={
          <div className="flex flex-wrap gap-1.5">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active === filter
                    ? "bg-ink text-white"
                    : "bg-canvas text-muted hover:text-ink"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        }
      >
        Project Log
      </SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((frame) => (
          <figure
            key={frame.title}
            className="group overflow-hidden rounded-2xl border border-black/5"
          >
            <div
              className={`relative aspect-4/3 bg-gradient-to-br ${frame.gradient}`}
            >
              <span className="absolute left-2 top-2 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-medium text-ink backdrop-blur">
                {frame.cat}
              </span>
            </div>
            <figcaption className="bg-white px-3 py-2 text-xs font-medium text-ink/75">
              {frame.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </Panel>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function SpotifyAux() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [src, setSrc] = useState(heavyRotation[0].src);
  const track = heavyRotation[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, index, src]);

  function select(next: number) {
    setIndex(next);
    setSrc(heavyRotation[next].src);
    setPlaying(true);
    setProgress(0);
    setCurrent(0);
    setDuration(0);
  }

  function handleError() {
    const audio = audioRef.current;
    if (!audio || audio.src.includes("/audio/sample-")) return;
    setSrc(audioClips[Math.floor(Math.random() * audioClips.length)]);
  }

  function step(direction: number) {
    select((index + direction + heavyRotation.length) % heavyRotation.length);
  }

  function seekTo(ratio: number) {
    const audio = audioRef.current;
    const value = Math.min(1, Math.max(0, ratio));
    if (!audio || !audio.duration) return;
    audio.currentTime = value * audio.duration;
    setProgress(value);
    setCurrent(audio.currentTime);
  }

  function seekFromEvent(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0) return;
    seekTo((event.clientX - rect.left) / rect.width);
  }

  function handleEnded() {
    if (repeat) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => setPlaying(false));
      }
      return;
    }
    step(1);
  }

  return (
    <Panel className="bg-gradient-to-b from-peri-50 to-white">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={handleError}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget;
          setCurrent(audio.currentTime);
          setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
        }}
        onEnded={handleEnded}
      />

      <SectionTitle
        icon={<MusicIcon className="size-4" />}
        action={
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-leaf-500">
            <span className="size-1.5 rounded-full bg-leaf-500" />
            Spotify Aux
          </span>
        }
      >
        Now Playing
      </SectionTitle>

      <div className="flex items-center gap-3">
        <div
          className={`grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${track.tone} text-white shadow-soft`}
        >
          <MusicIcon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{track.title}</p>
          <p className="truncate text-xs text-muted">{track.artist}</p>
        </div>
        <button
          type="button"
          aria-label="Favourite"
          aria-pressed={Boolean(liked[track.title])}
          onClick={() =>
            setLiked((prev) => ({
              ...prev,
              [track.title]: !prev[track.title],
            }))
          }
          className={`transition ${
            liked[track.title]
              ? "text-peri-500"
              : "text-ink/40 hover:text-ink"
          }`}
        >
          <HeartIcon
            className="size-4"
            fill={liked[track.title] ? "currentColor" : "none"}
          />
        </button>
        <button
          type="button"
          aria-label="More"
          className="text-ink/40 transition hover:text-ink"
        >
          <MoreIcon className="size-4" />
        </button>
      </div>

      <button
        type="button"
        aria-label="Seek through track"
        onClick={seekFromEvent}
        className="mt-5 flex h-12 w-full items-end gap-[3px]"
      >
        {waveform.map((height, i) => (
          <span
            key={i}
            className={`flex-1 rounded-full ${
              i / waveform.length <= progress ? "bg-ink/80" : "bg-peri-200"
            }`}
            style={{
              height: `${height}%`,
              transformOrigin: "bottom",
              animation: playing
                ? `wave ${0.9 + (i % 5) * 0.12}s ease-in-out infinite`
                : undefined,
            }}
          />
        ))}
      </button>
      <div className="mt-1.5 flex justify-between text-[11px] font-medium text-muted">
        <span>{formatTime(current)}</span>
        <span>{duration ? formatTime(duration) : track.dur}</span>
      </div>

      <div className="mt-4 flex items-center justify-center gap-5 text-ink/70">
        <button
          type="button"
          aria-label="Shuffle"
          onClick={() => select(Math.floor(Math.random() * heavyRotation.length))}
          className="transition hover:text-ink"
        >
          <ShuffleIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="transition hover:text-ink"
        >
          <SkipBackIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((value) => !value)}
          className="grid size-11 place-items-center rounded-full bg-ink text-white shadow-soft transition hover:bg-ink/85"
        >
          {playing ? (
            <PauseIcon className="size-4" />
          ) : (
            <PlayIcon className="size-4" />
          )}
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => step(1)}
          className="transition hover:text-ink"
        >
          <SkipForwardIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Repeat"
          aria-pressed={repeat}
          onClick={() => setRepeat((value) => !value)}
          className={`transition hover:text-ink ${
            repeat ? "text-leaf-500" : ""
          }`}
        >
          <RepeatIcon className="size-4" />
        </button>
      </div>

      <div className="mt-5 border-t border-black/5 pt-4">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          Heavy Rotation
        </p>
        <ul className="space-y-1">
          {heavyRotation.map((item, i) => {
            const isActive = i === index;
            return (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-1.5 py-1.5 text-left transition ${
                    isActive ? "bg-white shadow-soft" : "hover:bg-white/70"
                  }`}
                >
                  <span
                    className={`size-8 shrink-0 rounded-lg bg-gradient-to-br ${item.tone}`}
                  />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm ${
                        isActive ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {item.artist}
                    </span>
                  </span>
                  {isActive && playing ? (
                    <span className="flex h-3 shrink-0 items-end gap-0.5">
                      {[70, 100, 50].map((height, bar) => (
                        <span
                          key={bar}
                          className="w-0.5 rounded-full bg-peri-500"
                          style={{
                            height: `${height}%`,
                            transformOrigin: "bottom",
                            animation: `wave ${0.8 + bar * 0.2}s ease-in-out infinite`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-muted">
                      {item.dur}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Panel>
  );
}

function WorkspaceFocus() {
  return (
    <Panel className="border-none bg-ink text-white/90">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
          <span className="grid size-7 place-items-center rounded-full bg-white/10">
            <TerminalIcon className="size-4" />
          </span>
          Workspace Focus
        </h2>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/70">
          deep work
        </span>
      </div>

      <div className="space-y-1.5 rounded-2xl bg-black/40 p-4 font-mono text-xs leading-relaxed">
        <p className="text-white/80">
          <span className="text-leaf-400">$</span> current_branch:{" "}
          <span className="text-peri-300">feature/edge-renderer</span>
        </p>
        <p className="text-white/45">
          {"// vitest · 128 passed · 0 failed"}
        </p>
        <p className="text-white/80">
          <span className="text-leaf-400">$</span> focus_timer --start 50m
          <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-peri-300 align-middle" />
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Builds", value: "17" },
          { label: "PRs", value: "214" },
          { label: "Streak", value: "23d" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white/5 p-2.5">
            <p className="text-sm font-semibold text-white">{item.value}</p>
            <p className="text-[11px] uppercase tracking-[0.1em] text-white/50">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default function DickyPage() {
  return (
    <div className="space-y-6 pb-16">
      <ProfileHeader />
      <StickyNotes owner="dicky" />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <AboutPanel />
          <InterestsPanel />
          <ActivityPanel />
          <ProjectLog />
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <SpotifyAux />
          <WorkspaceFocus />
        </div>
      </div>
    </div>
  );
}
