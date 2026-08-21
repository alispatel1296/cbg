import { COPY } from "./i18n";
import { PHRASES, WORDS } from "./gu-phrases";
import { PAGE_PHRASES, PATTERNS } from "./easy-phrases";

const KEEP = new Set(
  [
    "Urja",
    "IOCL",
    "SATAT",
    "GST",
    "PCB",
    "CBG",
    "FOM",
    "UPI",
    "OTP",
    "PDF",
    "Excel",
    "PO",
    "GRN",
    "CCTV",
    "NOC",
    "LOI",
    "BEE",
    "CCTS",
    "CGD",
    "SHG",
    "CH₄",
    "CH4",
    "CO₂",
    "CO2",
    "H₂S",
    "H2S",
    "WhatsApp",
    "Google",
    "Meta",
    "Verra",
    "Nashik",
    "Sinnar",
    "Dindori",
    "Wavi",
    "Nandur",
    "Greenfield",
    "Maharashtra",
    "India",
    "English",
    "TPD",
    "QR",
    "GPS",
    "ID",
    "SKU",
    "INV",
    "AP",
    "D1",
    "D2",
    "D3",
    "OK",
    "GOBARdhan",
  ].map((s) => s.toLowerCase()),
);

let exact: Record<string, string> | null = null;

function fold(s: string) {
  return s
    .replace(/\u00a0/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function maps() {
  if (exact) return;
  exact = { ...PHRASES, ...PAGE_PHRASES };
  for (const key of Object.keys(COPY.en)) {
    const en = COPY.en[key];
    const gu = COPY.gu[key];
    if (en && gu && en !== gu) exact[fold(en)] = gu;
  }
  const lower: Record<string, string> = {};
  for (const [en, gu] of Object.entries(exact)) {
    lower[en.toLowerCase()] = gu;
  }
  for (const [en, gu] of Object.entries(lower)) {
    if (!exact[en]) exact[en] = gu;
  }
}

function keepToken(tok: string) {
  if (!tok) return true;
  if (KEEP.has(tok.toLowerCase())) return true;
  if (/^₹/.test(tok)) return true;
  if (/^[\d.,/%+-]+$/.test(tok)) return true;
  if (/@/.test(tok) || /^https?:/i.test(tok)) return true;
  if (/^[A-Z]{1,5}-?\d/.test(tok)) return true;
  if (/^MH[-\s]?\d/i.test(tok)) return true;
  if (/^E-\d/.test(tok)) return true;
  if (/^PO-|^INV-|^SKU-|^FOM-|^AP-|^URJA-/i.test(tok)) return true;
  return false;
}

function applyWords(s: string) {
  maps();
  return s.replace(/[A-Za-z][A-Za-z'’.-]*/g, (tok) => {
    if (keepToken(tok)) return tok;
    if (tok.length < 3) return tok;
    const hit = WORDS[tok] ?? WORDS[tok.toLowerCase()];
    if (hit) return hit;
    return tok;
  });
}

function applyPatterns(s: string) {
  for (const [re, templ] of PATTERNS) {
    const m = s.match(re);
    if (!m) continue;
    return templ.replace(/\$(\d+)/g, (_, i) => m[Number(i)] ?? "");
  }
  return null;
}

function wordCount(s: string) {
  return s.split(/\s+/).filter(Boolean).length;
}

/** Full-sentence Gujarati. Never stitches English and Gujarati in one line. */
export function toGujarati(raw: string): string {
  if (!raw || !/[A-Za-z]/.test(raw)) return raw;
  maps();
  const lead = raw.match(/^\s*/)?.[0] ?? "";
  const tail = raw.match(/\s*$/)?.[0] ?? "";
  const core = fold(raw);
  if (!core) return raw;

  const hit = exact![core] ?? exact![core.toLowerCase()];
  if (hit) return lead + hit + tail;

  const pat = applyPatterns(core);
  if (pat) return lead + pat + tail;

  if (wordCount(core) <= 5) {
    const next = applyWords(core);
    const mixed = /[A-Za-z]{3,}/.test(next) && /[\u0A80-\u0AFF]/.test(next);
    if (mixed) return lead + core + tail;
    return lead + next + tail;
  }

  return raw;
}

const SKIP_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "TEXTAREA",
  "NOSCRIPT",
  "CODE",
  "PRE",
  "KBD",
  "SVG",
  "PATH",
]);

export function translateDom(root: ParentNode) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest("script,style,textarea,noscript,code,pre,[data-no-gu]")) {
        return NodeFilter.FILTER_REJECT;
      }
      if (p.closest("input")) return NodeFilter.FILTER_REJECT;
      const t = node.textContent ?? "";
      if (!/[A-Za-z]/.test(t)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const n of nodes) {
    const next = toGujarati(n.textContent ?? "");
    if (next !== n.textContent) n.textContent = next;
  }

  root.querySelectorAll("[placeholder],[title],[aria-label],[alt]").forEach((el) => {
    if (el.closest("[data-no-gu]")) return;
    for (const attr of ["placeholder", "title", "aria-label", "alt"] as const) {
      const v = el.getAttribute(attr);
      if (!v || !/[A-Za-z]/.test(v)) continue;
      const next = toGujarati(v);
      if (next !== v) el.setAttribute(attr, next);
    }
  });
}
