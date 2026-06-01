import { getContestStats } from '../utils/contestUtils';

export default function StatsBar({ contests }) {
  const stats = getContestStats(contests);

  return (
    <section className="grid grid-cols-2 overflow-hidden rounded-md border border-stone-200 bg-white md:grid-cols-4">
      <StatItem label="전체 공모전" value={`${stats.total}개`} />
      <StatItem label="진행중" value={`${stats.active}개`} />
      <StatItem label="마감임박" value={`${stats.urgent}개`} tone="urgent" />
      <StatItem label="마감" value={`${stats.closed}개`} tone="closed" />
    </section>
  );
}

function StatItem({ label, value, tone = 'default' }) {
  const valueClass =
    tone === 'urgent' ? 'text-red-700' : tone === 'closed' ? 'text-stone-400' : 'text-stone-950';

  return (
    <div className="border-b border-r border-stone-200 px-4 py-3 last:border-r-0 md:border-b-0">
      <p className="text-xs font-medium text-stone-500">{label}</p>
      <p className={`mt-1 text-lg font-semibold ${valueClass}`}>{value}</p>
    </div>
  );
}
