import { motion } from 'framer-motion';
import { User, Mail, Calendar, Edit2, Crown } from 'lucide-react';

export default function ProfileHeader({ profile, onEditClick }) {
  if (!profile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#1A0F3D]/70 to-[#120A2A]/70 backdrop-blur-xl p-8 mb-8 shadow-2xl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4DCFFF] to-[#9C4DFF] flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                {profile.fullName}
                <sup>
                  {profile.isPremium ? (
                    <Crown className="w-5 h-5 text-yellow-300" />
                  ) : (
                    'Free'
                  )}
                </sup>
              </h1>
              <p className="text-[#A7BFFF] text-sm">@{profile.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#4DCFFF]" />
              <div>
                <p className="text-xs text-[#C7CBE6] uppercase tracking-wide">Email</p>
                <p className="text-sm text-white font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#9C4DFF]" />
              <div>
                <p className="text-xs text-[#C7CBE6] uppercase tracking-wide">Joined</p>
                <p className="text-sm text-white font-medium">
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400" />
              <div>
                <p className="text-xs text-[#C7CBE6] uppercase tracking-wide">Account</p>
                <p className={`text-sm font-medium ${profile.isPremium ? 'text-yellow-300' : 'text-[#A7BFFF]'
                  }`}>
                  {profile.isPremium ? '⭐ Premium' : 'Free'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-col col-1">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEditClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold hover:shadow-lg hover:shadow-[#9C4DFF]/30 transition-all"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </motion.button>
          <p className="text-xs text-[#C7CBE6] uppercase tracking-wide pt-2 items-center text-center">Profile BETA</p>
        </div>
      </div>

    </motion.div>
  );
}
