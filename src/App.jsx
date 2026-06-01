import { useEffect, useMemo, useState } from 'react';
import ContestEditorModal from './components/ContestEditorModal';
import ContestTable from './components/ContestTable';
import StatsBar from './components/StatsBar';
import { hasSupabaseConfig } from './lib/supabaseClient';
import { createContest, deleteContest, fetchContests, updateContest } from './services/contestService';
import { sortContestsByDeadline } from './utils/contestUtils';

export default function App() {
  const [contests, setContests] = useState([]);
  const [editorState, setEditorState] = useState({ isOpen: false, contest: null });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sortedContests = useMemo(() => sortContestsByDeadline(contests), [contests]);

  useEffect(() => {
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
      await deleteContest(contestId);
      setContests((prev) => prev.filter((contest) => contest.id !== contestId));
    } catch (error) {
      setErrorMessage(error.message || '삭제하지 못했습니다.');
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
