import { RotateCcw } from "lucide-react";
import type { ApplicationFilters, ApplicationResult } from "@/lib/types";

const resultOptions: Array<"전체" | ApplicationResult> = [
  "전체",
  "합격",
  "불합격",
  "미정",
];

interface FiltersPanelProps {
  filters: ApplicationFilters;
  roles: string[];
  onChange: (filters: ApplicationFilters) => void;
  onReset: () => void;
}

export function FiltersPanel({
  filters,
  roles,
  onChange,
  onReset,
}: FiltersPanelProps) {
  return (
    <section className="rounded-lg border border-line bg-paper p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-ink">필터</h2>
        <button
          className="icon-button"
          onClick={onReset}
          title="필터 초기화"
          type="button"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-1 text-xs font-medium text-gray-500">
          시작일
          <input
            className="control"
            type="date"
            value={filters.startDate}
            onChange={(event) =>
              onChange({ ...filters, startDate: event.target.value })
            }
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-500">
          종료일
          <input
            className="control"
            type="date"
            value={filters.endDate}
            onChange={(event) =>
              onChange({ ...filters, endDate: event.target.value })
            }
          />
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-500">
          직무
          <select
            className="control"
            value={filters.role}
            onChange={(event) =>
              onChange({ ...filters, role: event.target.value })
            }
          >
            <option value="전체">전체</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-500">
          서류결과
          <select
            className="control"
            value={filters.result}
            onChange={(event) =>
              onChange({
                ...filters,
                result: event.target.value as ApplicationFilters["result"],
              })
            }
          >
            {resultOptions.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-medium text-gray-500">
          회사명
          <input
            className="control"
            placeholder="회사명 검색"
            value={filters.company}
            onChange={(event) =>
              onChange({ ...filters, company: event.target.value })
            }
          />
        </label>
      </div>
    </section>
  );
}
