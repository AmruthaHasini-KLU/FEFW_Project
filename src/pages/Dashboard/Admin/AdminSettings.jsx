import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardSettings from '@/components/DashboardSettings';

export default function AdminSettings() {
  return (
    <DashboardLayout role="admin">
      <div className="dashboard-content">
        <div className="page-header"><h1>Settings</h1><p className="muted">Manage your account preferences</p></div>
        <DashboardSettings />
      </div>
    </DashboardLayout>
  );
}