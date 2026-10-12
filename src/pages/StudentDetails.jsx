import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { studentApi, parseError } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import "../styles/StudentDetails.css";

export default function StudentDetails({ notify }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await studentApi.getById(id);
        if (!cancelled) setStudent(data);
      } catch (err) {
        if (!cancelled) setError(parseError(err).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await studentApi.remove(id);
      notify(`Deleted ${student.name}`);
      navigate("/students");
    } catch (err) {
      notify(parseError(err).message, "error");
      setDeleting(false);
    }
  };

  const initials = (name) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Student Details</h1>
          <p className="muted">Full record for student ID {id}</p>
        </div>
        <Link to="/students" className="btn btn-secondary">← Back to list</Link>
      </div>

      {loading && <Loader text="Loading student..." />}

      {!loading && error && (
        <div className="card state-card">
          <p className="error-text">{error}</p>
          <Link to="/students" className="btn btn-primary">Back to list</Link>
        </div>
      )}

      {!loading && student && (
        <div className="card details-card">
          <div className="details-head">
            <div className="avatar">{initials(student.name)}</div>
            <div>
              <h2>{student.name}</h2>
              <span className="badge">{student.department}</span>
            </div>
          </div>
          <dl className="details-grid">
            <div><dt>Student ID</dt><dd>{student.id}</dd></div>
            <div><dt>Email</dt><dd>{student.email}</dd></div>
            <div><dt>Age</dt><dd>{student.age}</dd></div>
            <div><dt>Department</dt><dd>{student.department}</dd></div>
            <div><dt>Phone</dt><dd>{student.phone || "Not provided"}</dd></div>
          </dl>
          <div className="details-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/students/${student.id}/edit`)}>Edit</button>
            <button className="btn btn-danger" onClick={() => setConfirming(true)}>Delete</button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        title="Delete student?"
        message={student ? `Are you sure you want to delete ${student.name}? This action cannot be undone.` : ""}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
}
