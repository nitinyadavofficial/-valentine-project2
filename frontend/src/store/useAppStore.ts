import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchParams, FilterOptions, SortOption, Train, Booking, User, Notification, Passenger } from '@/types';

interface AppState {
  searchParams: SearchParams;
  setSearchParams: (params: Partial<SearchParams>) => void;
  resetSearchParams: () => void;

  filters: FilterOptions;
  setFilters: (filters: Partial<FilterOptions>) => void;
  resetFilters: () => void;

  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;

  selectedTrain: Train | null;
  setSelectedTrain: (train: Train | null) => void;

  bookingPassengers: Passenger[];
  setBookingPassengers: (passengers: Passenger[]) => void;
  addPassenger: (passenger: Passenger) => void;
  updatePassenger: (id: string, data: Partial<Passenger>) => void;
  removePassenger: (id: string) => void;
  clearBookingPassengers: () => void;

  selectedSeats: { coachCode: string; seatNumbers: string[] }[];
  setSelectedSeats: (seats: { coachCode: string; seatNumbers: string[] }[]) => void;
  addSelectedSeat: (coachCode: string, seatNumber: string) => void;
  removeSelectedSeat: (coachCode: string, seatNumber: string) => void;
  clearSelectedSeats: () => void;

  currentBooking: Partial<Booking> | null;
  setCurrentBooking: (booking: Partial<Booking> | null) => void;

  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;

  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  liveTrackingTrain: string | null;
  setLiveTrackingTrain: (trainNumber: string | null) => void;
}

const defaultSearchParams: SearchParams = {
  from: '',
  to: '',
  date: new Date().toISOString().split('T')[0],
  returnDate: '',
  passengers: 1,
  class: '3A',
};

const defaultFilters: FilterOptions = {
  departureTimeRange: [0, 24],
  arrivalTimeRange: [0, 24],
  priceRange: [0, 5000],
  trainTypes: [],
  classes: [],
  seatAvailability: false,
  maxDuration: 24 * 60,
  maxStops: 20,
  onTimeOnly: false,
  overnightOnly: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      searchParams: defaultSearchParams,
      setSearchParams: (params) => set((state) => ({ searchParams: { ...state.searchParams, ...params } })),
      resetSearchParams: () => set({ searchParams: defaultSearchParams }),

      filters: defaultFilters,
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      resetFilters: () => set({ filters: defaultFilters }),

      sortBy: 'cheapest',
      setSortBy: (sortBy) => set({ sortBy }),

      selectedTrain: null,
      setSelectedTrain: (selectedTrain) => set({ selectedTrain }),

      bookingPassengers: [],
      setBookingPassengers: (bookingPassengers) => set({ bookingPassengers }),
      addPassenger: (passenger) => set((state) => ({ bookingPassengers: [...state.bookingPassengers, passenger] })),
      updatePassenger: (id, data) => set((state) => ({
        bookingPassengers: state.bookingPassengers.map((p) => (p.id === id ? { ...p, ...data } : p)),
      })),
      removePassenger: (id) => set((state) => ({
        bookingPassengers: state.bookingPassengers.filter((p) => p.id !== id),
      })),
      clearBookingPassengers: () => set({ bookingPassengers: [] }),

      selectedSeats: [],
      setSelectedSeats: (selectedSeats) => set({ selectedSeats }),
      addSelectedSeat: (coachCode, seatNumber) => set((state) => {
        const existing = state.selectedSeats.find((s) => s.coachCode === coachCode);
        if (existing) {
          return {
            selectedSeats: state.selectedSeats.map((s) =>
              s.coachCode === coachCode ? { ...s, seatNumbers: [...s.seatNumbers, seatNumber] } : s
            ),
          };
        }
        return { selectedSeats: [...state.selectedSeats, { coachCode, seatNumbers: [seatNumber] }] };
      }),
      removeSelectedSeat: (coachCode, seatNumber) => set((state) => ({
        selectedSeats: state.selectedSeats
          .map((s) => (s.coachCode === coachCode ? { ...s, seatNumbers: s.seatNumbers.filter((n) => n !== seatNumber) } : s))
          .filter((s) => s.seatNumbers.length > 0),
      })),
      clearSelectedSeats: () => set({ selectedSeats: [] }),

      currentBooking: null,
      setCurrentBooking: (currentBooking) => set({ currentBooking }),

      user: null,
      setUser: (user) => set({ user }),
      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
      logout: () => set({ user: null }),

      notifications: [],
      addNotification: (notification) => set((state) => ({
        notifications: [
          {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            read: false,
          },
          ...state.notifications,
        ].slice(0, 50),
      })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      })),
      clearNotifications: () => set({ notifications: [] }),

      isLoading: false,
      setIsLoading: (isLoading) => set({ isLoading }),

      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      liveTrackingTrain: null,
      setLiveTrackingTrain: (liveTrackingTrain) => set({ liveTrackingTrain }),
    }),
    {
      name: 'railgo-storage',
      partialize: (state) => ({
        searchParams: state.searchParams,
        user: state.user,
        notifications: state.notifications,
      }),
    }
  )
);