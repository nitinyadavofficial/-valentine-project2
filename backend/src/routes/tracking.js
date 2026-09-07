import express from 'express';
import { MOCK_LIVE_STATUS, TRAINS } from '../data/mockData.js';

const router = express.Router();

router.get('/:trainNumber/live', (req, res) => {
  const { trainNumber } = req.params;
  const liveStatus = MOCK_LIVE_STATUS[trainNumber];

  if (!liveStatus) {
    const train = TRAINS.find((t) => t.trainNumber === trainNumber);
    if (!train) {
      return res.status(404).json({ success: false, error: 'Train not found' });
    }

    return res.json({
      success: true,
      data: {
        trainNumber,
        name: train.name,
        status: 'SCHEDULED',
        currentStation: train.from,
        currentStationCode: train.from,
        lastUpdated: new Date().toISOString(),
        expectedArrival: train.arrivalTime,
        delayMinutes: 0,
        speed: 0,
        distanceCovered: 0,
        totalDistance: train.route[train.route.length - 1]?.distance || 0,
        nextStation: train.route[1]?.stationName || train.to,
        nextStationCode: train.route[1]?.stationCode || train.to,
        nextStationArrival: train.route[1]?.arrivalTime || train.arrivalTime,
        coordinates: train.route[0] ? { lat: 0, lng: 0 } : { lat: 0, lng: 0 },
        isLive: false,
        demo: true,
      },
    });
  }

  res.json({
    success: true,
    data: {
      ...liveStatus,
      lastUpdated: new Date().toISOString(),
      coordinates: {
        lat: liveStatus.coordinates.lat + (Math.random() - 0.5) * 0.005,
        lng: liveStatus.coordinates.lng + (Math.random() - 0.5) * 0.005,
      },
      distanceCovered: liveStatus.distanceCovered + Math.floor(Math.random() * 3),
      speed: Math.max(80, Math.min(130, liveStatus.speed + (Math.random() - 0.5) * 8)),
      demo: true,
    },
  });
});

router.get('/live/all', (req, res) => {
  const liveTrains = Object.entries(MOCK_LIVE_STATUS).map(([trainNumber, status]) => ({
    trainNumber,
    ...status,
    lastUpdated: new Date().toISOString(),
    coordinates: {
      lat: status.coordinates.lat + (Math.random() - 0.5) * 0.005,
      lng: status.coordinates.lng + (Math.random() - 0.5) * 0.005,
    },
  }));

  res.json({
    success: true,
    data: {
      liveTrains: liveTrains.length,
      onTime: liveTrains.filter((t) => t.delayMinutes === 0).length,
      delayed: liveTrains.filter((t) => t.delayMinutes > 0).length,
      trains: liveTrains,
    },
  });
});

router.get('/stations/active', (req, res) => {
  res.json({
    success: true,
    data: {
      activeStations: 438,
      lastUpdated: new Date().toISOString(),
    },
  });
});

export default router;