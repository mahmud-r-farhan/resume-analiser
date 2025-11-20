import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { parseJSONSafe } from '../../utils/api';
import ModalWrapper from './ModalWrapper';

const ForgotPasswordModal = ({ onClose, setStep, setPendingEmail, setMode }) => {
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Failed to send reset code';
        throw new Error(message);
      }

      setPendingEmail(email);
      setStep('resetOtp');
      toast.success('Reset code sent to your email');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Reset your password" currentMode="forgot" setMode={setMode}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-[#C7CBE6]">
          Enter your email address and we’ll send you a one-time code to reset your password.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Email</label>
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
            <Mail className="w-4 h-4 text-[#A7BFFF]" />
            <input
              name="email"
              type="email"
              required
              autoFocus
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="you@example.com"
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
          {loading ? 'Sending code…' : 'Send reset code'}
        </motion.button>
        <div className="text-center text-xs mt-4">
          <button type="button" onClick={() => setMode('login')} className="text-[#A7BFFF] hover:text-white underline">
            Back to Login
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
};

export default ForgotPasswordModal;