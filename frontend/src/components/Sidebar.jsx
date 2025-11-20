import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { X, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';
import { parseJSONSafe } from '../utils/api';

function Sidebar({ onClose, openAuthModal }) {
  const { user, token, setUser, logout } = useAuthStore();
  const [quota, setQuota] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(false);

  const fetchQuota = async () => {
    if (!token) {
      setQuota(null);
      return;
    }

    setLoadingQuota(true);

    try {
      const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/auth/quota`;
      const res = await fetch(apiEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const parsed = await parseJSONSafe(res);

      if (parsed.ok) {
        const newQuota = parsed.data.quota;
        setQuota(newQuota);

        const needsUpdate =
          user?.resumeQuota?.count !== newQuota.count ||
          user?.isPremium !== newQuota.isPremium;

        if (needsUpdate) {
          setUser({
            ...user,
            resumeQuota: {
              count: newQuota.count,
              windowStart: newQuota.resetAt
                ? new Date(newQuota.resetAt)
                : new Date(),
            },
            isPremium: newQuota.isPremium,
          });
        }
      } else if (parsed.status === 401) {
        logout();
        toast.error('Session expired. Please login again.');
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    } finally {
      setLoadingQuota(false);
    }
  };

  useEffect(() => {
    if (token) fetchQuota();
  }, [token]);

  const handleLogout = () => {
    logout();
    setQuota(null);
    toast.success('Logged out successfully');
    onClose?.();
  };

  const handleLoginClick = () => {
    openAuthModal?.('login');
    onClose?.();
  };

  const formatResetDate = (date) => {
    if (!date) return 'N/A';
    const reset = new Date(date);
    const now = new Date();
    const days = Math.ceil((reset - now) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `${days} days`;
  };

  return (
      <Motion.aside
        initial={{ y: -40, scaleY: 0, opacity: 0, transformOrigin: "top" }}
        animate={{ y: 0, scaleY: 1, opacity: 1 }}
        exit={{ y: -40, scaleY: 0, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 18,
          mass: 0.6,
        }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-[#1A0F3D]/5 backdrop-blur-md p-6 overflow-y-auto z-50 shadow-sm border-r border-[#4B2B7D]/10 flex flex-col origin-top"
      >
      {/* Close button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="text-[#E0E0E0] hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* ACCOUNT DETAILS (TOP) */}
      <div className="mt-0">
        {user ? (
          <div className="space-y-3 justify-center align-middle shadow-2xl rounded-xl p-4 bg-[#120A2A]/70 border border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-[#E0E0E0] font-semibold text-lg">Account Details</h3>

              <Motion.button
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                onClick={fetchQuota}
                disabled={loadingQuota}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                title="Refresh quota"
              >
                <RefreshCw className={`w-4 h-4 text-[#4DCFFF] ${loadingQuota ? 'animate-spin' : ''}`} />
              </Motion.button>
            </div>

            <Motion.p className="w-full text-green-400 font-semibold text-sm flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              You're connected
            </Motion.p>

            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="text-white font-medium">{user.username}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white font-medium">{user.fullName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-white font-medium truncate ml-2" title={user.email}>
                  {user.email.length > 15 ? `${user.email.slice(0, 15)}...` : user.email}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Account:</span>
                <span className={`font-semibold ${quota?.isPremium ? 'text-yellow-400' : 'text-white'}`}>
                  {quota?.isPremium ? '⭐ Premium' : 'Free'}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400">Resume Quota:</span>
                  <span className="text-white font-bold">
                    {loadingQuota
                      ? '...'
                      : quota
                      ? `${quota.count}/${quota.max === Infinity ? '∞' : quota.max}`
                      : user.resumeQuota
                      ? `${user.resumeQuota.count}/3`
                      : '0/3'}
                  </span>
                </div>

                {quota && quota.remaining !== undefined && (
                  <div className="text-xs text-gray-500">
                    {quota.remaining > 0 ? (
                      <span>{quota.remaining} remaining</span>
                    ) : (
                      <span className="text-orange-400">Limit reached</span>
                    )}
                    {quota.resetAt && (
                      <span className="block mt-1">Resets {formatResetDate(quota.resetAt)}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>Joined:</span>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full border border-white/20 text-[#E0E0E0] font-semibold py-3 rounded-xl hover:bg-white/5 transition mt-4"
            >
              Logout
            </Motion.button>
          </div>
        ) : (
          <Motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Login & continue
            <ArrowRight className="w-5 h-5" />
          </Motion.button>
        )}
      </div>
    </Motion.aside>
  );
}

export default Sidebar;