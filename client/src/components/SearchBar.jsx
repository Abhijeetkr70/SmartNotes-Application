import { useRef, useEffect, useState } from 'react';

function isMac() {
  if (navigator.userAgentData?.platform) {
    return navigator.userAgentData.platform.includes('Mac');
  }
  return navigator.platform.includes('Mac');
}

export default function SearchBar({ value, onChange }) {
  const inputRef = useRef(null);
  const [modKey] = useState(() => (isMac() ? '\u2318' : 'Ctrl'));

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
        aria-hidden="true"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search notes..."
        aria-label="Search notes"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field pl-10 pr-20 sm:pr-28"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300 sm:right-16"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 sm:flex">
        {modKey}K
      </kbd>
    </div>
  );
}
