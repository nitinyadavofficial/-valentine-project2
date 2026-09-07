import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Ticket, CheckCircle, AlertCircle, Clock, MapPin, User, Train, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { usePNRStatus } from '@/hooks/useApi';
import { cn } from '@/utils/cn';
import { formatDate, getClassName, formatCurrency } from '@/utils/helpers';

export function PNRPage() {
  const [pnr, setPnr] = useState('');
  const [checkedPnr, setCheckedPnr] = useState<string | null>(null);
  const { pnrStatus, checkPNR, isLoading, error } = usePNRStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.length === 10) {
      await checkPNR(pnr);
      setCheckedPnr(pnr);
    }
  };

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
              <Ticket className="w-10 h-10 text-white" />
            </div>
            <h1 className="page-title mb-4">PNR Status Enquiry</h1>
            <p className="page-subtitle">Enter your 10-digit PNR number to check your booking status, seat confirmation, and journey details.</p>
          </div>

          <Card className="p-6 lg:p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="pnr" className="label">PNR Number</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                  <input
                    id="pnr"
                    type="text"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit PNR"
                    maxLength={10}
                    className="input pl-12 text-center text-lg font-mono tracking-widest"
                    autoComplete="off"
                  />
                </div>
                <p className="text-sm text-navy-500 dark:text-navy-400 mt-1 text-center">Find PNR on your ticket or booking confirmation</p>
              </div>
              <Button type="submit" fullWidth size="lg" disabled={pnr.length !== 10 || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  'Check PNR Status'
                )}
              </Button>
            </form>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-navy-100 dark:bg-navy-800">
              <Ticket className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">PNR Format</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">10 digits (e.g., 4527819634)</p>
            </div>
            <div className="p-4 rounded-xl bg-navy-100 dark:bg-navy-800">
              <Clock className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">Chart Status</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Prepared 4hrs before departure</p>
            </div>
            <div className="p-4 rounded-xl bg-navy-100 dark:bg-navy-800">
              <User className="w-8 h-8 mx-auto text-primary-500 mb-2" />
              <p className="text-sm font-medium text-navy-900 dark:text-white">Passenger Status</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">CNF/RAC/WL/RLWL</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="font-medium text-red-700 dark:text-red-300">PNR Not Found</p>
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {pnrStatus && checkedPnr && (
            <AnimatePresence>
              <motion.div
                key={checkedPnr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 space-y-6"
              >
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xl font-bold text-navy-900 dark:text-white">PNR: {pnrStatus.pnr}</span>
                        <Badge variant={pnrStatus.chartStatus === 'PREPARED' ? 'success' : 'warning'}>
                          {pnrStatus.chartStatus}
                        </Badge>
                      </div>
                      <p className="text-navy-600 dark:text-navy-400">{pnrStatus.trainName} ({pnrStatus.trainNumber})</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-navy-900 dark:text-white">{formatDate(pnrStatus.journeyDate)}</p>
                      <p className="text-sm text-navy-500 dark:text-navy-400">{pnrStatus.from} → {pnrStatus.to}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <InfoBox label="From" value={pnrStatus.boardingStation} icon={MapPin} />
                    <InfoBox label="To" value={pnrStatus.destinationStation} icon={MapPin} />
                    <InfoBox label="Journey Date" value={formatDate(pnrStatus.journeyDate)} icon={Clock} />
                    <InfoBox label="Current Status" value={pnrStatus.currentStatus} icon={Train} />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Passenger Details</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-navy-500 dark:text-navy-400 border-b border-navy-200 dark:border-navy-800">
                          <th className="pb-3 font-medium">#</th>
                          <th className="pb-3 font-medium">Name</th>
                          <th className="pb-3 font-medium">Age</th>
                          <th className="pb-3 font-medium">Gender</th>
                          <th className="pb-3 font-medium">Booking Status</th>
                          <th className="pb-3 font-medium">Current Status</th>
                          <th className="pb-3 font-medium">Coach</th>
                          <th className="pb-3 font-medium">Seat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pnrStatus.passengers.map((passenger, index) => (
                          <tr key={index} className="border-b border-navy-100 dark:border-navy-800">
                            <td className="py-3 font-mono">{passenger.passengerNumber}</td>
                            <td className="py-3 font-medium text-navy-900 dark:text-white">{passenger.name}</td>
                            <td className="py-3">{passenger.age}</td>
                            <td className="py-3">{passenger.gender === 'M' ? 'Male' : passenger.gender === 'F' ? 'Female' : 'Other'}</td>
                            <td className="py-3">
                              <Badge variant={passenger.bookingStatus === 'CONFIRMED' ? 'success' : passenger.bookingStatus === 'WAITLISTED' ? 'warning' : 'danger'}>
                                {passenger.bookingStatus}
                              </Badge>
                            </td>
                            <td className="py-3">
                              <Badge variant={passenger.currentStatus === 'CNF' ? 'success' : passenger.currentStatus === 'RAC' ? 'warning' : 'danger'}>
                                {passenger.currentStatus}
                              </Badge>
                            </td>
                            <td className="py-3 font-mono">{passenger.coach}</td>
                            <td className="py-3 font-mono">{passenger.seatNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                <Card className="p-6 bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-medium text-navy-900 dark:text-white">Need to make changes?</p>
                      <p className="text-sm text-navy-600 dark:text-navy-400">You can cancel or modify your booking from the My Trips section.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="p-4 rounded-xl bg-navy-50 dark:bg-navy-800/50 text-center">
      <Icon className="w-5 h-5 text-primary-500 mx-auto mb-2" />
      <p className="text-xs text-navy-500 dark:text-navy-400 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-navy-900 dark:text-white text-sm">{value}</p>
    </div>
  );
}