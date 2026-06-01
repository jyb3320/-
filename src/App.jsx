import { useEffect, useMemo, useState } from 'react';
import ContestEditorModal from './components/ContestEditorModal';
import ContestTable from './components/ContestTable';
import StatsBar from './components/StatsBar';
import { normalizeContest, sortContestsByDeadline } from './utils/contestUtils';

const STORAGE_KEY = 'personal-contest-manager-table';

const sampleContests = [
  {
    id: 'sample-jeongseon-video',
    title: '2026 정선 관광 영상 공모전',
    deadline: '2026-07-31',
    officialUrl: 'https://example.com',
    memo: '영상 제출 형식 확인하기',
  },
  {
    id: 'sample-idea',
    title: '생활 혁신 아이디어 공모전',
    deadline: '2026-06-15',
    officialUrl: 'https://example.com/idea',
    memo: '',
  },
];

export default function App() {
  const [contests, setContests] = useState(() => readStorage(STORAGE_KEY, sampleContests).map(normalizeContest));
  const [editorState, setEditorState] = useState({ isOpen: false, contest: null });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contests));
  }, [contests]);

  const sortedContests = useMemo(() => sortContestsByDeadline(contests), [contests]);

  const openCreateModal = () => {
    setEditorState({ isOpen: true, contest: null });
  };

  const openEditModal = (contest) => {
    setEditorState({ isOpen: true, contest });
  };

  const closeModal = () => {
    setEditorState({ isOpen: false, contest: null });
  };

  const saveContest = (contestInput) => {
    if (editorState.contest) {
      setContests((prev) =>
        prev.map((contest) =>
          contest.id === editorState.contest.id ? normalizeContest({ ...contest, ...contestInput }) : contest,
        ),
      );
      closeModal();
      return;
    }

    setContests((prev) => [
      ...prev,
      normalizeContest({
        ...contestInput,
        id: `contest-${Date.now()}`,
      }),
    ]);
    closeModal();
  };

  const deleteContest = (contestId) => {
    const target = contests.find((contest) => contest.id === contestId);
    const confirmed = window.confirm(`"${target?.title || '이 공모전'}"을 삭제할까요?`);
    if (!confirmed) return;

    setContests((prev) => prev.filter((contest) => contest.id !== contestId));
  };

  return (
    <main className="min-h-screen bg-white text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-950">공모전 관리</h1>
            <p className="mt-2 text-sm text-stone-500">마감일이 가까운 공모전부터 자동 정렬됩니다.</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center rounded-md bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            공모전 등록
          </button>
        </header>

        <StatsBar contests={contests} />

        <ContestTable contests={sortedContests} onEdit={openEditModal} onDelete={deleteContest} />
      </div>

      <ContestEditorModal
        isOpen={editorState.isOpen}
        contest={editorState.contest}
        onClose={closeModal}
        onSave={saveContest}
      />
    </main>
  );
}

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}
