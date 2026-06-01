import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  deadline: '',
  officialUrl: '',
  memo: '',
};

export default function ContestEditorModal({ isOpen, contest, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(contest ? { ...emptyForm, ...contest } : emptyForm);
  }, [contest, isOpen]);

  if (!isOpen) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      title: form.title.trim(),
      deadline: form.deadline,
      officialUrl: form.officialUrl.trim(),
      memo: form.memo.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/25 p-4">
      <section className="w-full max-w-lg rounded-lg border border-stone-200 bg-white">
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-base font-semibold text-stone-950">{contest ? '공모전 수정' : '공모전 등록'}</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-md text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            aria-label="닫기"
            title="닫기"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 p-5">
          <TextInput
            label="공모전명"
            value={form.title}
            onChange={(value) => updateField('title', value)}
            placeholder="2026 정선 관광 영상 공모전"
            required
          />
          <TextInput
            label="마감일"
            type="date"
            value={form.deadline}
            onChange={(value) => updateField('deadline', value)}
            required
          />
          <TextInput
            label="공식 링크"
            type="url"
            value={form.officialUrl}
            onChange={(value) => updateField('officialUrl', value)}
            placeholder="https://example.com"
            required
          />
          <label className="grid gap-2 text-sm font-medium text-stone-700">
            메모
            <textarea
              value={form.memo}
              onChange={(event) => updateField('memo', event.target.value)}
              className="min-h-24 resize-y rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-normal text-stone-950 outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100"
              placeholder="제출물, 준비할 일, 링크 확인 사항 등을 적어두세요."
            />
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-md border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="inline-flex h-9 items-center justify-center rounded-md bg-stone-900 px-4 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              저장
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function TextInput({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-stone-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm font-normal text-stone-950 outline-none transition focus:border-stone-400 focus:ring-4 focus:ring-stone-100"
      />
    </label>
  );
}
