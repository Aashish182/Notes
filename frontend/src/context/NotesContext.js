import React, { createContext, useContext, useReducer, useCallback } from "react";
import { notesAPI } from "../utils/api";

const initialState = {
  notes: [],
  loading: false,
  error: null,
  searchQuery: "",
  activeTag: "",
};

const notesReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_NOTES":
      return { ...state, notes: action.payload, loading: false, error: null };
    case "ADD_NOTE":
      return { ...state, notes: [action.payload, ...state.notes], loading: false };
    case "UPDATE_NOTE":
      return {
        ...state,
        loading: false,
        notes: state.notes.map((n) => (n._id === action.payload._id ? action.payload : n)),
      };
    case "DELETE_NOTE":
      return { ...state, notes: state.notes.filter((n) => n._id !== action.payload) };
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_TAG":
      return { ...state, activeTag: action.payload };
    default:
      return state;
  }
};

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  const fetchNotes = useCallback(async (params = {}) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await notesAPI.getAll(params);
      dispatch({ type: "SET_NOTES", payload: res.data.data });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: err.response?.data?.message || "Failed to load notes" });
    }
  }, []);

  const createNote = useCallback(async (noteData) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await notesAPI.create(noteData);
      await fetchNotes();
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create note";
      dispatch({ type: "SET_ERROR", payload: msg });
      return { success: false, message: msg };
    }
  }, [fetchNotes]);

  const updateNote = useCallback(async (id, noteData) => {
    try {
      const res = await notesAPI.update(id, noteData);
      dispatch({ type: "UPDATE_NOTE", payload: res.data.data });
      return { success: true, data: res.data.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update note";
      return { success: false, message: msg };
    }
  }, []);

  const deleteNote = useCallback(async (id) => {
    try {
      await notesAPI.delete(id);
      dispatch({ type: "DELETE_NOTE", payload: id });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete note";
      return { success: false, message: msg };
    }
  }, []);

  const togglePin = useCallback(async (id) => {
    try {
      const res = await notesAPI.togglePin(id);
      dispatch({ type: "UPDATE_NOTE", payload: res.data.data });
      dispatch({ type: "SET_NOTES", payload: [] });
      await fetchNotes();
    } catch (err) {
      console.error("Failed to toggle pin:", err);
    }
  }, [fetchNotes]);

  return (
    <NotesContext.Provider
      value={{ ...state, fetchNotes, createNote, updateNote, deleteNote, togglePin, dispatch }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used within NotesProvider");
  return context;
};