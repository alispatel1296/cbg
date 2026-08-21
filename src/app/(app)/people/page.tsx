"use client";

import Link from "next/link";
import { Button, PageHeader, Panel } from "@/components/ui";
import { Photo } from "@/components/Photo";
import { useAuth } from "@/lib/auth";
import { useBook } from "@/lib/book-store";
import { findPerson, peopleForDirectory } from "@/lib/people";

export default function PeopleDirectoryPage() {
  const { user } = useAuth();
  const { staff } = useBook();
  const list = peopleForDirectory();
  const extra = staff.filter((s) => !findPerson(s.id));
  const canBrowse =
    user?.role === "plant_owner" ||
    user?.role === "hr_staff" ||
    user?.role === "super_admin" ||
    user?.role === "accountant" ||
    user?.role === "plant_operator";

  if (!canBrowse) {
    return (
      <div>
        <PageHeader
          title="People"
          description="You can only open your own card."
        />
        <Link href="/me">
          <Button variant="gold">My card</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        color="teal"
        title="People"
        description="Every person on this plant has a card. Open one — days, pay, and what that job must do."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <Link key={p.id} href={`/people/${p.id}`}>
            <Panel className="h-full hover:border-teal">
              <div className="flex gap-3">
                <Photo
                  src={p.photo}
                  alt={p.name}
                  className="size-12 shrink-0 rounded-full"
                />
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted">{p.jobTitle}</p>
                  <p className="text-xs text-muted">
                    {p.today === "present"
                      ? "In today"
                      : p.today === "late"
                        ? "Late"
                        : p.today === "absent"
                          ? "Absent"
                          : p.dept}
                  </p>
                </div>
              </div>
            </Panel>
          </Link>
        ))}
        {extra.map((s) => (
          <Link key={s.id} href={`/people/${s.id}`}>
            <Panel className="h-full hover:border-teal">
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-muted">{s.job} · new on the book</p>
            </Panel>
          </Link>
        ))}
      </div>
    </div>
  );
}
