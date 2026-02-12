import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiGet, apiPost, apiPut, apiDelete } from '../api';

export default function Expenses() {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    category: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
  });

  const base = `/api/bikes/${bikeId}/expenses`;

  function load() {
    Promise.all([
      apiGet(`/api/bikes/${bikeId}`),
      apiGet(base),
    ])
      .then(([bikeData, expensesData]) => {
        setBike(bikeData);
        setExpenses(expensesData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [bikeId]);

  function openEdit(e) {
    setEditingId(e.expense_id);
    setForm({
      category: e.category,
      amount: e.amount,
      date: e.date,
      notes: e.notes || '',
    });
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setError('');
    try {
      if (editingId) {
        await apiPut(`${base}/${editingId}`, form);
        setEditingId(null);
      } else {
        await apiPost(base, form);
        setShowForm(false);
      }
      setForm({ category: '', amount: '', date: new Date().toISOString().slice(0, 10), notes: '' });
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(expenseId) {
    if (!confirm('Delete this expense?')) return;
    try {
      await apiDelete(`${base}/${expenseId}`);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  if (loading) return <p className="text-white/60">Loading…</p>;
  if (!bike) return <p className="text-red-400">{error || 'Bike not found'}</p>;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link to={`/bikes/${bikeId}`} className="text-white/60 hover:text-white text-sm">← Bike</Link>
        <h1 className="font-heading text-3xl font-bold">Expenses</h1>
        <span className="text-white/60">{bike.brand} {bike.model}</span>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-md">
        <h2 className="font-heading text-xl font-semibold mb-2">Total for this bike</h2>
        <p className="text-accent font-heading text-3xl font-bold">${total.toFixed(2)}</p>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => { setShowForm(true); setEditingId(null); setForm({ category: '', amount: '', date: new Date().toISOString().slice(0, 10), notes: '' }); }}
          className="px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold"
        >
          Add expense
        </button>
      </div>

      {(showForm || editingId) && (
        <form onSubmit={handleSubmit} className="rounded-xl bg-white/5 border border-white/10 p-6 max-w-xl space-y-4">
          <h2 className="font-heading text-xl font-semibold">{editingId ? 'Edit expense' : 'New expense'}</h2>
          <div>
            <label className="block text-sm text-white/70 mb-1">Category *</label>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              placeholder="e.g. Fuel, Parts, Insurance"
              required
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">Amount *</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-white/70 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-black font-semibold">Save</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Cancel</button>
          </div>
        </form>
      )}

      <ul className="space-y-4">
        {expenses.map((e) => (
          <li key={e.expense_id} className="rounded-xl bg-white/5 border border-white/10 p-5 flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="font-heading font-semibold text-lg">{e.category}</h3>
              <p className="text-white/60 text-sm">{e.date}</p>
              {e.notes && <p className="text-white/70 mt-1">{e.notes}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-accent font-semibold">${Number(e.amount).toFixed(2)}</span>
              <button type="button" onClick={() => openEdit(e)} className="text-sm text-white/60 hover:text-white">Edit</button>
              <button type="button" onClick={() => handleDelete(e.expense_id)} className="text-sm text-red-400 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {expenses.length === 0 && !showForm && <p className="text-white/50">No expenses logged yet.</p>}
    </div>
  );
}
