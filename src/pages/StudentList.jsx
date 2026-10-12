import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentApi, parseError } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import "../styles/StudentList.css";

export default function StudentList({ notify }) {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Debounced fetch: loads everything when the box is empty, otherwise searches by name / ID / department.
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const q = query.trim();
        const data = q ? await studentApi.search(q) : await studentApi.getAll();
        if (!cancelled) setStudents(data);
      } catch (err) {
        if (!cancelled) {
          const { message } = parseError(err);
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.remove(toDelete.id);
      setStudents((list) => list.filter((s) => s.id !== toDelete.id));
      notify(`Deleted ${toDelete.name}`);
      setToDelete(null);
    } catch (err) {
      notify(parseError(err).message, "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Students</h1>
          <p className="muted">{loading ? "Loading..." : `${students.length} record${students.length === 1 ? "" : "s"}`}</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">＋ Add Student</Link>
      </div>

      <div className="card">
        <div className="toolbar">
          <input
            className="search-input"
            type="search"
            placeholder="Search by name, ID or department..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search students"
          />
        </div>

        {loading && <Loader text="Loading students..." />}

        {!loading && error && <p className="error-text center">{error}</p>}

        {!loading && !error && students.length === 0 && (
          <p className="muted center empty">
            {query.trim() ? `No students match "${query.trim()}".` : "No students yet. Click “Add Student” to create one."}
          </p>
        )}

        {!loading && !error && students.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Department</th>
                  <th>Phone</th>
                  <th className="actions-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td data-label="ID">{s.id}</td>
                    <td data-label="Name">
                      <Link to={`/students/${s.id}`} className="name-link">{s.name}</Link>
                    </td>
                    <td data-label="Email">{s.email}</td>
                    <td data-label="Age">{s.age}</td>
                    <td data-label="Department"><span className="badge">{s.department}</span></td>
                    <td data-label="Phone">{s.phone || "—"}</td>
                    <td data-label="Actions" className="actions-col">
                      <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/students/${s.id}`)}>View</button>
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/students/${s.id}/edit`)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => setToDelete(s)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete student?"
        message={toDelete ? `Are you sure you want to delete ${toDelete.name} (ID ${toDelete.id})? This action cannot be undone.` : ""}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
