import type { ApplicationResult } from "@/lib/types";

const styles: Record<ApplicationResult, string> = {
  합격: "border-emerald-200 bg-emerald-50 text-emerald-700",
  불합격: "border-rose-200 bg-rose-50 text-rose-700",
  미정: "border-amber-200 bg-amber-50 text-amber-700",
};

export function ResultBadge({ result }: { result: ApplicationResult }) {
  return (
    <span
      className={`inline-flex min-w-[54px] items-center justify-center rounded-full border px-2 py-1 text-xs font-semibold ${styles[result]}`}
    >
      {result}
    </span>
  );
}
