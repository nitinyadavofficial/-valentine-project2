import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Train, Search, MapPin, Ticket, User, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Dropdown, UserMenu } from '@/components/ui/Dropdown';

const navItems = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/search', label: 'Search Trains', icon: <SearchIcon /> },
  { path: '/tracking', label: 'Live Tracking', icon: <TrackingIcon /> },
  { path: '/pnr', label: 'PNR Status', icon: <PNRIcon /> },
  { path: '/trips', label: 'My Trips', icon: <TripsIcon /> },
  { path: '/offers', label: 'Offers', icon: <OffersIcon /> },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleLogout = () => { logout(); setMobileMenuOpen(false); };

  return (
    <>
      <header className={cn('fixed top-0 left-0 right-0 z-40 transition-all duration-300', scrolled ? 'bg-white/90 dark:bg-navy-950/90 backdrop-blur-xl shadow-sm' : 'bg-transparent')}>
        <nav className="section-container" aria-label="Main navigation">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link to="/" className="flex items-center gap-2" aria-label="RailGo Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-navy-800 flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-navy-900 dark:text-white">RailGo</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-navy-600 hover:text-navy-900 dark:text-navy-400 dark:hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800'
                  )}
                >
                  <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-navy-600 hover:bg-navy-100 dark:text-navy-400 dark:hover:bg-navy-800 transition-colors"
                aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <UserMenu
                  user={user!}
                  onProfile={() => { /* navigate to profile */ }}
                  onSettings={() => { /* navigate to settings */ }}
                  onTrips={() => { /* navigate to trips */ }}
                  onLogout={handleLogout}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>

            <button
              className="lg:hidden p-2 rounded-xl text-navy-600 hover:bg-navy-100 dark:text-navy-400 dark:hover:bg-navy-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden bg-white dark:bg-navy-950 border-t border-navy-200 dark:border-navy-800"
            >
              <div className="section-container py-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all',
                      location.pathname === item.path
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-navy-600 hover:bg-navy-100 dark:text-navy-400 dark:hover:bg-navy-800'
                    )}
                  >
                    <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-navy-200 dark:border-navy-800 flex items-center justify-between">
                  <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-3 rounded-xl text-navy-600 dark:text-navy-400">
                    {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                </div>
                {isAuthenticated ? (
                  <div className="pt-2 space-y-2">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl text-navy-600 dark:text-navy-400 hover:bg-navy-100 dark:hover:bg-navy-800">
                      <User className="w-5 h-5" /> Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left">
                      <LogIn className="w-5 h-5" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 flex flex-col gap-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="secondary" fullWidth>Sign In</Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="primary" fullWidth>Create Account</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function SearchIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
}
function TrackingIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>;
}
function PNRIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
}
function TripsIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
}
function OffersIcon({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>;
}