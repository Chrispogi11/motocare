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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    apiGet('/api/dashboard/stats')
      .then(setStats)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading dashboard…</p>
        </div>
      </div>
    );
  }

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
      tension: 0.4,
      borderWidth: 3,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: colors[i % colors.length],
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
    };
  }).filter((d) => d.data.length > 0);

  const mileageChartData = {
    datasets: mileageDatasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        labels: { 
          color: '#fff',
          font: { size: 13, weight: '500' },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        borderColor: 'rgba(34, 197, 94, 0.3)',
        borderWidth: 1,
      }
    },
    scales: {
      x: { 
        ticks: { color: '#9ca3af', font: { size: 12 } }, 
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { color: 'rgba(255,255,255,0.1)' }
      },
      y: { 
        ticks: { color: '#9ca3af', font: { size: 12 } }, 
        grid: { color: 'rgba(255,255,255,0.05)' },
        border: { color: 'rgba(255,255,255,0.1)' }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    }
  };

  const statCards = [
    {
      label: 'Total spending',
      value: `$${Number(stats.totalSpending).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      accent: true,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'This month',
      value: `$${Number(stats.monthlyCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      label: 'Services logged',
      value: stats.serviceCount,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      label: 'Bikes',
      value: stats.bikeCount,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className={`flex items-center justify-between transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div>
          <h1 className="font-heading text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-white/60">Overview of your motorcycle maintenance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`group relative rounded-2xl bg-gradient-to-br ${card.accent ? 'from-accent/10 to-accent/5' : 'from-white/5 to-white/[0.02]'} border ${card.accent ? 'border-accent/20' : 'border-white/10'} p-6 backdrop-blur-sm hover:border-accent/30 transition-all duration-300 hover:transform hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            {/* Glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.accent ? 'from-accent/20' : 'from-white/10'} to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity`} />
            
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-white/60 text-sm mb-2 font-medium tracking-wide uppercase">{card.label}</p>
                <p className={`font-heading text-3xl font-bold ${card.accent ? 'text-accent' : 'text-white'}`}>
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.accent ? 'bg-accent/10' : 'bg-white/5'} border ${card.accent ? 'border-accent/20' : 'border-white/10'} flex items-center justify-center ${card.accent ? 'text-accent' : 'text-white/60'} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mileage Chart */}
      {mileageDatasets.length > 0 && (
        <div className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 md:p-8 backdrop-blur-sm transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-semibold">Mileage progression</h2>
          </div>
          <div className="h-80">
            <Line data={mileageChartData} options={chartOptions} />
          </div>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Services */}
        <div className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-semibold">Recent services</h2>
          </div>
          
          {stats.services?.length ? (
            <ul className="space-y-3">
              {stats.services.slice(0, 5).map((s) => (
                <li key={s.service_id} className="group flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 font-medium truncate">{s.service_type}</p>
                    <p className="text-white/50 text-xs mt-0.5">{s.service_date}</p>
                  </div>
                  <span className="text-accent font-semibold ml-4">${Number(s.cost || 0).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-white/50 text-sm">No services yet</p>
              <Link to="/bikes" className="text-accent hover:underline text-sm mt-2 inline-block">Add a bike</Link>
            </div>
          )}
        </div>

        {/* Recent Expenses */}
        <div className={`rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 p-6 backdrop-blur-sm transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h2 className="font-heading text-xl font-semibold">Recent expenses</h2>
          </div>
          
          {stats.expenses?.length ? (
            <ul className="space-y-3">
              {stats.expenses.slice(0, 5).map((e) => (
                <li key={e.expense_id} className="group flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 font-medium truncate">{e.category}</p>
                    <p className="text-white/50 text-xs mt-0.5">{e.date}</p>
                  </div>
                  <span className="text-accent font-semibold ml-4">${Number(e.amount).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <p className="text-white/50 text-sm">No expenses yet</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className={`text-center transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Link 
          to="/bikes" 
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-hover text-black font-semibold transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105"
        >
          Manage bikes
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}