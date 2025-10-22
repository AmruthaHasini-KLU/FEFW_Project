import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/dashboard/lender">Lender</Link></li>
        <li><Link to="/dashboard/borrower">Borrower</Link></li>
        <li><Link to="/dashboard/admin">Admin</Link></li>
        <li><Link to="/dashboard/analyst">Analyst</Link></li>
      </ul>
    </aside>
  );
}
