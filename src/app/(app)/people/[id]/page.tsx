"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PersonDesk } from "@/components/person-desk";
import { Button, PageHeader } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useBook } from "@/lib/book-store";
import { canViewPerson, findPerson, personFromStaff } from "@/lib/people";

export default function PersonPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { staff } = useBook();

  const seeded = findPerson(id);
  const hired = staff.find((s) => s.id === id);
  const person = seeded ?? (hired ? personFromStaff(hired) : undefined);
  const self = Boolean(
    user &&
      person &&
      (person.userId === user.id || person.id === user.id),
  );

  if (!person) {
    return (
      <div>
        <PageHeader title="No card" description="This person is not on the book." />
        <Link href="/people">
          <Button variant="secondary">People</Button>
        </Link>
      </div>
    );
  }

  if (!canViewPerson(user?.role, person, self)) {
    return (
      <div>
        <PageHeader
          title="Not your card"
          description="You can only open your own card."
        />
        <Link href="/me">
          <Button variant="gold">My card</Button>
        </Link>
      </div>
    );
  }

  return <PersonDesk person={person} viewerRole={user?.role} self={self} />;
}
