import { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Toast from "./components/Toast.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StudentList from "./pages/StudentList.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import EditStudent from "./pages/EditStudent.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./styles/App.css";

export default function App() {
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onToggle={() => setMenuOpen((o) => !o)} onNavigate={() => setMenuOpen(false)} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard notify={notify} />} />
          <Route path="/students" element={<StudentList notify={notify} />} />
          <Route path="/students/new" element={<AddStudent notify={notify} />} />
          <Route path="/students/:id" element={<StudentDetails notify={notify} />} />
          <Route path="/students/:id/edit" element={<EditStudent notify={notify} />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
