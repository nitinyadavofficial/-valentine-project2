import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp, Clock, MapPin, Train, IndianRupee, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Skeleton, TrainListSkeleton } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useTrainSearch } from '@/hooks/useApi';
import { TRAINS, CLASSES, TRAIN_TYPES } from '@/utils/mockData';
import { cn } from '@/utils/cn';
import { formatTime, formatDuration, getClassName } from '@/utils/helpers';
import type { FilterOptions, SortOption, Train } from '@/types';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchTrains, isLoading, error } = useTrainSearch();
  const { filters, setFilters, resetFilters, sortBy, setSortBy } = useAppStore();
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [trains, setTrains] = useState<Train[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const classCode = searchParams.get('class') || '3A';

    if (from && to) {
      performSearch({ from, to, date, passengers: 1, class: classCode });
    }
  }, [searchParams]);

  const performSearch = async (params: { from: string; to: string; date: string; passengers: number; class: string }) => {
    setHasSearched(true);
    const results = await searchTrains(params);
    setTrains(results);
  };

  const filteredAndSortedTrains = useMemo(() => {
    let result = [...trains];

    if (filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24) {
      result = result.filter((t) => {
        const depHour = parseInt(t.departureTime.split(':')[0]);
        return depHour >= filters.departureTimeRange[0] && depHour <= filters.departureTimeRange[1];
      });
    }

    if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24) {
      result = result.filter((t) => {
        const arrHour = parseInt(t.arrivalTime.split(':')[0]);
        return arrHour >= filters.arrivalTimeRange[0] && arrHour <= filters.arrivalTimeRange[1];
      });
    }

    if (filters.priceRange[1] < 5000) {
      result = result.filter((t) => t.classes.some((c) => c.price >= filters.priceRange[0] && c.price <= filters.priceRange[1]));
    }

    if (filters.trainTypes.length > 0) {
      result = result.filter((t) => filters.trainTypes.some((type) => t.name.toLowerCase().includes(type.toLowerCase())));
    }

    if (filters.classes.length > 0) {
      result = result.filter((t) => t.classes.some((c) => filters.classes.includes(c.code)));
    }

    if (filters.seatAvailability) {
      result = result.filter((t) => t.classes.some((c) => c.available > 0));
    }

    if (filters.maxDuration < 24 * 60) {
      result = result.filter((t) => t.durationMinutes <= filters.maxDuration);
    }

    if (filters.maxStops < 20) {
      result = result.filter((t) => t.stops <= filters.maxStops);
    }

    if (filters.onTimeOnly) {
      result = result.filter((t) => t.status === 'ON_TIME' || t.delayMinutes === 0);
    }

    if (filters.overnightOnly) {
      result = result.filter((t) => {
        const depHour = parseInt(t.departureTime.split(':')[0]);
        const arrHour = parseInt(t.arrivalTime.split(':')[0]);
        return depHour >= 20 || depHour < 6 || arrHour >= 20 || arrHour < 6;
      });
    }

    switch (sortBy) {
      case 'cheapest':
        result.sort((a, b) => Math.min(...a.classes.map((c) => c.price)) - Math.min(...b.classes.map((c) => c.price)));
        break;
      case 'fastest':
        result.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case 'earliest':
        result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
        break;
      case 'latest':
        result.sort((a, b) => b.departureTime.localeCompare(a.departureTime));
        break;
      case 'availability':
        result.sort((a, b) => Math.max(...b.classes.map((c) => c.available)) - Math.max(...a.classes.map((c) => c.available)));
        break;
    }

    return result;
  }, [trains, filters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.departureTimeRange[0] > 0 || filters.departureTimeRange[1] < 24) count++;
    if (filters.arrivalTimeRange[0] > 0 || filters.arrivalTimeRange[1] < 24) count++;
    if (filters.priceRange[1] < 5000) count++;
    if (filters.trainTypes.length > 0) count++;
    if (filters.classes.length > 0) count++;
    if (filters.seatAvailability) count++;
    if (filters.maxDuration < 24 * 60) count++;
    if (filters.maxStops < 20) count++;
    if (filters.onTimeOnly) count++;
    if (filters.overnightOnly) count++;
    return count;
  }, [filters]);

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
  };

  const clearAllFilters = () => {
    resetFilters();
    setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="page-title">Train Search Results</h1>
              <p className="page-subtitle">
                {trains.length} train{trains.length !== 1 ? 's' : ''} found for your journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setMobileFiltersOpen(true)} className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters {activeFilterCount > 0 && <Badge variant="primary">{activeFilterCount}</Badge>}
              </Button>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm text-navy-600 dark:text-navy-400">Sort by:</label>
                <Select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  options={[
                    { value: 'cheapest', label: 'Cheapest' },
                    { value: 'fastest', label: 'Fastest' },
                    { value: 'earliest', label: 'Earliest Departure' },
                    { value: 'latest', label: 'Latest Departure' },
                    { value: 'availability', label: 'Best Availability' },
                  ]}
                  className="w-auto"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="flex lg:hidden mb-6">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} fullWidth className="justify-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilterCount > 0 && <Badge variant="primary">{activeFilterCount}</Badge>}
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-3" aria-label="Filters">
              <div className={cn('lg:sticky lg:top-24 space-y-6', showFilters || !mobileFiltersOpen ? 'block' : 'hidden')}>
                <FilterSidebar filters={filters} setFilters={setFilters} clearAllFilters={clearAllFilters} activeFilterCount={activeFilterCount} />
              </div>
            </aside>

            <main className="lg:col-span-9">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <TrainListSkeleton key="loading" count={5} />
                ) : hasSearched ? (
                  filteredAndSortedTrains.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {filteredAndSortedTrains.map((train, index) => (
                        <motion.div
                          key={train.trainNumber}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <TrainCard train={train} />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Train className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
                      <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">No trains found</h3>
                      <p className="text-navy-600 dark:text-navy-400 mb-6">Try adjusting your filters or search for a different route.</p>
                      <Button variant="outline" onClick={clearAllFilters}>Clear All Filters</Button>
                    </Card>
                  )
                ) : (
                  <Card className="p-8 text-center">
                    <Train className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
                    <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Start your search</h3>
                    <p className="text-navy-600 dark:text-navy-400 mb-6">Enter your journey details on the homepage to find trains.</p>
                    <Link to="/">
                      <Button>Go to Homepage</Button>
                    </Link>
                  </Card>
                )}
              </AnimatePresence>
            </main>
          </div>
        </motion.div>
      </div>

      {mobileFiltersOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileFiltersOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-navy-900 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-navy-200 dark:border-navy-800 flex items-center justify-between sticky top-0 bg-white dark:bg-navy-900 z-10">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar filters={filters} setFilters={setFilters} clearAllFilters={clearAllFilters} activeFilterCount={activeFilterCount} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function FilterSidebar({ filters, setFilters, clearAllFilters, activeFilterCount }: {
  filters: FilterOptions;
  setFilters: (f: Partial<FilterOptions>) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
}) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    time: true,
    price: true,
    type: false,
    class: false,
    other: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Filters</h2>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>

      <FilterSection title="Departure Time" icon={Clock} expanded={expandedSections.time} onToggle={() => toggleSection('time')}>
        <div className="space-y-3">
          <RangeSlider
            label="Departure Hour"
            min={0}
            max={24}
            value={filters.departureTimeRange}
            onChange={(val) => setFilters({ departureTimeRange: val })}
            step={1}
            format={(v) => `${v}:00`}
          />
        </div>
      </FilterSection>

      <FilterSection title="Arrival Time" icon={MapPin} expanded={expandedSections.time} onToggle={() => toggleSection('time')}>
        <div className="space-y-3">
          <RangeSlider
            label="Arrival Hour"
            min={0}
            max={24}
            value={filters.arrivalTimeRange}
            onChange={(val) => setFilters({ arrivalTimeRange: val })}
            step={1}
            format={(v) => `${v}:00`}
          />
        </div>
      </FilterSection>

      <FilterSection title="Price Range" icon={IndianRupee} expanded={expandedSections.price} onToggle={() => toggleSection('price')}>
        <RangeSlider
          label="Price (₹)"
          min={0}
          max={5000}
          value={filters.priceRange}
          onChange={(val) => setFilters({ priceRange: val })}
          step={100}
          format={(v) => `₹${v}`}
        />
      </FilterSection>

      <FilterSection title="Train Type" icon={Train} expanded={expandedSections.type} onToggle={() => toggleSection('type')}>
        <div className="space-y-2">
          {TRAIN_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.trainTypes.includes(type.value)}
                onChange={(e) => setFilters({
                  trainTypes: e.target.checked
                    ? [...filters.trainTypes, type.value]
                    : filters.trainTypes.filter((t) => t !== type.value)
                })}
                className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-navy-700 dark:text-navy-300">{type.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Class" icon={IndianRupee} expanded={expandedSections.class} onToggle={() => toggleSection('class')}>
        <div className="space-y-2">
          {CLASSES.map((cls) => (
            <label key={cls.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.classes.includes(cls.value)}
                onChange={(e) => setFilters({
                  classes: e.target.checked
                    ? [...filters.classes, cls.value]
                    : filters.classes.filter((c) => c !== cls.value)
                })}
                className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-navy-700 dark:text-navy-300">{cls.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="More Options" icon={SlidersHorizontal} expanded={expandedSections.other} onToggle={() => toggleSection('other')}>
        <div className="space-y-4">
          <div>
            <label className="label">Max Duration (hours)</label>
            <Input
              type="range"
              min={1}
              max={48}
              value={filters.maxDuration / 60}
              onChange={(e) => setFilters({ maxDuration: parseInt(e.target.value) * 60 })}
              className="h-2 bg-navy-200 dark:bg-navy-700 appearance-none rounded-lg"
            />
            <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{filters.maxDuration / 60}h</p>
          </div>

          <div>
            <label className="label">Max Stops</label>
            <Input
              type="range"
              min={0}
              max={30}
              value={filters.maxStops}
              onChange={(e) => setFilters({ maxStops: parseInt(e.target.value) })}
              className="h-2 bg-navy-200 dark:bg-navy-700 appearance-none rounded-lg"
            />
            <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">{filters.maxStops} stops</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.seatAvailability}
              onChange={(e) => setFilters({ seatAvailability: e.target.checked })}
              className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-navy-700 dark:text-navy-300">Only show trains with available seats</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.onTimeOnly}
              onChange={(e) => setFilters({ onTimeOnly: e.target.checked })}
              className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-navy-700 dark:text-navy-300">Only on-time trains</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.overnightOnly}
              onChange={(e) => setFilters({ overnightOnly: e.target.checked })}
              className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-navy-700 dark:text-navy-300">Only overnight trains</span>
          </label>
        </div>
      </FilterSection>
    </Card>
  );
}

function FilterSection({ title, icon: Icon, expanded, onToggle, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-navy-200 dark:border-navy-800 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-left"
        aria-expanded={expanded}
      >
        <span className="flex items-center gap-2 font-medium text-navy-900 dark:text-white">
          <Icon className="w-5 h-5 text-navy-500" />
          {title}
        </span>
        <ChevronDown className={cn('w-5 h-5 text-navy-500 transition-transform', expanded && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RangeSlider({ label, min, max, value, onChange, step, format }: {
  label: string;
  min: number;
  max: number;
  value: [number, number];
  onChange: (val: [number, number]) => void;
  step: number;
  format: (v: number) => string;
}) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(parseInt(e.target.value), maxVal);
    setMinVal(val);
    onChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(parseInt(e.target.value), minVal);
    setMaxVal(val);
    onChange([minVal, val]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-navy-600 dark:text-navy-400">{format(minVal)}</span>
        <span className="text-navy-600 dark:text-navy-400">{format(maxVal)}</span>
      </div>
      <div className="relative h-6">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none z-10"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-6 bg-transparent pointer-events-none appearance-none z-10"
        />
        <div className="absolute inset-0 h-2 bg-navy-200 dark:bg-navy-700 rounded-lg pointer-events-none">
          <div
            className="absolute h-full bg-primary-500 rounded-lg"
            style={{
              left: `${((minVal - min) / (max - min)) * 100}%`,
              width: `${((maxVal - minVal) / (max - min)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function TrainCard({ train }: { train: Train }) {
  const fromStation = TRAINS.find((s) => s.from === train.from);
  const toStation = TRAINS.find((s) => s.to === train.to);

  const minPrice = Math.min(...train.classes.map((c) => c.price));
  const maxAvailability = Math.max(...train.classes.map((c) => c.available));

  return (
    <Link to={`/train/${train.trainNumber}`} className="block">
      <Card className="p-6 hover:shadow-card-hover transition-all group">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex items-center gap-4 lg:w-48 flex-shrink-0">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center flex-shrink-0">
              <Train className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-semibold text-navy-900 dark:text-white">{train.trainNumber}</span>
                <StatusBadge status={train.status} size="sm" />
              </div>
              <p className="text-sm text-navy-600 dark:text-navy-400 truncate">{train.name}</p>
            </div>
          </div>

          <div className="flex-1 lg:px-8 py-4 border-y lg:border-y-0 lg:border-x border-navy-200 dark:border-navy-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy-900 dark:text-white tabular-nums">{train.departureTime}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">Departure</p>
                </div>
                <div className="flex items-center gap-2 text-navy-400">
                  <Train className="w-4 h-4" />
                  <div className="hidden sm:block h-px w-20 bg-gradient-to-r from-navy-300 to-navy-400" />
                  <Train className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-navy-900 dark:text-white tabular-nums">{train.arrivalTime}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">Arrival</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-navy-600 dark:text-navy-400">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {train.duration}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {train.stops} stops</span>
                <span className="flex items-center gap-1"><IndianRupee className="w-4 h-4" /> from ₹{minPrice.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-navy-200 dark:border-navy-800">
              <div className="flex flex-wrap items-center gap-3">
                {train.classes.map((cls) => (
                  <span key={cls.code} className={cn(
                    'px-3 py-1 rounded-lg text-xs font-medium',
                    cls.available > 0
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  )}>
                    {cls.code}: {cls.available > 0 ? `${cls.available} seats` : 'Waitlist'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:ml-auto lg:flex-shrink-0">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              <Train className="w-4 h-4 mr-1" />
              Track Live
            </Button>
            <Button size="sm" className="w-full sm:w-auto">
              Book Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}