import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, LogOut, BarChart3, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useAuthStore from '../store/authStore';
import { parseJSONSafe } from '../utils/api';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileTabs from '../components/profile/ProfileTabs';
import EditProfileModal from '../components/profile/EditProfileModal';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/analyze');
      return;
    }
    fetchProfileData();
  }, [token, navigate]);

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Fetch profile using centralized API
      const profileResult = await parseJSONSafe(
        await fetch(`${import.meta.env.VITE_API_ENDPOINT}/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      if (profileResult.ok) {
        setProfile(profileResult.data.user);
      }

      // Fetch stats using centralized API
      const statsResult = await parseJSONSafe(
        await fetch(`${import.meta.env.VITE_API_ENDPOINT}/profile/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      if (statsResult.ok) {
        setStats(statsResult.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-white text-xl">Redirecting...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DCFFF]/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#9C4DFF]/20 via-transparent to-transparent"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 text-[#C7CBE6] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Logout</span>
          </motion.button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-[#4DCFFF]/30 border-t-[#4DCFFF] rounded-full"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <ProfileHeader
              profile={profile}
              onEditClick={() => setShowEditModal(true)}
            />

            {/* Stats Grid */}
            {stats && <ProfileStats stats={stats} />}

            {/* Tabs: Analyses, Optimizations, Downloads */}
            <ProfileTabs token={token} onRefresh={fetchProfileData} />
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => {
            setProfile(updated);
            setShowEditModal(false);
            toast.success('Profile updated successfully');
          }}
        />
      )}
    </div>
  );
}
