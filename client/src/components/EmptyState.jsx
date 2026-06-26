export default function EmptyState({ hasSearch, onClearSearch }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 sm:py-20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800">
        <svg className="h-8 w-8 text-zinc-400" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          {hasSearch ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          )}
        </svg>
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        {hasSearch ? 'No notes found' : 'No notes yet'}
      </h3>
      <p className="mt-1 text-sm text-center text-zinc-500 dark:text-zinc-400">
        {hasSearch
          ? 'Try adjusting your search or filters.'
          : 'Click "New Note" to create your first note.'}
      </p>
      {hasSearch && (
        <button onClick={onClearSearch} className="btn-ghost mt-4 text-sm">
          Clear filters
        </button>
      )}
    </div>
  );
}
