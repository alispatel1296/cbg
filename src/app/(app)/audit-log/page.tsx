"use client";

import { Button, Decide, PageHeader, Panel, SimpleGuide } from "@/components/ui";
import { ScrollText } from "lucide-react";
import { useBook } from "@/lib/book-store";

export default function AuditLogPage() {
  const { audit } = useBook();
  return (
    <div>
      <PageHeader
        color="teal"
        title="Who wrote what"
        description="Every hire, truck, job, buy, sale and pay — with the person who typed it."
      />
      <SimpleGuide
        icon={ScrollText}
        plain="If a number is on a screen, this list shows who put it there."
        like="Factory CCTV for data"
      />
      <Decide
        cue="Last change"
        analysis={
          audit[0]
            ? `${audit[0].who} put “${audit[0].action}” from ${audit[0].desk}.`
            : "No typed change yet. Seed rows still carry a stamp on each desk."
        }
        decision="Open the desk that wrote it if something looks wrong."
      >
        <Button variant="secondary">Looks fine</Button>
      </Decide>
      <Panel>
        <ul className="space-y-3">
          {audit.map((a) => (
            <li key={a.id} className="border-b border-line pb-3 last:border-0">
              <p className="font-mono text-xs text-muted">
                {a.id} · {a.desk}
              </p>
              <p className="font-bold">{a.action}</p>
              <p className="text-sm text-muted">
                {a.who} · {new Date(a.when).toLocaleString("en-IN")}
              </p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
