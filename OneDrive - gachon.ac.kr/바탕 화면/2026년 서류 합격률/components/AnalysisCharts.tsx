"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyStats, RoleStats } from "@/lib/types";

interface AnalysisChartsProps {
  monthlyStats: MonthlyStats[];
  roleStats: RoleStats[];
}

export function AnalysisCharts({
  monthlyStats,
  roleStats,
}: AnalysisChartsProps) {
  const topRoles = roleStats.slice(0, 10);

  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <div className="rounded-lg border border-line bg-paper p-4 shadow-soft">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-ink">월별 분석</h2>
          <p className="mt-1 text-sm text-gray-500">
            미정은 합격률 계산에서 제외됩니다.
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={monthlyStats}>
              <CartesianGrid stroke="#eeeeec" vertical={false} />
              <XAxis dataKey="label" tickLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value, name) => [
                  name === "passRate"
                    ? `${Number(value).toFixed(1)}%`
                    : `${value}건`,
                  name === "passRate" ? "합격률" : name,
                ]}
              />
              <Bar
                dataKey="passRate"
                fill="#10b981"
                name="합격률"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[560px] w-full text-sm">
            <thead className="bg-muted text-left text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2">월</th>
                <th className="px-3 py-2 text-right">지원</th>
                <th className="px-3 py-2 text-right">합격</th>
                <th className="px-3 py-2 text-right">합격률</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((item) => (
                <tr className="border-b border-line" key={item.month}>
                  <td className="px-3 py-2">{item.label}</td>
                  <td className="px-3 py-2 text-right">{item.total}건</td>
                  <td className="px-3 py-2 text-right">{item.accepted}건</td>
                  <td className="px-3 py-2 text-right">
                    {item.passRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-paper p-4 shadow-soft">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-ink">직무별 분석</h2>
          <p className="mt-1 text-sm text-gray-500">
            지원 건수가 많은 직무 순으로 정렬됩니다.
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer height="100%" width="100%">
            <BarChart data={topRoles} layout="vertical" margin={{ left: 42 }}>
              <CartesianGrid stroke="#eeeeec" horizontal={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="role"
                tickLine={false}
                type="category"
                width={94}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "passRate"
                    ? `${Number(value).toFixed(1)}%`
                    : `${value}건`,
                  name === "total" ? "지원 건수" : "합격률",
                ]}
              />
              <Bar
                dataKey="total"
                fill="#6b7280"
                name="지원 건수"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[560px] w-full text-sm">
            <thead className="bg-muted text-left text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2">직무</th>
                <th className="px-3 py-2 text-right">지원</th>
                <th className="px-3 py-2 text-right">합격</th>
                <th className="px-3 py-2 text-right">합격률</th>
              </tr>
            </thead>
            <tbody>
              {roleStats.map((item) => (
                <tr className="border-b border-line" key={item.role}>
                  <td className="px-3 py-2">{item.role}</td>
                  <td className="px-3 py-2 text-right">{item.total}건</td>
                  <td className="px-3 py-2 text-right">{item.accepted}건</td>
                  <td className="px-3 py-2 text-right">
                    {item.passRate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
