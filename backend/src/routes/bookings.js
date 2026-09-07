import express from 'express';
import jwt from 'jsonwebtoken';
import { TRAINS, MOCK_BOOKINGS } from '../data/mockData.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'railgo-secret-key-change-in-production';

const BOOKINGS = [...MOCK_BOOKINGS];

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
}

router.post('/', authMiddleware, (req, res) => {
  const { trainNumber, journeyDate, coachClass, passengers, selectedSeats } = req.body;

  if (!trainNumber || !journeyDate || !coachClass || !passengers || !Array.isArray(passengers)) {
    return res.status(400).json({ success: false, error: 'Invalid booking data' });
  }

  const train = TRAINS.find((t) => t.trainNumber === trainNumber);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }

  const classInfo = train.classes.find((c) => c.code === coachClass);
  if (!classInfo) {
    return res.status(400).json({ success: false, error: 'Class not available on this train' });
  }

  const totalAmount = classInfo.price * passengers.length;
  const convenienceFee = Math.round(totalAmount * 0.02);
  const taxes = Math.round(totalAmount * 0.05);
  const grandTotal = totalAmount + convenienceFee + taxes;

  const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const booking = {
    id: `BK${Date.now()}`,
    pnr,
    trainNumber,
    journeyDate,
    coachClass,
    passengers: passengers.map((p, i) => ({
      ...p,
      id: `P${i + 1}`,
      seatNumber: selectedSeats?.find((s) => s.coachCode === (train.coachComposition.find((c) => c.classCode === coachClass)?.coachCode))?.seatNumbers[i] || `${Math.floor(Math.random() * 72) + 1}`,
      coachNumber: train.coachComposition.find((c) => c.classCode === coachClass)?.coachCode,
      bookingStatus: 'CONFIRMED',
    })),
    totalAmount: grandTotal,
    status: 'CONFIRMED',
    bookingTime: new Date().toISOString(),
    paymentId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    userId: req.userId,
  };

  BOOKINGS.push(booking);

  res.status(201).json({
    success: true,
    data: {
      bookingId: booking.id,
      pnr: booking.pnr,
      totalAmount: booking.totalAmount,
      paymentId: booking.paymentId,
    },
  });
});

router.get('/', authMiddleware, (req, res) => {
  const userBookings = BOOKINGS.filter((b) => b.userId === req.userId);
  res.json({ success: true, data: userBookings });
});

router.get('/:bookingId', authMiddleware, (req, res) => {
  const booking = BOOKINGS.find((b) => b.id === req.params.bookingId && b.userId === req.userId);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }
  res.json({ success: true, data: booking });
});

router.post('/:bookingId/cancel', authMiddleware, (req, res) => {
  const booking = BOOKINGS.find((b) => b.id === req.params.bookingId && b.userId === req.userId);
  if (!booking) {
    return res.status(404).json({ success: false, error: 'Booking not found' });
  }

  if (booking.status === 'CANCELLED') {
    return res.status(400).json({ success: false, error: 'Booking already cancelled' });
  }

  const journeyDate = new Date(booking.journeyDate);
  const now = new Date();
  const hoursUntilJourney = (journeyDate - now) / (1000 * 60 * 60);

  let refundPercent = 0;
  if (hoursUntilJourney > 48) refundPercent = 100;
  else if (hoursUntilJourney > 12) refundPercent = 50;
  else if (hoursUntilJourney > 4) refundPercent = 25;

  booking.status = 'CANCELLED';
  booking.cancelledAt = new Date().toISOString();
  booking.refundAmount = Math.round(booking.totalAmount * refundPercent / 100);

  res.json({ success: true, data: booking });
});

export default router;