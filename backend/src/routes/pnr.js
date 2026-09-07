import express from 'express';

const router = express.Router();

const MOCK_PNRS = {
  '4527819634': {
    pnr: '4527819634',
    trainNumber: '12501',
    trainName: 'Pune Superfast Express',
    journeyDate: '2026-08-20',
    from: 'LKO',
    to: 'NDLS',
    boardingStation: 'LKO',
    destinationStation: 'NDLS',
    passengers: [
      { passengerNumber: 1, name: 'Prince Patel', age: 28, gender: 'M', bookingStatus: 'CONFIRMED', currentStatus: 'CNF', coach: 'B3', seatNumber: '42' },
    ],
    chartStatus: 'PREPARED',
    currentStatus: 'Confirmed',
  },
  '8271946352': {
    pnr: '8271946352',
    trainNumber: '12002',
    trainName: 'Shatabdi Express',
    journeyDate: '2026-09-05',
    from: 'LKO',
    to: 'NDLS',
    boardingStation: 'LKO',
    destinationStation: 'NDLS',
    passengers: [
      { passengerNumber: 1, name: 'Rahul Sharma', age: 35, gender: 'M', bookingStatus: 'CONFIRMED', currentStatus: 'CNF', coach: 'C1', seatNumber: '15' },
      { passengerNumber: 2, name: 'Priya Sharma', age: 32, gender: 'F', bookingStatus: 'CONFIRMED', currentStatus: 'CNF', coach: 'C1', seatNumber: '16' },
    ],
    chartStatus: 'PREPARED',
    currentStatus: 'Confirmed',
  },
};

const checkSchema = {
  pnr: (val) => typeof val === 'string' && val.length === 10 && /^\d{10}$/.test(val),
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

router.post('/check', (req, res) => {
  const validation = validate(checkSchema, req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, error: 'Invalid PNR format. Must be 10 digits.' });
  }

  const { pnr } = req.body;
  const pnrData = MOCK_PNRS[pnr];

  if (!pnrData) {
    return res.status(404).json({ success: false, error: 'PNR not found' });
  }

  res.json({ success: true, data: pnrData });
});

router.get('/:pnr', (req, res) => {
  const { pnr } = req.params;
  if (!/^\d{10}$/.test(pnr)) {
    return res.status(400).json({ success: false, error: 'Invalid PNR format' });
  }

  const pnrData = MOCK_PNRS[pnr];
  if (!pnrData) {
    return res.status(404).json({ success: false, error: 'PNR not found' });
  }

  res.json({ success: true, data: pnrData });
});

export default router;