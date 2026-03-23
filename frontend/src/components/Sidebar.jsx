import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Lightbulb, UploadCloud } from 'lucide-react';

export default function Sidebar() {
  return (
    <nav className="navbar">
      <div className="brand">JobIntel Pro</div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/insights" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Lightbulb size={20} /> Insights
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <UploadCloud size={20} /> Upload Data
        </NavLink>
      </div>
    </nav>
  );
}
