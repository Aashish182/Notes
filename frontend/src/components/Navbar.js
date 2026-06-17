import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const Navbar = ({ searchQuery, onSearchChange, onNewNote }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the user menu when clicking outside it
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 px-4 backdrop-blur-md sm:px-6">
      <div className="mx-auto flex h-16 max-w-6xl flex-wrap items-center gap-3 py-2 sm:flex-nowrap">
        {/* Logo */}
        <div className="flex-shrink-0 text-xl font-bold text-primary">
          notes<span className="text-gray-100">.</span>
        </div>

        {/* Search */}
        <div className="relative order-3 w-full flex-1 sm:order-none sm:w-auto sm:max-w-md">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search notes"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-gray-100 outline-none transition-colors placeholder:text-muted focus:border-primary"
          />
        </div>

        {/* New note */}
        <button onClick={onNewNote} className="btn-primary flex-shrink-0">
          + New note
        </button>

        {/* User menu */}
        <div className="relative ml-auto flex-shrink-0 sm:ml-1" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-gray-100 transition-colors hover:border-primary"
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {initials}
            </span>
            <span className="hidden max-w-[100px] truncate sm:inline">{user?.name}</span>
            <ChevronIcon />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-lg border border-border bg-surface py-1 shadow-lg animate-fade-in">
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-medium text-gray-100">{user?.name}</p>
                <p className="truncate text-xs text-muted">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-accent hover:bg-surface2"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;