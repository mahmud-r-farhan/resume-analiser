import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import ModalWrapper from './ModalWrapper';
import { parseJSONSafe } from '../../utils/api';

const VerifyEmailModal = ({ onClose, pendingEmail, setPendingEmail }) => {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value.trim();
    if (!otp || otp.length !== 6) return toast.error('Enter a valid 6-digit code');

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Verification failed';
        throw new Error(message);
      }

      setAuth({ token: parsed.data.token, user: parsed.data.user });
      toast.success('Email verified! Welcome aboard 🎉');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Verify your email">
      <form onSubmit={handleSubmit} className="space-y-6">
        <button
          type="button"
          onClick={() => setPendingEmail('')}
          className="flex items-center gap-2 text-xs text-[#A7BFFF] hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to details
        </button>

        <p className="text-sm text-[#C7CBE6]">
          We’ve sent a 6-digit verification code to{' '}
          <span className="font-semibold text-white">{pendingEmail}</span>.
          <br />
          Enter it below to complete signup.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Verification code</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <KeyRound className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              autoFocus
              className="w-full bg-transparent text-center text-2xl tracking-[0.5em] text-white outline-none placeholder:text-slate-600"
              placeholder="••••••"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full rounded-xl bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        >
          {loading ? 'Verifying…' : 'Verify & continue'}
        </motion.button>
      </form>
    </ModalWrapper>
  );
};

export default VerifyEmailModal;