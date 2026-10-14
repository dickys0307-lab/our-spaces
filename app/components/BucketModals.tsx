"use client";

import { useState } from "react";
import { Modal } from "./Modal";
import { useAppData } from "./store";
import { CheckIcon, PlusIcon } from "./icons";

const fieldClass =
  "w-full rounded-xl border border-black/10 bg-canvas/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:ring-2 focus:ring-peri-200";

const STATUS_LABEL: Record<"done" | "progress" | "idea", string> = {
  done: "Already done",
  progress: "In progress",
  idea: "Just an idea",
};

function GoalForm({ onDone }: { onDone: () => void }) {
  const { addBucketItem } = useAppData();
  const [label, setLabel] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"done" | "progress" | "idea">("idea");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const clean = label.trim();
    if (!clean) return;
    addBucketItem({
      label: clean,
      note: note.trim() || STATUS_LABEL[status],
      status,
    });
    onDone();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Goal / target
        </span>
        <input
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="e.g. Northern lights trip in Tromsø"
          autoFocus
          className={fieldClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Note (optional)
        </span>
        <input
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Any detail or deadline..."
          className={fieldClass}
        />
      </label>

      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-ink/60">
          Status
        </span>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(STATUS_LABEL) as (keyof typeof STATUS_LABEL)[]).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                  status === option
                    ? "border-ink/15 bg-ink text-white"
                    : "border-black/10 bg-white text-ink/60 hover:bg-canvas"
                }`}
              >
                {STATUS_LABEL[option]}
              </button>
            ),
          )}
        </div>
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
          className="flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-ink/85"
        >
          <PlusIcon className="size-4" />
          Add to list
        </button>
      </div>
    </form>
  );
}

export function AddGoalModal({
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
      title="Add a bucket list goal"
      subtitle="Logged to the shared Circle Bucket List."
    >
      {open && <GoalForm onDone={onClose} />}
    </Modal>
  );
}

export function ManageBucketModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { bucket, toggleBucketItem } = useAppData();
  const doneCount = bucket.filter((item) => item.done).length;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Manage Bucket List"
      subtitle={`${doneCount} of ${bucket.length} goals checked off · scroll to explore`}
    >
      <ul className="space-y-2.5">
        {bucket.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-black/5 bg-canvas/50 p-3.5 transition hover:bg-canvas"
          >
            <button
              type="button"
              onClick={() => toggleBucketItem(item.id)}
              aria-pressed={item.done}
              aria-label={`Toggle ${item.label}`}
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
                <div className="mt-2">
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
                  <p className="mt-1 text-[11px] font-medium text-ink/55">
                    {item.progress.value} / {item.progress.total}
                  </p>
                </div>
              )}
            </div>

            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${
                item.done
                  ? "bg-leaf-400/30 text-ink"
                  : item.status === "progress"
                    ? "bg-butter-200 text-ink"
                    : "bg-canvas text-ink/55"
              }`}
            >
              {item.done ? "Done" : STATUS_LABEL[item.status]}
            </span>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
