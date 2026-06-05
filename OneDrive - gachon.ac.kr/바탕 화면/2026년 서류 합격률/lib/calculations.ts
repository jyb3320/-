import type {
  Application,
  ApplicationFilters,
  MonthlyStats,
  RoleStats,
  SortDirection,
  SummaryStats,
} from "@/lib/types";

export const emptyFilters: ApplicationFilters = {
  startDate: "",
  endDate: "",
  role: "전체",
  result: "전체",
  company: "",
};

export function calculatePassRate(accepted: number, rejected: number) {
  const decided = accepted + rejected;
  return decided === 0 ? 0 : (accepted / decided) * 100;
}

export function summarizeApplications(applications: Application[]): SummaryStats {
  const accepted = applications.filter((item) => item.result === "합격").length;
  const rejected = applications.filter((item) => item.result === "불합격").length;
  const pending = applications.filter((item) => item.result === "미정").length;

  return {
    total: applications.length,
    accepted,
    rejected,
    pending,
    passRate: calculatePassRate(accepted, rejected),
  };
}

export function filterApplications(
  applications: Application[],
  filters: ApplicationFilters,
) {
  const companyQuery = filters.company.trim().toLowerCase();

  return applications.filter((item) => {
    if (filters.startDate && item.date < filters.startDate) return false;
    if (filters.endDate && item.date > filters.endDate) return false;
    if (filters.role !== "전체" && item.role !== filters.role) return false;
    if (filters.result !== "전체" && item.result !== filters.result) return false;
    if (companyQuery && !item.company.toLowerCase().includes(companyQuery)) {
      return false;
    }
    return true;
  });
}

export function sortApplications(
  applications: Application[],
  direction: SortDirection,
) {
  return [...applications].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    const companyCompare = a.company.localeCompare(b.company, "ko");
    return direction === "desc"
      ? dateCompare * -1 || companyCompare
      : dateCompare || companyCompare;
  });
}

export function getMonthlyStats(applications: Application[]): MonthlyStats[] {
  return Array.from({ length: 12 }, (_, index) => {
    const month = index + 1;
    const rows = applications.filter((item) => {
      if (!item.date) return false;
      const parsedMonth = Number(item.date.slice(5, 7));
      return parsedMonth === month;
    });
    const summary = summarizeApplications(rows);

    return {
      month,
      label: `${month}월`,
      total: summary.total,
      accepted: summary.accepted,
      rejected: summary.rejected,
      pending: summary.pending,
      passRate: summary.passRate,
    };
  });
}

export function getRoleStats(applications: Application[]): RoleStats[] {
  const grouped = applications.reduce<Record<string, Application[]>>((acc, item) => {
    const role = item.role.trim() || "미입력";
    acc[role] = acc[role] ? [...acc[role], item] : [item];
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([role, rows]) => {
      const summary = summarizeApplications(rows);
      return {
        role,
        total: summary.total,
        accepted: summary.accepted,
        rejected: summary.rejected,
        pending: summary.pending,
        passRate: summary.passRate,
      };
    })
    .sort((a, b) => b.total - a.total || a.role.localeCompare(b.role, "ko"));
}

export function getUniqueRoles(applications: Application[]) {
  return Array.from(
    new Set(applications.map((item) => item.role.trim()).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, "ko"));
}
