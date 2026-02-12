import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT bike_id, user_id, brand, model, year, plate_number, engine_cc, current_mileage, photo, created_at FROM bikes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bikes' });
  }
});

router.get('/:bikeId', async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM bikes WHERE bike_id = $1 AND user_id = $2',
      [bikeId, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Bike not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to fetch bike' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { brand, model, year, plate_number, engine_cc, current_mileage } = req.body;
    if (!brand?.trim() || !model?.trim() || !year) {
      return res.status(400).json({ error: 'Brand, model and year are required' });
    }
    const y = parseInt(year, 10);
    if (Number.isNaN(y) || y < 1900 || y > new Date().getFullYear() + 1) {
      return res.status(400).json({ error: 'Invalid year' });
    }

    const { rows } = await pool.query(
      `INSERT INTO bikes (user_id, brand, model, year, plate_number, engine_cc, current_mileage)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING bike_id, user_id, brand, model, year, plate_number, engine_cc, current_mileage, photo, created_at`,
      [
        req.user.id,
        brand.trim(),
        model.trim(),
        y,
        plate_number?.trim() || null,
        engine_cc != null ? parseInt(engine_cc, 10) : null,
        current_mileage != null ? parseInt(current_mileage, 10) : 0,
      ]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create bike' });
  }
});

router.put('/:bikeId', async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { brand, model, year, plate_number, engine_cc, current_mileage, photo } = req.body;

    const { rows } = await pool.query(
      'SELECT bike_id FROM bikes WHERE bike_id = $1 AND user_id = $2',
      [bikeId, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Bike not found' });

    const updates = [];
    const values = [];
    let i = 1;
    if (brand !== undefined) { updates.push(`brand = $${i++}`); values.push(brand.trim()); }
    if (model !== undefined) { updates.push(`model = $${i++}`); values.push(model.trim()); }
    if (year !== undefined) { updates.push(`year = $${i++}`); values.push(parseInt(year, 10)); }
    if (plate_number !== undefined) { updates.push(`plate_number = $${i++}`); values.push(plate_number?.trim() || null); }
    if (engine_cc !== undefined) { updates.push(`engine_cc = $${i++}`); values.push(engine_cc == null ? null : parseInt(engine_cc, 10)); }
    if (current_mileage !== undefined) { updates.push(`current_mileage = $${i++}`); values.push(parseInt(current_mileage, 10)); }
    if (photo !== undefined) { updates.push(`photo = $${i++}`); values.push(photo || null); }

    if (updates.length === 0) {
      const { rows: r } = await pool.query('SELECT * FROM bikes WHERE bike_id = $1 AND user_id = $2', [bikeId, req.user.id]);
      return res.json(r[0]);
    }
    values.push(bikeId, req.user.id);
    const { rows: updated } = await pool.query(
      `UPDATE bikes SET ${updates.join(', ')} WHERE bike_id = $${i} AND user_id = $${i + 1} RETURNING *`,
      values
    );
    res.json(updated[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update bike' });
  }
});

router.delete('/:bikeId', async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { rowCount } = await pool.query('DELETE FROM bikes WHERE bike_id = $1 AND user_id = $2', [bikeId, req.user.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Bike not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete bike' });
  }
});

// Photo upload for a bike
router.post('/:bikeId/photo', upload.single('photo'), async (req, res) => {
  try {
    const { bikeId } = req.params;
    if (!req.file) return res.status(400).json({ error: 'No photo file uploaded' });

    const photoPath = `/uploads/${req.file.filename}`;
    const { rows } = await pool.query(
      'UPDATE bikes SET photo = $1 WHERE bike_id = $2 AND user_id = $3 RETURNING bike_id, photo',
      [photoPath, bikeId, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Bike not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

export default router;
