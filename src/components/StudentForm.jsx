import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/StudentForm.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

const empty = { name: "", email: "", age: "", department: "", phone: "" };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = "Name is required";
  if (!v.email.trim()) e.email = "Email is required";
  else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address";
  const age = Number(v.age);
  if (v.age === "" || Number.isNaN(age)) e.age = "Age is required";
  else if (!Number.isInteger(age) || age < 1 || age > 120) e.age = "Age must be a whole number between 1 and 120";
  if (!v.department.trim()) e.department = "Department is required";
  if (v.phone.trim() && !PHONE_RE.test(v.phone.trim())) e.phone = "Phone must be 7-20 digits (+, -, spaces allowed)";
  return e;
}

/**
 * Shared by Add and Edit pages.
 * onSubmit(payload) must return a promise; if it rejects with { fieldErrors }
 * those are shown under the matching inputs.
 */
export default function StudentForm({ initial = empty, submitLabel, onSubmit, serverErrors = {} }) {
  const [values, setValues] = useState({ ...empty, ...initial, age: initial.age ?? "", phone: initial.phone ?? "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const shown = { ...serverErrors, ...errors };

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;
    setSaving(true);
    try {
      await onSubmit({
        name: values.name.trim(),
        email: values.email.trim(),
        age: Number(values.age),
        department: values.department.trim(),
        phone: values.phone.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className={`form-group ${shown[name] ? "has-error" : ""}`}>
      <label htmlFor={name}>{label}{props.required && <span className="req"> *</span>}</label>
      <input id={name} name={name} value={values[name]} onChange={change} {...props} />
      {shown[name] && <span className="field-error">{shown[name]}</span>}
    </div>
  );

  return (
    <form className="student-form" onSubmit={submit} noValidate>
      <div className="form-grid">
        {field("name", "Full Name", { type: "text", placeholder: "e.g. Aarav Sharma", required: true, maxLength: 100 })}
        {field("email", "Email Address", { type: "email", placeholder: "name@example.com", required: true, maxLength: 150 })}
        {field("age", "Age", { type: "number", placeholder: "e.g. 20", required: true, min: 1, max: 120 })}
        {field("department", "Department", { type: "text", placeholder: "e.g. Computer Science", required: true, maxLength: 100 })}
        {field("phone", "Phone Number (optional)", { type: "tel", placeholder: "e.g. 9876543210", maxLength: 20 })}
      </div>
      <div className="form-actions">
        <Link to="/students" className="btn btn-secondary">Cancel</Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
