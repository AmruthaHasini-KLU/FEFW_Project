import React, { useMemo, useState } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

const sampleLogs = Array.from({ length: 28 }).map((_, i) => ({ id: i + 1, time: `2025-10-${(i%30)+1} 10:${(i%60).toString().padStart(2,'0')}`, actor: ['system','john','admin'][i%3], action: ['login','loan_approved','file_uploaded'][i%3], details: `Details for event ${i+1}` }));

export default function AdminActivity() {
  const [page, setPage] = useState(0);
  const perPage = 10;
  const pages = Math.ceil(sampleLogs.length / perPage);

  const current = useMemo(() => sampleLogs.slice(page * perPage, page * perPage + perPage), [page]);

  return (
    <div className="admin-dashboard dashboard">
      <div className="dashboard-layout">
        <DashboardSidebar basePath="/dashboard/admin" role="admin" />
        <section className="dashboard-content admin-content">
          <header className="admin-header header">
            <div>
              <h1>Activity</h1>
              <p className="muted">System activity and audit logs</p>
            </div>
          </header>

          <div className="card table-block" style={{ padding: '1rem' }}>
            <table className="table">
              <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Details</th></tr></thead>
              <tbody>
                {current.map(l => (
                  <tr key={l.id}><td>{l.time}</td><td>{l.actor}</td><td>{l.action}</td><td>{l.details}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <div className="muted">Page {page+1} of {pages}</div>
              <div>
                <button className="btn btn-outline btn-sm" disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))}>Prev</button>
                <button className="btn btn-outline btn-sm" style={{ marginLeft: 8 }} disabled={page>=pages-1} onClick={() => setPage(p => Math.min(pages-1, p+1))}>Next</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
