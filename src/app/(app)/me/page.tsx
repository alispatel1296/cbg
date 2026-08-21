"use client";

import { PersonDesk } from "@/components/person-desk";
import { useAuth } from "@/lib/auth";
import { findPerson } from "@/lib/people";
import { PageHeader, Panel } from "@/components/ui";

export default function MePage() {
  const { user } = useAuth();
  const person = findPerson(user?.id);

  if (!person) {
    return (
      <div>
        <PageHeader title="My card" description="No card on this login yet." />
        <Panel>
          <p className="text-sm text-muted">
            {user?.name} is not on the people book. Ask HR to add you on Staff.
          </p>
        </Panel>
      </div>
    );
  }

  return (
    <PersonDesk person={person} viewerRole={user?.role} self />
  );
}
