import { useEffect, useMemo, useState } from 'react';
import ContestEditorModal from './components/ContestEditorModal';
import ContestTable from './components/ContestTable';
import StatsBar from './components/StatsBar';
import { hasSupabaseConfig } from './lib/supabaseClient';
import { createContest, createContests, deleteContest, fetchContests, updateContest } from './services/contestService';
import { sortContestsByDeadline } from './utils/contestUtils';

const LEGACY_STORAGE_KEY = 'personal-contest-manager-table';
const LEGACY_BACKUP_KEY = 'personal-contest-manager-table-imported';

export default function App() {
  const [contests, setContests] = useState([]);
  const [editorState, setEditorState] = useState({ isOpen: false, contest: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [legacyContests, setLegacyContests] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');

  const sortedContests = useMemo(() => sortContestsByDeadline(contests), [contests]);

  useEffect(() => {
    setLegacyContests(readLegacyContests());
    loadContests();
  }, []);

  const loadContests = async () => {
    if (!hasSupabaseConfig) {
      setErrorMessage('Supabase 환경변수가 설정되지 않았습니다.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await fetchContests();
      setContests(data);
    } catch (error) {
      setErrorMessage(error.message || '공모전 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditorState({ isOpen: true, contest: null });
  };

  const openEditModal = (contest) => {
    setEditorState({ isOpen: true, contest });
  };

  const closeModal = () => {
    if (isSaving) return;
    setEditorState({ isOpen: false, contest: null });
  };

  const saveContest = async (contestInput) => {
    try {
      setIsSaving(true);
      setErrorMessage('');
      setNoticeMessage('');

      if (editorState.contest) {
        const updated = await updateContest(editorState.contest.id, contestInput);
        setContests((prev) => prev.map((contest) => (contest.id === updated.id ? updated : contest)));
      } else {
        const created = await createContest(contestInput);
        setContests((prev) => [...prev, created]);
      }

      setEditorState({ isOpen: false, contest: null });
    } catch (error) {
      setErrorMessage(error.message || '저장하지 못했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeContest = async (contestId) => {
    const target = contests.find((contest) => contest.id === contestId);
    const confirmed = window.confirm(`"${target?.title || '이 공모전'}"을 삭제할까요?`);
    if (!confirmed) return;

    try {
      setErrorMessage('');
      setNoticeMessage('');
      await deleteContest(contestId);
      setContests((prev) => prev.filter((contest) => contest.id !== contestId));
    } catch (error) {
      setErrorMessage(error.message || '삭제하지 못했습니다.');
    }
  };

  const importLegacyContests = async () => {
    if (legacyContests.length === 0) return;

    const confirmed = window.confirm(`이전 localStorage 데이터 ${legacyContests.length}개를 Supabase로 가져올까요?`);
    if (!confirmed) return;

    try {
      setIsImporting(true);
      setErrorMessage('');
      setNoticeMessage('');

      const imported = await createContests(legacyContests);
      setContests((prev) => [...prev, ...imported]);
      localStorage.setItem(LEGACY_BACKUP_KEY, JSON.stringify(legacyContests));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      setLegacyContests([]);
      setNoticeMessage(`이전 데이터 ${imported.length}개를 가져왔습니다.`);
    } catch (error) {
      setErrorMessage(error.message || '이전 데이터를 가져오지 못했습니다.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-stone-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 border-b border-stone-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-950">공모전 관리</h1>
            <p className="mt-2 text-sm text-stone-500">팀원이 같은 공모전 목록을 함께 확인하고 관리합니다.</p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-10 items-center justify-center rounded-md bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            공모전 등록
          </button>
        </header>

        {legacyContests.length > 0 && (
          <section className="flex flex-col gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-amber-900">
              이전 브라우저 저장 데이터 {legacyContests.length}개를 찾았습니다.
            </p>
            <button
              type="button"
              onClick={importLegacyContests}
              disabled={isImporting}
              className="inline-flex h-9 items-center justify-center rounded-md bg-amber-900 px-3 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? '가져오는 중...' : '이전 데이터 가져오기'}
            </button>
          </section>
        )}

        {noticeMessage && (
          <section className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {noticeMessage}
          </section>
        )}

        {errorMessage && (
          <section className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </section>
        )}

        <StatsBar contests={contests} />

        <ContestTable
          contests={sortedContests}
          isLoading={isLoading}
          onEdit={openEditModal}
          onDelete={removeContest}
        />
      </div>

      <ContestEditorModal
        isOpen={editorState.isOpen}
        contest={editorState.contest}
        isSaving={isSaving}
        onClose={closeModal}
        onSave={saveContest}
      />
    </main>
  );
}

function readLegacyContests() {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((contest) => ({
        title: contest.title || '',
        deadline: contest.deadline || '',
        officialUrl: contest.officialUrl || contest.link || '',
        memo: contest.memo || '',
      }))
      .filter((contest) => contest.title && contest.deadline && contest.officialUrl);
  } catch {
    return [];
  }
}
