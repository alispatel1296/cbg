"use client";

import { useState } from "react";
import { DOC_VAULT } from "@/lib/tier1-data";
import { DOC_RENEWALS } from "@/lib/factory-ops";
import { PHOTOS } from "@/lib/extras";
import {
  Button,
  Decide,
  PageHeader,
  Panel,
  StatusPill,
} from "@/components/ui";
import { Photo } from "@/components/Photo";

type Extra = { id: string; title: string; type: string; date: string };

export default function DocsPage() {
  const [files, setFiles] = useState<Extra[]>([]);
  const [over, setOver] = useState(false);

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const next = Array.from(list).map((f, i) => ({
      id: `UP-${files.length + i + 1}`,
      title: f.name,
      type: f.type.includes("pdf") ? "PDF" : "Photo",
      date: new Date().toISOString().slice(0, 10),
    }));
    setFiles((p) => [...next, ...p]);
  };

  return (
    <div>
      <PageHeader
        color="teal"
        title="Paper cupboard"
        description="Drop GST, NOC, photos of trucks. So nothing lives only on WhatsApp."
      />
      <Decide
        cue="Renew first"
        analysis={`GST check is due in ${DOC_RENEWALS[2].daysLeft} days. A missing file here is how a truck photo stays only on WhatsApp.`}
        decision="Drop that paper now, or wait until the date is red."
      >
        <Button variant="gold">Add GST paper</Button>
        <Button variant="secondary">Remind me</Button>
      </Decide>
      <div className="mb-4 overflow-hidden rounded-xl">
        <Photo src={PHOTOS.paper} alt="Papers" className="h-36 w-full" />
      </div>
      <label
        className={`mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center ${
          over ? "border-teal bg-teal-soft" : "border-line bg-surface"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
      >
        <p className="font-semibold">Drop photo or PDF here</p>
        <p className="mt-1 text-sm text-muted">Or tap to pick from phone</p>
        <input
          type="file"
          className="hidden"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => add(e.target.files)}
        />
      </label>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        {DOC_RENEWALS.map((d) => (
          <Panel
            key={d.id}
            className={
              d.daysLeft <= 20 ? "border-l-4 border-l-amber" : "border-l-4 border-l-teal"
            }
          >
            <p className="text-sm font-bold text-muted">{d.daysLeft} days left</p>
            <p className="font-bold">{d.title}</p>
            <p className="text-sm text-muted">Renew by {d.renew}</p>
          </Panel>
        ))}
      </div>
      <Panel>
        <ul className="space-y-2">
          {[...files, ...DOC_VAULT].map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3"
            >
              <div>
                <p className="font-bold">{d.title}</p>
                <p className="text-sm text-muted">
                  {d.id} · {d.date}
                </p>
              </div>
              <StatusPill status="neutral" label={d.type} />
            </li>
          ))}
        </ul>
        <Button
          variant="secondary"
          className="mt-3"
          onClick={() => window.print()}
        >
          Print / save PDF
        </Button>
      </Panel>
    </div>
  );
}
