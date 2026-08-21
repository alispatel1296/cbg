"use client";

import { useState } from "react";
import { JOB_COMMENTS } from "@/lib/extras";
import {
  ActionCard,
  Button,
  Decide,
  Lane,
  PageHeader,
  Panel,
} from "@/components/ui";
import { useBook } from "@/lib/book-store";
import { DeskGate, EnteredBy, Field, FormCard, inputClass } from "@/components/book-ui";
import type { PlantJob } from "@/lib/book";
import { PLANT_TODAY } from "@/lib/plant-clock";

export default function WorkOrdersPage() {
  const { jobs, staff, addJob, setJobDone, can } = useBook();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    assigneeId: staff[0]?.id ?? "",
    due: "2026-08-22",
    priority: "medium" as PlantJob["priority"],
  });
  const today = PLANT_TODAY;
  const openJobs = jobs.filter((w) => w.status === "open");
  const late = openJobs.filter((w) => w.due < today);
  const high = openJobs.filter((w) => w.priority === "high");
  const week = openJobs.filter((w) => w.priority !== "high");
  const done = jobs.filter((w) => w.status === "done");

  return (
    <div>
      <PageHeader
        color="teal"
        title="Jobs"
        description="A job exists only when you pick a person from People."
        actions={
          <Button onClick={() => setOpen((v) => !v)}>New job</Button>
        }
      />

      {open ? (
        <DeskGate action="assign_job">
          <FormCard
            title="Assign a job — pick who from Staff"
            submit="Save job"
            onSubmit={() => {
              if (!can("assign_job") || !draft.title.trim()) return;
              addJob(draft);
              setOpen(false);
              setDraft({ ...draft, title: "" });
            }}
          >
            <Field label="What to do">
              <input
                required
                className={inputClass}
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
            </Field>
            <Field label="Give to">
              <select
                className={inputClass}
                value={draft.assigneeId}
                onChange={(e) =>
                  setDraft({ ...draft, assigneeId: e.target.value })
                }
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {s.job}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Due">
              <input
                type="date"
                className={inputClass}
                value={draft.due}
                onChange={(e) => setDraft({ ...draft, due: e.target.value })}
              />
            </Field>
            <Field label="Priority">
              <select
                className={inputClass}
                value={draft.priority}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    priority: e.target.value as PlantJob["priority"],
                  })
                }
              >
                <option value="high">Can stop the plant</option>
                <option value="medium">This week</option>
                <option value="low">When free</option>
              </select>
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      <Decide
        cue="Do this first"
        analysis={
          late[0]
            ? `${late[0].title} is late. ${late[0].assigneeName} still has it.`
            : high[0]
              ? `${high[0].title} can stop the plant. ${high[0].assigneeName} owns it.`
              : "No late jobs. Assign only if something new broke."
        }
        decision={
          late[0] || high[0]
            ? "Mark it done if finished, or give it to someone else."
            : "Floor is clear."
        }
      >
        {late[0] ? (
          <Button variant="gold" onClick={() => setJobDone(late[0].id)}>
            Mark done
          </Button>
        ) : high[0] ? (
          <Button variant="gold" onClick={() => setJobDone(high[0].id)}>
            Mark done
          </Button>
        ) : (
          <Button onClick={() => setOpen(true)}>New job</Button>
        )}
        <Button variant="secondary" onClick={() => setOpen(true)}>
          Give to someone else
        </Button>
      </Decide>

      <div className="mb-4 space-y-2">
        {late.map((wo) => (
          <ActionCard
            key={wo.id}
            tone="danger"
            cue="Late"
            title={wo.title}
            detail={`${wo.assigneeName} · due ${new Date(wo.due).toLocaleDateString("en-IN")} · ${wo.source}`}
            action={
              <Button variant="secondary" onClick={() => setJobDone(wo.id)}>
                Mark done
              </Button>
            }
          />
        ))}
        {high
          .filter((w) => w.due >= today)
          .map((wo) => (
            <ActionCard
              key={wo.id}
              tone="amber"
              cue="Can stop the plant"
              title={wo.title}
              detail={`${wo.assigneeName} · ${wo.source}`}
              action={
                <Button variant="secondary" onClick={() => setJobDone(wo.id)}>
                  Mark done
                </Button>
              }
            />
          ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Lane title="Stop the plant" count={high.length} empty="No plant-stop jobs">
          {high.map((wo) => (
            <JobCard key={wo.id} wo={wo} onDone={() => setJobDone(wo.id)} />
          ))}
        </Lane>
        <Lane title="This week" count={week.length} empty="Clear">
          {week.map((wo) => (
            <JobCard key={wo.id} wo={wo} onDone={() => setJobDone(wo.id)} />
          ))}
        </Lane>
        <Lane title="Done" count={done.length} empty="Nothing finished yet">
          {done.map((wo) => (
            <JobCard key={wo.id} wo={wo} />
          ))}
        </Lane>
      </div>

      <TalkBox />
    </div>
  );
}

function JobCard({
  wo,
  onDone,
}: {
  wo: PlantJob;
  onDone?: () => void;
}) {
  return (
    <div className="rounded-lg border border-line bg-raised p-3">
      <p className="font-medium">{wo.title}</p>
      <p className="text-sm text-muted">
        {wo.assigneeName} · due {wo.due}
      </p>
      <EnteredBy stamp={wo.stamp} />
      {onDone && wo.status === "open" ? (
        <Button variant="ghost" className="mt-2 h-9 min-w-0" onClick={onDone}>
          Mark done
        </Button>
      ) : null}
    </div>
  );
}

function TalkBox() {
  const [comments, setComments] = useState(JOB_COMMENTS);
  const [note, setNote] = useState("");
  const [html, setHtml] = useState(
    "<b>D2 mix:</b> cut napier. Recheck pH at 2pm.<br/><ul><li>Photo the probe</li><li>Do not add residue</li></ul>",
  );

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-2">
      <Panel>
        <p className="font-semibold">Talk on the job</p>
        <ul className="mt-3 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg bg-surface px-3 py-2">
              <p className="text-sm font-semibold">{c.who}</p>
              <p className="text-sm">{c.text}</p>
              <p className="text-xs text-muted">{c.at}</p>
            </li>
          ))}
        </ul>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!note.trim()) return;
            setComments((p) => [
              ...p,
              {
                id: `c${p.length + 1}`,
                who: "You",
                text: note.trim(),
                at: "Now",
              },
            ]);
            setNote("");
          }}
        >
          <input
            className="flex-1 rounded-lg border border-line px-3 py-2"
            placeholder="Write a remark…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <Button type="submit">Post</Button>
        </form>
      </Panel>
      <Panel>
        <p className="font-semibold">Shift note — bold / list</p>
        <div className="mt-2 flex gap-1">
          {(["bold", "italic", "insertUnorderedList"] as const).map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="rounded border border-line px-2 py-1 text-xs font-semibold"
              onClick={() => document.execCommand(cmd)}
            >
              {cmd === "bold" ? "B" : cmd === "italic" ? "I" : "List"}
            </button>
          ))}
        </div>
        <div
          className="mt-2 min-h-28 rounded-lg border border-line bg-surface px-3 py-2 text-sm"
          contentEditable
          suppressContentEditableWarning
          dangerouslySetInnerHTML={{ __html: html }}
          onBlur={(e) => setHtml(e.currentTarget.innerHTML)}
        />
      </Panel>
    </div>
  );
}
