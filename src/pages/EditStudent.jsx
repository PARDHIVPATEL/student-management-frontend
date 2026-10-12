import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import StudentForm from "../components/StudentForm.jsx";
import Loader from "../components/Loader.jsx";
import { studentApi, parseError } from "../services/api.js";

export default function EditStudent({ notify }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [serverErrors, setServerErrors] = useState({});

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

  const handleSubmit = async (payload) => {
    try {
      const updated = await studentApi.update(id, payload);
      notify(`Student ${updated.name} updated successfully`);
      navigate(`/students/${id}`);
    } catch (err) {
      const { message, fieldErrors } = parseError(err);
      setServerErrors(
        Object.keys(fieldErrors).length ? fieldErrors : err.response?.status === 409 ? { email: message } : {}
      );
      notify(message, "error");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Edit Student</h1>
          <p className="muted">Update the details for student ID {id}</p>
        </div>
      </div>
      <div className="card">
        {loading && <Loader text="Loading student..." />}
        {!loading && error && (
          <div className="state-card">
            <p className="error-text">{error}</p>
            <Link to="/students" className="btn btn-secondary">Back to list</Link>
          </div>
        )}
        {!loading && student && (
          <StudentForm initial={student} submitLabel="Save Changes" onSubmit={handleSubmit} serverErrors={serverErrors} />
        )}
      </div>
    </div>
  );
}
