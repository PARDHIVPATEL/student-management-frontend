import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

const links = [
  { to: "/", label: "Dashboard", icon: "▦", end: true },
  { to: "/students", label: "Students", icon: "☰", end: true },
  { to: "/students/new", label: "Add Student", icon: "＋", end: true },
];

export default function Sidebar({ open, onToggle, onNavigate }) {
  return (
    <>
      <header className="topbar">
        <button className="menu-btn" onClick={onToggle} aria-label="Toggle navigation" aria-expanded={open}>
          ☰
        </button>
        <span className="topbar-title">Student Management</span>
      </header>

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-logo">🎓</span>
          <div>
            <div className="brand-name">StudentMS</div>
            <div className="brand-sub">Admin Console</div>
          </div>
        </div>
        <nav className="nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              onClick={onNavigate}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon" aria-hidden="true">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">v1.0 · React + Spring Boot</div>
      </aside>

      {open && <div className="backdrop" onClick={onToggle} />}
    </>
  );
}
