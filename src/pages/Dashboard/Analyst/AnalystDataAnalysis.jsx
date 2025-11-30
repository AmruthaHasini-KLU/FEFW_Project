import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalystDataAnalysisPro() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.style.background = dark ? '#0f172a' : '#ffffff';
    document.body.style.margin = 0;
    document.body.style.overflowX = 'hidden';
  }, [dark]);

  const seasonalData = [
    { label: 'Jan', value: 40 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 30 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 50 },
  ];

  return (
    <DashboardLayout role="analyst">
      <div style={{ ...styles.page, ...(dark && styles.darkPage) }}>
        {/* Header */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Advanced Data Analysis</h1>
            <p style={styles.subtitle}>
              Deep dive into loan performance and customer behavior
            </p>
          </div>

          <button
            onClick={() => setDark(!dark)}
            style={{ ...styles.toggle, ...(dark && styles.toggleDark) }}
          >
            {dark ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Top Grid */}
        <div style={styles.grid}>
          {/* Customer Segmentation */}
          <div style={{ ...styles.card, ...(dark && styles.darkCard) }}>
            <h3 style={styles.cardTitle}>Customer Segmentation</h3>
            <p style={styles.muted}>
              Analysis by customer demographics and behavior
            </p>

            {[
              { name: 'First-time Borrowers', value: 45 },
              { name: 'Repeat Customers', value: 35 },
              { name: 'High-value Customers', value: 20 },
            ].map((item) => (
              <div key={item.name} style={styles.progressRow}>
                <span>{item.name}</span>

                <div style={styles.progressTrack}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${item.value}%`,
                    }}
                  />
                </div>

                <span>{item.value}%</span>
              </div>
            ))}
          </div>

          {/* Seasonal Trends FIXED */}
          <div style={{ ...styles.card, ...(dark && styles.darkCard) }}>
            <h3 style={styles.cardTitle}>Seasonal Trends</h3>
            <p style={styles.muted}>Loan demand patterns throughout the year</p>

            <div style={styles.chartContainer}>
              {seasonalData.map((item) => (
                <div key={item.label} style={styles.barWrapper}>
                  <div
                    style={{
                      ...styles.chartBar,
                      height: `${item.value * 2}px`,
                    }}
                  />
                  <span style={styles.chartLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictive Analytics */}
        <div
          style={{
            ...styles.card,
            ...(dark && styles.darkCard),
            marginTop: 24,
          }}
        >
          <h3 style={styles.cardTitle}>Predictive Analytics</h3>
          <p style={styles.muted}>ML-powered insights and forecasting</p>

          <div style={styles.statsGrid}>
            <div style={styles.statBox}>
              <div style={{ ...styles.statValue, color: '#6366f1' }}>
                92%
              </div>
              <div style={styles.muted}>Predicted approval accuracy</div>
            </div>

            <div style={styles.statBox}>
              <div style={{ ...styles.statValue, color: '#22c55e' }}>
                15%
              </div>
              <div style={styles.muted}>Expected growth next quarter</div>
            </div>

            <div style={styles.statBox}>
              <div style={{ ...styles.statValue, color: '#fb923c' }}>
                2.8%
              </div>
              <div style={styles.muted}>Forecasted default rate</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          © 2025 Fynvia. All rights reserved.
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ------------------ STYLES ------------------ */

const styles = {
  page: {
    padding: 24,
    minHeight: '100vh',
    color: '#111827',
    boxSizing: 'border-box',
  },

  darkPage: {
    color: '#e5e7eb',
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  title: {
    fontSize: 36,
    fontWeight: 700,
    margin: 0,
  },

  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },

  toggle: {
    padding: '8px 14px',
    borderRadius: 8,
    background: '#fff',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontSize: 14,
  },

  toggleDark: {
    background: '#020617',
    color: '#fff',
    border: '1px solid #334155',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 20,
    marginTop: 28,
  },

  card: {
    background: '#ffffff',
    borderRadius: 14,
    padding: 20,
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
  },

  darkCard: {
    background: '#020617',
    border: '1px solid #1e293b',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
  },

  muted: {
    fontSize: 13,
    color: '#9ca3af',
  },

  progressRow: {
    display: 'grid',
    gridTemplateColumns: '160px 1fr 50px',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    fontSize: 14,
  },

  progressTrack: {
    height: 8,
    borderRadius: 20,
    background: '#e5e7eb',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: '#111827',
    borderRadius: 20,
    transition: 'width 1s ease',
  },

  chartContainer: {
    height: 180,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 16,
    marginTop: 28,
    paddingBottom: 6,
    borderBottom: '1px solid #e5e7eb',
  },

  barWrapper: {
    flex: 1,
    textAlign: 'center',
  },

  chartBar: {
    width: '100%',
    background: '#6366f1',
    borderRadius: 6,
    transition: 'height 0.6s ease',
  },

  chartLabel: {
    fontSize: 12,
    marginTop: 6,
    display: 'inline-block',
    color: '#6b7280',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 24,
    marginTop: 28,
  },

  statBox: {
    textAlign: 'center',
  },

  statValue: {
    fontSize: 32,
    fontWeight: 700,
  },

  footer: {
    textAlign: 'center',
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 40,
    paddingBottom: 16,
  },
};