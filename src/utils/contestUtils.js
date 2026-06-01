export function getToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getDaysUntil(deadline) {
  const deadlineDate = new Date(`${deadline}T23:59:59`);
  const diff = deadlineDate.getTime() - getToday().getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getDdayLabel(deadline) {
  const daysLeft = getDaysUntil(deadline);

  if (daysLeft < 0) return '마감';
  if (daysLeft === 0) return 'D-Day';
  return `D-${daysLeft}`;
}

export function getContestStatus(deadline) {
  const daysLeft = getDaysUntil(deadline);

  if (daysLeft < 0) return '마감';
  if (daysLeft <= 7) return '마감임박';
  return '진행중';
}

export function sortContestsByDeadline(contests) {
  return [...contests].sort((a, b) => {
    const aDays = getDaysUntil(a.deadline);
    const bDays = getDaysUntil(b.deadline);
    const aClosed = aDays < 0;
    const bClosed = bDays < 0;

    if (aClosed && !bClosed) return 1;
    if (!aClosed && bClosed) return -1;
    return aDays - bDays;
  });
}

export function getContestStats(contests) {
  return contests.reduce(
    (stats, contest) => {
      const status = getContestStatus(contest.deadline);
      stats.total += 1;
      if (status === '진행중') stats.active += 1;
      if (status === '마감임박') stats.urgent += 1;
      if (status === '마감') stats.closed += 1;
      return stats;
    },
    { total: 0, active: 0, urgent: 0, closed: 0 },
  );
}
