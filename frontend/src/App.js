
import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotesProvider, useNotes } from "./context/NotesContext";
import { ToastProvider, useToast } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import NoteCard from "./components/NoteCard";
import NoteForm from "./components/NoteForm";
import NoteDetail from "./components/NoteDetail";
import ConfirmDialog from "./components/ConfirmDialog";
import SkeletonCards from "./components/SkeletonCards";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import useDebounce from "./hooks/useDebounce";

const NotesDashboard = () => {
  const { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote, togglePin } = useNotes();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    const params = {};
    if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
    if (activeTag) params.tag = activeTag;
    fetchNotes(params);
  }, [debouncedSearch, activeTag, fetchNotes]);

  const allTags = [...new Set(notes.flatMap((n) => n.tags || []))].sort();

  const handleCreate = useCallback(async (data) => {
    setFormLoading(true);
    const result = await createNote(data);
    setFormLoading(false);
    if (result.success) { toast.success("Note created!"); setShowForm(false); }
    else toast.error(result.message);
  }, [createNote, toast]);

  const handleUpdate = useCallback(async (data) => {
    setFormLoading(true);
    const result = await updateNote(editNote._id, data);
    setFormLoading(false);
    if (result.success) {
      toast.success("Note updated!");
      setEditNote(null);
      if (viewNote?._id === editNote._id) setViewNote(result.data);
    } else toast.error(result.message);
  }, [updateNote, editNote, viewNote, toast]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    const result = await deleteNote(deleteTarget._id);
    setDeleteLoading(false);
    if (result.success) {
      toast.success("Note deleted");
      setDeleteTarget(null);
      if (viewNote?._id === deleteTarget._id) setViewNote(null);
    } else toast.error(result.message);
  }, [deleteNote, deleteTarget, viewNote, toast]);

  const handleTogglePin = useCallback(async (note) => {
    await togglePin(note._id);
    toast.info(note.isPinned ? "Note unpinned" : "Note pinned 📌");
  }, [togglePin, toast]);

  const pinnedCount = notes.filter((n) => n.isPinned).length;

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewNote={() => { setEditNote(null); setShowForm(true); }}
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        {!loading && notes.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-5 rounded-xl border border-border bg-surface px-5 py-3.5">
            <div className="flex flex-col gap-0.5">
              <span className="text-lg font-bold text-primary">{notes.length}</span>
              <span className="text-xs text-muted">Total notes</span>
            </div>
            {pinnedCount > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-primary">{pinnedCount}</span>
                <span className="text-xs text-muted">Pinned</span>
              </div>
            )}
            {allTags.length > 0 && (
              <div className="flex flex-col gap-0.5">
                <span className="text-lg font-bold text-primary">{allTags.length}</span>
                <span className="text-xs text-muted">Tags</span>
              </div>
            )}
          </div>
        )}

        {allTags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                activeTag === "" ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary hover:text-primary"
              }`}
              onClick={() => setActiveTag("")}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  activeTag === tag ? "border-primary bg-primary text-white" : "border-border text-muted hover:border-primary hover:text-primary"
                }`}
                onClick={() => setActiveTag(tag === activeTag ? "" : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100">Something went wrong</h3>
            <p className="max-w-xs text-sm text-muted">{error}</p>
            <button className="btn-primary" onClick={() => fetchNotes()}>Try again</button>
          </div>
        )}

        {loading && !error && <SkeletonCards count={6} />}

        {!loading && !error && notes.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-border">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-100">
              {searchQuery || activeTag ? "No notes found" : "No notes yet"}
            </h3>
            <p className="max-w-xs text-sm text-muted">
              {searchQuery || activeTag ? "Try a different search or tag." : "Create your first note to get started."}
            </p>
            {!searchQuery && !activeTag && (
              <button className="btn-primary" onClick={() => setShowForm(true)}>+ Create note</button>
            )}
          </div>
        )}

        {!loading && !error && notes.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                onClick={() => setViewNote(note)}
                onEdit={() => { setEditNote(note); setShowForm(true); }}
                onDelete={() => setDeleteTarget(note)}
                onTogglePin={() => handleTogglePin(note)}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <NoteForm
          note={editNote}
          onSubmit={editNote ? handleUpdate : handleCreate}
          onClose={() => { setShowForm(false); setEditNote(null); }}
          loading={formLoading}
        />
      )}

      {viewNote && !showForm && (
        <NoteDetail
          note={viewNote}
          onClose={() => setViewNote(null)}
          onEdit={() => { setEditNote(viewNote); setShowForm(true); }}
          onDelete={() => { setDeleteTarget(viewNote); setViewNote(null); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete note?"
          message={`"${deleteTarget.title}" will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

const RedirectIfAuthed = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<RedirectIfAuthed><LoginPage /></RedirectIfAuthed>} />
    <Route path="/signup" element={<RedirectIfAuthed><SignupPage /></RedirectIfAuthed>} />
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <NotesProvider>
            <NotesDashboard />
          </NotesProvider>
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;