import { useCallback, useState } from 'react';
import type { Train, LiveTrainStatus, PNRStatus, ApiResponse, SearchParams } from '@/types';
import { TRAINS, MOCK_LIVE_STATUS, STATIONS } from '@/utils/mockData';
import { useAppStore } from '@/store/useAppStore';

const API_BASE = '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error || 'Request failed' };
    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
}

export function useTrainSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { searchParams } = useAppStore();

  const searchTrains = useCallback(async (params?: SearchParams): Promise<Train[]> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const search = params || searchParams;
      let results = TRAINS.filter((train) => {
        const fromMatch = !search.from || train.from === search.from;
        const toMatch = !search.to || train.to === search.to;
        return fromMatch && toMatch;
      });

      if (search.class) {
        results = results.filter((train) => train.classes.some((c) => c.code === search.class));
      }

      setIsLoading(false);
      return results;
    } catch (err) {
      setError('Failed to search trains');
      setIsLoading(false);
      return [];
    }
  }, [searchParams]);

  return { searchTrains, isLoading, error };
}

export function useTrainDetails(trainNumber: string | null) {
  const [train, setTrain] = useState<Train | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrain = useCallback(async () => {
    if (!trainNumber) return;
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = TRAINS.find((t) => t.trainNumber === trainNumber);
      setTrain(found || null);
      if (!found) setError('Train not found');
    } catch {
      setError('Failed to fetch train details');
    }
    setIsLoading(false);
  }, [trainNumber]);

  return { train, fetchTrain, isLoading, error };
}

export function useLiveTrainStatus(trainNumber: string | null) {
  const [status, setStatus] = useState<LiveTrainStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!trainNumber) return;
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockStatus = MOCK_LIVE_STATUS[trainNumber];
      if (mockStatus) {
        setStatus({
          ...mockStatus,
          lastUpdated: new Date().toISOString(),
          coordinates: {
            lat: mockStatus.coordinates.lat + (Math.random() - 0.5) * 0.01,
            lng: mockStatus.coordinates.lng + (Math.random() - 0.5) * 0.01,
          },
        });
      } else {
        setError('Live status not available for this train');
      }
    } catch {
      setError('Failed to fetch live status');
    }
    setIsLoading(false);
  }, [trainNumber]);

  return { status, fetchStatus, isLoading, error };
}

export function usePNRStatus() {
  const [pnrStatus, setPnrStatus] = useState<PNRStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPNR = useCallback(async (pnr: string): Promise<PNRStatus | null> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (pnr === '4527819634') {
        const result: PNRStatus = {
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
        };
        setPnrStatus(result);
        setIsLoading(false);
        return result;
      }

      if (pnr === '8271946352') {
        const result: PNRStatus = {
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
        };
        setPnrStatus(result);
        setIsLoading(false);
        return result;
      }

      setError('PNR not found');
      setIsLoading(false);
      return null;
    } catch {
      setError('Failed to check PNR status');
      setIsLoading(false);
      return null;
    }
  }, []);

  return { pnrStatus, checkPNR, isLoading, error };
}

export function useStations() {
  const [stations] = useState<typeof STATIONS>(STATIONS);

  const searchStations = useCallback((query: string) => {
    if (!query) return stations;
    const q = query.toLowerCase();
    return stations.filter(
      (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
    );
  }, [stations]);

  const getStationByCode = useCallback((code: string) => {
    return stations.find((s) => s.code === code);
  }, [stations]);

  return { stations, searchStations, getStationByCode };
}

export function useBooking() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBooking = useCallback(async (bookingData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const booking = {
        id: `BK${Date.now()}`,
        pnr,
        ...bookingData,
        status: 'CONFIRMED',
        bookingTime: new Date().toISOString(),
        paymentId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      setIsLoading(false);
      return { success: true, data: booking };
    } catch {
      setError('Booking failed. Please try again.');
      setIsLoading(false);
      return { success: false, error: 'Booking failed' };
    }
  }, []);

  const processPayment = useCallback(async (amount: number, method: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsLoading(false);
      return { success: true, paymentId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}` };
    } catch {
      setError('Payment processing failed');
      setIsLoading(false);
      return { success: false, error: 'Payment failed' };
    }
  }, []);

  return { createBooking, processPayment, isLoading, error };
}