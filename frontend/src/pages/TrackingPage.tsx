import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, MapPin, Clock, AlertCircle, CheckCircle, TrendingUp, Zap, RefreshCw, Navigation, Activity, Calendar, Radio } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';
import { TRAINS, STATIONS, MOCK_LIVE_STATUS } from '@/utils/mockData';
import { cn } from '@/utils/cn';
import { formatTime, formatDate, calculateDelayStatus } from '@/utils/helpers';

const POPULAR_TRACKING_TRAINS = ['12501', '12002', '12456', '12301'];

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <Card className="p-6 h-full hover:shadow-card-hover transition-all">
      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="font-semibold text-navy-900 dark:text-white mb-2">{title}</h3>
      <p className="text-navy-600 dark:text-navy-400 text-sm">{description}</p>
    </Card>
  );
}

function StatusCard({ icon: Icon, label, value, subtitle }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; subtitle: string }) {
  return (
    <div className="p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-primary-500" />
        <span className="text-sm text-navy-500 dark:text-navy-400">{label}</span>
      </div>
      <p className="font-semibold text-navy-900 dark:text-white text-lg">{value}</p>
      <p className="text-xs text-navy-500 dark:text-navy-400">{subtitle}</p>
    </div>
  );
}

function RouteMap({ train, liveStatus, progress }: { train: typeof TRAINS[0]; liveStatus: typeof MOCK_LIVE_STATUS[keyof typeof MOCK_LIVE_STATUS]; progress: number }) {
  const stations = train.route;
  const stationCount = stations.length;

  return (
    <div className="relative">
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset={`${progress}%`} stopColor="#3b82f6" stopOpacity="1" />
              <stop offset={`${progress}%`} stopColor="#94a3b8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          <path
            d={`M 20 60 Q 500 20 980 60`}
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-500"
          />

          {stations.map((station, index) => {
            const x = 20 + (index / (stationCount - 1)) * 960;
            const isCurrent = station.stationCode === liveStatus.currentStationCode;
            const isPassed = station.distance <= liveStatus.distanceCovered;
            const isNext = station.stationCode === liveStatus.nextStationCode;

            return (
              <g key={station.stationCode} className="cursor-pointer">
                <circle
                  cx={x}
                  cy={60}
                  r={isCurrent ? 10 : isNext ? 8 : 6}
                  fill={isCurrent ? '#3b82f6' : isPassed ? '#22c55e' : isNext ? '#f59e0b' : '#94a3b8'}
                  stroke="white"
                  strokeWidth={2}
                  className={cn('transition-all duration-300', isCurrent && 'animate-pulse', isNext && 'animate-bounce')}
                />
                <text
                  x={x}
                  y={100}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#64748b"
                  className="font-medium"
                  transform={`rotate(-45 ${x} 100)`}
                >
                  {station.stationName}
                </text>
                {isCurrent && (
                  <text x={x} y={25} textAnchor="middle" fontSize="10" fill="#3b82f6" fontWeight="bold">🚂 LIVE</text>
                )}
              </g>
            );
          })}

          <motion.circle
            cx={20 + (progress / 100) * 960}
            cy={60}
            r={12}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={3}
            className="filter drop-shadow-lg"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
        <LegendItem color="#22c55e" label="Passed" />
        <LegendItem color="#3b82f6" label="Current" pulse />
        <LegendItem color="#f59e0b" label="Next" />
        <LegendItem color="#94a3b8" label="Upcoming" />
      </div>
    </div>
  );
}

function LegendItem({ color, label, pulse = false }: { color: string; label: string; pulse?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-navy-600 dark:text-navy-400">
      <span className={cn('w-3 h-3 rounded-full', pulse && 'animate-pulse')} style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function UpcomingStationRow({ station, isNext, delayMinutes }: { station: { stationName: string; stationCode: string; arrivalTime: string; departureTime: string; haltMinutes: number; day: number; distance: number; platform?: string; delayMinutes: number }; isNext: boolean; delayMinutes: number }) {
  return (
    <div className={cn('flex items-center gap-4 py-3', isNext && 'bg-primary-50 dark:bg-primary-900/20')}>
      <div className={cn('w-2 h-2 rounded-full flex-shrink-0', isNext ? 'bg-primary-500 animate-pulse' : 'bg-navy-300 dark:bg-navy-600')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium', isNext && 'text-primary-700 dark:text-primary-300')}>{station.stationName}</span>
          <span className="text-sm text-navy-500 dark:text-navy-400">({station.stationCode})</span>
          {isNext && <Badge variant="info" size="sm">Next</Badge>}
          {station.platform && <Badge variant="secondary" size="sm">PF {station.platform}</Badge>}
          {delayMinutes > 0 && <Badge variant="warning" size="sm">+{delayMinutes}min</Badge>}
        </div>
        <div className="flex items-center gap-4 text-sm text-navy-500 dark:text-navy-400">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Arr: {station.arrivalTime}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Dep: {station.departureTime}</span>
          {station.haltMinutes > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Halt: {station.haltMinutes}min</span>}
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Day {station.day}</span>
        </div>
      </div>
      {isNext && (
        <div className="text-right">
          <p className="font-semibold text-navy-900 dark:text-white">{station.arrivalTime}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">Est. Arrival</p>
        </div>
      )}
    </div>
  );
}

function JourneyInfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-navy-100 dark:border-navy-800 last:border-0">
      <span className="text-navy-500 dark:text-navy-400">{label}</span>
      <span className="font-medium text-navy-900 dark:text-white text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items_center justify-between py-2 border-b border-navy-100 dark:border-navy-800 last:border-0">
      <span className="text-navy-500 dark:text-navy-400">{label}</span>
      <span className="font-medium text-navy-900 dark:text-white">{value}</span>
    </div>
  );
}

function TrackingSearchView({ inputRef, searchQuery, setSearchQuery, showSuggestions, setShowSuggestions, filteredTrains, handleSearch, handleSuggestionClick }: any) {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-12 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <Train className="w-10 h-10 text-white" />
            </div>
            <h1 className="page-title mb-4">Live Train Tracking</h1>
            <p className="page-subtitle">Track any train in real-time with GPS precision. Get live location, speed, delay updates, and station alerts.</p>
          </div>

          <Card className="p-6 lg:p-8 mb-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Enter train number or name (e.g., 12501, Pune Superfast)"
                  className="input pl-12 pr-12 text-lg"
                  autoComplete="off"
                />
                <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2" size="lg">
                  Track
                </Button>
              </div>

              <AnimatePresence>
                {showSuggestions && searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-navy-200 dark:border-navy-800 overflow-hidden z-10"
                  >
                    {filteredTrains.slice(0, 5).map((train) => (
                      <button
                        key={train.trainNumber}
                        onClick={() => handleSuggestionClick(train.trainNumber)}
                        className="w-full p-4 hover:bg-navy-50 dark:hover:bg-navy-800 flex items-center justify-between border-t border-navy-100 dark:border-navy-800 first:border-0"
                      >
                        <div>
                          <p className="font-medium text-navy-900 dark:text-white">{train.trainNumber} - {train.name}</p>
                          <p className="text-sm text-navy-500 dark:text-navy-400">{train.from} → {train.to} | {train.departureTime} - {train.arrivalTime}</p>
                        </div>
                        <Train className="w-5 h-5 text-primary-500" />
                      </button>
                    ))}
                    {filteredTrains.length === 0 && (
                      <div className="p-4 text-center text-navy-500 dark:text-navy-400">No trains found</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_TRACKING_TRAINS.map((num) => {
              const train = TRAINS.find((t) => t.trainNumber === num);
              return train ? (
                <motion.button
                  key={num}
                  onClick={() => handleSuggestionClick(num)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="card p-4 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Train className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-900 dark:text-white truncate">{train.trainNumber} - {train.name}</p>
                      <p className="text-sm text-navy-500 dark:text-navy-400">{train.from} → {train.to}</p>
                    </div>
                  </div>
                </motion.button>
              ) : null;
            })}
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <FeatureCard icon={MapPin} title="Real-time Location" description="GPS-based live tracking with precise train coordinates updated every 30 seconds." />
            <FeatureCard icon={Activity} title="Speed & Delay" description="Live speed monitoring, delay calculations, and estimated arrival predictions." />
            <FeatureCard icon={Navigation} title="Route Visualization" description="Interactive route map showing current position, upcoming stations, and progress." />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TrackingLiveView({ trainNumber, liveStatus, fetchLiveStatus, autoRefresh, setAutoRefresh, train, currentStation, nextStation, progress, delayInfo, error }: any) {
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
              <Link to="/tracking" className="inline-flex items-center gap-2 text-navy-600 dark:text-navy-400 hover:text-primary-600 dark:hover:text-primary-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                Back to Search
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center">
                  <Train className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-navy-900 dark:text-white">{trainNumber}</span>
                    <StatusBadge status={liveStatus?.status || 'SCHEDULED'} />
                    {liveStatus?.isLive && <Badge variant="success" dot>Live</Badge>}
                  </div>
                  <p className="text-navy-600 dark:text-navy-400">{train?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)} className="gap-2">
                <RefreshCw className={cn('w-4 h-4', autoRefresh && 'animate-spin')} />
                Auto Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={() => fetchLiveStatus(trainNumber)}>
                <RefreshCw className="w-4 h-4" />
                Refresh Now
              </Button>
            </div>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-700 dark:text-amber-300">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Live Train Status</h3>
                <div className="flex items-center gap-2 text-sm text-navy-500 dark:text-navy-400">
                  <span className="flex items-center gap-1">
                    <span className={cn('w-2 h-2 rounded-full', liveStatus?.isLive ? 'bg-green-500 animate-pulse' : 'bg-navy-400')} />
                    {liveStatus?.isLive ? 'Live' : 'Scheduled'}
                  </span>
                  <span>Updated {liveStatus ? new Date(liveStatus.lastUpdated).toLocaleTimeString() : 'Just now'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatusCard icon={MapPin} label="Current Station" value={liveStatus?.currentStation || '—'} subtitle={liveStatus?.currentStationCode} />
                <StatusCard icon={Clock} label="Expected Arrival" value={liveStatus?.expectedArrival || '—'} subtitle={liveStatus?.delayMinutes !== 0 ? `${liveStatus.delayMinutes > 0 ? '+' : ''}${liveStatus.delayMinutes}min` : 'On Time'} />
                <StatusCard icon={Zap} label="Current Speed" value={`${liveStatus?.speed || 0} km/h`} subtitle="Live GPS" />
                <StatusCard icon={TrendingUp} label="Delay Status" value={delayInfo.label} subtitle={`${Math.round(progress)}% completed`} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <Train className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white">Next Station</p>
                      <p className="text-sm text-navy-500 dark:text-navy-400">{liveStatus?.nextStation || '—'} ({liveStatus?.nextStationCode || '—'})</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-navy-900 dark:text-white">{liveStatus?.nextStationArrival || '—'}</p>
                    <p className="text-sm text-navy-500 dark:text-navy-400">Estimated Arrival</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Interactive Route Map</h3>
              <RouteMap
                train={train!}
                liveStatus={liveStatus!}
                progress={progress}
              />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Upcoming Stations</h3>
              <div className="space-y-0">
                {train?.route.slice(train.route.findIndex((s) => s.stationCode === liveStatus?.currentStationCode) + 1).map((station, index) => (
                  <UpcomingStationRow
                    key={`${station.stationCode}-${index}`}
                    station={station}
                    isNext={index === 0}
                    delayMinutes={station.delayMinutes}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Journey Overview</h3>
              <div className="space-y-4">
                <JourneyInfoRow label="Train" value={`${trainNumber} - ${train?.name}`} />
                <JourneyInfoRow label="Route" value={`${train?.from} → ${train?.to}`} />
                <JourneyInfoRow label="Departure" value={`${formatTime(train?.departureTime || '')} (${currentStation?.stationName || '—'})`} />
                <JourneyInfoRow label="Arrival" value={`${formatTime(train?.arrivalTime || '')} (${nextStation?.stationName || '—'})`} />
                <JourneyInfoRow label="Duration" value={train?.duration || '—'} />
                <JourneyInfoRow label="Distance" value={`${train?.route[train.route.length - 1]?.distance || 0} km`} />
                <JourneyInfoRow label="Current Delay" value={delayInfo.label} />
                <JourneyInfoRow label="Progress" value={`${Math.round(progress)}%`} />
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Train Details</h3>
              <div className="space-y-3">
                <DetailRow label="Coaches" value={train?.coachComposition.length.toString() || '—'} />
                <DetailRow label="Classes" value={train?.classes.map((c) => c.code).join(', ') || '—'} />
                <DetailRow label="Running Days" value={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].filter((_, i) => train?.runningDays.includes(i)).join(', ') || '—'} />
                <DetailRow label="Avg Speed" value={`${train?.speed || 0} km/h`} />
                <DetailRow label="Pantry Car" value={train?.amenities.includes('Pantry Car') ? 'Yes' : 'No'} />
                <DetailRow label="Charging Points" value={train?.amenities.includes('Charging Points') ? 'Yes' : 'No'} />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">Demo Live Data</h3>
              <p className="text-sm text-navy-600 dark:text-navy-400">
                This is simulated live tracking data for demonstration purposes. In production, this would connect to real railway GPS APIs.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackingPage() {
  const [trainNumber, setTrainNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [liveStatus, setLiveStatus] = useState<typeof MOCK_LIVE_STATUS[keyof typeof MOCK_LIVE_STATUS] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { setLiveTrackingTrain } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchLiveStatus = useCallback(async (number: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockStatus = MOCK_LIVE_STATUS[number];
      if (mockStatus) {
        const updatedStatus = {
          ...mockStatus,
          lastUpdated: new Date().toISOString(),
          coordinates: {
            lat: mockStatus.coordinates.lat + (Math.random() - 0.5) * 0.005,
            lng: mockStatus.coordinates.lng + (Math.random() - 0.5) * 0.005,
          },
          distanceCovered: mockStatus.distanceCovered + Math.floor(Math.random() * 5),
          speed: Math.max(80, Math.min(130, mockStatus.speed + (Math.random() - 0.5) * 10)),
        };
        setLiveStatus(updatedStatus);
      } else {
        setError('Live tracking not available for this train. Showing scheduled timing.');
        const train = TRAINS.find((t) => t.trainNumber === number);
        if (train) {
          setLiveStatus({
            trainNumber: train.trainNumber,
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
            coordinates: STATIONS.find((s) => s.code === train.from)?.coordinates || { lat: 0, lng: 0 },
            isLive: false,
          });
        }
      }
    } catch {
      setError('Failed to fetch live status');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (trainNumber) {
      setLiveTrackingTrain(trainNumber);
      fetchLiveStatus(trainNumber);
    }
  }, [trainNumber, fetchLiveStatus]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh && trainNumber && !isLoading) {
      interval = setInterval(() => fetchLiveStatus(trainNumber), 30000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, trainNumber, isLoading]);

  const filteredTrains = TRAINS.filter(
    (t) => t.trainNumber.toLowerCase().includes(searchQuery.toLowerCase()) || t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      const found = filteredTrains[0];
      if (found) {
        setTrainNumber(found.trainNumber);
        setSearchQuery(found.trainNumber);
      }
    }
  };

  const handleSuggestionClick = (number: string) => {
    setTrainNumber(number);
    setSearchQuery(number);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const train = TRAINS.find((t) => t.trainNumber === trainNumber);
  const currentStation = train?.route.find((s) => s.stationCode === liveStatus?.currentStationCode);
  const nextStation = train?.route.find((s) => s.stationCode === liveStatus?.nextStationCode);
  const progress = liveStatus && liveStatus.totalDistance > 0 ? (liveStatus.distanceCovered / liveStatus.totalDistance) * 100 : 0;
  const delayInfo = liveStatus ? calculateDelayStatus(liveStatus.delayMinutes) : { label: 'Unknown', color: 'gray' };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      {trainNumber ? (
        <TrackingLiveView
          trainNumber={trainNumber}
          liveStatus={liveStatus}
          fetchLiveStatus={fetchLiveStatus}
          autoRefresh={autoRefresh}
          setAutoRefresh={setAutoRefresh}
          train={train}
          currentStation={currentStation}
          nextStation={nextStation}
          progress={progress}
          delayInfo={delayInfo}
          error={error}
        />
      ) : (
        <TrackingSearchView
          inputRef={inputRef}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          filteredTrains={filteredTrains}
          handleSearch={handleSearch}
          handleSuggestionClick={handleSuggestionClick}
        />
      )}
    </div>
  );
}

function Link({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) {
  return <a href={to} className={className}>{children}</a>;
}