import { motion, AnimatePresence } from 'framer-motion';
import { Info, CheckCircle2, Mail, Sparkles } from 'lucide-react';

function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full border border-slate-700 overflow-hidden max-h-[95vh] overflow-y-auto"
        >
          <div className="bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] text-white p-4 sm:p-6 relative overflow-hidden">
            <div className="items-center gap-2 sm:gap-3 relative z-10">
              <h1 className="text-2xl sm:text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight">
                Welcome To
              </h1>
              <p className='text-center pt-2'>Premium Resume Optimizer</p>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4"
            >
              <p className="text-gray-200 leading-relaxed text-sm sm:text-base">
               AI-powered premium resume enhancement for perfect job matches.
              </p>
            </motion.div>
                {/* Features */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3 sm:space-y-4 text-gray-300"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                Key Features:
              </h3>
              <ul className="space-y-2 ml-4 sm:ml-6 text-sm sm:text-base leading-relaxed">
                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>AI-powered resume analysis tailored to job descriptions</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>5+ Top Open-Source AI Models to Consider</span>
                </motion.li>
                <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>Download results in Markdown or PDF format</span>
                </motion.li>
                 <motion.li 
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>create up to 3 ATS-friendly, polished CV versions</span>
                </motion.li>
                
              </ul>
            </motion.div>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3 sm:space-y-4 text-gray-300">
              <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                Premium Features:
              </h3>
              <ul className="space-y-2 ml-4 sm:ml-6 text-sm sm:text-base leading-relaxed">
                <motion.li initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>Unlimited tailored AI and CV rewriting</span>
                </motion.li>
                <motion.li initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>Advanced AI models</span>
                </motion.li>
                 <motion.li initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>Premium Resume Template</span>
                </motion.li>
                 <motion.li initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1 flex-shrink-0">•</span>
                  <span>Boost your career</span>
                </motion.li>
              </ul>
            </motion.div>
    
          </div>
          <div className="px-4 sm:px-6 space-y-3">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-gradient-to-br from-[#4a50caf6] via-[#6a6fc3d3] to-[#b33c7f] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
            >
              Start Premium Optimization
            </motion.button>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm pb-2">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>Support:</span>
              <a href="mailto:dev@devplus.fun" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-dotted underline-offset-2">
                dev@devplus.fun
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default WelcomeModal;