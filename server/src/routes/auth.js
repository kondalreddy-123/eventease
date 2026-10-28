import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'eventease-secret-key-2026';

// Register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  const existing = db.findUserByEmail(email);
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    id: `user-${uuidv4().slice(0, 8)}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: 'user',
    currency: 'INR',
    createdAt: new Date().toISOString()
  };

  db.addUser(newUser);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    message: 'Account created successfully!',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, currency: newUser.currency }
  });
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Welcome back!',
    token,
    user: { id: user.id, name: user.name, email: user.email, currency: user.currency || 'INR' }
  });
});

// Demo login (Instant login into Demo account)
router.post('/demo', (req, res) => {
  let demoUser = db.findUserByEmail('demo@eventease.ai');
  if (!demoUser) {
    const salt = bcrypt.genSaltSync(10);
    demoUser = {
      id: 'user-demo-001',
      name: 'Demo Planner',
      email: 'demo@eventease.ai',
      password: bcrypt.hashSync('demo123', salt),
      role: 'user',
      currency: 'INR',
      createdAt: new Date().toISOString()
    };
    db.addUser(demoUser);
  }

  const token = jwt.sign({ userId: demoUser.id }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    message: 'Demo session active. Enjoy exploring EventEase AI!',
    token,
    isDemo: true,
    user: { id: demoUser.id, name: demoUser.name, email: demoUser.email, currency: demoUser.currency || 'INR' }
  });
});

// Current user profile
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// Update profile / settings
router.put('/profile', requireAuth, (req, res) => {
  const { name, currency } = req.body;
  const user = db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name) user.name = name.trim();
  if (currency) user.currency = currency;
  db.save();

  res.json({
    message: 'Profile updated successfully',
    user: { id: user.id, name: user.name, email: user.email, currency: user.currency }
  });
});

export default router;
