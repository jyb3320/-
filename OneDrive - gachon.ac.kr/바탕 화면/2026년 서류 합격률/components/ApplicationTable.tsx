"use client";

import { ArrowDownAZ, ArrowUpAZ, Plus, Trash2 } from "lucide-react";
import type { Application, ApplicationResult, SortDirection } from "@/lib/types";
import { ResultBadge } from "@/components/ResultBadge";

const resultOptions: ApplicationResult[] = ["합격", "불합격", "미정"];

interface ApplicationTableProps {
  applications: Application[];
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
  onAdd: () => void;
  onUpdate: (id: string, patch: Partial<Application>) => void;
  onDelete: (id: string) => void;
}

export function ApplicationTable({
  applications,
  sortDirection,
  onSortDirectionChange,
  onAdd,
  onUpdate,
  onDelete,
}: ApplicationTableProps) {
  return (
    <section className="rounded-lg border border-line bg-paper shadow-soft">
      <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink">지원 내역</h2>
          <p className="mt-1 text-sm text-gray-500">
            필터 적용 후 {applications.length.toLocaleString("ko-KR")}건
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="text-button"
            onClick={() =>
              onSortDirectionChange(sortDirection === "desc" ? "asc" : "desc")
            }
            type="button"
          >
            {sortDirection === "desc" ? (
              <ArrowDownAZ size={16} />
            ) : (
              <ArrowUpAZ size={16} />
            )}
            {sortDirection === "desc" ? "최신순" : "오래된순"}
          </button>
          <button className="text-button" onClick={onAdd} type="button">
            <Plus size={16} />행 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1040px] w-full table-fixed border-collapse text-sm">
          <colgroup>
            <col className="w-36" />
            <col className="w-48" />
            <col className="w-48" />
            <col className="w-64" />
            <col />
            <col className="w-16" />
          </colgroup>
          <thead className="bg-muted text-left text-xs font-semibold text-gray-500">
            <tr>
              <th className="border-b border-line px-3 py-3">지원일</th>
              <th className="border-b border-line px-3 py-3">회사명</th>
              <th className="border-b border-line px-3 py-3">직무</th>
              <th className="border-b border-line px-3 py-3">서류결과</th>
              <th className="border-b border-line px-3 py-3">메모</th>
              <th className="border-b border-line px-3 py-3 text-center">
                삭제
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((item) => (
              <tr className="group hover:bg-gray-50" key={item.id}>
                <td className="border-b border-line px-3 py-2">
                  <input
                    className="control w-full"
                    type="date"
                    value={item.date}
                    onChange={(event) =>
                      onUpdate(item.id, { date: event.target.value })
                    }
                  />
                </td>
                <td className="border-b border-line px-3 py-2">
                  <input
                    className="control w-full"
                    value={item.company}
                    onChange={(event) =>
                      onUpdate(item.id, { company: event.target.value })
                    }
                  />
                </td>
                <td className="border-b border-line px-3 py-2">
                  <input
                    className="control w-full"
                    value={item.role}
                    onChange={(event) =>
                      onUpdate(item.id, { role: event.target.value })
                    }
                  />
                </td>
                <td className="min-w-64 border-b border-line px-3 py-2">
                  <div className="flex min-w-[224px] items-center gap-3">
                    <select
                      className="control w-[148px] min-w-[148px] shrink-0 whitespace-nowrap pr-8"
                      value={item.result}
                      onChange={(event) =>
                        onUpdate(item.id, {
                          result: event.target.value as ApplicationResult,
                        })
                      }
                    >
                      {resultOptions.map((result) => (
                        <option key={result} value={result}>
                          {result}
                        </option>
                      ))}
                    </select>
                    <ResultBadge result={item.result} />
                  </div>
                </td>
                <td className="border-b border-line px-3 py-2">
                  <input
                    className="control w-full"
                    placeholder="면접 일정, 공고 링크 등"
                    value={item.memo}
                    onChange={(event) =>
                      onUpdate(item.id, { memo: event.target.value })
                    }
                  />
                </td>
                <td className="border-b border-line px-3 py-2 text-center">
                  <button
                    className="icon-button"
                    onClick={() => onDelete(item.id)}
                    title="행 삭제"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
