export type ApplicationResult = "합격" | "불합격" | "미정";

export type SortDirection = "desc" | "asc";

export interface Application {
  id: string;
  date: string;
  company: string;
  role: string;
  result: ApplicationResult;
  memo: string;
}

export interface ApplicationFilters {
  startDate: string;
  endDate: string;
  role: string;
  result: "전체" | ApplicationResult;
  company: string;
}

export interface SummaryStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
  passRate: number;
}

export interface MonthlyStats {
  month: number;
  label: string;
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
  passRate: number;
}

export interface RoleStats {
  role: string;
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
  passRate: number;
}
