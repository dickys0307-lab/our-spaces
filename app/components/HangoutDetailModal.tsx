"use client";

import { Modal } from "./Modal";
import { AvatarImage } from "./AvatarImage";
import { MEMBER_META } from "./memberStyles";
import { rsvpsFor, type Hangout, type RsvpStatus } from "./store";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
} from "./icons";

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

const WEEKDAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatFullDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  const weekday = new Date(year, month - 1, day).getDay();
  return `${WEEKDAYS_FULL[weekday]}, ${MONTHS[month - 1]} ${day}, ${year}`;
}

const RSVP_META: Record<
  RsvpStatus,
  { label: string; className: string; dot: string }
> = {
  going: {
    label: "Going",
    className: "bg-leaf-400/20 text-ink",
    dot: "bg-leaf-500",
  },
  maybe: {
    label: "Maybe",
    className: "bg-butter-200 text-ink",
    dot: "bg-butter-300",
  },
  invited: {
    label: "Invited",
    className: "bg-canvas text-muted",
    dot: "bg-black/20",
  },
};

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-black/5 bg-canvas/50 p-3">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-ink/70">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>
        <span className="mt-0.5 block text-sm font-medium leading-snug">
          {children}
        </span>
      </span>
    </div>
  );
}

export function HangoutDetailModal({
  hangout,
  onClose,
}: {
  hangout: Hangout | null;
  onClose: () => void;
}) {
  const open = hangout !== null;
  const meta = hangout ? MEMBER_META[hangout.member] : MEMBER_META.dicky;
  const rsvps = hangout ? rsvpsFor(hangout) : [];
  const going = rsvps.filter((rsvp) => rsvp.status === "going").length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={hangout?.title ?? ""}
      subtitle={hangout ? `Hosted by ${meta.name}` : undefined}
      size="lg"
    >
      {hangout && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${meta.chip}`}
            >
              {hangout.category}
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1 text-xs font-medium text-ink/70">
              <UsersIcon className="size-3.5" />
              {going} going
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoRow
              icon={<CalendarIcon className="size-4" />}
              label="Date & time"
            >
              {formatFullDate(hangout.date)}
              <span className="mt-0.5 flex items-center gap-1.5 text-muted">
                <ClockIcon className="size-3.5" />
                {hangout.time}
              </span>
            </InfoRow>

            <InfoRow icon={<MapPinIcon className="size-4" />} label="Location">
              {hangout.location}
            </InfoRow>
          </div>

          {hangout.description && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
                About this hangout
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/75">
                {hangout.description}
              </p>
            </div>
          )}

          <div
            className={`flex items-center gap-3 rounded-2xl border p-3 ${meta.cell}`}
          >
            <AvatarImage member={hangout.member} size={44} />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/50">
                Organizer
              </p>
              <p className="text-sm font-semibold">{meta.name}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/50">
              RSVP &amp; participants
            </p>
            <ul className="mt-2 space-y-2">
              {rsvps.map((rsvp) => {
                const member = MEMBER_META[rsvp.member];
                const status = RSVP_META[rsvp.status];
                return (
                  <li
                    key={rsvp.member}
                    className="flex items-center gap-3 rounded-2xl border border-black/5 bg-canvas/40 p-2.5"
                  >
                    <AvatarImage member={rsvp.member} size={36} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {member.name}
                      </span>
                      {rsvp.member === hangout.member && (
                        <span className="text-[11px] text-muted">Hosting</span>
                      )}
                    </span>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${status.className}`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${status.dot}`}
                      />
                      {status.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}
