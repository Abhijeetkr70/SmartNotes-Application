import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { fetchNotes, createNote, updateNote, deleteNote } from '../api/notes';

export function useNotes() {
  const { getToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  const loadNotes = useCallback(async (opts) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const data = await fetchNotes({ ...opts, token, signal: controller.signal });
      if (!controller.signal.aborted) {
        setNotes(data);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'TimeoutError') return;
      if (err.message?.includes('No token') || err.message?.includes('Invalid token')) {
        return;
      }
      setError(err.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [getToken]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadNotes({ search, tags: activeTags });
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, activeTags, loadNotes]);

  const addNote = useCallback(async (data) => {
    const token = await getToken();
    const created = await createNote(data, { token });
    setNotes((prev) => [created, ...prev]);
    return created;
  }, [getToken]);

  const editNote = useCallback(async (id, data) => {
    const token = await getToken();
    const updated = await updateNote(id, data, { token });
    setNotes((prev) => prev.map((n) => (n._id === id ? updated : n)));
    return updated;
  }, [getToken]);

  const removeNote = useCallback(async (id) => {
    const token = await getToken();
    await deleteNote(id, { token });
    setNotes((prev) => prev.filter((n) => n._id !== id));
  }, [getToken]);

  const toggleTag = useCallback((tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearTags = useCallback(() => {
    setActiveTags([]);
  }, []);

  const allTags = useMemo(
    () => [...new Set(notes.flatMap((n) => n.tags))].sort(),
    [notes]
  );

  return {
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
    refresh: () => loadNotes({ search, tags: activeTags }),
  };
}
