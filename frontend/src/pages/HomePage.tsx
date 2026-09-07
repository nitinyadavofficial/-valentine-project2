import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { useSearch } from '@/hooks/useSearch';
import { STATIONS, CLASSES } from '@/utils/mockData';
import { cn } from '@/utils/cn';
import { CalendarIcon, ClockIcon, UsersIcon, TrainIcon, StarIcon, ShieldIcon, ZapIcon, TrendingUpIcon, SearchIcon, MapPinIcon, ArrowRightIcon } from '@/components/ui/Icons';

const FEATURES = [
  { icon: SearchIcon, title: 'Smart Search', description: 'Find trains instantly with intelligent suggestions and real-time availability.' },
  { icon: MapPinIcon, title: 'Live Tracking', description: 'Track your train in real-time with GPS precision and station alerts.' },
  { icon: ClockIcon, title: 'On-Time Guarantee', description: 'Get notified of delays, platform changes, and schedule updates instantly.' },
  { icon: UsersIcon, title: 'Easy Booking', description: 'Book tickets in minutes with multiple passengers and seat selection.' },
  { icon: ShieldIcon, title: 'Secure Payments', description: 'Pay safely with UPI, cards, net banking, and digital wallets.' },
  { icon: ZapIcon, title: 'Instant Confirmation', description: 'Get your PNR and e-ticket immediately after booking.' },
];

const STATS = [
  { value: '50,000+', label: 'Daily Bookings', icon: TrendingUpIcon },
  { value: '12,000+', label: 'Trains Tracked', icon: TrainIcon },
  { value: '99.9%', label: 'Uptime', icon: ShieldIcon },
  { value: '4.8★', label: 'App Rating', icon: StarIcon },
];

const POPULAR_ROUTES = [
  { from: 'LKO', to: 'NDLS', name: 'Lucknow → New Delhi', trains: 24, duration: '6h 15m' },
  { from: 'BCT', to: 'NDLS', name: 'Mumbai → New Delhi', trains: 18, duration: '16h 35m' },
  { from: 'HWH', to: 'NDLS', name: 'Kolkata → New Delhi', trains: 12, duration: '17h 05m' },
  { from: 'SBC', to: 'NDLS', name: 'Bangalore → New Delhi', trains: 8, duration: '35h 30m' },
  { from: 'MAS', to: 'HWH', name: 'Chennai → Kolkata', trains: 10, duration: '26h 45m' },
  { from: 'ADI', to: 'BCT', name: 'Ahmedabad → Mumbai', trains: 22, duration: '6h 20m' },
];

export function HomePage() {
  const { searchParams, setSearchParams } = useAppStore();
  const { searchStations } = useSearch();
  const [swapAnim, setSwapAnim] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSwap = () => {
    setSwapAnim(true);
    setTimeout(() => {
      setSearchParams({ from: searchParams.to, to: searchParams.from });
      setSwapAnim(false);
    }, 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.from || !searchParams.to) return;
  };

  const stationOptions = STATIONS.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }));

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
        </div>

        <div className="section-container relative py-24 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="primary" className="mb-6 inline-flex" style={{ animationDelay: '100ms' }}>
              <StarIcon className="w-3 h-3 mr-1" /> New: Live Train Tracking with GPS
            </Badge>
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6" style={{ animationDelay: '200ms' }}>
              Your Journey{' '}
              <span className="bg-gradient-to-r from-primary-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">
                Starts Here
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-navy-200/90 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '300ms' }}>
              Search, book and track trains in real time — all from one place. Experience the future of railway travel.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="card-premium p-6 lg:p-8 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
                <div className="lg:col-span-2">
                  <label htmlFor="from" className="label">From Station</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                    <input
                      id="from"
                      type="text"
                      list="from-stations"
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({ from: e.target.value })}
                      onFocus={() => setFocusedField('from')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g., Lucknow (LKO)"
                      className={cn('input pl-10', focusedField === 'from' && 'ring-2 ring-primary-500 border-transparent')}
                      autoComplete="off"
                    />
                    <datalist id="from-stations">
                      {stationOptions.map((opt) => <option key={opt.value} value={opt.label} />)}
                    </datalist>
                  </div>
                </div>

                <div className="flex items-end lg:hidden">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className={cn('p-2 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700 transition-all', swapAnim && 'rotate-180')}
                    aria-label="Swap from and to stations"
                  >
                    <motion.svg
                      animate={{ rotate: swapAnim ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </motion.svg>
                  </button>
                </div>

                <div className="lg:col-span-2">
                  <label htmlFor="to" className="label">To Station</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                    <input
                      id="to"
                      type="text"
                      list="to-stations"
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({ to: e.target.value })}
                      onFocus={() => setFocusedField('to')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="e.g., New Delhi (NDLS)"
                      className={cn('input pl-10', focusedField === 'to' && 'ring-2 ring-primary-500 border-transparent')}
                      autoComplete="off"
                    />
                    <datalist id="to-stations">
                      {stationOptions.map((opt) => <option key={opt.value} value={opt.label} />)}
                    </datalist>
                  </div>
                </div>

                <div className="hidden lg:flex items-end">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className={cn('p-2 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-700 transition-all', swapAnim && 'rotate-180')}
                    aria-label="Swap from and to stations"
                  >
                    <motion.svg
                      animate={{ rotate: swapAnim ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </motion.svg>
                  </button>
                </div>

                <div>
                  <label htmlFor="date" className="label">Journey Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                    <input
                      id="date"
                      type="date"
                      value={searchParams.date}
                      onChange={(e) => setSearchParams({ date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className={cn('input pl-10')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="class" className="label">Class</label>
                  <Select
                    id="class"
                    value={searchParams.class}
                    onChange={(e) => setSearchParams({ class: e.target.value })}
                    options={CLASSES}
                    placeholder="Select class"
                  />
                </div>

                <div className="lg:col-span-1 flex items-end">
                  <Button type="submit" fullWidth size="lg" className="group">
                    <SearchIcon className="w-5 h-5 mr-1" />
                    Search Trains
                    <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-navy-600 dark:text-navy-400">
                <span className="flex items-center gap-1"><UsersIcon className="w-4 h-4" /> {searchParams.passengers} Passenger{searchParams.passengers > 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {searchParams.date}</span>
                {searchParams.returnDate && <span className="flex items-center gap-1"><CalendarIcon className="w-4 h-4" /> Return: {searchParams.returnDate}</span>}
              </div>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.4 }}
          className="section-container relative pb-12"
        >
          <div className="flex items-center justify-center gap-4 text-navy-300/50">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-navy-500" />
            <span className="text-sm font-medium">Popular Routes</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-navy-500" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {POPULAR_ROUTES.map((route, index) => (
              <motion.link
                key={route.from + route.to}
                href={`/search?from=${route.from}&to=${route.to}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="card p-4 hover:shadow-card-hover transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-navy-900 dark:text-white">{route.name}</span>
                  <Badge variant="info">{route.trains} trains</Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-navy-600 dark:text-navy-400">
                  <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4" /> {route.duration}</span>
                  <TrainIcon className="w-4 h-4 text-primary-500" />
                </div>
              </motion.link>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-20 lg:py-28 bg-white dark:bg-navy-950" aria-labelledby="features-heading">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 id="features-heading" className="page-title">Everything you need for seamless travel</h2>
            <p className="page-subtitle">Powerful features designed to make your railway journey effortless and enjoyable.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {FEATURES.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="card p-6 hover:shadow-card-hover transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-navy-600 dark:text-navy-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-navy-50 dark:bg-navy-900" aria-labelledby="stats-heading">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-navy-600 dark:text-navy-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-white dark:bg-navy-950" aria-labelledby="cta-heading">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-premium p-8 lg:p-16 text-center max-w-3xl mx-auto"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <TrainIcon className="w-8 h-8 text-white" />
            </div>
            <h2 id="cta-heading" className="page-title mb-4">Ready to start your journey?</h2>
            <p className="page-subtitle mb-8 max-w-lg mx-auto">Join millions of travelers who trust RailGo for their railway bookings. Fast, secure, and reliable.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/search">
                <Button size="lg" className="group w-full sm:w-auto">
                  <SearchIcon className="w-5 h-5 mr-2" />
                  Search Trains Now
                  <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/tracking">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  Track Live Train
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}