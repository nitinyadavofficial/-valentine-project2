import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Train, MapPin, Clock, Calendar, Shield, Users, IndianRupee, ArrowRight, ChevronDown, ChevronUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useTrainDetails } from '@/hooks/useApi';
import { TRAINS } from '@/utils/mockData';
import { cn } from '@/utils/cn';
import { formatDate, formatCurrency, getClassName, getSeatTypeLabel } from '@/utils/helpers';

export function TrainDetailsPage() {
  const { trainNumber } = useParams<{ trainNumber: string }>();
  const navigate = useNavigate();
  const { train, fetchTrain, isLoading, error } = useTrainDetails(trainNumber || null);
  const { setSelectedTrain, setSearchParams } = useAppStore();
  const [expandedRoute, setExpandedRoute] = useState(false);

  useEffect(() => {
    if (trainNumber) {
      fetchTrain();
    }
  }, [trainNumber, fetchTrain]);

  useEffect(() => {
    if (train) {
      setSelectedTrain(train);
    }
  }, [train, setSelectedTrain]);

  if (isLoading) {
    return <TrainDetailsSkeleton />;
  }

  if (error || !train) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Train className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Train Not Found</h2>
            <p className="text-navy-600 dark:text-navy-400 mb-6">The train you're looking for doesn't exist or has been removed.</p>
            <Link to="/search">
              <Button>Search Trains</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const minPrice = Math.min(...train.classes.map((c) => c.price));
  const runningDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link to="/search" className="inline-flex items-center gap-2 text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Search
          </Link>

          <div className="card-premium p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex items-center gap-4 lg:w-52 flex-shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center flex-shrink-0">
                  <Train className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-navy-900 dark:text-white">{train.trainNumber}</span>
                    <StatusBadge status={train.status} />
                  </div>
                  <p className="text-sm text-navy-600 dark:text-navy-400 truncate">{train.name}</p>
                </div>
              </div>

              <div className="flex-1 lg:px-8 py-4 border-y lg:border-y-0 lg:border-x border-navy-200 dark:border-navy-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-navy-900 dark:text-white tabular-nums">{train.departureTime}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400">Departure</p>
                    </div>
                    <div className="flex items-center gap-2 text-navy-400">
                      <Train className="w-5 h-5" />
                      <div className="hidden sm:block h-px w-24 bg-gradient-to-r from-navy-300 to-navy-400" />
                      <Train className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-navy-900 dark:text-white tabular-nums">{train.arrivalTime}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400">Arrival</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600 dark:text-navy-400">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {train.duration}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {train.stops} stops</span>
                    <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> from {formatCurrency(minPrice)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-navy-200 dark:border-navy-800 flex flex-wrap items-center gap-3">
                  {train.classes.map((cls) => (
                    <span key={cls.code} className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium',
                      cls.available > 0
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    )}>
                      {cls.code} - {getClassName(cls.code)}: {cls.available > 0 ? `${cls.available} seats` : 'WL'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 lg:ml-auto lg:flex-shrink-0">
                <Link to={`/booking/${train.trainNumber}`}>
                  <Button size="lg" className="w-full sm:w-auto group">
                    Book Tickets
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Route & Timetable</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedRoute(!expandedRoute)}
                  className="gap-1"
                >
                  {expandedRoute ? 'Show Less' : 'Show All Stations'}
                  {expandedRoute ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-0">
                {train.route.slice(0, expandedRoute ? undefined : 8).map((station, index) => (
                  <RouteStationRow
                    key={`${station.stationCode}-${index}`}
                    station={station}
                    index={index}
                    total={train.route.length}
                    isFirst={index === 0}
                    isLast={index === train.route.length - 1}
                    delayMinutes={station.delayMinutes}
                  />
                ))}
                {!expandedRoute && train.route.length > 8 && (
                  <div className="text-center py-4 text-navy-500 dark:text-navy-400">
                    +{train.route.length - 8} more stations
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Train Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Train Number" value={train.trainNumber} />
                <InfoRow label="Train Name" value={train.name} />
                <InfoRow label="Running Days" value={train.runningDays.map((d) => runningDays[d]).join(', ')} />
                <InfoRow label="Total Distance" value={`${train.route[train.route.length - 1].distance} km`} />
                <InfoRow label="Avg Speed" value={`${train.speed} km/h`} />
                <InfoRow label="Total Stops" value={train.stops.toString()} />
                <InfoRow label="Zone" value="Northern Railway" />
                <InfoRow label="Category" value="Superfast Express" />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {train.amenities.map((amenity) => (
                  <Badge key={amenity} variant="info" className="gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Coach Composition</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-navy-500 dark:text-navy-400 border-b border-navy-200 dark:border-navy-800">
                      <th className="pb-2 font-medium">Coach</th>
                      <th className="pb-2 font-medium">Class</th>
                      <th className="pb-2 font-medium">Position</th>
                      <th className="pb-2 font-medium">Seats</th>
                      <th className="pb-2 font-medium">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {train.coachComposition.map((coach) => (
                      <tr key={coach.coachCode} className="border-b border-navy-100 dark:border-navy-800">
                        <td className="py-3 font-mono font-medium">{coach.coachCode}</td>
                        <td className="py-3">{getClassName(coach.classCode)}</td>
                        <td className="py-3 text-center">{coach.position}</td>
                        <td className="py-3 text-center">{coach.totalSeats}</td>
                        <td className="py-3 text-center">
                          <Badge variant={coach.layout.seats.filter((s) => s.status === 'available').length > 0 ? 'success' : 'danger'}>
                            {coach.layout.seats.filter((s) => s.status === 'available').length}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Fare Information</h3>
              <div className="space-y-3">
                {train.classes.map((cls) => (
                  <div key={cls.code} className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
                    <div className="flex items-center gap-3">
                      <Badge variant="primary">{cls.code}</Badge>
                      <span className="font-medium text-navy-900 dark:text-white">{getClassName(cls.code)}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy-900 dark:text-white">{formatCurrency(cls.price)}</p>
                      <p className="text-sm text-navy-500 dark:text-navy-400">
                        {cls.available > 0 ? `${cls.available} seats available` : 'Waitlist only'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Book Your Journey</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Journey Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="label">Class</label>
                  <select className="input">
                    {train.classes.map((cls) => (
                      <option key={cls.code} value={cls.code} disabled={cls.available === 0}>
                        {cls.code} - {getClassName(cls.code)} ({cls.available > 0 ? `${cls.available} seats` : 'Waitlist'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Passengers</label>
                  <select className="input" defaultValue="1">
                    {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <Link to={`/booking/${train.trainNumber}`}>
                  <Button fullWidth size="lg">
                    Proceed to Book
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Important Information</h3>
              <div className="space-y-3 text-sm text-navy-600 dark:text-navy-400">
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>Chart preparation usually happens 4 hours before departure.</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Carry valid ID proof (Aadhaar/PAN/Passport) during journey.</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>E-catering available at major stations. Pre-book meals online.</span>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>Free cancellation up to 48 hours before departure (charges apply).</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function RouteStationRow({ station, index, total, isFirst, isLast, delayMinutes }: {
  station: { stationCode: string; stationName: string; arrivalTime: string; departureTime: string; haltMinutes: number; day: number; distance: number; platform?: string; delayMinutes: number };
  index: number;
  total: number;
  isFirst: boolean;
  isLast: boolean;
  delayMinutes: number;
}) {
  const showArrival = !isFirst;
  const showDeparture = !isLast;

  return (
    <div className="flex items-center gap-4 py-3 relative">
      <div className="flex flex-col items-center relative z-10">
        <div className={cn('w-3 h-3 rounded-full border-2 border-navy-200 dark:border-navy-800', index === 0 ? 'bg-primary-500 border-primary-500' : 'bg-white dark:bg-navy-900')} />
        {!isLast && <div className="w-px h-full bg-navy-200 dark:bg-navy-800" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-navy-900 dark:text-white">{station.stationName}</span>
          <span className="text-xs text-navy-500 dark:text-navy-400">({station.stationCode})</span>
          {station.platform && <Badge variant="info" size="sm">PF {station.platform}</Badge>}
          {delayMinutes > 0 && <Badge variant="warning" size="sm">+{delayMinutes}min</Badge>}
        </div>
        <div className="flex items-center gap-4 text-sm text-navy-500 dark:text-navy-400 mt-1">
          {showArrival && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Arr: {station.arrivalTime}</span>}
          {showDeparture && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Dep: {station.departureTime}</span>}
          {station.haltMinutes > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Halt: {station.haltMinutes}min</span>}
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Day {station.day}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {station.distance}km</span>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50">
      <p className="text-xs text-navy-500 dark:text-navy-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-navy-900 dark:text-white">{value}</p>
    </div>
  );
}

function TrainDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <div className="card-premium p-6 lg:p-8 animate-pulse">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex items-center gap-4 lg:w-52 flex-shrink-0">
              <Skeleton variant="rectangular" width={80} height={80} className="rounded-xl" />
              <div className="space-y-2">
                <Skeleton variant="text" width="60%" height={24} />
                <Skeleton variant="text" width="40%" height={16} />
              </div>
            </div>
            <div className="flex-1 lg:px-8 py-4 border-y lg:border-y-0 lg:border-x border-navy-200 dark:border-navy-800 space-y-4">
              <div className="flex items-center gap-6">
                <Skeleton variant="text" width={80} height={40} />
                <Skeleton variant="rectangular" width={24} height={24} className="rounded" />
                <Skeleton variant="text" width={80} height={40} />
              </div>
              <Skeleton variant="text" width="40%" height={16} />
            </div>
            <div className="flex items-center gap-3 lg:ml-auto lg:flex-shrink-0">
              <Skeleton variant="rectangular" width={140} height={48} />
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <Skeleton variant="text" width="30%" height={24} className="mb-4" />
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <Skeleton key={j} variant="text" width="100%" height={16} />
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="space-y-6">
            <Card className="p-6 animate-pulse">
              <Skeleton variant="text" width="30%" height={24} className="mb-4" />
              <Skeleton variant="text" width="100%" height={120} />
            </Card>
            <Card className="p-6 animate-pulse">
              <Skeleton variant="text" width="30%" height={24} className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="text" width="100%" height={56} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}