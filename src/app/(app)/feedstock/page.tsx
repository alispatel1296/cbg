"use client";

import Link from "next/link";
import { useState } from "react";
import { SUPPLIER_LEDGER } from "@/lib/data";
import { Button, PageHeader } from "@/components/ui";
import { TruckLiveBoard } from "@/components/ops";
import { useBook } from "@/lib/book-store";
import { DeskGate, Field, FormCard, inputClass, LineNotice } from "@/components/book-ui";
import { useAuth } from "@/lib/auth";
import { WATCH } from "@/lib/plant-flow";

export default function FeedstockPage() {
  const pending = SUPPLIER_LEDGER.reduce((s, x) => s + x.pendingInr, 0);
  const { staff, addTruck, can } = useBook();
  const { user } = useAuth();
  const drivers = staff.filter((s) => s.kind === "driver");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    plate: "MH 15 ",
    load: "Cattle dung",
    qty: "8 t",
    village: "Wavi village pit",
    farmer: "Ramesh Kolekar",
    driverId: drivers[0]?.id ?? "",
  });

  const storeLike = ["store_staff", "plant_operator", "plant_owner", "super_admin"].includes(
    user?.role ?? "",
  );

  return (
    <div>
      <PageHeader
        color="teal"
        title="Trucks"
        description="How far this trip has gone. Then pay farmer, pay driver, or hold."
        actions={
          <div className="flex w-full gap-2 sm:w-auto">
            <Link href="/yield" className="min-w-0 flex-1 sm:flex-none">
              <Button variant="secondary" className="w-full">
                Best mix
              </Button>
            </Link>
            {storeLike ? (
              <Button className="flex-1 sm:flex-none" onClick={() => setOpen((v) => !v)}>
                Log new truck
              </Button>
            ) : null}
          </div>
        }
      />

      <LineNotice watch={WATCH.trucks} />

      {open ? (
        <DeskGate action="log_truck">
          <FormCard
            title="Log truck — pick a driver from Staff"
            submit="Save truck"
            onSubmit={() => {
              if (!can("log_truck")) return;
              const id = addTruck(form);
              if (id) setOpen(false);
            }}
          >
            <Field label="Number plate">
              <input
                required
                className={inputClass}
                value={form.plate}
                onChange={(e) => setForm({ ...form, plate: e.target.value })}
              />
            </Field>
            <Field label="Load">
              <input
                required
                className={inputClass}
                value={form.load}
                onChange={(e) => setForm({ ...form, load: e.target.value })}
              />
            </Field>
            <Field label="Weight">
              <input
                required
                className={inputClass}
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
              />
            </Field>
            <Field label="Village / pit">
              <input
                required
                className={inputClass}
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
              />
            </Field>
            <Field label="Farmer">
              <input
                required
                className={inputClass}
                value={form.farmer}
                onChange={(e) => setForm({ ...form, farmer: e.target.value })}
              />
            </Field>
            <Field label="Driver (from Staff)">
              <select
                required
                className={inputClass}
                value={form.driverId}
                onChange={(e) => setForm({ ...form, driverId: e.target.value })}
              >
                {drivers.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.id}
                  </option>
                ))}
              </select>
            </Field>
          </FormCard>
        </DeskGate>
      ) : null}

      <TruckLiveBoard pendingInr={pending} />
    </div>
  );
}
