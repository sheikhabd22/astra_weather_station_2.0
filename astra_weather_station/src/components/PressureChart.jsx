import React, { useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler, Legend);

export default function PressureChart({ labels, values }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels.map(d => {
          try { const dt = new Date(d); return `${dt.getMonth()+1}/${dt.getDate()} ${String(dt.getHours()).padStart(2,'0')}`; }
          catch { return String(d); }
        }),
        datasets: [{
          label: 'Surface Pressure (hPa)',
          data: values,
          borderColor: '#1f8ac0',
          backgroundColor: 'rgba(31,138,192,0.15)',
          tension: 0.25,
          pointRadius: 0,
          fill: true,
        }],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: { maxTicksLimit: 6, color: '#4b6486' },
          },
          y: {
            grid: { color: '#e7eef7' },
            ticks: { color: '#4b6486' },
          },
        },
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
      },
    });

    const handle = () => chartRef.current?.resize();
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('resize', handle);
      chartRef.current?.destroy();
    };
  }, [labels, values]);

  return (
    <div className="pressure-chart glass-bg">
      <div className="section-title">Pressure (hPa) - Recent</div>
      <div className="chart-wrap" style={{ height: 260 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}


