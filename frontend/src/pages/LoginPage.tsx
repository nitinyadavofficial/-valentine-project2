import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Train, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/utils/cn';
import { toast } from 'react-hot-toast';

export function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/trips';
  const { login, isLoading: authLoading } = useAuth();
  const { addNotification } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await login(email, password);
      addNotification({ type: 'success', title: 'Welcome back!', message: 'You have been successfully logged in.' });
      toast.success('Welcome back!');
      navigate(redirect, { replace: true });
    } catch {
      toast.error('Login failed. Please try again.');
    }
    setIsLoading(false);
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
          <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-navy-600 dark:text-navy-400">Sign in to your account to continue</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })); }}
                  placeholder="you@example.com"
                  className={cn('input pl-10', errors.email && 'input-error')}
                  autoComplete="email"
                  disabled={isLoading || authLoading}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: '' })); }}
                  placeholder="Enter your password"
                  className={cn('input pl-10 pr-12', errors.password && 'input-error')}
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-navy-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-sm text-navy-600 dark:text-navy-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" fullWidth size="lg" disabled={isLoading || authLoading}>
              {isLoading || authLoading ? 'Signing in...' : 'Sign In'}
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
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign up</Link>
            </p>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-200 dark:border-navy-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-navy-900 text-navy-500 dark:text-navy-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" fullWidth onClick={() => { /* Google login */ }}>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </Button>
            <Button variant="outline" fullWidth onClick={() => { /* Apple login */ }}>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.57c-.98.96-2.48 1.48-4.03 1.48-2.84 0-5.13-1.47-5.13-4.57 0-2.35 1.68-4.03 3.74-4.51.17-.04.4-.08.58-.13.24-.07.36-.19.54-.34.18-.15.38-.32.52-.52.24-.34.21-.58-.08-.73-.31-.15-1.33-1.17-2.18-2.25C9.7 5.72 8.68 4.58 7.18 3.65c-.46-.28-1.12-.39-1.56-.21-.48.18-.81.43-1.08.67-.27.25-.47.57-.61.93-.1.26-.17.55-.17.84 0 1.1.32 2.03.97 2.73.43.48.96.8 1.58.8 1.02 0 1.78-.56 2.04-1.31.04-.12.06-.26.06-.4 0-.36-.13-.52-.34-.71-.2-.18-.4-.27-.71-.31l-.57-.08c-.85-.1-1.33-.42-1.33-1.13 0-.91 1.02-1.4 2.34-1.4 1.27 0 2.33.4 3.23 1.24.3.28.46.5.58.76.06.1.13.16.23.2.14.06.25.04.35-.05.23-.17.59-.68.72-1.1.06-.2.09-.4.1-.61.04-.5-.08-1.17-.42-1.64-.31-.4-.76-.74-1.2-.95-.44-.22-.94-.22-1.52-.02-.55.18-.9.46-1.2.82-.25.27-.54.61-.74.97-.2.37-.3.8-.3 1.25 0 1.05.43 1.8 1.3 2.2.8.35 1.92.5 3.16.5 2.64 0 4.77-1.38 4.77-4.34 0-1.71-.71-3.19-1.88-4.18-.15-.12-.2-.24-.2-.44 0-.38.23-.63.57-.76.32-.1.75-.17 1.08-.2.52-.06.89.06 1.22.3.38.28.62.64.72 1.08.08.37.02.85-.21 1.15-.2.25-.5.44-.8.6-.48.23-1.07.33-1.78.33-2.03 0-3.67-1.33-3.67-3.87 0-3.05 2.54-4.87 5.88-4.87 1.54 0 2.8.47 3.73 1.17.52.39.94.8 1.23 1.18.33.42.42.9.37 1.45-.04.44-.25.9-.56 1.21-.4.38-.9.6-1.5.6-1.36 0-2.45-.71-2.45-2.13 0-1.28.98-2.1 2.48-2.1 1.55 0 2.56.82 2.56 2.08 0 .84-.36 1.42-.82 1.8-.34.28-.56.48-.82.72-.15.15-.15.33-.03.47.26.28.7.55 1.2.66.67.14 1.27-.12 1.53-.57.14-.22.25-.5.25-.79 0-.47-.18-.77-.45-1.03-.28-.24-.6-.4-1.0-.4-.64 0-1.08.23-1.23.52-.1.2-.13.47-.13.7 0 .47.14.77.37 1.02.25.24.6.38 1.02.38.37 0 .66-.1.84-.26.17-.14.28-.35.28-.57 0-.42-.24-.82-.65-1.13-.38-.27-.8-.42-1.23-.51-.43-.09-.8-.16-1.16-.16-1.2 0-2.05.57-2.05 1.83 0 .68.27 1.2.7 1.55.38.3.92.46 1.58.46 1.35 0 2.25-.73 2.25-1.94 0-.86-.4-1.47-.95-1.84-.13-.09-.2-.18-.2-.3 0-.3.21-.47.48-.6.3-.15.65-.23 1.02-.23.76 0 1.2.3 1.2 1.03 0 .52-.24.9-.54 1.13-.44.3-1.02.44-1.75.44-.8 0-1.5-.25-1.93-.7-.37-.37-.58-.85-.58-1.4 0-.76.38-1.3 1.05-1.6.4-.18.77-.27 1.18-.27.52 0 .9.15 1.15.4.25.26.38.6.38.98 0 .56-.32 1-1.02 1.12-.42.08-.85.14-1.26.17-.22.02-.41-.05-.54-.14-.28-.2-.5-.47-.65-.77-.15-.3-.18-.66-.11-.99.06-.3.2-.52.41-.69.32-.26.72-.39 1.16-.39.7 0 1.18.22 1.42.61.28.43.32 1.02.12 1.58-.17.49-.62.88-1.25 1.15-.49.21-1.06.31-1.7.31-.67 0-1.24-.16-1.68-.47-.34-.25-.62-.56-.77-.9-.15-.35-.15-.84.05-1.15.21-.32.58-.52 1.04-.52.47 0 .81.14 1.06.4.26.26.39.62.39 1.02 0 .53-.25.95-.66 1.22-.48.32-1.07.45-1.73.45-2.56 0-4.2-1.47-4.2-4.42 0-3.04 2.63-4.89 5.94-4.89 2.7 0 4.7 1.58 4.7 4.42 0 1.4-.5 2.6-1.24 3.38-.44.48-.8 1.02-.8 1.66 0 .37.07.69.18.98.2.48.43.81.8 1.13.13.11.24.17.35.23.14.07.27.05.38-.04.25-.2.55-.7.7-1.08.14-.37.21-.77.21-1.2 0-.73-.26-1.3-.7-1.68-.5-.48-1.17-.74-2.03-.74-.73 0-1.35.2-1.82.56-.44.32-.76.72-.93 1.19-.1.25-.06.5.08.73.24.39.64.71 1.14.93.4.17.84.28 1.3.28.9 0 1.6-.6 1.6-1.68 0-.75-.48-1.3-1.12-1.53-.35-.13-.63-.15-.87-.06-.42.15-.78.5-.97.85-.2.38-.27.8-.27 1.25 0 1.3.68 2.15 1.7 2.15.56 0 1.03-.18 1.38-.48.24-.2.4-.42.5-.68.1-.27.08-.57-.03-.83-.2-.47-.56-.87-1.03-1.1-.28-.13-.5-.15-.68-.07-.24.11-.4.3-.48.49-.08.19-.1.42-.06.64.03.2.1.38.19.53.15.26.4.46.7.57.35.13.7.18 1.07.18.82 0 1.47-.46 1.47-1.37 0-.52-.2-1-.5-1.28-.4-.34-.9-.5-1.4-.5-.4 0-.74.12-1 .34-.25.23-.4.54-.42.88-.02.3.06.57.18.81.24.46.66.8 1.16.8.57 0 1.03-.32 1.03-.92 0-.48-.28-.82-.65-1.07-.4-.27-.8-.38-1.2-.43-.52-.05-1.03.03-1.43.34-.37.28-.62.66-.73 1.1-.04.15-.04.3.03.46.08.15.16.25.27.3.2.08.46.1 1.07-.1.24-.07.42-.22.52-.37.09-.15.17-.32.22-.5.06-.17.06-.33.01-.5-.06-.18-.1-.35-.18-.48-.1-.18-.23-.33-.36-.45-.2-.19-.44-.35-.68-.48-.5-.26-.97-.4-1.37-.4-.63 0-1.13.22-1.47.58-.33.35-.5.78-.5 1.26 0 .8.34 1.37.9 1.68.54.3 1.2.45 1.98.45 1.18 0 2.08-.6 2.08-1.8 0-.7-.27-1.23-.74-1.6-.25-.2-.5-.32-.77-.37-.4-.08-.83.07-1.08.4-.25.34-.37.8-.37 1.28 0 1.3.7 2.25 1.88 2.25 1.22 0 2.1-.86 2.1-2.33 0-.83-.4-1.42-.88-1.74-.46-.3-.8-.55-1.2-.7-.35-.14-.6-.18-.9-.1-.6.14-1.04.47-1.23.92-.17.4-.23.83-.23 1.27 0 .84.27 1.4.72 1.73.4.28.87.4 1.43.4.6 0 1.05-.2 1.33-.53.25-.3.37-.7.37-1.12 0-.68-.26-1.17-.7-1.48-.46-.32-1.0-.47-1.62-.47-.76 0-1.32.37-1.65 1.02-.33.65-.4 1.5-.22 2.13.12.41.32.72.62.9.28.17.62.25 1.0.25.63 0 1.08-.32 1.08-1.03 0-.5-.24-.85-.65-1.1-.37-.23-.76-.34-1.15-.34-.52 0-1.0.25-1.3.66-.3.42-.45.97-.45 1.55 0 1.2.7 1.9 1.8 1.9.84 0 1.5-.5 1.5-1.35 0-.78-.5-1.3-1.25-1.3-.68 0-1.17.44-1.17 1.18 0 .64.37 1.08.95 1.18.54.08 1.04-.22 1.2-.72.08-.22.14-.44.19-.66.1-.43-.05-.8-.42-1.02z"/></svg>
              Apple
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}