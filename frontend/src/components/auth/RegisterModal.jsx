import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import ModalWrapper from './ModalWrapper';
import { parseJSONSafe } from '../../utils/api';

const RegisterModal = ({ onClose, setStep, setPendingEmail, setMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const username = f.get('username')?.trim();
    const fullName = f.get('fullName')?.trim();
    const email = f.get('email')?.trim();
    const password = f.get('password');
    const confirm = f.get('confirmPassword');

    if (!username || !fullName || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, fullName, email, password }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Registration failed';
        throw new Error(message);
      }

      setPendingEmail(email);
      setStep('verifyEmail');
      toast.success('Account created! Check your email for the verification code');
    } catch (err) {
      toast.error(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Create your account" currentMode="register" setMode={setMode}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Username</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <User className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="username"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="unique.handle"
            />
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Full name</label>
          <input
            name="fullName"
            required
            className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-400"
            placeholder="Your name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <Mail className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password Fields */}
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#E0E0E0]">Password</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <Lock className="w-4 h-4 text-[#A7BFFF]" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#E0E0E0]">Confirm password</label>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <Lock className="w-4 h-4 text-[#A7BFFF]" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={loading}
          className="w-full mt-2 rounded-xl bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account & verify email'}
        </motion.button>
        <div className="text-center text-xs mt-4">
          <span className="text-[#E0E0E0]">Already have an account? </span>
          <button type="button" onClick={() => setMode('login')} className="text-[#A7BFFF] hover:text-white underline">
            Sign in
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default RegisterModal;