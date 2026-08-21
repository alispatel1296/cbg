export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const body = rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c);
          return s.includes(",") || s.includes('"')
            ? `"${s.replaceAll('"', '""')}"`
            : s;
        })
        .join(","),
    )
    .join("\n");
  const blob = new Blob(["\uFEFF" + body], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printPdf() {
  window.print();
}
