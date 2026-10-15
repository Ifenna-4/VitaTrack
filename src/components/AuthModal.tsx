import React, { useState } from 'react';
import { Activity, X, Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signup' | 'signin';
  onClose: () => void;
  onSuccess: (data: { name: string; email: string }) => void;
  onExploreDemo: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signup',
  onClose,
  onSuccess,
  onExploreDemo,
}) => {
  const [mode, setMode] = useState<'signup' | 'signin'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      onSuccess({ name: name.trim(), email: email.trim() });
    } else {
      // Sign-in
      if (!email.trim()) {
        setError('Please enter your email');
        return;
      }
      onSuccess({
        name: name.trim() || (email.split('@')[0] ? email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1) : 'Member'),
        email: email.trim(),
      });
    }
  };

  const handleUseDemo = () => {
    onExploreDemo();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-2xs">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-lg">VitaTrack</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {mode === 'signup' ? 'Create your health account' : 'Welcome back to VitaTrack'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'signup'
            ? 'Start your personalized chronic condition monitoring journey.'
            : 'Access your continuous reading history and AI insights.'}
        </p>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-slate-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99]"
          >
            <span>{mode === 'signup' ? 'Continue to Onboarding' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5 text-center">
          <p className="text-xs text-slate-500">
            {mode === 'signup' ? 'Already have an account?' : "Don't have an account yet?"}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setError('');
              }}
              className="font-semibold text-teal-700 hover:underline"
            >
              {mode === 'signup' ? 'Sign In' : 'Create an Account'}
            </button>
          </p>

          <button
            type="button"
            onClick={handleUseDemo}
            className="text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300"
          >
            Or jump into Demo Profile (Eleanor Vance)
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted data session • Educational privacy protected</span>
        </div>
      </div>
    </div>
  );
};
