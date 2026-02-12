import { Router } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    if (password.length < MIN_PASSWORD) {
      return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters` });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name.trim(), email.trim().toLowerCase(), hashed]
    );
    const user = rows[0];
    const token = signToken(user.id, user.email);
    res.status(201).json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { rows } = await pool.query(
      'SELECT id, name, email, password FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id, user.email);
    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
