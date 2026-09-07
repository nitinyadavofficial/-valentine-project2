export interface Station {
  code: string;
  name: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Train {
  trainNumber: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  durationMinutes: number;
  stops: number;
  runningDays: number[];
  classes: TrainClass[];
  status: TrainStatus;
  delayMinutes: number;
  speed: number;
  currentStation?: string;
  route: RouteStation[];
  amenities: string[];
  coachComposition: CoachComposition[];
}

export interface TrainClass {
  code: string;
  name: string;
  available: number;
  price: number;
  totalSeats: number;
}

export interface RouteStation {
  stationCode: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
  haltMinutes: number;
  day: number;
  distance: number;
  platform?: string;
  delayMinutes: number;
}

export interface CoachComposition {
  coachCode: string;
  classCode: string;
  position: number;
  totalSeats: number;
  layout: SeatLayout;
}

export interface SeatLayout {
  rows: number;
  columns: number;
  seats: Seat[];
}

export interface Seat {
  number: string;
  type: SeatType;
  status: SeatStatus;
  position: { row: number; col: number };
}

export type SeatType = 'LB' | 'MB' | 'UB' | 'SL' | 'SU' | 'WL' | 'RS' | 'AC';
export type SeatStatus = 'available' | 'selected' | 'occupied' | 'reserved' | 'ladies' | 'handicapped';

export type TrainStatus = 'RUNNING' | 'ARRIVED' | 'DEPARTED' | 'CANCELLED' | 'DELAYED' | 'ON_TIME' | 'SCHEDULED';

export interface LiveTrainStatus {
  trainNumber: string;
  name: string;
  status: TrainStatus;
  currentStation: string;
  currentStationCode: string;
  lastUpdated: string;
  expectedArrival: string;
  delayMinutes: number;
  speed: number;
  distanceCovered: number;
  totalDistance: number;
  nextStation: string;
  nextStationCode: string;
  nextStationArrival: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  isLive: boolean;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  idType: 'AADHAAR' | 'PAN' | 'PASSPORT' | 'VOTER_ID' | 'DRIVING_LICENSE';
  idNumber: string;
  seatPreference: 'LB' | 'MB' | 'UB' | 'ANY';
  mealPreference: 'VEG' | 'NON_VEG' | 'NO_MEAL';
  seatNumber?: string;
  coachNumber?: string;
  bookingStatus: BookingStatus;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'WAITLISTED' | 'RAC' | 'CANCELLED';

export interface Booking {
  id: string;
  pnr: string;
  train: Train;
  journeyDate: string;
  passengers: Passenger[];
  totalAmount: number;
  status: BookingStatus;
  bookingTime: string;
  paymentId?: string;
  coachClass: string;
}

export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName: string;
  journeyDate: string;
  from: string;
  to: string;
  boardingStation: string;
  destinationStation: string;
  passengers: PNRPassenger[];
  chartStatus: 'PREPARED' | 'NOT_PREPARED';
  currentStatus: string;
}

export interface PNRPassenger {
  passengerNumber: number;
  name: string;
  age: number;
  gender: string;
  bookingStatus: BookingStatus;
  currentStatus: string;
  coach: string;
  seatNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  savedPassengers: SavedPassenger[];
  savedPaymentMethods: SavedPaymentMethod[];
  preferences: UserPreferences;
}

export interface SavedPassenger {
  id: string;
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  idType: string;
  idNumber: string;
  seatPreference: string;
  mealPreference: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';
  name: string;
  maskedNumber?: string;
  upiId?: string;
  isDefault: boolean;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  defaultClass: string;
  language: string;
  currency: string;
}

export interface SearchParams {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: number;
  class: string;
}

export interface FilterOptions {
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
  priceRange: [number, number];
  trainTypes: string[];
  classes: string[];
  seatAvailability: boolean;
  maxDuration: number;
  maxStops: number;
  onTimeOnly: boolean;
  overnightOnly: boolean;
}

export type SortOption = 'cheapest' | 'fastest' | 'earliest' | 'latest' | 'availability';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface PaymentDetails {
  fare: number;
  convenienceFee: number;
  taxes: number;
  total: number;
  paymentMethod: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}