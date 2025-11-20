import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Crown, ArrowRight } from 'lucide-react';

const QuotaExceededModal = ({ isOpen, onClose, onUpgrade, resetAt }) => {
  if (!isOpen) return null;

  const formatResetDate = (date) => {
    if (!date) return 'soon';
    const reset = new Date(date);
    const now = new Date();
    const days = Math.ceil((reset - now) / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'today';
    if (days === 1) return 'tomorrow';
    return `in ${days} days`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A0F3D]/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 max-w-lg w-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-orange-500/20">
                    <AlertTriangle className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Weekly Limit Reached</h3>
                    <p className="text-sm text-[#C7CBE6] mt-1">
                      Quota resets {formatResetDate(resetAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-[#C7CBE6] leading-relaxed">
                  You've reached your weekly limit of 3 optimized resumes. Upgrade to Premium for unlimited resume creation and access to premium AI models.
                </p>
                <div className="rounded-xl bg-gradient-to-r from-[#4DCFFF]/10 to-[#9C4DFF]/10 border border-[#4DCFFF]/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-white">Premium Benefits:</span>
                  </div>
                  <ul className="space-y-1 text-sm text-[#C7CBE6] ml-7">
                    <li>• Unlimited optimized resumes</li>
                    <li>• Premium LLM models (GPT-4, Claude, Grok, etc.)</li>
                    <li>• Priority processing</li>
                    <li>• All premium templates</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold transition hover:bg-white/10"
                >
                  Maybe Later
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onUpgrade}
                  className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold transition flex items-center justify-center gap-2"
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuotaExceededModal;

