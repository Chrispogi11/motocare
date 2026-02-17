import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import bikesRoutes from './routes/bikes.js';
import servicesRoutes from './routes/services.js';
import mileageRoutes from './routes/mileage.js';
import expensesRoutes from './routes/expenses.js';
import dashboardRoutes from './routes/dashboard.js';
import fredRoutes from './routes/fred.js';
import { ensureUploadDir } from './middleware/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

ensureUploadDir();

// Static uploads (for photo URLs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/bikes', bikesRoutes);
app.use('/api/bikes', servicesRoutes);
app.use('/api/bikes', mileageRoutes);
app.use('/api/bikes', expensesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/fred', fredRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`MotoCare API on http://localhost:${PORT}`));
