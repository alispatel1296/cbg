/** Build a .ics the owner can open in Google Calendar. Demo has no Google login. */

export function downloadIcs(opts: {
  title: string;
  date: string;
  description?: string;
  filename?: string;
}) {
  const day = opts.date.replace(/-/g, "");
  const end = nextDay(opts.date).replace(/-/g, "");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const desc = (opts.description ?? "Urja plant diary").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Urja//Plant diary//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${day}-${slug(opts.title)}@urja.plant`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${day}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(desc)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = opts.filename ?? `urja-${opts.date}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function nextDay(iso: string) {
  const d = new Date(`${iso}T00:00:00+05:30`);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
}

function esc(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
