
import React from "react";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const ACCENT_MAP = {
  default: "before:bg-primary",
  red: "before:bg-note-red",
  orange: "before:bg-note-orange",
  yellow: "before:bg-note-yellow",
  green: "before:bg-note-green",
  blue: "before:bg-note-blue",
  purple: "before:bg-note-purple",
};

const PinIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}
    stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
);

const NoteCard = ({ note, onClick, onEdit, onDelete, onTogglePin }) => {
  const handleAction = (e, fn) => {
    e.stopPropagation(); 
    fn();
  };

  const accent = ACCENT_MAP[note.color] || ACCENT_MAP.default;

  return (
    <div
      className={`group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border bg-surface p-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl before:absolute before:inset-x-0 before:top-0 before:h-[3px] ${accent} ${
        note.isPinned ? "border-warning" : "border-border hover:border-primary"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Open note: ${note.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="flex-1 break-words text-base font-semibold text-gray-100">{note.title}</h3>
        <div className="flex flex-shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            className={`flex h-7 w-7 items-center justify-center rounded-md bg-surface2 transition-colors hover:bg-border ${note.isPinned ? "text-warning" : "text-muted hover:text-gray-100"}`}
            onClick={(e) => handleAction(e, onTogglePin)}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <PinIcon filled={note.isPinned} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md bg-surface2 text-muted transition-colors hover:bg-border hover:text-gray-100"
            onClick={(e) => handleAction(e, onEdit)}
            title="Edit note"
          >
            <EditIcon />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md bg-surface2 text-muted transition-colors hover:bg-accent hover:text-white"
            onClick={(e) => handleAction(e, onDelete)}
            title="Delete note"
          >
            <DeleteIcon />
          </button>
        </div>
      </div>

      {note.content && (
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">{note.content}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted">
          {note.updatedAt !== note.createdAt
            ? `Updated ${formatDate(note.updatedAt)}`
            : `Created ${formatDate(note.createdAt)}`}
        </span>
        {note.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="card-tag">#{tag}</span>
            ))}
            {note.tags.length > 3 && <span className="card-tag">+{note.tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteCard;