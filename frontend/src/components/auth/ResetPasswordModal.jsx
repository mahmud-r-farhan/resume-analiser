import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import useAuthStore from '../../store/authStore';
import ModalWrapper from './ModalWrapper';
import { parseJSONSafe } from '../../utils/api';

const ResetPasswordModal = ({ onClose, pendingEmail, resetToken }) => {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const apiBase = import.meta.env.VITE_API_ENDPOINT;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirm = e.target.confirmPassword.value;

    if (password !== confirm) return toast.error("Passwords don't match");
    if (password.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/auth/forgot-password/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetToken, password }),
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        const message = parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Failed to reset password';
        throw new Error(message);
      }

      setAuth({ token: parsed.data.token, user: parsed.data.user });
      toast.success('Password updated successfully! You’re logged in.');
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalWrapper onClose={onClose} title="Set new password">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-[#C7CBE6]">
          Create a strong new password for{' '}
          <span className="font-semibold text-white">{pendingEmail}</span>.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#E0E0E0]">New password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#E0E0E0]">Confirm password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-400"
              placeholder="Repeat password"
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
          {loading ? 'Updating password…' : 'Update password & login'}
        </motion.button>
      </form>
    </ModalWrapper>
  );
};

export default ResetPasswordModal;