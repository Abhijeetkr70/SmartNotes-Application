import { useState, useEffect } from 'react';

const presetColors = [
  { label: 'Emerald', value: '#10b981' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Sky', value: '#0ea5e9' },
  { label: 'Slate', value: '#64748b' },
  { label: 'Lime', value: '#84cc16' },
];

export default function Sidebar({
  allTags,
  activeTags,
  onToggleTag,
  onClearTags,
  onAddNote,
  editing,
  selectedColor,
  onColorChange,
  open,
  onClose,
}) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-zinc-200 bg-zinc-50/95 backdrop-blur-sm transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950/95 md:static md:z-auto md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-4 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-sm font-bold text-white">
              S
            </div>
            <span className="text-lg font-semibold tracking-tight">SmartNotes</span>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost p-1 md:hidden"
            aria-label="Close sidebar"
          >
            <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <button onClick={onAddNote} className="btn-primary w-full" disabled={editing}>
            <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Note
          </button>

          {editing && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Note Color
              </h3>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => onColorChange(c.value)}
                    aria-label={`Set note color to ${c.label}`}
                    className={`h-7 w-7 rounded-full transition-all duration-200 hover:scale-110 hover:shadow-md ${
                      selectedColor === c.value ? 'ring-2 ring-zinc-900 ring-offset-2 dark:ring-zinc-100 dark:ring-offset-zinc-950' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          )}

          {allTags.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allTags.map((tag) => {
                  const active = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => onToggleTag(tag)}
                      aria-pressed={active}
                      className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                        active
                          ? 'bg-accent-500 text-white shadow-sm'
                          : 'bg-zinc-200/70 text-zinc-600 hover:bg-zinc-300/70 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Quick Filters
            </h3>
            <div className="space-y-1">
              <button
                onClick={onClearTags}
                className="btn-ghost w-full justify-start text-xs"
              >
                All Notes
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false;
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((prev) => !prev)}
      className="btn-ghost w-full justify-start text-xs"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
