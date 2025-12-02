import { useState } from "react";
import { 
  LayoutDashboard, 
  Bell, 
  MessageSquare, 
  CreditCard, 
  Calendar, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import "../css/Sidebar.css";

const Sidebar = ({ onNavigate, activeKey }) => {
  const [open, setOpen] = useState(true);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));

  // Resident Menu (keys used by Home switch-case) - without logout
  const residentMenu = [
    { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
    { label: "Notices", icon: Bell, key: "notices" },
    { label: "Complaints", icon: MessageSquare, key: "complaints" },
    { label: "Payments", icon: CreditCard, key: "payments:resident" },
    { label: "Meetings", icon: Calendar, key: "meetings:list" },
    { label: "Profile", icon: User, key: "profile" },
  ];

  // Admin Menu - without logout
  const adminMenu = [
    { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
    { label: "Notices", icon: Bell, key: "notices" },
    { label: "Manage Complaints", icon: MessageSquare, key: "complaints:admin" },
    { label: "Manage Payments", icon: CreditCard, key: "payments:admin" },
    { label: "Meetings", icon: Calendar, key: "meetings:list" },
    { label: "Profile", icon: User, key: "profile" },
  ];

  // Select menu based on role
  const menu = user?.role === "admin" ? adminMenu : residentMenu;

  return (
    <div className={open ? "sidebar open" : "sidebar"}>
      {/* Logo and Brand Section */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-circle">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {open && <span className="brand-name">SocietyConnect</span>}
        </div>
      </div>

      {/* Toggle Button */}
      <button className="toggle-btn" onClick={() => setOpen(!open)}>
        {open ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Main Menu */}
      <ul className="menu-list">
        {menu.map((item) => {
          const IconComponent = item.icon;
          return (
            <li key={item.key} className={item.key === activeKey ? "menu-item active" : "menu-item"}>
              <button
                type="button"
                className="menu-button"
                onClick={() => {
                  if (typeof onNavigate === "function") {
                    onNavigate(item.key);
                  }
                }}
              >
                <span className="icon">
                  <IconComponent size={20} />
                </span>
                {open && <span className="label">{item.label}</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Logout Button at Bottom */}
      <div className="sidebar-footer">
        <button
          type="button"
          className="menu-button logout-button"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
        >
          <span className="icon">
            <LogOut size={20} />
          </span>
          {open && <span className="label">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
