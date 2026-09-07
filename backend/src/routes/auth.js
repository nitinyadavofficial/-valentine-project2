import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'railgo-secret-key-change-in-production';
const USERS = new Map();

const registerSchema = {
  name: (val) => typeof val === 'string' && val.length >= 2,
  email: (val) => typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone: (val) => typeof val === 'string' && val.length >= 10,
  password: (val) => typeof val === 'string' && val.length >= 8,
};

const loginSchema = {
  email: (val) => typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  password: (val) => typeof val === 'string' && val.length >= 1,
};

function validate(schema, data) {
  const errors = {};
  for (const [key, validator] of Object.entries(schema)) {
    if (!validator(data[key])) {
      errors[key] = `Invalid ${key}`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  const validation = validate(registerSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid input', details: validation.errors });
  }

  if (USERS.has(email)) {
    return res.status(409).json({ success: false, error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: `USR${Date.now()}`,
    name,
    email,
    phone,
    password: hashedPassword,
    savedPassengers: [],
    savedPaymentMethods: [],
    preferences: {
      notifications: { email: true, sms: true, push: true },
      defaultClass: '3A',
      language: 'en',
      currency: 'INR',
    },
    createdAt: new Date().toISOString(),
  };

  USERS.set(email, user);

  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '30d' });

  const { password: _, ...userWithoutPassword } = user;
  res.status(201).json({ success: true, data: { user: userWithoutPassword, token } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const validation = validate(loginSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid input', details: validation.errors });
  }

  const user = USERS.get(email);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '30d' });

  const { password: _, ...userWithoutPassword } = user;
  res.json({ success: true, data: { user: userWithoutPassword, token } });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = Array.from(USERS.values()).find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;