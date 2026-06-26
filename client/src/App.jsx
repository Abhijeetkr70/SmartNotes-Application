import { useState, useCallback, useRef } from 'react';
import { useNotes } from './hooks/useNotes';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import NoteCard from './components/NoteCard';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';
import LoadingSkeleton from './components/LoadingSkeleton';

export default function App() {
  const {
    notes,
    loading,
    error,
    search,
    setSearch,
    activeTags,
    toggleTag,
    clearTags,
    allTags,
    addNote,
    editNote,
    removeNote,
    refresh,
  } = useNotes();

  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarColor, setSidebarColor] = useState('#10b981');
  const [alert, setAlert] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const triggerRef = useRef(null);

  const showAlert = useCallback((message, type = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 6000);
  }, []);

  const restoreFocus = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const openNewNote = useCallback(() => {
    setEditing(null);
    setShowEditor(true);
    setSidebarOpen(false);
  }, []);

  const openEditNote = useCallback((note) => {
    setEditing(note);
    setShowEditor(true);
    setSidebarColor(note.color);
    setSidebarOpen(false);
  }, []);

  const handleSave = useCallback(
    async (form) => {
      try {
        setSaving(true);
        if (editing) {
          await editNote(editing._id, form);
          showAlert('Note updated', 'success');
        } else {
          await addNote(form);
          showAlert('Note created', 'success');
        }
        setShowEditor(false);
        setEditing(null);
        restoreFocus();
      } catch (err) {
        showAlert(err.message);
      } finally {
        setSaving(false);
      }
    },
    [editing, editNote, addNote, showAlert, restoreFocus]
  );

  const handleDelete = useCallback(
    async (id) => {
      try {
        await removeNote(id);
        showAlert('Note deleted', 'success');
        if (editing?._id === id) {
          setShowEditor(false);
          setEditing(null);
          restoreFocus();
        }
      } catch (err) {
        showAlert(err.message);
      }
    },
    [removeNote, editing, showAlert, restoreFocus]
  );

  const handleCancel = useCallback(() => {
    setShowEditor(false);
    setEditing(null);
    restoreFocus();
  }, [restoreFocus]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        allTags={allTags}
        activeTags={activeTags}
        onToggleTag={toggleTag}
        onClearTags={clearTags}
        onAddNote={openNewNote}
        editing={showEditor}
        selectedColor={sidebarColor}
        onColorChange={setSidebarColor}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex flex-1 flex-col overflow-hidden min-w-0">
        {showEditor && (
          <div className="h-full w-full border-b border-zinc-200 dark:border-zinc-800">
            <NoteEditor
              note={editing}
              onSave={handleSave}
              onCancel={handleCancel}
              saving={saving}
            />
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6">
            <div className="mx-auto flex max-w-5xl items-center gap-3">
              <button
                ref={triggerRef}
                onClick={() => setSidebarOpen(true)}
                className="btn-ghost p-1.5 md:hidden"
                aria-label="Open sidebar menu"
              >
                <svg className="h-5 w-5" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div className="flex-1">
                <SearchBar value={search} onChange={setSearch} />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-5xl">
              {error && (
                <div
                  role="alert"
                  className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400"
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <span>{error}</span>
                    <button onClick={refresh} className="ml-auto text-xs font-medium underline hover:no-underline">
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {alert && (
                <div
                  role="alert"
                  className={`mb-4 rounded-lg border p-3 text-sm ${
                    alert.type === 'success'
                      ? 'border-accent-200 bg-accent-50 text-accent-700 dark:border-accent-900/50 dark:bg-accent-950/50 dark:text-accent-400'
                      : 'border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 shrink-0" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      {alert.type === 'success' ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                      )}
                    </svg>
                    <span>{alert.message}</span>
                    <button onClick={() => setAlert(null)} className="ml-auto" aria-label="Dismiss alert">
                      <svg className="h-4 w-4" aria-hidden="true" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {loading ? (
                <LoadingSkeleton />
              ) : notes.length === 0 ? (
                <EmptyState
                  hasSearch={!!search || activeTags.length > 0}
                  onClearSearch={() => {
                    setSearch('');
                    clearTags();
                  }}
                />
              ) : (
                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {notes.map((note) => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      onEdit={openEditNote}
                      onDelete={handleDelete}
                      activeTags={activeTags}
                      onToggleTag={toggleTag}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
