"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Badge, Panel, SectionTitle } from "./ui";
import { useSession, type MemberKey } from "./session";
import {
  CameraIcon,
  CheckIcon,
  ClockIcon,
  HeartIcon,
  MapPinIcon,
  MoreIcon,
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
  peach: "bg-apricot-50",
  cream: "bg-white",
  amber: "bg-butter-50",
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
    text: "Your coding summaries made the audit painless. Genuinely impressive.",
    author: "Maya",
    tone: "peach",
  },
  {
    id: 2,
    text: "The clean data you handed over saved the whole dashboard launch.",
    author: "Leo",
    tone: "amber",
  },
  {
    id: 3,
    text: "Your system diagrams are unfairly pretty. Teach me your ways.",
    author: "Aura",
    tone: "cream",
  },
  {
    id: 4,
    text: "Quiet records, loud standard. Keep shaping, Nadia.",
    author: "Dicky",
    tone: "peach",
  },
];

const stats = [
  { label: "Circle Member", value: "Oct 2021" },
  { label: "Case Files", value: "340 Logged" },
  { label: "Sticky Notes", value: "28 Pinned" },
  { label: "Current Focus", value: "Data Quality" },
];

const about = [
  { label: "Primary Tools", value: "Epic · 3M Encoder · Excel" },
  { label: "Favorite Sanctuary", value: "The quiet records room at golden hour" },
  { label: "Circle Superpower", value: "Turning clinical chaos into clean data" },
  { label: "Current Obsession", value: "Health data standards & interoperability" },
];

const interests = [
  "Health Information Management",
  "Medical Coding (ICD-10)",
  "Clinical Documentation",
  "Health Data Analytics",
  "Electronic Health Records",
  "Medical Terminology",
  "Privacy & Compliance",
  "Healthcare Systems",
  "Biostatistics",
];

const activity = [
  {
    title: "Clinical Documentation Audit",
    meta: "Flagged 12 gaps, all closed",
    icon: <ClockIcon className="size-4" />,
    tone: "bg-apricot-200",
    time: "2d",
  },
  {
    title: "ICD-10 Coding Sprint",
    meta: "Cleared the coding backlog",
    icon: <SparkleIcon className="size-4" />,
    tone: "bg-butter-100",
    time: "1w",
  },
  {
    title: "EHR Migration Project",
    meta: "Mapped 40 legacy fields",
    icon: <TerminalIcon className="size-4" />,
    tone: "bg-apricot-100",
    time: "3w",
  },
];

const frames = [
  {
    title: "ICD-10 Audit Log",
    cat: "Coding",
    gradient: "from-apricot-200 to-apricot-300",
  },
  {
    title: "Discharge Summaries",
    cat: "Coding",
    gradient: "from-butter-200 to-apricot-300",
  },
  {
    title: "Readmission Trends",
    cat: "Analytics",
    gradient: "from-stone-400 to-stone-600",
  },
  {
    title: "EHR Migration Map",
    cat: "Analytics",
    gradient: "from-apricot-300 to-apricot-400",
  },
  {
    title: "Data Quality Pass",
    cat: "Coding",
    gradient: "from-stone-300 to-stone-500",
  },
  {
    title: "Registry Report",
    cat: "Analytics",
    gradient: "from-apricot-100 to-apricot-200",
  },
];

const filters = ["All Work", "Coding", "Analytics"] as const;

const audioClips = [
  "/audio/sample-15s.mp3",
  "/audio/sample-12s.mp3",
  "/audio/sample-9s.mp3",
  "/audio/sample-6s.mp3",
  "/audio/sample-3s.mp3",
];

const heavyRotation = [
  { title: "Snooze", artist: "SZA", dur: "3:21", tone: "from-apricot-200 to-apricot-300", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/b3/9b/ca/b39bca57-2627-1aec-77af-cbf551205394/mzaf_4430383240210492712.plus.aac.p.m4a" },
  { title: "Kill Bill", artist: "SZA", dur: "2:33", tone: "from-butter-200 to-butter-300", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/2b/ea/452bead6-c7f5-82d4-f5f7-ec876014b4cc/mzaf_2905911853279084717.plus.aac.p.m4a" },
  { title: "Good Days", artist: "SZA", dur: "4:39", tone: "from-apricot-300 to-apricot-400", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9b/32/fe/9b32fec3-fbfb-db0f-3dcf-bb089d412f23/mzaf_15200324731067771849.plus.aac.p.m4a" },
  { title: "Nobody Gets Me", artist: "SZA", dur: "3:00", tone: "from-apricot-100 to-apricot-200", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/97/6a/42/976a424b-72c9-cc0c-200f-8604c996b25b/mzaf_13218782517530680491.plus.aac.p.m4a" },
  { title: "Saturn", artist: "SZA", dur: "3:06", tone: "from-butter-100 to-butter-200", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/7c/28/b3/7c28b3ed-9aa9-6454-92c6-e46d20849bed/mzaf_518591709818271733.plus.aac.p.m4a" },
];

const waveform = Array.from({ length: 56 }, (_, i) =>
  Math.round(22 + Math.abs(Math.sin(i * 1.24)) * 58 + (i % 3) * 6),
);

function ProfileHeader() {
  return (
    <section className="overflow-hidden rounded-3xl border border-black/5 bg-white shadow-soft">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-butter-100 via-sage-100 to-apricot-200 sm:h-56">
        <div className="absolute -left-10 top-6 size-40 rounded-full bg-butter-200/50 blur-2xl" />
        <div className="absolute right-10 -top-6 size-44 rounded-full bg-apricot-200/60 blur-2xl" />
        <div className="absolute bottom-0 right-20 size-32 rounded-full bg-sage-200/50 blur-2xl" />
      </div>

      <div className="px-4 pb-6 sm:px-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative -mt-12 w-fit shrink-0 sm:-mt-14">
                <div className="relative grid size-24 place-items-center overflow-hidden rounded-full sm:size-28 border-4 border-apricot-400 bg-gradient-to-br from-apricot-300 to-apricot-500 ring-2 ring-white shadow-soft">
                  <img
                    src="/avatar/nadia.png"
                    alt="Nadia's avatar"
                    className="size-full object-cover object-center"
                  />
                </div>
                <span className="absolute bottom-1 right-1 grid size-7 place-items-center rounded-full border-4 border-white sm:size-8 bg-apricot-400 text-white">
                  <CheckIcon className="size-3.5" strokeWidth={2.4} />
                </span>
              </div>

              <div className="min-w-0 pb-1 sm:pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Nadia
                  </h1>
                  <span className="text-sm text-muted">@nadia</span>
                  <Badge tone="butter">
                    <SparkleIcon className="size-3" />
                    Inner Circle
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-ink/70">
                  Medical Records · Health Information Specialist
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                  <MapPinIcon className="size-3.5" />
                  Bandung · Clinical Archive · Health Data Lab
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-apricot-400 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition hover:bg-apricot-500 sm:flex-none sm:py-2"
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
                className="rounded-2xl border border-apricot-100 bg-apricot-50/70 p-3.5"
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
      { id: Date.now(), text, author: "You", tone: "peach" },
    ]);
    setDraft("");
    setWriting(false);
  }

  return (
    <section className="rounded-3xl border border-peri-200/70 bg-peri-100 p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-ink/80">
          <PinIcon className="size-4" />
          Sticky Notes
        </h2>
        <span className="flex items-center gap-2 text-xs text-ink/50">
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
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-apricot-400 text-white shadow-soft ring-4 ring-peri-100">
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
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-apricot-500">
              — {note.author}
            </p>
          </article>
        ))}

        {isOwner ? (
          <article className="relative flex h-60 w-44 shrink-0 snap-start flex-col rounded-2xl border-2 border-dashed border-apricot-300 bg-white/70 p-4 text-left shadow-note sm:h-64 sm:w-48">
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-apricot-400 text-white shadow-soft ring-4 ring-peri-100">
              <PinIcon className="size-3" strokeWidth={2} />
            </span>

            {writing ? (
              <div className="flex h-full flex-col gap-2 pt-2">
                <textarea
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write on your profile..."
                  className="min-h-0 flex-1 resize-none rounded-xl border border-apricot-200 bg-white p-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-apricot-300"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={addNote}
                    className="rounded-full bg-apricot-400 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-apricot-500"
                  >
                    Pin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setWriting(false);
                      setDraft("");
                    }}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-ink/50 transition hover:text-ink"
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
                <span className="grid size-9 place-items-center rounded-full bg-apricot-400 text-white shadow-soft transition hover:bg-apricot-500">
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
          <article className="relative flex h-60 w-44 shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/10 bg-white/40 p-4 text-center shadow-note sm:h-64 sm:w-48">
            <span className="absolute -top-2.5 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full bg-apricot-400/40 text-white shadow-soft ring-4 ring-peri-100">
              <PinIcon className="size-3" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-ink/50">Read-only</span>
            <span className="text-xs text-muted">
              Only Nadia can pin thoughts on this profile.
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
        About Nadia
      </SectionTitle>

      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
        Field Notes
      </p>
      <div className="mt-2 rounded-2xl border border-apricot-100 bg-apricot-50 p-4">
        <p className="text-lg font-medium italic leading-snug">
          &ldquo;Clean records, clear care — the data should never get in the way.&rdquo;
        </p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {about.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-apricot-100 bg-apricot-50/60 p-3.5"
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
          <span
            key={interest}
            className="rounded-full border border-apricot-200 bg-apricot-50 px-3 py-1 text-xs font-medium text-ink/75"
          >
            {interest}
          </span>
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
            className="text-xs font-medium text-apricot-500 transition hover:text-ink"
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
            className="flex items-center gap-3 rounded-2xl px-2 py-2.5 transition hover:bg-apricot-50"
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
            <span className="shrink-0 rounded-full bg-apricot-50 px-2.5 py-1 text-xs font-medium text-apricot-500">
              {item.time}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function CaseRecords() {
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
                    ? "bg-apricot-400 text-white"
                    : "bg-apricot-50 text-ink/60 hover:text-ink"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        }
      >
        Case Records
      </SectionTitle>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {visible.map((frame) => (
          <figure
            key={frame.title}
            className="group overflow-hidden rounded-2xl border border-apricot-100"
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
    <Panel className="bg-gradient-to-b from-apricot-100 to-white">
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
          <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-apricot-500">
            <span className="size-1.5 rounded-full bg-apricot-400" />
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
              ? "text-apricot-500"
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
              i / waveform.length <= progress ? "bg-apricot-500" : "bg-apricot-200"
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
          className="transition hover:text-apricot-500"
        >
          <ShuffleIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Previous"
          onClick={() => step(-1)}
          className="transition hover:text-apricot-500"
        >
          <SkipBackIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((value) => !value)}
          className="grid size-11 place-items-center rounded-full bg-apricot-400 text-white shadow-soft transition hover:bg-apricot-500"
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
          className="transition hover:text-apricot-500"
        >
          <SkipForwardIcon className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Repeat"
          aria-pressed={repeat}
          onClick={() => setRepeat((value) => !value)}
          className={`transition hover:text-apricot-500 ${
            repeat ? "text-apricot-500" : ""
          }`}
        >
          <RepeatIcon className="size-4" />
        </button>
      </div>

      <div className="mt-5 border-t border-apricot-100 pt-4">
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
                          className="w-0.5 rounded-full bg-apricot-500"
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
    <Panel className="border-none bg-cocoa-900 text-white/90">
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
          <span className="text-butter-300">$</span> current_branch:{" "}
          <span className="text-apricot-300">feature/ehr-migration</span>
        </p>
        <p className="text-white/45">
          {"// records · 340 coded · 0 errors"}
        </p>
        <p className="text-white/80">
          <span className="text-butter-300">$</span> focus_timer --start 25m
          <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-apricot-300 align-middle" />
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Files", value: "340" },
          { label: "Coded", value: "96%" },
          { label: "Streak", value: "7d" },
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

export default function NadiaPage() {
  return (
    <div className="space-y-6 pb-16">
      <ProfileHeader />
      <StickyNotes owner="nadia" />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <AboutPanel />
          <InterestsPanel />
          <ActivityPanel />
          <CaseRecords />
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <SpotifyAux />
          <WorkspaceFocus />
        </div>
      </div>
    </div>
  );
}
