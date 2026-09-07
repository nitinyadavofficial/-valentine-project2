export const STATIONS = [
  { code: 'NDLS', name: 'New Delhi', city: 'New Delhi', state: 'Delhi', coordinates: { lat: 28.6448, lng: 77.2097 } },
  { code: 'LKO', name: 'Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 } },
  { code: 'CNB', name: 'Kanpur Central', city: 'Kanpur', state: 'Uttar Pradesh', coordinates: { lat: 26.4499, lng: 80.3319 } },
  { code: 'ETW', name: 'Etawah', city: 'Etawah', state: 'Uttar Pradesh', coordinates: { lat: 26.7771, lng: 79.0158 } },
  { code: 'ALJN', name: 'Aligarh', city: 'Aligarh', state: 'Uttar Pradesh', coordinates: { lat: 27.8974, lng: 78.0880 } },
  { code: 'BSB', name: 'Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', coordinates: { lat: 25.3176, lng: 82.9739 } },
  { code: 'PRAYAGRAJ', name: 'Prayagraj', city: 'Prayagraj', state: 'Uttar Pradesh', coordinates: { lat: 25.4358, lng: 81.8463 } },
  { code: 'JP', name: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 } },
  { code: 'AII', name: 'Ajmer', city: 'Ajmer', state: 'Rajasthan', coordinates: { lat: 26.4499, lng: 74.6399 } },
  { code: 'UDZ', name: 'Udaipur', city: 'Udaipur', state: 'Rajasthan', coordinates: { lat: 24.5854, lng: 73.7125 } },
  { code: 'BCT', name: 'Mumbai Central', city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 18.9750, lng: 72.8258 } },
  { code: 'CSMT', name: 'Mumbai CSMT', city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 18.9398, lng: 72.8355 } },
  { code: 'PUNE', name: 'Pune', city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
  { code: 'SUR', name: 'Surat', city: 'Surat', state: 'Gujarat', coordinates: { lat: 21.1702, lng: 72.8311 } },
  { code: 'ADI', name: 'Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 } },
  { code: 'HWH', name: 'Howrah', city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5851, lng: 88.3468 } },
  { code: 'KOAA', name: 'Kolkata', city: 'Kolkata', state: 'West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 } },
  { code: 'MAS', name: 'Chennai Central', city: 'Chennai', state: 'Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { code: 'SBC', name: 'Bangalore', city: 'Bengaluru', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
  { code: 'HYB', name: 'Hyderabad', city: 'Hyderabad', state: 'Telangana', coordinates: { lat: 17.3850, lng: 78.4867 } },
];

function generateSeatLayout(totalSeats, classCode) {
  const seats = [];
  let seatNumber = 1;

  if (classCode === '1A') {
    const rows = Math.ceil(totalSeats / 4);
    for (let row = 0; row < rows; row++) {
      const types = ['LB', 'UB', 'LB', 'UB'];
      for (let col = 0; col < 4 && seatNumber <= totalSeats; col++) {
        seats.push({
          number: String(seatNumber),
          type: types[col],
          status: Math.random() > 0.7 ? 'occupied' : 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
    return { rows, columns: 4, seats };
  }

  if (classCode === '2A') {
    const rows = Math.ceil(totalSeats / 6);
    for (let row = 0; row < rows; row++) {
      const types = ['LB', 'MB', 'UB', 'LB', 'MB', 'UB'];
      for (let col = 0; col < 6 && seatNumber <= totalSeats; col++) {
        seats.push({
          number: String(seatNumber),
          type: types[col],
          status: Math.random() > 0.65 ? 'occupied' : 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
    return { rows, columns: 6, seats };
  }

  if (classCode === '3A' || classCode === 'SL') {
    const rows = Math.ceil(totalSeats / 8);
    for (let row = 0; row < rows; row++) {
      const types = ['LB', 'MB', 'UB', 'SL', 'SU', 'LB', 'MB', 'UB'];
      for (let col = 0; col < 8 && seatNumber <= totalSeats; col++) {
        seats.push({
          number: String(seatNumber),
          type: types[col],
          status: Math.random() > 0.6 ? 'occupied' : 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
    return { rows, columns: 8, seats };
  }

  if (classCode === 'EC') {
    const rows = Math.ceil(totalSeats / 4);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 4 && seatNumber <= totalSeats; col++) {
        seats.push({
          number: String(seatNumber),
          type: 'AC',
          status: Math.random() > 0.5 ? 'occupied' : 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
    return { rows, columns: 4, seats };
  }

  if (classCode === 'CC') {
    const rows = Math.ceil(totalSeats / 5);
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < 5 && seatNumber <= totalSeats; col++) {
        seats.push({
          number: String(seatNumber),
          type: 'AC',
          status: Math.random() > 0.55 ? 'occupied' : 'available',
          position: { row, col },
        });
        seatNumber++;
      }
    }
    return { rows, columns: 5, seats };
  }

  return { rows: 0, columns: 0, seats: [] };
}

export const TRAINS = [
  {
    trainNumber: '12501',
    name: 'Pune Superfast Express',
    from: 'LKO',
    to: 'NDLS',
    departureTime: '22:30',
    arrivalTime: '06:45',
    duration: '8h 15m',
    durationMinutes: 495,
    stops: 6,
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: [
      { code: '1A', name: 'AC First Class', available: 4, price: 3245, totalSeats: 18 },
      { code: '2A', name: 'AC 2 Tier', available: 12, price: 1845, totalSeats: 48 },
      { code: '3A', name: 'AC 3 Tier', available: 34, price: 1245, totalSeats: 72 },
      { code: 'SL', name: 'Sleeper', available: 78, price: 465, totalSeats: 180 },
    ],
    status: 'RUNNING',
    delayMinutes: 8,
    speed: 108,
    currentStation: 'Kanpur Central',
    route: [
      { stationCode: 'LKO', stationName: 'Lucknow', arrivalTime: '', departureTime: '22:30', haltMinutes: 0, day: 1, distance: 0, delayMinutes: 0 },
      { stationCode: 'BBK', stationName: 'Barabanki', arrivalTime: '23:10', departureTime: '23:12', haltMinutes: 2, day: 1, distance: 28, delayMinutes: 3 },
      { stationCode: 'AY', stationName: 'Ayodhya', arrivalTime: '23:55', departureTime: '23:57', haltMinutes: 2, day: 1, distance: 128, delayMinutes: 5 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '01:45', departureTime: '01:50', haltMinutes: 5, day: 2, distance: 265, delayMinutes: 8 },
      { stationCode: 'ETW', stationName: 'Etawah', arrivalTime: '03:10', departureTime: '03:12', haltMinutes: 2, day: 2, distance: 385, delayMinutes: 10 },
      { stationCode: 'ALJN', stationName: 'Aligarh', arrivalTime: '04:45', departureTime: '04:47', haltMinutes: 2, day: 2, distance: 520, delayMinutes: 8 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:45', departureTime: '', haltMinutes: 0, day: 2, distance: 642, delayMinutes: 8 },
    ],
    amenities: ['Pantry Car', 'Charging Points', 'Reading Lights', 'Curtains', 'Bio Toilets', 'CCTV'],
    coachComposition: [
      { coachCode: 'H1', classCode: '1A', position: 1, totalSeats: 18, layout: generateSeatLayout(18, '1A') },
      { coachCode: 'A1', classCode: '2A', position: 2, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'A2', classCode: '2A', position: 3, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'B1', classCode: '3A', position: 4, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'B2', classCode: '3A', position: 5, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'B3', classCode: '3A', position: 6, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'S1', classCode: 'SL', position: 7, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
      { coachCode: 'S2', classCode: 'SL', position: 8, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
      { coachCode: 'S3', classCode: 'SL', position: 9, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
    ],
  },
  {
    trainNumber: '12002',
    name: 'Shatabdi Express',
    from: 'LKO',
    to: 'NDLS',
    departureTime: '06:15',
    arrivalTime: '12:30',
    duration: '6h 15m',
    durationMinutes: 375,
    stops: 3,
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: [
      { code: 'EC', name: 'Executive Chair Car', available: 8, price: 2145, totalSeats: 56 },
      { code: 'CC', name: 'AC Chair Car', available: 24, price: 1145, totalSeats: 150 },
    ],
    status: 'ON_TIME',
    delayMinutes: 0,
    speed: 130,
    currentStation: 'Lucknow',
    route: [
      { stationCode: 'LKO', stationName: 'Lucknow', arrivalTime: '', departureTime: '06:15', haltMinutes: 0, day: 1, distance: 0, delayMinutes: 0 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '07:55', departureTime: '08:00', haltMinutes: 5, day: 1, distance: 265, delayMinutes: 0 },
      { stationCode: 'ETW', stationName: 'Etawah', arrivalTime: '09:15', departureTime: '09:17', haltMinutes: 2, day: 1, distance: 385, delayMinutes: 0 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '12:30', departureTime: '', haltMinutes: 0, day: 1, distance: 642, delayMinutes: 0 },
    ],
    amenities: ['Meals Included', 'Newspaper', 'Charging Points', 'WiFi', 'Entertainment System'],
    coachComposition: [
      { coachCode: 'E1', classCode: 'EC', position: 1, totalSeats: 56, layout: generateSeatLayout(56, 'EC') },
      { coachCode: 'C1', classCode: 'CC', position: 2, totalSeats: 75, layout: generateSeatLayout(75, 'CC') },
      { coachCode: 'C2', classCode: 'CC', position: 3, totalSeats: 75, layout: generateSeatLayout(75, 'CC') },
    ],
  },
  {
    trainNumber: '12456',
    name: 'Rajdhani Express',
    from: 'BCT',
    to: 'NDLS',
    departureTime: '16:00',
    arrivalTime: '08:35',
    duration: '16h 35m',
    durationMinutes: 995,
    stops: 8,
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: [
      { code: '1A', name: 'AC First Class', available: 6, price: 4895, totalSeats: 24 },
      { code: '2A', name: 'AC 2 Tier', available: 18, price: 2895, totalSeats: 72 },
      { code: '3A', name: 'AC 3 Tier', available: 42, price: 1995, totalSeats: 144 },
    ],
    status: 'RUNNING',
    delayMinutes: 15,
    speed: 110,
    currentStation: 'Surat',
    route: [
      { stationCode: 'BCT', stationName: 'Mumbai Central', arrivalTime: '', departureTime: '16:00', haltMinutes: 0, day: 1, distance: 0, delayMinutes: 0 },
      { stationCode: 'SUR', stationName: 'Surat', arrivalTime: '19:25', departureTime: '19:30', haltMinutes: 5, day: 1, distance: 263, delayMinutes: 12 },
      { stationCode: 'ADI', stationName: 'Ahmedabad', arrivalTime: '22:40', departureTime: '22:50', haltMinutes: 10, day: 1, distance: 493, delayMinutes: 15 },
      { stationCode: 'JP', stationName: 'Jaipur', arrivalTime: '04:15', departureTime: '04:20', haltMinutes: 5, day: 2, distance: 1158, delayMinutes: 18 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '08:35', departureTime: '', haltMinutes: 0, day: 2, distance: 1384, delayMinutes: 15 },
    ],
    amenities: ['Meals Included', 'Pantry Car', 'Charging Points', 'Reading Lights', 'Curtains', 'Bio Toilets', 'CCTV', 'Attendant Call Button'],
    coachComposition: [
      { coachCode: 'H1', classCode: '1A', position: 1, totalSeats: 24, layout: generateSeatLayout(24, '1A') },
      { coachCode: 'A1', classCode: '2A', position: 2, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'A2', classCode: '2A', position: 3, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'B1', classCode: '3A', position: 4, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'B2', classCode: '3A', position: 5, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
    ],
  },
  {
    trainNumber: '12301',
    name: 'Howrah Rajdhani',
    from: 'HWH',
    to: 'NDLS',
    departureTime: '16:55',
    arrivalTime: '10:00',
    duration: '17h 05m',
    durationMinutes: 1025,
    stops: 7,
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: [
      { code: '1A', name: 'AC First Class', available: 3, price: 5245, totalSeats: 24 },
      { code: '2A', name: 'AC 2 Tier', available: 14, price: 3145, totalSeats: 72 },
      { code: '3A', name: 'AC 3 Tier', available: 38, price: 2145, totalSeats: 144 },
    ],
    status: 'RUNNING',
    delayMinutes: 22,
    speed: 105,
    currentStation: 'Prayagraj',
    route: [
      { stationCode: 'HWH', stationName: 'Howrah', arrivalTime: '', departureTime: '16:55', haltMinutes: 0, day: 1, distance: 0, delayMinutes: 0 },
      { stationCode: 'BSB', stationName: 'Varanasi', arrivalTime: '02:30', departureTime: '02:40', haltMinutes: 10, day: 2, distance: 680, delayMinutes: 15 },
      { stationCode: 'PRAYAGRAJ', stationName: 'Prayagraj', arrivalTime: '05:10', departureTime: '05:15', haltMinutes: 5, day: 2, distance: 810, delayMinutes: 22 },
      { stationCode: 'CNB', stationName: 'Kanpur Central', arrivalTime: '08:45', departureTime: '08:50', haltMinutes: 5, day: 2, distance: 1020, delayMinutes: 20 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '10:00', departureTime: '', haltMinutes: 0, day: 2, distance: 1445, delayMinutes: 22 },
    ],
    amenities: ['Meals Included', 'Pantry Car', 'Charging Points', 'Reading Lights', 'Curtains', 'Bio Toilets', 'CCTV', 'Attendant Call Button'],
    coachComposition: [
      { coachCode: 'H1', classCode: '1A', position: 1, totalSeats: 24, layout: generateSeatLayout(24, '1A') },
      { coachCode: 'A1', classCode: '2A', position: 2, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'A2', classCode: '2A', position: 3, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'B1', classCode: '3A', position: 4, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'B2', classCode: '3A', position: 5, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
    ],
  },
  {
    trainNumber: '12627',
    name: 'Karnataka Express',
    from: 'SBC',
    to: 'NDLS',
    departureTime: '19:20',
    arrivalTime: '06:50',
    duration: '35h 30m',
    durationMinutes: 2130,
    stops: 22,
    runningDays: [0, 1, 2, 3, 4, 5, 6],
    classes: [
      { code: '2A', name: 'AC 2 Tier', available: 8, price: 3445, totalSeats: 48 },
      { code: '3A', name: 'AC 3 Tier', available: 22, price: 2245, totalSeats: 144 },
      { code: 'SL', name: 'Sleeper', available: 56, price: 845, totalSeats: 288 },
    ],
    status: 'SCHEDULED',
    delayMinutes: 0,
    speed: 95,
    currentStation: 'Bangalore',
    route: [
      { stationCode: 'SBC', stationName: 'Bangalore', arrivalTime: '', departureTime: '19:20', haltMinutes: 0, day: 1, distance: 0, delayMinutes: 0 },
      { stationCode: 'HYB', stationName: 'Hyderabad', arrivalTime: '04:30', departureTime: '04:40', haltMinutes: 10, day: 2, distance: 570, delayMinutes: 0 },
      { stationCode: 'NDLS', stationName: 'New Delhi', arrivalTime: '06:50', departureTime: '', haltMinutes: 0, day: 3, distance: 2365, delayMinutes: 0 },
    ],
    amenities: ['Pantry Car', 'Charging Points', 'Reading Lights', 'Bio Toilets', 'CCTV'],
    coachComposition: [
      { coachCode: 'A1', classCode: '2A', position: 1, totalSeats: 48, layout: generateSeatLayout(48, '2A') },
      { coachCode: 'B1', classCode: '3A', position: 2, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'B2', classCode: '3A', position: 3, totalSeats: 72, layout: generateSeatLayout(72, '3A') },
      { coachCode: 'S1', classCode: 'SL', position: 4, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
      { coachCode: 'S2', classCode: 'SL', position: 5, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
      { coachCode: 'S3', classCode: 'SL', position: 6, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
      { coachCode: 'S4', classCode: 'SL', position: 7, totalSeats: 72, layout: generateSeatLayout(72, 'SL') },
    ],
  },
];

export const MOCK_LIVE_STATUS = {
  '12501': {
    trainNumber: '12501',
    name: 'Pune Superfast Express',
    status: 'RUNNING',
    currentStation: 'Kanpur Central',
    currentStationCode: 'CNB',
    lastUpdated: new Date(Date.now() - 20000).toISOString(),
    expectedArrival: '06:45',
    delayMinutes: 8,
    speed: 108,
    distanceCovered: 265,
    totalDistance: 642,
    nextStation: 'Etawah',
    nextStationCode: 'ETW',
    nextStationArrival: '03:10',
    coordinates: { lat: 26.4499, lng: 80.3319 },
    isLive: true,
  },
  '12002': {
    trainNumber: '12002',
    name: 'Shatabdi Express',
    status: 'ON_TIME',
    currentStation: 'Lucknow',
    currentStationCode: 'LKO',
    lastUpdated: new Date(Date.now() - 30000).toISOString(),
    expectedArrival: '12:30',
    delayMinutes: 0,
    speed: 0,
    distanceCovered: 0,
    totalDistance: 642,
    nextStation: 'Kanpur Central',
    nextStationCode: 'CNB',
    nextStationArrival: '07:55',
    coordinates: { lat: 26.8467, lng: 80.9462 },
    isLive: true,
  },
  '12456': {
    trainNumber: '12456',
    name: 'Rajdhani Express',
    status: 'RUNNING',
    currentStation: 'Surat',
    currentStationCode: 'SUR',
    lastUpdated: new Date(Date.now() - 15000).toISOString(),
    expectedArrival: '08:35',
    delayMinutes: 15,
    speed: 110,
    distanceCovered: 263,
    totalDistance: 1384,
    nextStation: 'Ahmedabad',
    nextStationCode: 'ADI',
    nextStationArrival: '22:40',
    coordinates: { lat: 21.1702, lng: 72.8311 },
    isLive: true,
  },
};

export const MOCK_BOOKINGS = [
  {
    id: 'BK001',
    pnr: '4527819634',
    trainNumber: '12501',
    trainName: 'Pune Superfast Express',
    from: 'LKO',
    to: 'NDLS',
    journeyDate: '2026-08-20',
    departureTime: '22:30',
    arrivalTime: '06:45',
    duration: '8h 15m',
    passengers: [
      { id: 'P1', name: 'Prince Patel', age: 28, gender: 'M', idType: 'AADHAAR', idNumber: 'XXXX XXXX 1234', seatPreference: 'LB', mealPreference: 'VEG', seatNumber: '42', coachNumber: 'B3', bookingStatus: 'CONFIRMED' },
    ],
    totalAmount: 1320,
    status: 'CONFIRMED',
    bookingTime: '2026-08-15T10:30:00Z',
    paymentId: 'PAY_123456',
    coachClass: '3A',
  },
  {
    id: 'BK002',
    pnr: '8271946352',
    trainNumber: '12002',
    trainName: 'Shatabdi Express',
    from: 'LKO',
    to: 'NDLS',
    journeyDate: '2026-09-05',
    departureTime: '06:15',
    arrivalTime: '12:30',
    duration: '6h 15m',
    passengers: [
      { id: 'P1', name: 'Rahul Sharma', age: 35, gender: 'M', idType: 'PAN', idNumber: 'ABCDE1234F', seatPreference: 'ANY', mealPreference: 'VEG', seatNumber: '15', coachNumber: 'C1', bookingStatus: 'CONFIRMED' },
      { id: 'P2', name: 'Priya Sharma', age: 32, gender: 'F', idType: 'AADHAAR', idNumber: 'XXXX XXXX 5678', seatPreference: 'ANY', mealPreference: 'VEG', seatNumber: '16', coachNumber: 'C1', bookingStatus: 'CONFIRMED' },
    ],
    totalAmount: 2450,
    status: 'CONFIRMED',
    bookingTime: '2026-08-10T14:20:00Z',
    paymentId: 'PAY_789012',
    coachClass: 'CC',
  },
];

export const MOCK_USER = {
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
};

export const TRAIN_TYPES = [
  { value: 'rajdhani', label: 'Rajdhani' },
  { value: 'shatabdi', label: 'Shatabdi' },
  { value: 'duronto', label: 'Duronto' },
  { value: 'superfast', label: 'Superfast' },
  { value: 'express', label: 'Express' },
  { value: 'passenger', label: 'Passenger' },
  { value: 'vande_bharat', label: 'Vande Bharat' },
];

export const CLASSES = [
  { value: '1A', label: 'AC First Class (1A)' },
  { value: '2A', label: 'AC 2 Tier (2A)' },
  { value: '3A', label: 'AC 3 Tier (3A)' },
  { value: 'EC', label: 'Executive Chair Car (EC)' },
  { value: 'CC', label: 'AC Chair Car (CC)' },
  { value: 'SL', label: 'Sleeper (SL)' },
  { value: '2S', label: 'Second Seating (2S)' },
];

export const ID_TYPES = [
  { value: 'AADHAAR', label: 'Aadhaar Card' },
  { value: 'PAN', label: 'PAN Card' },
  { value: 'PASSPORT', label: 'Passport' },
  { value: 'VOTER_ID', label: 'Voter ID' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
];