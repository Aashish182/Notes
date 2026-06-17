import React from "react";

const ConfirmDialog = ({ title, message, onConfirm, onCancel, loading }) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 animate-fade-in"
    onClick={(e) => e.target === e.currentTarget && onCancel()}
  >
    <div
      className="w-full max-w-sm rounded-xl border border-border bg-surface p-7 animate-slide-up"
      role="alertdialog"
      aria-labelledby="confirm-title"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-100" id="confirm-title">{title}</h3>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted transition-colors hover:bg-surface2 hover:text-gray-100"
          onClick={onCancel}
        >
          ×
        </button>
      </div>
      <p className="mb-6 text-sm text-muted">{message}</p>
      <div className="flex justify-end gap-2.5">
        <button className="btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm} disabled={loading}>
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;