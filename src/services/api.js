import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

/** Turn any Axios error into a friendly { message, fieldErrors } object. */
export function parseError(error) {
  if (error.response) {
    const data = error.response.data || {};
    return {
      message: data.message || `Request failed (status ${error.response.status})`,
      fieldErrors: data.fieldErrors || {},
    };
  }
  if (error.code === "ECONNABORTED") {
    return { message: "The server took too long to respond. Please try again.", fieldErrors: {} };
  }
  return {
    message: "Cannot reach the server. Make sure the backend is running on port 8080.",
    fieldErrors: {},
  };
}

export const studentApi = {
  getAll: () => api.get("/students").then((r) => r.data),
  getById: (id) => api.get(`/students/${id}`).then((r) => r.data),
  create: (student) => api.post("/students", student).then((r) => r.data),
  update: (id, student) => api.put(`/students/${id}`, student).then((r) => r.data),
  remove: (id) => api.delete(`/students/${id}`).then((r) => r.data),
  search: (q) => api.get("/students/search", { params: { q } }).then((r) => r.data),
  stats: () => api.get("/students/stats").then((r) => r.data),
};

export default api;
