import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import ModalWrapper from './ModalWrapper';
import { parseJSONSafe } from '../../utils/api';

const LoginModal = ({ onClose, setMode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email')?.trim();
    const password = formData.get('password');

    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Login failed';
        throw new Error(message);
      }

      setAuth({ token: parsed.data.token, user: parsed.data.user });
      toast.success('Logged in successfully');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper
      onClose={onClose}
      title="Sign in to generate resumes"
      currentMode="login"
      setMode={setMode}
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <Mail className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="email"
              type="email"
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="you@example.com"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Password</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <Lock className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="••••••••"
            />
            {showPassword ? (
              <EyeOff
                className="w-4 h-4 text-[#A7BFFF] cursor-pointer"
                onClick={() => setShowPassword(false)}
              />
            ) : (
              <Eye
                className="w-4 h-4 text-[#A7BFFF] cursor-pointer"
                onClick={() => setShowPassword(true)}
              />
            )}
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Login & continue'}
        </motion.button>

      </form>
      <div className="text-center text-xs mt-4">

        <button type="button" onClick={() => setMode('forgot')} className="text-[#A7BFFF] hover:text-white underline">
          Forgotten password?
        </button>
      </div>
    </ModalWrapper>
  );
};

export default LoginModal;