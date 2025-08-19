import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>Choose a test</h2>
      <div className="home-actions">
        <NavLink to="/text" className="btn">
          Test Caption (Text)
        </NavLink>
        <NavLink to="/image" className="btn">
          Test Image
        </NavLink>
      </div>
    </div>
  );
}
