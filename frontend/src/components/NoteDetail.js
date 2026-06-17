
import React from "react";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const NoteDetail = ({ note, onClose, onEdit, onDelete }) => {
  if (!note) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface p-7 animate-slide-up"
        role="dialog"
        aria-labelledby="note-detail-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {note.isPinned && <span title="Pinned" className="text-warning">📌</span>}
            <span className="text-lg font-semibold text-gray-100" id="note-detail-title">Note</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-ghost btn-sm" onClick={onEdit}>Edit</button>
            <button className="btn-danger btn-sm" onClick={onDelete}>Delete</button>
            <button
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface2 hover:text-gray-100"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="break-words text-xl font-bold text-gray-100">{note.title}</h2>
          <div className="text-xs text-muted">
            <div>Created: {formatDate(note.createdAt)}</div>
            {note.updatedAt !== note.createdAt && (
              <div>Last updated: {formatDate(note.updatedAt)}</div>
            )}
          </div>
          {note.content && (
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-200">
              {note.content}
            </p>
          )}
          {note.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <span key={tag} className="card-tag">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;