import type { SummaryStats } from "@/lib/types";

const formatter = new Intl.NumberFormat("ko-KR");

export function SummaryCards({ stats }: { stats: SummaryStats }) {
  const cards = [
    { label: "총 지원 건수", value: `${formatter.format(stats.total)}건` },
    { label: "합격", value: `${formatter.format(stats.accepted)}건` },
    { label: "불합격", value: `${formatter.format(stats.rejected)}건` },
    { label: "미정", value: `${formatter.format(stats.pending)}건` },
    { label: "전체 서류 합격률", value: `${stats.passRate.toFixed(1)}%` },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          className="rounded-lg border border-line bg-paper p-4 shadow-soft"
          key={card.label}
        >
          <p className="text-xs font-medium text-gray-500">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-ink">
            {card.value}
          </p>
        </div>
      ))}
    </section>
  );
}
