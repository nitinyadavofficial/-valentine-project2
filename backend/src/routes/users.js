import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'railgo-secret-key-change-in-production';

const USERS = new Map([
  ['prince.patel@email.com', {
    id: 'USR001',
    name: 'Prince Patel',
    email: 'prince.patel@email.com',
    phone: '+91 98765 43210',
    savedPassengers: [
      { id: 'SP1', name: 'Prince Patel', age: 28, gender: 'M', idType: 'AADHAAR', idNumber: 'XXXX XXXX 1234', seatPreference: 'LB', mealPreference: 'VEG' },
      { id: 'SP2', name: 'Anjali Patel', age: 26, gender: 'F', idType: 'AADHAAR', idNumber: 'XXXX XXXX 5678', seatPreference: 'UB', mealPreference: 'VEG' },
    ],
    savedPaymentMethods: [
      { id: 'PM1', type: 'UPI', name: 'PhonePe', upiId: 'prince@ybl', isDefault: true },
      { id: 'PM2', type: 'CARD', name: 'HDFC Credit Card', maskedNumber: '**** **** **** 1234', isDefault: false },
    ],
    preferences: {
      notifications: { email: true, sms: true, push: true },
      defaultClass: '3A',
      language: 'en',
      currency: 'INR',
    },
  }],
]);

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = USERS.get(decoded.email) || USERS.values().next().value;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

const profileSchema = {
  name: (val) => typeof val === 'string' && val.length >= 2,
  email: (val) => typeof val === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  phone: (val) => typeof val === 'string' && val.length >= 10,
};

const passengerSchema = {
  name: (val) => typeof val === 'string' && val.length >= 2,
  age: (val) => typeof val === 'number' && val >= 1 && val <= 120,
  gender: (val) => ['M', 'F', 'O'].includes(val),
  idType: (val) => ['AADHAAR', 'PAN', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE'].includes(val),
  idNumber: (val) => typeof val === 'string' && val.length >= 4,
  seatPreference: (val) => ['LB', 'MB', 'UB', 'ANY'].includes(val),
  mealPreference: (val) => ['VEG', 'NON_VEG', 'NO_MEAL'].includes(val),
};

const paymentSchema = {
  type: (val) => ['UPI', 'CARD', 'NET_BANKING', 'WALLET'].includes(val),
  name: (val) => typeof val === 'string' && val.length > 0,
  upiId: (val) => !val || typeof val === 'string',
  cardNumber: (val) => !val || typeof val === 'string',
  expiry: (val) => !val || typeof val === 'string',
  cvv: (val) => !val || typeof val === 'string',
  bank: (val) => !val || typeof val === 'string',
};

function validate(schema, data) {
  const errors = {};
  for (const [key, validator] of Object.entries(schema)) {
    if (data[key] !== undefined && !validator(data[key])) {
      errors[key] = `Invalid ${key}`;
    }
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

router.get('/profile', authMiddleware, (req, res) => {
  const { password: _, ...user } = req.user;
  res.json({ success: true, data: user });
});

router.put('/profile', authMiddleware, (req, res) => {
  const validation = validate(profileSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid input', details: validation.errors });
  }

  req.user = { ...req.user, ...req.body };
  USERS.set(req.user.email, req.user);

  const { password: _, ...user } = req.user;
  res.json({ success: true, data: user });
});

router.get('/passengers', authMiddleware, (req, res) => {
  res.json({ success: true, data: req.user.savedPassengers });
});

router.post('/passengers', authMiddleware, (req, res) => {
  const validation = validate(passengerSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid passenger data', details: validation.errors });
  }

  const passenger = { ...req.body, id: `SP${Date.now()}` };
  req.user.savedPassengers.push(passenger);
  USERS.set(req.user.email, req.user);

  res.status(201).json({ success: true, data: passenger });
});

router.put('/passengers/:id', authMiddleware, (req, res) => {
  const validation = validate(passengerSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid passenger data', details: validation.errors });
  }

  const index = req.user.savedPassengers.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Passenger not found' });
  }

  req.user.savedPassengers[index] = { ...req.user.savedPassengers[index], ...req.body };
  USERS.set(req.user.email, req.user);

  res.json({ success: true, data: req.user.savedPassengers[index] });
});

router.delete('/passengers/:id', authMiddleware, (req, res) => {
  req.user.savedPassengers = req.user.savedPassengers.filter((p) => p.id !== req.params.id);
  USERS.set(req.user.email, req.user);
  res.json({ success: true, message: 'Passenger deleted' });
});

router.get('/payments', authMiddleware, (req, res) => {
  res.json({ success: true, data: req.user.savedPaymentMethods });
});

router.post('/payments', authMiddleware, (req, res) => {
  const validation = validate(paymentSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid payment data', details: validation.errors });
  }

  const payment = { ...req.body, id: `PM${Date.now()}`, isDefault: req.user.savedPaymentMethods.length === 0 };
  req.user.savedPaymentMethods.push(payment);
  USERS.set(req.user.email, req.user);

  res.status(201).json({ success: true, data: payment });
});

router.put('/payments/:id/default', authMiddleware, (req, res) => {
  req.user.savedPaymentMethods.forEach((p) => { p.isDefault = p.id === req.params.id; });
  USERS.set(req.user.email, req.user);
  res.json({ success: true, data: req.user.savedPaymentMethods });
});

router.delete('/payments/:id', authMiddleware, (req, res) => {
  req.user.savedPaymentMethods = req.user.savedPaymentMethods.filter((p) => p.id !== req.params.id);
  if (req.user.savedPaymentMethods.length > 0) {
    req.user.savedPaymentMethods[0].isDefault = true;
  }
  USERS.set(req.user.email, req.user);
  res.json({ success: true, message: 'Payment method deleted' });
});

router.get('/preferences', authMiddleware, (req, res) => {
  res.json({ success: true, data: req.user.preferences });
});

router.put('/preferences', authMiddleware, (req, res) => {
  req.user.preferences = { ...req.user.preferences, ...req.body };
  USERS.set(req.user.email, req.user);
  res.json({ success: true, data: req.user.preferences });
});

export default router;