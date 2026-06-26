export default function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card animate-pulse overflow-hidden">
          <div className="p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-4 flex gap-1.5">
              <div className="h-5 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="mt-4 h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
