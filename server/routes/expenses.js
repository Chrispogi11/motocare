import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router({ mergeParams: true });
router.use(authMiddleware);

async function ensureBikeOwnership(req, res, next) {
  const { bikeId } = req.params;
  const { rows } = await pool.query('SELECT bike_id FROM bikes WHERE bike_id = $1 AND user_id = $2', [bikeId, req.user.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Bike not found' });
  next();
}

router.get('/:bikeId/expenses', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM expenses WHERE bike_id = $1 ORDER BY date DESC',
      [bikeId]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

router.post('/:bikeId/expenses', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { category, amount, date, notes } = req.body;
    if (!category?.trim() || amount == null || !date) {
      return res.status(400).json({ error: 'Category, amount and date are required' });
    }
    const amt = parseFloat(amount);
    if (Number.isNaN(amt)) return res.status(400).json({ error: 'Invalid amount' });

    const { rows } = await pool.query(
      'INSERT INTO expenses (bike_id, category, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [bikeId, category.trim(), amt, date, notes?.trim() || null]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

router.put('/:bikeId/expenses/:expenseId', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId, expenseId } = req.params;
    const { category, amount, date, notes } = req.body;

    const updates = [];
    const values = [];
    let i = 1;
    if (category !== undefined) { updates.push(`category = $${i++}`); values.push(category.trim()); }
    if (amount !== undefined) { updates.push(`amount = $${i++}`); values.push(parseFloat(amount)); }
    if (date !== undefined) { updates.push(`date = $${i++}`); values.push(date); }
    if (notes !== undefined) { updates.push(`notes = $${i++}`); values.push(notes?.trim() || null); }
    if (updates.length === 0) {
      const { rows } = await pool.query('SELECT * FROM expenses WHERE expense_id = $1 AND bike_id = $2', [expenseId, bikeId]);
      if (!rows[0]) return res.status(404).json({ error: 'Expense not found' });
      return res.json(rows[0]);
    }
    values.push(expenseId, bikeId);
    const { rows } = await pool.query(
      `UPDATE expenses SET ${updates.join(', ')} WHERE expense_id = $${i} AND bike_id = $${i + 1} RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: 'Expense not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

router.delete('/:bikeId/expenses/:expenseId', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId, expenseId } = req.params;
    const { rowCount } = await pool.query('DELETE FROM expenses WHERE expense_id = $1 AND bike_id = $2', [expenseId, bikeId]);
    if (rowCount === 0) return res.status(404).json({ error: 'Expense not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
