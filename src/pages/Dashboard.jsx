import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { studentApi, parseError } from "../services/api.js";
import Loader from "../components/Loader.jsx";
import "../styles/Dashboard.css";

export default function Dashboard({ notify }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setStats(await studentApi.stats());
    } catch (err) {
      const { message } = parseError(err);
      setError(message);
      notify(message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const max = stats ? Math.max(1, ...stats.departments.map((d) => d.count)) : 1;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Overview of your student records</p>
        </div>
      </div>

      {loading && <Loader text="Loading statistics..." />}

      {!loading && error && (
        <div className="card state-card">
          <p className="error-text">{error}</p>
          <button className="btn btn-primary" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="stat-grid">
            <div className="card stat-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{stats.totalStudents}</span>
            </div>
            <div className="card stat-card accent">
              <span className="stat-label">Departments</span>
              <span className="stat-value">{stats.totalDepartments}</span>
            </div>
            <div className="card stat-card warm">
              <span className="stat-label">Largest Department</span>
              <span className="stat-value small">
                {stats.departments[0] ? `${stats.departments[0].department} (${stats.departments[0].count})` : "—"}
              </span>
            </div>
          </div>

          <div className="dash-grid">
            <section className="card">
              <h2>Students by Department</h2>
              {stats.departments.length === 0 ? (
                <p className="muted">No data yet. Add your first student to see statistics.</p>
              ) : (
                <ul className="bars">
                  {stats.departments.map((d) => (
                    <li key={d.department}>
                      <div className="bar-head">
                        <span>{d.department}</span>
                        <strong>{d.count}</strong>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(d.count / max) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <Link to="/students/new" className="btn btn-primary">＋ Add New Student</Link>
                <Link to="/students" className="btn btn-secondary">View All Students</Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
