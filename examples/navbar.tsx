import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <div className="navbar">
      <ul>
        <li className="nav-link">
          <Link to="/basic">Basic</Link>
        </li>
        <li className="nav-link">
          <Link to="/relative">Relative</Link>
        </li>
        <li className="nav-link">
          <Link to="/stacked">Stacked</Link>
        </li>
      </ul>
    </div>
  );
}
