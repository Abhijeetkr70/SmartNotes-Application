export default function NoteCard({ note, onEdit, onDelete, activeTags, onToggleTag }) {
  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div
      className="card group cursor-pointer overflow-hidden"
      style={{ borderLeftColor: note.color, borderLeftWidth: 3 }}
      onClick={() => onEdit(note)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(note);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Edit note: ${note.title || 'Untitled'}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {note.title || 'Untitled'}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note._id);
            }}
            className="shrink-0 rounded p-1.5 text-zinc-400 transition-all hover:bg-red-50 hover:text-red-500 md:opacity-0 md:group-hover:opacity-100 dark:hover:bg-red-950/50"
            aria-label={`Delete note: ${note.title || 'Untitled'}`}
          >
            <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
            </svg>
          </button>
        </div>

        {note.body && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {note.body}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {note.tags.map((tag) => {
            const active = activeTags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTag(tag);
                }}
                aria-pressed={active}
                className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-all ${
                  active
                    ? 'bg-accent-500 text-white'
                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
          <span>{formatDate(note.createdAt)}</span>
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: note.color }}
          />
        </div>
      </div>
    </div>
  );
}
