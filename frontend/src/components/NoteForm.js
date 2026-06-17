
import React, { useState, useEffect, useRef } from "react";

const COLORS = ["default", "red", "orange", "yellow", "green", "blue", "purple"];

const SWATCH_CLASSES = {
  default: "bg-primary",
  red: "bg-note-red",
  orange: "bg-note-orange",
  yellow: "bg-note-yellow",
  green: "bg-note-green",
  blue: "bg-note-blue",
  purple: "bg-note-purple",
};

const NoteForm = ({ note, onSubmit, onClose, loading }) => {
  const isEdit = Boolean(note?._id);
  const titleRef = useRef(null);

  const [form, setForm] = useState({
    title: note?.title || "",
    content: note?.content || "",
    tags: note?.tags?.join(", ") || "",
    color: note?.color || "default",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 50);
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.trim().length > 200) errs.title = "Title cannot exceed 200 characters";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const tagsArray = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    await onSubmit({
      title: form.title.trim(),
      content: form.content.trim(),
      tags: tagsArray,
      color: form.color,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 animate-fade-in"
      onClick={handleOverlayClick}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-surface p-7 animate-slide-up"
        role="dialog"
        aria-labelledby="form-modal-title"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-100" id="form-modal-title">
            {isEdit ? "Edit note" : "New note"}
          </h2>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface2 hover:text-gray-100"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="note-title">Title *</label>
            <input
              ref={titleRef}
              id="note-title"
              className={`form-input ${errors.title ? "error" : ""}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Give your note a title…"
              maxLength={200}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div className="mb-5 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="form-textarea"
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Start writing…"
              rows={6}
            />
          </div>

          <div className="mb-5 flex flex-col gap-1.5">
            <label className="form-label" htmlFor="note-tags">Tags (comma-separated)</label>
            <input
              id="note-tags"
              className="form-input"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="work, ideas, personal"
            />
          </div>

          <div className="mb-5 flex flex-col gap-2">
            <label className="form-label">Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${SWATCH_CLASSES[c]} ${
                    form.color === c ? "scale-110 ring-2 ring-gray-100 ring-offset-2 ring-offset-surface" : ""
                  }`}
                  onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                  title={c}
                  aria-label={`${c} color`}
                />
              ))}
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-2.5">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving…" : isEdit ? "Save changes" : "Create note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;