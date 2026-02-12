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

router.get('/:bikeId/mileage', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM mileage_logs WHERE bike_id = $1 ORDER BY date DESC',
      [bikeId]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch mileage logs' });
  }
});

router.post('/:bikeId/mileage', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { date, mileage } = req.body;
    if (!date || mileage == null) {
      return res.status(400).json({ error: 'Date and mileage are required' });
    }
    const m = parseInt(mileage, 10);
    if (Number.isNaN(m) || m < 0) return res.status(400).json({ error: 'Invalid mileage' });

    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        `INSERT INTO mileage_logs (bike_id, date, mileage) VALUES ($1, $2, $3)
         ON CONFLICT (bike_id, date) DO UPDATE SET mileage = $3 RETURNING *`,
        [bikeId, date, m]
      );
      await client.query('UPDATE bikes SET current_mileage = $1 WHERE bike_id = $2', [m, bikeId]);
      res.status(201).json(rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Mileage for this date already exists' });
    res.status(500).json({ error: 'Failed to create mileage log' });
  }
});

router.delete('/:bikeId/mileage/:logId', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId, logId } = req.params;
    const { rowCount } = await pool.query('DELETE FROM mileage_logs WHERE log_id = $1 AND bike_id = $2', [logId, bikeId]);
    if (rowCount === 0) return res.status(404).json({ error: 'Mileage log not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete mileage log' });
  }
});

export default router;
