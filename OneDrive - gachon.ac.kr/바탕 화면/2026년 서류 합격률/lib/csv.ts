import type { Application, ApplicationResult } from "@/lib/types";

const headers = ["지원일", "회사명", "직무", "서류결과", "메모"];

export function normalizeResult(value: string): ApplicationResult {
  const trimmed = value.trim();
  if (trimmed === "합격" || trimmed === "불합격") return trimmed;
  return "미정";
}

export function parseCsv(text: string): Application[] {
  const rows = parseCsvRows(text).filter((row) =>
    row.some((cell) => cell.trim() !== ""),
  );
  if (rows.length === 0) return [];

  const [first, ...rest] = rows;
  const hasHeader = headers.some((header) => first.includes(header));
  const dataRows = hasHeader ? rest : rows;

  return dataRows.map((row, index) => ({
    id: crypto.randomUUID(),
    date: normalizeDate(row[0] ?? ""),
    company: (row[1] ?? "").trim(),
    role: (row[2] ?? "").trim(),
    result: normalizeResult(row[3] ?? ""),
    memo: (row[4] ?? "").trim(),
  }));
}

export function applicationsToCsv(applications: Application[]) {
  const rows = [
    headers,
    ...applications.map((item) => [
      item.date,
      item.company,
      item.role,
      item.result,
      item.memo,
    ]),
  ];

  return rows.map((row) => row.map(escapeCsvCell).join(",")).join("\r\n");
}

function parseCsvRows(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell);
  rows.push(row);
  return rows;
}

function escapeCsvCell(value: string) {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function normalizeDate(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed.slice(0, 10);
  return parsed.toISOString().slice(0, 10);
}
