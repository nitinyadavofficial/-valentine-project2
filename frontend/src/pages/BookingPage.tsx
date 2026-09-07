import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, User, Calendar, Ticket, CreditCard, CheckCircle, ChevronDown, ChevronUp, Plus, Trash2, Shield, Clock, MapPin, IndianRupee, Train as TrainIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';
import { useTrainDetails } from '@/hooks/useApi';
import { TRAINS } from '@/utils/mockData';
import { cn } from '@/utils/cn';
import { formatTime, formatDate, formatCurrency, getClassName } from '@/utils/helpers';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const passengerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.number().min(1, 'Age is required').max(120, 'Invalid age'),
  gender: z.enum(['M', 'F', 'O']),
  idType: z.enum(['AADHAAR', 'PAN', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE']),
  idNumber: z.string().min(4, 'ID number is required'),
  seatPreference: z.enum(['LB', 'MB', 'UB', 'ANY']),
  mealPreference: z.enum(['VEG', 'NON_VEG', 'NO_MEAL']),
});

const bookingSchema = z.object({
  passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const STEPS = [
  { id: 1, label: 'Select Train', icon: TrainIcon },
  { id: 2, label: 'Passengers', icon: User },
  { id: 3, label: 'Seat Selection', icon: Ticket },
  { id: 4, label: 'Payment', icon: CreditCard },
];

export function BookingPage() {
  const { trainNumber } = useParams<{ trainNumber: string }>();
  const navigate = useNavigate();
  const { train, fetchTrain, isLoading } = useTrainDetails(trainNumber || null);
  const { bookingPassengers, setBookingPassengers, addPassenger, updatePassenger, removePassenger, clearBookingPassengers, selectedSeats, setSelectedSeats, clearSelectedSeats, setCurrentBooking } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedClass, setSelectedClass] = useState('3A');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { passengers: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'passengers' });

  useEffect(() => {
    if (trainNumber) fetchTrain();
  }, [trainNumber, fetchTrain]);

  useEffect(() => {
    if (train) {
      const availableClass = train.classes.find((c) => c.available > 0);
      if (availableClass) setSelectedClass(availableClass.code);
    }
  }, [train]);

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: '', age: 0, gender: 'M', idType: 'AADHAAR', idNumber: '', seatPreference: 'ANY', mealPreference: 'VEG' });
    }
  }, [fields.length, append]);

  const handleNext = async (step: number) => {
    if (step === 2) {
      await handleSubmit(async (data) => {
        setBookingPassengers(data.passengers);
        setCurrentStep(3);
      })();
    } else if (step === 3) {
      setCurrentStep(4);
      setCurrentBooking({
        train,
        journeyDate,
        passengers: bookingPassengers,
        coachClass: selectedClass,
      });
    } else {
      setCurrentStep(step);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  if (isLoading) {
    return <BookingSkeleton />;
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Train className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Train Not Found</h2>
            <Button onClick={() => navigate('/search')}>Search Trains</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const selectedClassInfo = train.classes.find((c) => c.code === selectedClass);
  const minPrice = selectedClassInfo?.price || 0;
  const totalPrice = minPrice * bookingPassengers.length;

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <StepProgress steps={STEPS} currentStep={currentStep} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {currentStep === 1 && <Step1TrainSelect train={train} selectedClass={selectedClass} setSelectedClass={setSelectedClass} journeyDate={journeyDate} setJourneyDate={setJourneyDate} onNext={() => handleNext(2)} />}
            {currentStep === 2 && <Step2Passengers fields={fields} append={append} remove={remove} control={control} register={register} errors={errors} onBack={handleBack} onNext={() => handleNext(3)} />}
            {currentStep === 3 && <Step3SeatSelection train={train} selectedClass={selectedClass} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} bookingPassengers={bookingPassengers} onBack={handleBack} onNext={() => handleNext(4)} />}
            {currentStep === 4 && <Step4PaymentSummary train={train} selectedClass={selectedClass} journeyDate={journeyDate} bookingPassengers={bookingPassengers} totalPrice={totalPrice} onBack={handleBack} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepProgress({ steps, currentStep }: { steps: { id: number; label: string; icon: React.ComponentType<{ className?: string }> }[]; currentStep: number }) {
  return (
    <div className="relative">
      <div className="hidden lg:block absolute top-6 left-0 right-0 h-1 bg-navy-200 dark:bg-navy-800" />
      <div className="flex items-center justify-between relative z-10">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300',
              currentStep > step.id ? 'bg-primary-500 border-primary-500' : currentStep === step.id ? 'bg-white border-primary-500' : 'bg-white border-navy-200 dark:border-navy-800'
            )}>
              {currentStep > step.id ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : (
                <step.icon className={cn('w-6 h-6', currentStep === step.id ? 'text-primary-500' : 'text-navy-400 dark:text-navy-500')} />
              )}
            </div>
            <span className={cn('mt-2 text-sm font-medium', currentStep >= step.id ? 'text-navy-900 dark:text-white' : 'text-navy-500 dark:text-navy-400')}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step1TrainSelect({ train, selectedClass, setSelectedClass, journeyDate, setJourneyDate, onNext, bookingPassengers }: {
  train: typeof TRAINS[0];
  selectedClass: string;
  setSelectedClass: (c: string) => void;
  journeyDate: string;
  setJourneyDate: (d: string) => void;
  onNext: () => void;
  bookingPassengers: any[];
}) {
  return (
    <>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Confirm Your Train</h3>
        <div className="card p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4 lg:w-48 flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center flex-shrink-0">
                <Train className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-navy-900 dark:text-white">{train.trainNumber}</span>
                  <Badge variant="primary">{train.status}</Badge>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Journey Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Journey Date</label>
            <input
              type="date"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="input"
            />
          </div>
          <div>
            <label className="label">Class</label>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input">
              {train.classes.map((cls) => (
                <option key={cls.code} value={cls.code} disabled={cls.available === 0}>
                  {cls.code} - {getClassName(cls.code)} ({cls.available > 0 ? `${cls.available} seats` : 'WL'}) - ₹{cls.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Passengers</label>
            <select value={bookingPassengers.length} onChange={(e) => { /* handled by form */ }} className="input">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <p className="text-sm text-primary-700 dark:text-primary-300">
            <strong>Fare Estimate:</strong> ₹{formatCurrency(train.classes.find((c) => c.code === selectedClass)?.price || 0)} per passenger
          </p>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button size="lg" onClick={onNext} className="min-w-[200px]">
          Continue to Passengers
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </>
  );
}

function Step2Passengers({ fields, append, remove, control, register, errors, onBack, onNext }: {
  fields: { id: string }[];
  append: (data: any) => void;
  remove: (index: number) => void;
  control: any;
  register: any;
  errors: any;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Passenger Details</h3>
          {fields.length < 6 && (
            <Button variant="outline" size="sm" onClick={() => append({ name: '', age: 0, gender: 'M', idType: 'AADHAAR', idNumber: '', seatPreference: 'ANY', mealPreference: 'VEG' })}>
              <Plus className="w-4 h-4 mr-1" />
              Add Passenger
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-navy-900 dark:text-white">Passenger {index + 1}</span>
                {fields.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Controller
                  name={`passengers.${index}.name`}
                  control={control}
                  rules={{ required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } }}
                  render={({ field }) => (
                    <Input
                      label="Full Name"
                      error={errors.passengers?.[index]?.name?.message}
                      {...field}
                      placeholder="As per ID proof"
                    />
                  )}
                />
                <Controller
                  name={`passengers.${index}.age`}
                  control={control}
                  rules={{ required: 'Age is required', min: { value: 1, message: 'Invalid age' }, max: { value: 120, message: 'Invalid age' } }}
                  render={({ field }) => (
                    <Input
                      label="Age"
                      type="number"
                      error={errors.passengers?.[index]?.age?.message}
                      {...field}
                      placeholder="Age"
                    />
                  )}
                />
                <Controller
                  name={`passengers.${index}.gender`}
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select
                      label="Gender"
                      error={errors.passengers?.[index]?.gender?.message}
                      options={[
                        { value: 'M', label: 'Male' },
                        { value: 'F', label: 'Female' },
                        { value: 'O', label: 'Other' },
                      ]}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name={`passengers.${index}.idType`}
                  control={control}
                  rules={{ required: 'ID type is required' }}
                  render={({ field }) => (
                    <Select
                      label="ID Type"
                      error={errors.passengers?.[index]?.idType?.message}
                      options={[
                        { value: 'AADHAAR', label: 'Aadhaar Card' },
                        { value: 'PAN', label: 'PAN Card' },
                        { value: 'PASSPORT', label: 'Passport' },
                        { value: 'VOTER_ID', label: 'Voter ID' },
                        { value: 'DRIVING_LICENSE', label: 'Driving License' },
                      ]}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Controller
                  name={`passengers.${index}.idNumber`}
                  control={control}
                  rules={{ required: 'ID number is required', minLength: { value: 4, message: 'Invalid ID number' } }}
                  render={({ field }) => (
                    <Input
                      label="ID Number"
                      error={errors.passengers?.[index]?.idNumber?.message}
                      {...field}
                      placeholder="Enter ID number"
                    />
                  )}
                />
                <Controller
                  name={`passengers.${index}.seatPreference`}
                  control={control}
                  rules={{ required: 'Seat preference is required' }}
                  render={({ field }) => (
                    <Select
                      label="Seat Preference"
                      error={errors.passengers?.[index]?.seatPreference?.message}
                      options={[
                        { value: 'LB', label: 'Lower Berth' },
                        { value: 'MB', label: 'Middle Berth' },
                        { value: 'UB', label: 'Upper Berth' },
                        { value: 'ANY', label: 'Any' },
                      ]}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name={`passengers.${index}.mealPreference`}
                  control={control}
                  rules={{ required: 'Meal preference is required' }}
                  render={({ field }) => (
                    <Select
                      label="Meal Preference"
                      error={errors.passengers?.[index]?.mealPreference?.message}
                      options={[
                        { value: 'VEG', label: 'Vegetarian' },
                        { value: 'NON_VEG', label: 'Non-Vegetarian' },
                        { value: 'NO_MEAL', label: 'No Meal' },
                      ]}
                      {...field}
                    />
                  )}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={isSubmitting} className="min-w-[200px]">
          Continue to Seats
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </>
  );
}

function Step3SeatSelection({ train, selectedClass, selectedSeats, setSelectedSeats, bookingPassengers, onBack, onNext }: {
  train: typeof TRAINS[0];
  selectedClass: string;
  selectedSeats: { coachCode: string; seatNumbers: string[] }[];
  setSelectedSeats: (seats: { coachCode: string; seatNumbers: string[] }[]) => void;
  bookingPassengers: any[];
  onBack: () => void;
  onNext: () => void;
}) {
  const coaches = train.coachComposition.filter((c) => c.classCode === selectedClass);
  const requiredSeats = bookingPassengers.length;

  return (
    <>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Select Seats</h3>
        <p className="text-navy-600 dark:text-navy-400 mb-6">Select {requiredSeats} seat{requiredSeats > 1 ? 's' : ''} for your journey. Available seats are shown in green.</p>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {coaches.map((coach) => (
            <div key={coach.coachCode} className="card p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="primary">{coach.coachCode}</Badge>
                  <span className="text-sm text-navy-600 dark:text-navy-400">{getClassName(coach.classCode)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1 text-green-600"><span className="w-3 h-3 rounded bg-green-500" /> Available</span>
                  <span className="flex items-center gap-1 text-navy-500"><span className="w-3 h-3 rounded bg-navy-500" /> Selected</span>
                  <span className="flex items-center gap-1 text-red-600"><span className="w-3 h-3 rounded bg-red-500" /> Booked</span>
                </div>
              </div>

              <SeatMap coach={coach} selectedSeats={selectedSeats.find((s) => s.coachCode === coach.coachCode)?.seatNumbers || []} onSeatClick={(seatNum) => {
                const existing = selectedSeats.find((s) => s.coachCode === coach.coachCode);
                const selected = existing?.seatNumbers || [];
                if (selected.includes(seatNum)) {
                  setSelectedSeats(selectedSeats.map((s) => s.coachCode === coach.coachCode ? { ...s, seatNumbers: s.seatNumbers.filter((n) => n !== seatNum) } : s).filter((s) => s.seatNumbers.length > 0));
                } else if (selected.length < requiredSeats) {
                  setSelectedSeats([...selectedSeats.filter((s) => s.coachCode !== coach.coachCode), { coachCode: coach.coachCode, seatNumbers: [...selected, seatNum] }]);
                }
              }} requiredCount={requiredSeats} />
            </div>
          ))}
        </div>

        {selectedSeats.reduce((acc, s) => acc + s.seatNumbers.length, 0) < requiredSeats && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <p className="text-amber-700 dark:text-amber-300">Please select {requiredSeats - selectedSeats.reduce((acc, s) => acc + s.seatNumbers.length, 0)} more seat{requiredSeats > 1 ? 's' : ''}.</p>
          </div>
        )}
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button size="lg" onClick={onNext} disabled={selectedSeats.reduce((acc, s) => acc + s.seatNumbers.length, 0) < requiredSeats} className="min-w-[200px]">
          Continue to Payment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </>
  );
}

function SeatMap({ coach, selectedSeats, onSeatClick, requiredCount }: {
  coach: { coachCode: string; layout: { rows: number; columns: number; seats: { number: string; type: string; status: string; position: { row: number; col: number } }[] } };
  selectedSeats: string[];
  onSeatClick: (seatNum: string) => void;
  requiredCount: number;
}) {
  const { rows, columns, seats } = coach.layout;

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-1">
          {Array.from({ length: columns }).map((_, col) => {
            const seat = seats.find((s) => s.position.row === row && s.position.col === col);
            if (!seat) return <div className="w-10 h-10" />;
            const isSelected = selectedSeats.includes(seat.number);
            const isAvailable = seat.status === 'available';
            const isBooked = seat.status === 'occupied';

            return (
              <button
                key={seat.number}
                type="button"
                onClick={() => isAvailable && !isSelected && onSeatClick(seat.number)}
                disabled={isBooked || (!isAvailable && !isSelected)}
                className={cn(
                  'w-10 h-10 rounded-lg text-xs font-medium transition-all flex items-center justify-center',
                  isSelected && 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2',
                  isAvailable && !isSelected && 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400',
                  isBooked && 'bg-red-100 text-red-600 cursor-not-allowed dark:bg-red-900/30 dark:text-red-400',
                  seat.status === 'reserved' && 'bg-amber-100 text-amber-800 cursor-not-allowed dark:bg-amber-900/30 dark:text-amber-400',
                  seat.status === 'ladies' && 'bg-pink-100 text-pink-800 cursor-not-allowed dark:bg-pink-900/30 dark:text-pink-400',
                )}
                title={`${seat.number} - ${seat.type} - ${seat.status}`}
              >
                <div className="text-center">
                  <div className="font-medium">{seat.number}</div>
                  <div className="text-[8px]">{seat.type}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Step4PaymentSummary({ train, selectedClass, journeyDate, bookingPassengers, totalPrice, onBack }: {
  train: typeof TRAINS[0];
  selectedClass: string;
  journeyDate: string;
  bookingPassengers: any[];
  totalPrice: number;
  onBack: () => void;
}) {
  const convenienceFee = Math.round(totalPrice * 0.02);
  const taxes = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + convenienceFee + taxes;

  return (
    <>
      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Booking Summary</h3>
        <div className="card p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center">
              <Train className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-navy-900 dark:text-white">{train.trainNumber} - {train.name}</p>
              <p className="text-sm text-navy-600 dark:text-navy-400">{train.from} → {train.to} • {formatDate(journeyDate)}</p>
              <p className="text-sm text-navy-600 dark:text-navy-400">{train.departureTime} - {train.arrivalTime} • {train.duration}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {bookingPassengers.map((passenger, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-navy-50 dark:bg-navy-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-navy-900 dark:text-white">{passenger.name}</p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">Age: {passenger.age} • {passenger.gender === 'M' ? 'Male' : 'Female'}</p>
                </div>
              </div>
              <Badge variant="primary">{selectedClass}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Fare Breakdown</h3>
        <div className="space-y-3">
          <FareRow label={`Ticket Fare (${bookingPassengers.length} passenger${bookingPassengers.length > 1 ? 's' : ''})`} value={formatCurrency(totalPrice)} />
          <FareRow label="Convenience Fee" value={formatCurrency(convenienceFee)} />
          <FareRow label="GST (5%)" value={formatCurrency(taxes)} />
          <div className="border-t border-navy-200 dark:border-navy-800 pt-3 flex items-center justify-between">
            <span className="font-semibold text-navy-900 dark:text-white">Total Payable</span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-6 bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
        <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Payment Options</h3>
        <div className="grid grid-cols-2 gap-3">
          {['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'].map((method) => (
            <button
              key={method}
              type="button"
              className="p-4 rounded-xl border-2 border-navy-200 dark:border-navy-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left"
            >
              <p className="font-medium text-navy-900 dark:text-white">{method}</p>
              <p className="text-sm text-navy-500 dark:text-navy-400">Secure payment gateway</p>
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Link to={`/payment/booking-${Date.now()}`}>
          <Button size="lg" className="min-w-[200px]">
            Pay {formatCurrency(grandTotal)}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </>
  );
}

function FareRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-navy-700 dark:text-navy-300">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function BookingSkeleton() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <Skeleton variant="rectangular" height={60} className="mb-8" />
        <div className="max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <Skeleton variant="text" width="30%" height={24} className="mb-4" />
              <div className="space-y-3">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} variant="text" width="100%" height={56} />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Link({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) {
  return <a href={to} className={className}>{children}</a>;
}