import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  const menu = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard" },
    { label: "Notices", icon: "📢", path: "/notices" },
    { label: "Complaints", icon: "📝", path: "/complaints" },
    { label: "Payments", icon: "💳", path: "/payments" },
    { label: "Meetings", icon: "📅", path: "/meetings" },
    { label: "Profile", icon: "👤", path: "/profile" },
    { label: "Logout", icon: "🚪", path: "/logout" },
  ];

  return (
    <div className={open ? "sidebar open" : "sidebar"}>
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        {open ? "←" : "→"}
      </button>

      <ul className="menu-list">
        {menu.map((item) => (
          <li
            key={item.path}
            className={
              location.pathname.startsWith(item.path)
                ? "menu-item active"
                : "menu-item"
            }
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {open && <span className="label">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
