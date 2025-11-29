import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ labels = [], data = [], label = 'Series', color = 'rgba(99,102,241,0.9)', loading = false }) {
  if (loading) return <div className="skeleton skeleton-chart" aria-busy="true" />;
  const chartData = {
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.3,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: true, ticks: { color: 'var(--muted)' } } },
  };

  return <div style={{ height: 180 }}><Line options={options} data={chartData} /></div>;
}
