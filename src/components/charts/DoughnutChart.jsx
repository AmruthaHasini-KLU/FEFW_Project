import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ labels = [], values = [], colors = [], loading = false }) {
  if (loading) return <div className="skeleton skeleton-chart" aria-busy="true" />;

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        hoverOffset: 6,
      },
    ],
  };

  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  return <div style={{ height: 200 }}><Doughnut data={data} options={options} /></div>;
}
