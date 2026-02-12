import { Router } from 'express';
import pool from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;

    const [bikesRes, servicesRes, expensesRes, mileageRes] = await Promise.all([
      pool.query('SELECT bike_id, brand, model, current_mileage FROM bikes WHERE user_id = $1', [userId]),
      pool.query(
        `SELECT s.bike_id, s.service_date, s.cost, s.service_type
         FROM services s JOIN bikes b ON s.bike_id = b.bike_id WHERE b.user_id = $1 ORDER BY s.service_date DESC`,
        [userId]
      ),
      pool.query(
        `SELECT e.bike_id, e.date, e.amount, e.category
         FROM expenses e JOIN bikes b ON e.bike_id = b.bike_id WHERE b.user_id = $1 ORDER BY e.date DESC`,
        [userId]
      ),
      pool.query(
        `SELECT m.bike_id, m.date, m.mileage
         FROM mileage_logs m JOIN bikes b ON m.bike_id = b.bike_id WHERE b.user_id = $1 ORDER BY m.date ASC`,
        [userId]
      ),
    ]);

    const bikes = bikesRes.rows;
    const services = servicesRes.rows;
    const expenses = expensesRes.rows;
    const mileage = mileageRes.rows;

    const totalSpending =
      expenses.reduce((sum, e) => sum + Number(e.amount), 0) +
      services.reduce((sum, s) => sum + Number(s.cost || 0), 0);

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlyCost =
      expenses
        .filter((e) => e.date && e.date.toString().startsWith(thisMonth))
        .reduce((sum, e) => sum + Number(e.amount), 0) +
      services
        .filter((s) => s.service_date && s.service_date.toString().startsWith(thisMonth))
        .reduce((sum, s) => sum + Number(s.cost || 0), 0);

    const mileageByBike = {};
    bikes.forEach((b) => (mileageByBike[b.bike_id] = []));
    mileage.forEach((m) => {
      if (mileageByBike[m.bike_id]) {
        mileageByBike[m.bike_id].push({ date: m.date, mileage: Number(m.mileage) });
      }
    });

    res.json({
      totalSpending: Math.round(totalSpending * 100) / 100,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      serviceCount: services.length,
      bikeCount: bikes.length,
      services: services.slice(0, 10),
      expenses: expenses.slice(0, 10),
      mileageByBike,
      bikes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

export default router;
