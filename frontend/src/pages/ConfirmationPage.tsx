import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Ticket, Download, Share2, MapPin, Train, Clock, Calendar, User, IndianRupee, Shield, Star, ArrowRight, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';
import { formatDate, formatTime, formatCurrency, getClassName } from '@/utils/helpers';

export function ConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { currentBooking, setCurrentBooking } = useAppStore();
  const [copied, setCopied] = useState<string | null>(null);

  const booking = currentBooking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Ticket className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">Booking Not Found</h2>
            <Button onClick={() => navigate('/trips')}>View My Trips</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const train = booking.train as any;
  const passengers = booking.passengers || [];
  const coachClass = booking.coachClass || '3A';
  const journeyDate = booking.journeyDate || new Date().toISOString().split('T')[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    const text = `RailGo Booking Confirmed!\nPNR: ${booking.pnr}\nTrain: ${booking.trainNumber} - ${train?.name}\nDate: ${formatDate(journeyDate)}\nFrom: ${train?.from} To: ${train?.to}`;
    if (navigator.share) {
      await navigator.share({ title: 'RailGo Booking', text });
    } else {
      handleCopy(text, 'Booking details');
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Booking Confirmed!</h1>
            <p className="text-navy-600 dark:text-navy-400">Your ticket has been booked successfully.</p>
          </motion.div>

          <Card className="p-6 mb-6 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <Ticket className="w-7 h-7 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-navy-900 dark:text-white">PNR: {booking.pnr}</p>
                <p className="text-sm text-navy-600 dark:text-navy-400">Booking ID: {booking.id}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleCopy(booking.pnr, 'PNR')}>
                  {copied === 'PNR' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Journey Details</h3>
              <StatusBadge status={booking.status as any} />
            </div>

            <div className="card p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-navy-700 flex items-center justify-center">
                  <Train className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-navy-900 dark:text-white">{train?.trainNumber} - {train?.name}</p>
                  <p className="text-sm text-navy-600 dark:text-navy-400">{train?.from} → {train?.to}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <InfoItem label="Date" value={formatDate(journeyDate)} icon={Calendar} />
              <InfoItem label="Departure" value={`${formatTime(train?.departureTime || '')} (${train?.from})`} icon={Clock} />
              <InfoItem label="Arrival" value={`${formatTime(train?.arrivalTime || '')} (${train?.to})`} icon={Clock} />
              <InfoItem label="Duration" value={train?.duration} icon={Clock} />
            </div>

            <div className="space-y-3">
              {passengers.map((passenger: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <span className="text-primary-700 dark:text-primary-300 font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white">{passenger.name}</p>
                      <p className="text-sm text-navy-500 dark:text-navy-400">Age: {passenger.age} • {passenger.gender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="font-mono text-sm text-navy-600 dark:text-navy-400">Coach: {passenger.coachNumber || '—'}</p>
                      <p className="font-mono text-sm text-navy-600 dark:text-navy-400">Seat: {passenger.seatNumber || '—'}</p>
                    </div>
                    <Badge variant="success">{passenger.bookingStatus}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Fare Summary</h3>
            <div className="space-y-3">
              <FareRow label={`Ticket Fare (${passengers.length} passenger${passengers.length > 1 ? 's' : ''})`} value={formatCurrency((booking.totalAmount || 0) - Math.round((booking.totalAmount || 0) * 0.07))} />
              <FareRow label="Convenience Fee + GST" value={formatCurrency(Math.round((booking.totalAmount || 0) * 0.07))} />
              <div className="border-t border-navy-200 dark:border-navy-800 pt-3 flex items-center justify-between">
                <span className="font-semibold text-navy-900 dark:text-white">Total Paid</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(booking.totalAmount || 0)}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Your E-Ticket</h3>
            <div className="card p-6 border-2 border-dashed border-navy-300 dark:border-navy-700">
              <div className="text-center py-8">
                <Ticket className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
                <p className="text-navy-600 dark:text-navy-400 mb-4">Your e-ticket has been sent to your registered email and phone number.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button onClick={() => { /* download ticket */ }}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Ticket
                  </Button>
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Ticket
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6 bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">What's Next?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ActionButton icon={MapPin} label="Track Train" onClick={() => navigate(`/tracking?train=${booking.trainNumber}`)} description="Live GPS tracking" />
              <ActionButton icon={Calendar} label="View Itinerary" onClick={() => navigate('/trips')} description="Full journey details" />
              <ActionButton icon={Shield} label="Travel Insurance" onClick={() => { /* insurance */ }} description="Add protection" />
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" onClick={() => navigate('/trips')}>
              View My Trips
            </Button>
            <Button onClick={() => navigate('/search')}>
              Book Another Ticket
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 text-center">
      <Icon className="w-5 h-5 text-primary-500 mx-auto mb-2" />
      <p className="text-xs text-navy-500 dark:text-navy-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-navy-900 dark:text-white text-sm">{value}</p>
    </div>
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

function ActionButton({ icon: Icon, label, onClick, description }: { icon: React.ComponentType<{ className?: string }>; label: string; onClick: () => void; description: string }) {
  return (
    <button
      onClick={onClick}
      className="p-4 rounded-xl border border-navy-200 dark:border-navy-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <p className="font-medium text-navy-900 dark:text-white">{label}</p>
          <p className="text-xs text-navy-500 dark:text-navy-400">{description}</p>
        </div>
      </div>
    </button>
  );
}