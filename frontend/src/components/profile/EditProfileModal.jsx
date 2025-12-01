import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { parseJSONSafe } from '../../utils/api';

export default function EditProfileModal({ profile, onClose, onSave }) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const token = localStorage.getItem('authToken') ||
        JSON.parse(localStorage.getItem('cv-auth-storage') || '{}')?.state?.token;

      const res = await fetch(`${apiBase}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, username }),
      });

      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        onSave(parsed.data.user);
        toast.success('Profile updated');
      } else {
        throw new Error(parsed.data?.error || 'Update failed');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-[#120A2A]/95 p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-white outline-none focus:border-[#4DCFFF] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#E0E0E0] mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-white/15 bg-white/5 text-white outline-none focus:border-[#4DCFFF] transition-colors"
                required
              />
            </div>

            <div className="flex gap-3 pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
