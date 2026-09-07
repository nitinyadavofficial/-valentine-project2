import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, Eye, EyeOff, Train, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import { toast } from 'react-hot-toast';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = 'Password must contain uppercase, lowercase, and number';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData.name.trim(), formData.email, formData.password, formData.phone);
      toast.success('Account created successfully!');
      navigate('/trips', { replace: true });
    } catch {
      toast.error('Registration failed. Please try again.');
    }
    setIsLoading(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-navy-800 flex items-center justify-center">
              <Train className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl text-navy-900 dark:text-white">RailGo</span>
          </Link>
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-navy-600 dark:text-navy-400">Join RailGo to book trains faster and track journeys live</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="As per ID proof"
                  className={cn('input pl-10', errors.name && 'input-error')}
                  autoComplete="name"
                  disabled={isLoading || authLoading}
                />
              </div>
              {errors.name && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className={cn('input pl-10', errors.email && 'input-error')}
                  autoComplete="email"
                  disabled={isLoading || authLoading}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="label">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={cn('input pl-10', errors.phone && 'input-error')}
                  autoComplete="tel"
                  disabled={isLoading || authLoading}
                />
              </div>
              {errors.phone && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 8 characters, 1 uppercase, 1 number"
                  className={cn('input pl-10 pr-12', errors.password && 'input-error')}
                  autoComplete="new-password"
                  disabled={isLoading || authLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 dark:hover:text-navy-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={cn('input pl-10', errors.confirmPassword && 'input-error')}
                  autoComplete="new-password"
                  disabled={isLoading || authLoading}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="w-4 h-4 mt-0.5 rounded border-navy-300 text-primary-600 focus:ring-primary-500" required />
              <label htmlFor="terms" className="text-sm text-navy-600 dark:text-navy-400">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 dark:text-primary-400 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={isLoading || authLoading}>
              {isLoading || authLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {errors.form && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">{errors.form}</p>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-navy-600 dark:text-navy-400">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 text-center text-sm text-navy-500 dark:text-navy-400"
        >
          <p>By creating an account, you agree to receive booking updates via email and SMS.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}