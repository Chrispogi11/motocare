import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiGet } from '../api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/dashboard/stats')
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-white/60">Loading dashboard…</p>;
  if (error) return <p className="text-red-400">Failed to load: {error}</p>;
  if (!stats) return null;

  const mileageDatasets = Object.entries(stats.mileageByBike || {}).map(([bikeId, points], i) => {
    const bike = stats.bikes?.find((b) => String(b.bike_id) === bikeId);
    const label = bike ? `${bike.brand} ${bike.model}` : `Bike ${bikeId}`;
    const colors = ['#22c55e', '#4ade80', '#86efac'];
    return {
      label,
      data: points.map((p) => ({ x: p.date, y: p.mileage })),
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length] + '20',
      tension: 0.3,
    };
  }).filter((d) => d.data.length > 0);

  const mileageChartData = {
    datasets: mileageDatasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: '#fff' } },
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

  return (
    <div className="space-y-12">
      <h1 className="font-heading text-4xl font-bold">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm mb-1">Total spending</p>
          <p className="font-heading text-2xl font-bold text-accent">${Number(stats.totalSpending).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm mb-1">This month</p>
          <p className="font-heading text-2xl font-bold text-white">${Number(stats.monthlyCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm mb-1">Services logged</p>
          <p className="font-heading text-2xl font-bold text-white">{stats.serviceCount}</p>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <p className="text-white/60 text-sm mb-1">Bikes</p>
          <p className="font-heading text-2xl font-bold text-white">{stats.bikeCount}</p>
        </div>
      </div>

      {mileageDatasets.length > 0 && (
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">Mileage trend</h2>
          <div className="h-64">
            <Line data={mileageChartData} options={chartOptions} />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">Recent services</h2>
          {stats.services?.length ? (
            <ul className="space-y-3">
              {stats.services.slice(0, 5).map((s) => (
                <li key={s.service_id} className="flex justify-between text-sm">
                  <span className="text-white/80">{s.service_type} — {s.service_date}</span>
                  <span className="text-accent">${Number(s.cost || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50 text-sm">No services yet. <Link to="/bikes" className="text-accent hover:underline">Add a bike</Link> and log a service.</p>
          )}
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-6">
          <h2 className="font-heading text-xl font-semibold mb-4">Recent expenses</h2>
          {stats.expenses?.length ? (
            <ul className="space-y-3">
              {stats.expenses.slice(0, 5).map((e) => (
                <li key={e.expense_id} className="flex justify-between text-sm">
                  <span className="text-white/80">{e.category} — {e.date}</span>
                  <span className="text-accent">${Number(e.amount).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/50 text-sm">No expenses yet.</p>
          )}
        </div>
      </div>

      <div>
        <Link to="/bikes" className="inline-block px-6 py-3 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold transition">
          Manage bikes
        </Link>
      </div>
    </div>
  );
}
