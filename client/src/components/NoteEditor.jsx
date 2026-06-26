import { useState, useEffect, useRef } from 'react';

const INITIAL = { title: '', body: '', color: '#10b981', tags: [] };

export default function NoteEditor({ note, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() =>
    note
      ? { title: note.title || '', body: note.body || '', color: note.color || '#10b981', tags: [...(note.tags || [])] }
      : { ...INITIAL }
  );
  const [tagInput, setTagInput] = useState('');
  const titleRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (note) {
      setForm({ title: note.title || '', body: note.body || '', color: note.color || '#10b981', tags: [...(note.tags || [])] });
    } else {
      setForm({ ...INITIAL });
    }
  }, [note]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && t.length <= 30 && !form.tags.includes(t) && form.tags.length < 20 && /^[a-zA-Z0-9 _-]+$/.test(t)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, t] }));
    }
    setTagInput('');
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault();
      addTag();
    }
  };

  const canSave = form.title.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {note ? 'Edit Note' : 'New Note'}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="btn-ghost text-xs" disabled={saving}>
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="btn-primary text-xs"
            disabled={!canSave || saving}
          >
            {saving ? (
              <svg className="h-3.5 w-3.5 animate-spin" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            )}
            {note ? 'Update' : 'Create'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="mx-auto max-w-2xl space-y-4">
          <input
            ref={titleRef}
            type="text"
            placeholder="Note title..."
            aria-label="Note title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="input-field text-lg font-semibold"
            maxLength={200}
          />

          <textarea
            placeholder="Start writing..."
            aria-label="Note body"
            value={form.body}
            onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
            className="input-field min-h-[200px] resize-y leading-relaxed"
            maxLength={50000}
          />

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-300"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-accent-900 dark:hover:text-accent-100"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <svg className="h-3 w-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="Add a tag..."
                aria-label="New tag name"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKey}
                className="input-field flex-1"
                maxLength={30}
              />
              <button onClick={addTag} className="btn-ghost text-xs" disabled={!tagInput.trim()}>
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
