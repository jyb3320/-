"use client";

import { Download, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnalysisCharts } from "@/components/AnalysisCharts";
import { ApplicationTable } from "@/components/ApplicationTable";
import { FiltersPanel } from "@/components/FiltersPanel";
import { SummaryCards } from "@/components/SummaryCards";
import {
  emptyFilters,
  filterApplications,
  getMonthlyStats,
  getRoleStats,
  getUniqueRoles,
  sortApplications,
  summarizeApplications,
} from "@/lib/calculations";
import { applicationsToCsv, parseCsv } from "@/lib/csv";
import { sampleApplications } from "@/lib/sampleApplications";
import type {
  Application,
  ApplicationFilters,
  SortDirection,
} from "@/lib/types";

const storageKey = "application-pass-rate-tracker:v1";

function loadApplicationsFromStorage() {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return sampleApplications;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as Application[]) : sampleApplications;
  } catch {
    return sampleApplications;
  }
}

function saveApplicationsToStorage(applications: Application[]) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(applications));
  } catch {
    // Keep the app usable even when browser storage is unavailable.
  }
}

export function ApplicationManager() {
  const [applications, setApplications] =
    useState<Application[]>(sampleApplications);
  const [filters, setFilters] = useState<ApplicationFilters>(emptyFilters);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const hydrated = useRef(false);

  useEffect(() => {
    setApplications(loadApplicationsFromStorage());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (hydrated.current) {
      saveApplicationsToStorage(applications);
    }
  }, [applications]);

  const filteredApplications = useMemo(
    () => filterApplications(applications, filters),
    [applications, filters],
  );

  const sortedApplications = useMemo(
    () => sortApplications(filteredApplications, sortDirection),
    [filteredApplications, sortDirection],
  );

  const summary = useMemo(
    () => summarizeApplications(filteredApplications),
    [filteredApplications],
  );

  const monthlyStats = useMemo(
    () => getMonthlyStats(filteredApplications),
    [filteredApplications],
  );

  const roleStats = useMemo(
    () => getRoleStats(filteredApplications),
    [filteredApplications],
  );

  const roles = useMemo(() => getUniqueRoles(applications), [applications]);

  function addApplication() {
    const today = new Date().toISOString().slice(0, 10);
    setApplications((current) => [
      {
        id: crypto.randomUUID(),
        date: today,
        company: "",
        role: "",
        result: "미정",
        memo: "",
      },
      ...current,
    ]);
  }

  function updateApplication(id: string, patch: Partial<Application>) {
    setApplications((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function deleteApplication(id: string) {
    setApplications((current) => current.filter((item) => item.id !== id));
  }

  async function importCsv(file: File) {
    const text = await file.text();
    const imported = parseCsv(text);
    if (imported.length > 0) {
      setApplications(imported);
      setFilters(emptyFilters);
    }
  }

  function downloadCsv() {
    const csv = applicationsToCsv(applications);
    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "서류_지원_내역.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            2026년 서류 합격률
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal text-ink">
            지원 내역 관리
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="text-button cursor-pointer">
            <Upload size={16} />
            CSV 업로드
            <input
              accept=".csv,text/csv"
              className="sr-only"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importCsv(file);
                event.target.value = "";
              }}
            />
          </label>
          <button className="text-button" onClick={downloadCsv} type="button">
            <Download size={16} />
            CSV 다운로드
          </button>
        </div>
      </header>

      <SummaryCards stats={summary} />
      <FiltersPanel
        filters={filters}
        roles={roles}
        onChange={setFilters}
        onReset={() => setFilters(emptyFilters)}
      />
      <AnalysisCharts monthlyStats={monthlyStats} roleStats={roleStats} />
      <ApplicationTable
        applications={sortedApplications}
        sortDirection={sortDirection}
        onAdd={addApplication}
        onDelete={deleteApplication}
        onSortDirectionChange={setSortDirection}
        onUpdate={updateApplication}
      />
    </main>
  );
}
