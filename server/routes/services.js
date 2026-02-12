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

router.get('/:bikeId/services', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { rows } = await pool.query(
      'SELECT * FROM services WHERE bike_id = $1 ORDER BY service_date DESC',
      [bikeId]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/:bikeId/services', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId } = req.params;
    const { service_type, description, service_date, mileage_at_service, cost, shop_name } = req.body;
    if (!service_type?.trim() || !service_date) {
      return res.status(400).json({ error: 'Service type and date are required' });
    }
    const mileage = mileage_at_service != null ? parseInt(mileage_at_service, 10) : 0;
    const costNum = cost != null ? parseFloat(cost) : 0;

    const { rows } = await pool.query(
      `INSERT INTO services (bike_id, service_type, description, service_date, mileage_at_service, cost, shop_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [bikeId, service_type.trim(), description?.trim() || null, service_date, mileage, costNum, shop_name?.trim() || null]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.put('/:bikeId/services/:serviceId', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId, serviceId } = req.params;
    const { service_type, description, service_date, mileage_at_service, cost, shop_name } = req.body;

    const { rows } = await pool.query(
      'UPDATE services SET service_type = COALESCE($1, service_type), description = COALESCE($2, description), service_date = COALESCE($3, service_date), mileage_at_service = COALESCE($4, mileage_at_service), cost = COALESCE($5, cost), shop_name = COALESCE($6, shop_name) WHERE service_id = $7 AND bike_id = $8 RETURNING *',
      [service_type?.trim(), description?.trim(), service_date, mileage_at_service != null ? parseInt(mileage_at_service, 10) : null, cost != null ? parseFloat(cost) : null, shop_name?.trim(), serviceId, bikeId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Service not found' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/:bikeId/services/:serviceId', ensureBikeOwnership, async (req, res) => {
  try {
    const { bikeId, serviceId } = req.params;
    const { rowCount } = await pool.query('DELETE FROM services WHERE service_id = $1 AND bike_id = $2', [serviceId, bikeId]);
    if (rowCount === 0) return res.status(404).json({ error: 'Service not found' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
