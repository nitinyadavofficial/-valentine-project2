import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Train, Tag, Clock, Users, Star, Sparkles, Gift, Percent, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const OFFERS = [
  {
    id: 'offer-1',
    title: 'First Booking Discount',
    description: 'Get flat 10% off on your first train booking with RailGo. Use code WELCOME10 at checkout.',
    discount: '10% OFF',
    code: 'WELCOME10',
    validUntil: '2026-12-31',
    category: 'New User',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=200&fit=crop',
    terms: ['Valid for first booking only', 'Minimum booking amount ₹500', 'Maximum discount ₹200', 'Not applicable on Tatkal bookings'],
  },
  {
    id: 'offer-2',
    title: 'Weekend Getaway Special',
    description: 'Book Friday-Sunday journeys and get 15% cashback up to ₹500 in your RailGo wallet.',
    discount: '15% Cashback',
    code: 'WEEKEND15',
    validUntil: '2026-11-30',
    category: 'Weekend',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=200&fit=crop',
    terms: ['Valid on Fri-Sun journeys only', 'Cashback credited within 24 hours', 'Maximum cashback ₹500', 'Wallet balance usable on next booking'],
  },
  {
    id: 'offer-3',
    title: 'Senior Citizen Concession',
    description: 'Senior citizens (60+) get additional 5% discount on all classes. Automatically applied at checkout.',
    discount: '5% Extra',
    code: 'AUTO',
    validUntil: '2026-12-31',
    category: 'Senior Citizen',
    image: 'https://images.unsplash.com/photo-1506794778538-7f5c5d8f0e4d?w=400&h=200&fit=crop',
    terms: ['Age 60+ with valid ID proof', 'Applicable on all classes', 'Cannot be combined with other offers', 'One passenger per booking'],
  },
  {
    id: 'offer-4',
    title: 'Group Booking Offer',
    description: 'Book for 6 or more passengers and get 10% discount + free meal vouchers worth ₹200.',
    discount: '10% + Meals',
    code: 'GROUP10',
    validUntil: '2026-10-31',
    category: 'Group',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=200&fit=crop',
    terms: ['Minimum 6 passengers in same PNR', 'All passengers must travel together', 'Meal vouchers valid for 30 days', 'Not applicable on Rajdhani/Shatabdi'],
  },
  {
    id: 'offer-5',
    title: 'Frequent Traveler Rewards',
    description: 'Complete 10 journeys in a year and unlock Gold status with priority support, lounge access, and 20% off.',
    discount: 'Gold Status',
    code: 'AUTO',
    validUntil: '2026-12-31',
    category: 'Loyalty',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    terms: ['10 confirmed journeys in 12 months', 'Gold status valid for 1 year', 'Lounge access at major stations', 'Priority customer support'],
  },
  {
    id: 'offer-6',
    title: 'Student Discount',
    description: 'Students with valid ID get 10% off on Sleeper and AC Chair Car classes. Verify once, enjoy all year.',
    discount: '10% OFF',
    code: 'STUDENT10',
    validUntil: '2026-12-31',
    category: 'Student',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop',
    terms: ['Valid student ID required', 'Applicable on SL and CC classes', 'Verification required once per year', 'Not combinable with other offers'],
  },
];

const CATEGORIES = ['All', 'New User', 'Weekend', 'Senior Citizen', 'Group', 'Loyalty', 'Student'];

export function OffersPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredOffers = activeCategory === 'All' ? OFFERS : OFFERS.filter((o) => o.category === activeCategory);

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
              <h1 className="page-title">Offers & Discounts</h1>
              <p className="page-subtitle">Save more on your train journeys with exclusive offers and promotional deals.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" className="gap-1">
                <Sparkles className="w-3 h-3" />
                6 Active Offers
              </Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-all',
                  activeCategory === cat
                    ? 'bg-primary-500 text-white'
                    : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOffers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OfferCard offer={offer} />
                </motion.div>
              ))}
</div>
          </motion.div>
        </AnimatePresence>

          {filteredOffers.length === 0 && (
            <Card className="p-12 text-center">
              <Tag className="w-16 h-16 mx-auto text-navy-300 dark:text-navy-600 mb-4" />
              <h3 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">No offers in this category</h3>
              <p className="text-navy-600 dark:text-navy-400">Check back later for new deals!</p>
            </Card>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">How to Use Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HowToStep number={1} title="Select Offer" description="Browse available offers and copy the promo code or click 'Apply' to auto-apply." icon={Tag} />
              <HowToStep number={2} title="Book Tickets" description="Search trains, select your journey, and proceed to payment page." icon={Train} />
              <HowToStep number={3} title="Enjoy Discount" description="Enter promo code at checkout or watch it auto-apply. Discount reflects instantly." icon={CheckCircle} />
            </div>
          </motion.div>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: typeof OFFERS[0] }) {
  return (
    <Card className="p-0 overflow-hidden h-full hover:shadow-card-hover transition-all">
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${offer.image})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Badge variant="primary">{offer.category}</Badge>
          <Badge variant="success">{offer.discount}</Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-bold text-lg">{offer.code !== 'AUTO' ? `Code: ${offer.code}` : 'Auto-applied'}</p>
          <p className="text-white/70 text-sm">Valid until {new Date(offer.validUntil).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-navy-900 dark:text-white text-lg">{offer.title}</h3>
        <p className="text-navy-600 dark:text-navy-400 text-sm">{offer.description}</p>
        <div className="pt-2 border-t border-navy-200 dark:border-navy-800">
          <p className="text-xs text-navy-500 dark:text-navy-400 mb-2">Key Terms:</p>
          <ul className="space-y-1 text-xs text-navy-500 dark:text-navy-400">
            {offer.terms.slice(0, 3).map((term, i) => (
              <li key={i} className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                {term}
              </li>
            ))}
            {offer.terms.length > 3 && (
              <li className="flex items-center gap-1">
                <span className="w-3 h-3 flex-shrink-0" />+{offer.terms.length - 3} more terms
              </li>
            )}
          </ul>
        </div>
        <Button className="w-full" variant={offer.code === 'AUTO' ? 'secondary' : 'primary'}>
          {offer.code === 'AUTO' ? 'Auto Applied' : 'Copy Code & Book'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}

function HowToStep({ number, title, description, icon: Icon }: { number: number; title: string; description: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card className="p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">{number}</span>
      </div>
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
      </div>
      <h3 className="font-semibold text-navy-900 dark:text-white mb-2">{title}</h3>
      <p className="text-navy-600 dark:text-navy-400 text-sm">{description}</p>
    </Card>
  );
}