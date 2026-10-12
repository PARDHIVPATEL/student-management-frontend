import "../styles/Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loader-wrap" role="status">
      <div className="spinner" />
      <span>{text}</span>
    </div>
  );
}
