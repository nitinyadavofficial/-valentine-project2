import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Train, Calendar, MapPin, Clock, ChevronDown, ChevronUp, X, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import { formatDate, formatTime, formatCurrency } from '@/utils/helpers';

const MOCK_BOOKINGS = [
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
    passengers: [{ name: 'Prince Patel', age: 28, gender: 'M', coachNumber: 'B3', seatNumber: '42', bookingStatus: 'CONFIRMED' }],
    totalAmount: 1320,
    status: 'CONFIRMED',
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
      { name: 'Rahul Sharma', age: 35, gender: 'M', coachNumber: 'C1', seatNumber: '15', bookingStatus: 'CONFIRMED' },
      { name: 'Priya Sharma', age: 32, gender: 'F', coachNumber: 'C1', seatNumber: '16', bookingStatus: 'CONFIRMED' },
    ],
    totalAmount: 2450,
    status: 'CONFIRMED',
    coachClass: 'CC',
  },
  {
    id: 'BK003',
    pnr: '1928374650',
    trainNumber: '12456',
    trainName: 'Rajdhani Express',
    from: 'BCT',
    to: 'NDLS',
    journeyDate: '2026-07-15',
    departureTime: '16:00',
    arrivalTime: '08:35',
    duration: '16h 35m',
    passengers: [{ name: 'Amit Kumar', age: 40, gender: 'M', coachNumber: 'A1', seatNumber: '23', bookingStatus: 'CONFIRMED' }],
    totalAmount: 3245,
    status: 'COMPLETED',
    coachClass: '2A',
  },
  {
    id: 'BK004',
    pnr: '5647382910',
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani',
    from: 'HWH',
    to: 'NDLS',
    journeyDate: '2026-08-10',
    departureTime: '16:55',
    arrivalTime: '10:00',
    duration: '17h 05m',
    passengers: [{ name: 'Sneha Singh', age: 29, gender: 'F', coachNumber: 'B2', seatNumber: '11', bookingStatus: 'CANCELLED' }],
    totalAmount: 2145,
    status: 'CANCELLED',
    coachClass: '3A',
  },
];

type Tab = 'upcoming' | 'past' | 'cancelled';

export function TripsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: MOCK_BOOKINGS.filter((b) => b.status === 'CONFIRMED' && new Date(b.journeyDate) >= new Date()).length },
    { id: 'past', label: 'Past Trips', icon: Clock, count: MOCK_BOOKINGS.filter((b) => b.status === 'COMPLETED').length },
    { id: 'cancelled', label: 'Cancelled', icon: X, count: MOCK_BOOKINGS.filter((b) => b.status === 'CANCELLED').length },
  ];

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    const isPast = new Date(booking.journeyDate) < new Date();
    if (activeTab === 'upcoming') return booking.status === 'CONFIRMED' && !isPast;
    if (activeTab === 'past') return booking.status === 'COMPLETED' || (booking.status === 'CONFIRMED' && isPast);
    if (activeTab === 'cancelled') return booking.status === 'CANCELLED';
    return false;
  });

  const toggleExpand = (id: string) => {
    setExpandedBooking((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="page-title">My Trips</h1>
              <p className="page-subtitle">Manage your bookings, view journey history, and track upcoming trains.</p>
            </div>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="flex gap-2 bg-navy-100 dark:bg-navy-800 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-white dark:bg-navy-900 text-navy-900 dark:text-white shadow-sm'
                    : 'text-navy-600 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && <Badge variant="primary" size="sm">{tab.count}</Badge>}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {filteredBookings.length === 0 ? (
              <Card className="p-12 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {activeTab === 'upcoming' && <Calendar className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />}
                  {activeTab === 'past' && <Clock className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />}
                  {activeTab === 'cancelled' && <X className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />}
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">
                    {activeTab === 'upcoming' ? 'No Upcoming Trips' : activeTab === 'past' ? 'No Past Trips' : 'No Cancelled Bookings'}
                  </h3>
                  <p className="text-navy-600 dark:text-navy-400 mb-6">
                    {activeTab === 'upcoming' ? 'Book your next journey to see it here.' : 'Your completed trips will appear here.'}
                  </p>
                  {activeTab === 'upcoming' && <Button onClick={() => window.location.href = '/search'}>Book Your First Trip</Button>}
                </motion.div>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <BookingCard booking={booking} isExpanded={expandedBooking === booking.id} onToggle={() => toggleExpand(booking.id)} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function BookingCard({ booking, isExpanded, onToggle }: { booking: typeof MOCK_BOOKINGS[0]; isExpanded: boolean; onToggle: () => void }) {
  const isUpcoming = booking.status === 'CONFIRMED' && new Date(booking.journeyDate) >= new Date();
  const isPast = booking.status === 'COMPLETED' || (booking.status === 'CONFIRMED' && new Date(booking.journeyDate) < new Date());

  return (
    <Card className="p-0 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-6 flex flex-col lg:flex-row lg:items-center gap-6 text-left hover:bg-navy-50 dark:hover:bg-navy-800/50 transition-colors"
      >
        <div className="flex items-center gap-4 lg:w-48 flex-shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center flex-shrink-0">
            <Train className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold text-navy-900 dark:text-white">{booking.trainNumber}</span>
              <StatusBadge status={booking.status as any} size="sm" />
            </div>
            <p className="text-sm text-navy-600 dark:text-navy-400 truncate">{booking.trainName}</p>
          </div>
        </div>

        <div className="flex-1 lg:px-8 py-4 border-y lg:border-y-0 lg:border-x border-navy-200 dark:border-navy-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-navy-900 dark:text-white tabular-nums">{booking.departureTime}</p>
                <p className="text-xs text-navy-500 dark:text-navy-400">Departure</p>
              </div>
              <div className="flex items-center gap-2 text-navy-400">
                <Train className="w-4 h-4" />
                <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-navy-300 to-navy-400" />
                <Train className="w-4 h-4" />
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-navy-900 dark:text-white tabular-nums">{booking.arrivalTime}</p>
                <p className="text-xs text-navy-500 dark:text-navy-400">Arrival</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600 dark:text-navy-400">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.journeyDate)}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.duration}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.coachClass}</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4" /> {formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:ml-auto lg:flex-shrink-0">
          <div className="hidden lg:flex flex-col items-end gap-1">
            <span className="font-semibold text-navy-900 dark:text-white">PNR: {booking.pnr}</span>
            <span className="text-sm text-navy-500 dark:text-navy-400">{booking.passengers.length} passenger{booking.passengers.length > 1 ? 's' : ''}</span>
          </div>
          <ChevronDown className={cn('w-5 h-5 text-navy-400 transition-transform', isExpanded && 'rotate-180')} />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-navy-200 dark:border-navy-800 bg-navy-50 dark:bg-navy-900/50"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-navy-500 dark:text-navy-400">Booking Date</p>
                  <p className="font-medium text-navy-900 dark:text-white">{formatDate(booking.journeyDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-navy-500 dark:text-navy-400">Booking Status</p>
                  <p className="font-medium text-navy-900 dark:text-white">{booking.status}</p>
                </div>
                <div>
                  <p className="text-sm text-navy-500 dark:text-navy-400">Payment ID</p>
                  <p className="font-mono text-sm text-navy-600 dark:text-navy-400">{booking.id}</p>
                </div>
              </div>

              <div className="space-y-3">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-navy-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                        <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">{passenger.name}</p>
                        <p className="text-sm text-navy-500 dark:text-navy-400">Age: {passenger.age} • {passenger.gender === 'M' ? 'Male' : 'Female'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-mono text-sm text-navy-600 dark:text-navy-400">Coach: {passenger.coachNumber}</p>
                        <p className="font-mono text-sm text-navy-600 dark:text-navy-400">Seat: {passenger.seatNumber}</p>
                      </div>
                      <Badge variant={passenger.bookingStatus === 'CONFIRMED' ? 'success' : 'danger'}>{passenger.bookingStatus}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {isUpcoming && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download Ticket
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Track Train
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <X className="w-4 h-4 mr-1" />
                    Cancel Ticket
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}