import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach the stored JWT to every outgoing request, if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("notes_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token is invalid/expired, clear it so the app falls back to the login screen
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("notes_token");
      localStorage.removeItem("notes_user");
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ─── Notes API ────────────────────────────────────────────────────────────────
export const notesAPI = {
  // GET /api/notes?search=&tag=
  getAll: (params = {}) => api.get("/notes", { params }),

  // GET /api/notes/:id
  getById: (id) => api.get(`/notes/${id}`),

  // POST /api/notes
  create: (noteData) => api.post("/notes", noteData),

  // PUT /api/notes/:id
  update: (id, noteData) => api.put(`/notes/${id}`, noteData),

  // DELETE /api/notes/:id
  delete: (id) => api.delete(`/notes/${id}`),

  // PATCH /api/notes/:id/pin
  togglePin: (id) => api.patch(`/notes/${id}/pin`),
};

export default api;