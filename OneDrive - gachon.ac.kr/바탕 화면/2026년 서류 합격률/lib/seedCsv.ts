import type { Application, ApplicationResult } from "@/lib/types";

export function parseSeedCsv(text: string): Application[] {
  const [, ...rows] = text.trim().split(/\r?\n/);

  return rows.map((row, index) => {
    const [date, company, role, result, memo = ""] = row.split(",");
    return {
      id: `excel-${index + 1}`,
      date,
      company,
      role,
      result: normalizeSeedResult(result),
      memo,
    };
  });
}

function normalizeSeedResult(value: string): ApplicationResult {
  return value === "합격" || value === "불합격" ? value : "미정";
}
