import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Smartphone, Building, Wallet, CheckCircle, Loader2, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/helpers';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: Smartphone, description: 'PhonePe, Google Pay, Paytm, BHIM' },
  { id: 'credit', label: 'Credit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay, Amex' },
  { id: 'debit', label: 'Debit Card', icon: CreditCard, description: 'Visa, Mastercard, RuPay, Maestro' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, description: '50+ banks supported' },
  { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'RailGo Wallet, Amazon Pay, Mobikwik' },
];

export function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { currentBooking, user, setCurrentBooking } = useAppStore();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'details' | 'processing' | 'success'>('method');
  const [formData, setFormData] = useState({
    upiId: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    nameOnCard: '',
    bank: '',
    walletType: '',
  });

  const booking = currentBooking;
  if (!booking) {
    return (
      <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center">
        <div className="section-container text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <CreditCard className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-2">No Active Booking</h2>
            <Button onClick={() => navigate('/search')}>Search Trains</Button>
          </motion.div>
        </div>
      </div>
    );
  }

  const train = booking.train as any;
  const passengers = booking.passengers || [];
  const coachClass = booking.coachClass || '3A';
  const journeyDate = booking.journeyDate || new Date().toISOString().split('T')[0];

  const fare = train?.classes?.find((c: any) => c.code === coachClass)?.price || 0;
  const totalFare = fare * passengers.length;
  const convenienceFee = Math.round(totalFare * 0.02);
  const taxes = Math.round(totalFare * 0.05);
  const grandTotal = totalFare + convenienceFee + taxes;

  const handlePayment = async () => {
    setProcessing(true);
    setStep('processing');

    await new Promise((resolve) => setTimeout(resolve, 3000));

    setStep('success');
    const newBooking = {
      ...booking,
      id: `BK${Date.now()}`,
      pnr: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      status: 'CONFIRMED',
      bookingTime: new Date().toISOString(),
      paymentId: `PAY_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      totalAmount: grandTotal,
    };
    setCurrentBooking(newBooking);

    setTimeout(() => {
      navigate(`/confirmation/${newBooking.id}`);
    }, 2000);
  };

  const renderMethodDetails = () => {
    switch (selectedMethod) {
      case 'upi':
        return (
          <div className="space-y-4">
            <Input
              label="UPI ID"
              placeholder="yourname@upi"
              value={formData.upiId}
              onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              required
            />
            <p className="text-sm text-navy-500 dark:text-navy-400">We'll send a collect request to your UPI app. Approve to complete payment.</p>
          </div>
        );
      case 'credit':
      case 'debit':
        return (
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
              maxLength={19}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry (MM/YY)"
                placeholder="12/25"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                maxLength={5}
                required
              />
              <Input
                label="CVV"
                placeholder="123"
                type="password"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                maxLength={3}
                required
              />
            </div>
            <Input
              label="Name on Card"
              placeholder="John Doe"
              value={formData.nameOnCard}
              onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
              required
            />
          </div>
        );
      case 'netbanking':
        return (
          <div className="space-y-4">
            <Select
              label="Select Bank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              options={[
                { value: 'sbi', label: 'State Bank of India' },
                { value: 'hdfc', label: 'HDFC Bank' },
                { value: 'icici', label: 'ICICI Bank' },
                { value: 'axis', label: 'Axis Bank' },
                { value: 'kotak', label: 'Kotak Mahindra Bank' },
                { value: 'pnb', label: 'Punjab National Bank' },
                { value: 'bob', label: 'Bank of Baroda' },
                { value: 'canara', label: 'Canara Bank' },
                { value: 'other', label: 'Other Bank' },
              ]}
              placeholder="Choose your bank"
              required
            />
            <p className="text-sm text-navy-500 dark:text-navy-400">You'll be redirected to your bank's secure portal to complete payment.</p>
          </div>
        );
      case 'wallet':
        return (
          <div className="space-y-4">
            <Select
              label="Wallet Type"
              value={formData.walletType}
              onChange={(e) => setFormData({ ...formData, walletType: e.target.value })}
              options={[
                { value: 'railgo', label: 'RailGo Wallet' },
                { value: 'amazon', label: 'Amazon Pay' },
                { value: 'mobikwik', label: 'Mobikwik' },
                { value: 'freecharge', label: 'Freecharge' },
              ]}
              placeholder="Choose wallet"
              required
            />
            <p className="text-sm text-navy-500 dark:text-navy-400">Complete payment using your wallet balance.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <div className="section-container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 text-navy-600 dark:text-navy-400 mb-4">
              <span className="font-medium">Payment</span>
            </div>
            <div className="flex items-center gap-4">
              {['method', 'details', 'processing', 'success'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    step === s ? 'bg-primary-500 text-white' :
                    (s === 'method' ? true : ['details', 'processing', 'success'].indexOf(step) >= ['details', 'processing', 'success'].indexOf(s)) ? 'bg-primary-500 text-white' : 'bg-navy-200 dark:bg-navy-700 text-navy-500'
                  )}>
                    {['method', 'details', 'processing', 'success'].indexOf(step) >= ['details', 'processing', 'success'].indexOf(s) && step !== s ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < 3 && <div className={cn('w-16 h-1 mx-2', step !== 'method' && i === 0 ? 'bg-primary-500' : step === 'success' ? 'bg-primary-500' : 'bg-navy-200 dark:bg-navy-700')} />}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 'method' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-navy-900 dark:text-white">Select Payment Method</h3>
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <Lock className="w-4 h-4" />
                        <span>Secure & Encrypted</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {PAYMENT_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => { setSelectedMethod(method.id); setStep('details'); }}
                          className={cn(
                            'p-4 rounded-xl border-2 transition-all text-left',
                            selectedMethod === method.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-navy-200 dark:border-navy-700 hover:border-primary-300 dark:hover:border-primary-700'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', selectedMethod === method.id ? 'bg-primary-500' : 'bg-navy-100 dark:bg-navy-800')}>
                              <method.icon className={cn('w-5 h-5', selectedMethod === method.id ? 'text-white' : 'text-navy-600 dark:text-navy-400')} />
                            </div>
                            <div>
                              <p className="font-medium text-navy-900 dark:text-white">{method.label}</p>
                              <p className="text-xs text-navy-500 dark:text-navy-400">{method.description}</p>
                            </div>
                          </div>
                          {selectedMethod === method.id && (
                            <CheckCircle className="w-5 h-5 text-primary-500 absolute top-4 right-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-r from-primary-500/10 to-cyan-500/10 border-primary-200/50 dark:border-primary-800/50">
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-primary-500" />
                      <div>
                        <p className="font-medium text-navy-900 dark:text-white">100% Secure Payment</p>
                        <p className="text-sm text-navy-600 dark:text-navy-400">PCI DSS compliant • 256-bit encryption • No card storage</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {step === 'details' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-6">Payment Details</h3>
                    {renderMethodDetails()}
                    <div className="pt-4 border-t border-navy-200 dark:border-navy-800">
                      <Button fullWidth size="lg" onClick={handlePayment} disabled={processing}>
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Processing...
                          </>
                        ) : (
                          `Pay ${formatCurrency(grandTotal)}`
                        )}
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-4">Order Summary</h3>
                    <div className="space-y-3">
                      <FareRow label={`Ticket Fare (${passengers.length} passenger${passengers.length > 1 ? 's' : ''})`} value={formatCurrency(totalFare)} />
                      <FareRow label="Convenience Fee" value={formatCurrency(convenienceFee)} />
                      <FareRow label="GST (5%)" value={formatCurrency(taxes)} />
                      <div className="border-t border-navy-200 dark:border-navy-800 pt-3 flex items-center justify-between">
                        <span className="font-semibold text-navy-900 dark:text-white">Total Payable</span>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{formatCurrency(grandTotal)}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {step === 'processing' && (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"
                  />
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Processing Payment</h3>
                  <p className="text-navy-600 dark:text-navy-400">Please do not close this window. Redirecting to payment gateway...</p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Payment Successful!</h3>
                  <p className="text-navy-600 dark:text-navy-400">Redirecting to booking confirmation...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
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