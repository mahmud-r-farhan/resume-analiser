import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

const PurchaseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1A0F3D]/85 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <AlertCircle className="w-6 h-6 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Purchase Feature Unavailable</h3>
                </div>
                {/*
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                  */}
              </div>
            
              <div className="space-y-4">
                <p className="text-[#C7CBE6] leading-relaxed">
                  Currently working on implementing the premium purchase feature. 
                  This will be available soon with secure payment processing.
                </p>
                <p className="text-sm text-[#A7BFFF]">
                  In the meantime, you can continue using the free tier with 3 optimized resumes per week. <a href="mailto:dev@devplus.fun" title='dev@devplus.fun' className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted underline-offset-2">Contact me</a> for any questions.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition shadow-lg shadow-blue-500/35 hover:shadow-blue-500/45"
                >
                  Understood
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PurchaseModal;

