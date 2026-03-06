import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Stethoscope,
  CheckCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'admin' | 'patient'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        toast.success('Welcome back!');
      } else {
        await register({ name, email, password });
        toast.success('Account created!');
      }
      navigate(role === 'admin' ? '/admin' : '/patient');
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.error : null;
      toast.error(message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (r: 'admin' | 'patient') => {
    setRole(r);
    setIsLogin(true);
    if (r === 'admin') {
      setEmail('admin@medexplainer.ai');
      setPassword('admin123');
    } else {
      setEmail('patient@medexplainer.ai');
      setPassword('patient123');
    }
  };

  const inputClass =
    'w-full pl-12 pr-4 py-3 rounded-lg bg-surface-50 border border-surface-300 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm';

  return (
    <div className="min-h-screen flex">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex w-[48%] bg-gradient-to-br from-surface-900 via-surface-800 to-primary-900 p-10 flex-col justify-between relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-80px] left-[-40px] w-[280px] h-[280px] bg-accent-500/10 rounded-full blur-3xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">MedExplainer AI</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-extrabold text-white leading-tight mb-5"
          >
            Medical reports,
            <br />
            <span className="text-primary-300">explained simply.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-surface-300 leading-relaxed mb-10"
          >
            Transform complex clinical reports into personalised video explanations
            tailored to your patients&apos; language and literacy level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {[
              'HIPAA-compliant secure processing',
              'Multi-lingual AI video generation',
              'Real-time pipeline monitoring',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-surface-300">
                <CheckCircle className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span className="text-sm">{f}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-surface-500 text-xs">
          <span>Powered by AWS</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-surface-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-surface-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">MedExplainer AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-surface-900 mb-1">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-sm text-surface-500">
              {isLogin
                ? 'Enter your credentials to access the portal.'
                : 'Fill in the details below to get started.'}
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex gap-2 mb-6">
            {(
              [
                { key: 'admin' as const, icon: Stethoscope, label: 'Doctor' },
                { key: 'patient' as const, icon: User, label: 'Patient' },
              ] as const
            ).map((r) => (
              <button
                key={r.key}
                onClick={() => fillDemo(r.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                  role === r.key
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-surface-200 text-surface-500 hover:border-surface-300 hover:bg-surface-50'
                }`}
              >
                <r.icon className="w-4 h-4" />
                {r.label}
              </button>
            ))}
          </div>

          {/* Tabs (Sign In / Sign Up) */}
          <div className="flex gap-1 mb-6 bg-surface-100 p-1 rounded-lg">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                isLogin
                  ? 'bg-white text-surface-900 shadow-sm'
                  : 'text-surface-500 hover:text-surface-700'
              }`}
            >
              Sign In
            </button>
            {role === 'patient' && (
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  !isLogin
                    ? 'bg-white text-surface-900 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                Sign Up
              </button>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-3.5 rounded-lg bg-primary-50 border border-primary-100 flex items-start gap-3">
            <Shield className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-primary-700 leading-relaxed">
              <strong>Demo Mode:</strong> Click <strong>Doctor</strong> or{' '}
              <strong>Patient</strong> above to auto-fill demo credentials, then sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
