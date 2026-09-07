import express from 'express';
import { TRAINS, STATIONS, MOCK_LIVE_STATUS, CLASSES, TRAIN_TYPES } from '../data/mockData.js';

const router = express.Router();

router.get('/search', (req, res) => {
  const { from, to, date, class: classCode, passengers } = req.query;
  
  if (!from || !to) {
    return res.status(400).json({ success: false, error: 'Missing from or to parameters' });
  }

  let trains = TRAINS.filter((t) => t.from === from && t.to === to);

  if (classCode) {
    trains = trains.filter((t) => t.classes.some((c) => c.code === classCode));
  }

  const journeyDate = new Date(date || new Date().toISOString().split('T')[0]);
  const dayOfWeek = journeyDate.getDay();

  trains = trains.filter((t) => t.runningDays.includes(dayOfWeek));

  res.json({ success: true, data: trains });
});

router.get('/stations', (req, res) => {
  const { q } = req.query;
  let stations = STATIONS;
  if (q) {
    const query = String(q).toLowerCase();
    stations = stations.filter((s) => s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query) || s.city.toLowerCase().includes(query));
  }
  res.json({ success: true, data: stations });
});

router.get('/:trainNumber', (req, res) => {
  const train = TRAINS.find((t) => t.trainNumber === req.params.trainNumber);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }
  res.json({ success: true, data: train });
});

router.get('/:trainNumber/availability', (req, res) => {
  const train = TRAINS.find((t) => t.trainNumber === req.params.trainNumber);
  if (!train) {
    return res.status(404).json({ success: false, error: 'Train not found' });
  }

  const { class: classCode } = req.query;
  let classes = train.classes;
  if (classCode) {
    classes = classes.filter((c) => c.code === classCode);
  }

  res.json({ success: true, data: { trainNumber: train.trainNumber, classes, date: req.query.date } });
});

router.get('/classes/list', (req, res) => {
  res.json({ success: true, data: CLASSES });
});

export default router;