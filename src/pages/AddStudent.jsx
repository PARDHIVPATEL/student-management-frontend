import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentForm from "../components/StudentForm.jsx";
import { studentApi, parseError } from "../services/api.js";

export default function AddStudent({ notify }) {
  const navigate = useNavigate();
  const [serverErrors, setServerErrors] = useState({});

  const handleSubmit = async (payload) => {
    try {
      const created = await studentApi.create(payload);
      notify(`Student ${created.name} added successfully (ID ${created.id})`);
      navigate("/students");
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
          <h1>Add Student</h1>
          <p className="muted">Enter the details of the new student</p>
        </div>
      </div>
      <div className="card">
        <StudentForm submitLabel="Add Student" onSubmit={handleSubmit} serverErrors={serverErrors} />
      </div>
    </div>
  );
}
