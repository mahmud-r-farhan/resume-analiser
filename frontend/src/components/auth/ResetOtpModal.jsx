import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import ModalWrapper from './ModalWrapper';
import { parseJSONSafe } from '../../utils/api';

const ResetOtpModal = ({ onClose, pendingEmail, setStep, setResetToken }) => {
  const [loading, setLoading] = useState(false);
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value.trim();
    if (!otp || otp.length !== 6) return toast.error('Enter valid 6-digit code');

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, otp }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Invalid or expired code';
        throw new Error(message);
      }

      setResetToken(parsed.data.resetToken);
      setStep('resetPassword');
      toast.success('Code verified! Set your new password.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Enter reset code">
      <form onSubmit={handleSubmit} className="space-y-6">
        <button
          type="button"
          onClick={() => setStep('form')}
          className="flex items-center gap-2 text-xs text-[#A7BFFF] hover:text-white mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <p className="text-sm text-[#C7CBE6]">
          We sent a 6-digit code to{' '}
          <span className="font-semibold text-white">{pendingEmail}</span>.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#E0E0E0]">Reset code</label>
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
              className="w-full bg-transparent text-center text-2xl tracking-[0.5em] text-white outline-none"
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
          {loading ? 'Verifying…' : 'Verify code'}
        </motion.button>
      </form>
    </ModalWrapper>
  );
};

export default ResetOtpModal;