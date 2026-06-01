import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { getContestStatus, getDdayLabel } from '../utils/contestUtils';

export default function ContestTable({ contests, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <section className="grid min-h-56 place-items-center rounded-md border border-stone-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-stone-500">공모전 목록을 불러오는 중입니다.</p>
      </section>
    );
  }

  if (contests.length === 0) {
    return (
      <section className="grid min-h-56 place-items-center rounded-md border border-dashed border-stone-300 bg-white p-8 text-center">
        <div>
          <p className="text-lg font-semibold text-stone-900">등록된 공모전이 없습니다</p>
          <p className="mt-2 text-sm text-stone-500">상단의 등록 버튼으로 첫 공모전을 추가하세요.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-md border border-stone-200 bg-white">
      <div className="max-h-[68vh] overflow-auto">
        <table className="min-w-[980px] w-full border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 bg-stone-50">
            <tr className="border-b border-stone-200 text-xs font-semibold text-stone-500">
              <Th className="w-[28%]">공모전명</Th>
              <Th className="w-[120px]">마감일</Th>
              <Th className="w-[100px]">D-Day</Th>
              <Th className="w-[110px]">상태</Th>
              <Th className="w-[120px]">공식 링크</Th>
              <Th>메모</Th>
              <Th className="w-[72px] text-center">수정</Th>
              <Th className="w-[72px] text-center">삭제</Th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <ContestRow key={contest.id} contest={contest} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ContestRow({ contest, onEdit, onDelete }) {
  const status = getContestStatus(contest.deadline);
  const closed = status === '마감';

  return (
    <tr
      onClick={() => onEdit(contest)}
      className={`cursor-pointer border-b border-stone-100 transition last:border-b-0 hover:bg-stone-50 ${
        closed ? 'bg-stone-50 text-stone-400' : 'bg-white text-stone-800'
      }`}
    >
      <Td>
        <span className={`font-medium ${closed ? 'text-stone-400' : 'text-stone-950'}`}>{contest.title}</span>
      </Td>
      <Td>{contest.deadline}</Td>
      <Td>
        <span className={`font-semibold ${closed ? 'text-stone-400' : status === '마감임박' ? 'text-red-700' : 'text-stone-900'}`}>
          {getDdayLabel(contest.deadline)}
        </span>
      </Td>
      <Td>
        <StatusBadge status={status} />
      </Td>
      <Td>
        <a
          href={contest.officialUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-stone-200 bg-white px-2.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-100"
        >
          열기
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Td>
      <Td>
        <span className="line-clamp-1 text-stone-600">{contest.memo || '-'}</span>
      </Td>
      <Td className="text-center">
        <IconButton
          label="수정"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(contest);
          }}
        >
          <Pencil className="h-4 w-4" />
        </IconButton>
      </Td>
      <Td className="text-center">
        <IconButton
          label="삭제"
          danger
          onClick={(event) => {
            event.stopPropagation();
            onDelete(contest.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </Td>
    </tr>
  );
}

function StatusBadge({ status }) {
  const className =
    status === '마감'
      ? 'bg-stone-100 text-stone-500'
      : status === '마감임박'
        ? 'bg-red-50 text-red-700'
        : 'bg-white text-stone-700 ring-1 ring-inset ring-stone-200';

  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{status}</span>;
}

function IconButton({ label, danger = false, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`inline-grid h-8 w-8 place-items-center rounded-md border border-transparent transition ${
        danger ? 'text-stone-500 hover:bg-red-50 hover:text-red-600' : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
      }`}
    >
      {children}
    </button>
  );
}

function Th({ className = '', children }) {
  return <th className={`border-r border-stone-200 px-3 py-2 last:border-r-0 ${className}`}>{children}</th>;
}

function Td({ className = '', children }) {
  return <td className={`border-r border-stone-100 px-3 py-3 align-middle last:border-r-0 ${className}`}>{children}</td>;
}
