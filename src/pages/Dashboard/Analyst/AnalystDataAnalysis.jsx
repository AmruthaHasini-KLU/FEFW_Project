import React, { useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useSettings } from '@/context/SettingsContext';

export default function AnalystDataAnalysisPro() {
  const { theme, toggleTheme } = useSettings();

  useEffect(() => {
    // ensure layout spacing and overflow are consistent
    try {
      document.body.style.margin = 0;
      document.body.style.overflowX = 'hidden';
    } catch (e) {}
  }, []);

  const seasonalData = [
    { label: 'Jan', value: 40 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 30 },
    { label: 'Apr', value: 65 },
    { label: 'May', value: 50 },
  ];

  return (
    <DashboardLayout role="analyst">
      <div style={{ ...styles.page }}>
        {/* Header */}
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>Advanced Data Analysis</h1>
              <p style={styles.subtitle}>
                Deep dive into loan performance and customer behavior
              </p>
          </div>

          <button
            onClick={() => toggleTheme()}
            style={styles.toggle}
          >
            {theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>

        {/* Top Grid */}
        <div style={styles.grid}>
          {/* Customer Segmentation */}
          <div style={styles.card}>
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
          <div style={styles.card}>
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
        <div style={{ ...styles.card, marginTop: 24 }}>
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
    color: 'var(--text)',
    background: 'var(--bg)',
    boxSizing: 'border-box',
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
    color: 'var(--muted)',
    marginTop: 4,
  },

  toggle: {
    padding: '8px 14px',
    borderRadius: 8,
    background: 'var(--panel)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    cursor: 'pointer',
    fontSize: 14,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 20,
    marginTop: 28,
  },

  card: {
    background: 'var(--panel)',
    borderRadius: 14,
    padding: 20,
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 6,
    color: 'var(--text)',
  },

  muted: {
    fontSize: 13,
    color: 'var(--muted)',
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
    background: 'var(--surface)',
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    background: 'var(--accent-600)',
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
    borderBottom: '1px solid var(--border)',
  },

  barWrapper: {
    flex: 1,
    textAlign: 'center',
  },

  chartBar: {
    width: '100%',
    background: 'var(--accent)',
    borderRadius: 6,
    transition: 'height 0.6s ease',
  },

  chartLabel: {
    fontSize: 12,
    marginTop: 6,
    display: 'inline-block',
    color: 'var(--muted)',
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
    color: 'var(--muted)',
    marginTop: 40,
    paddingBottom: 16,
  },
};