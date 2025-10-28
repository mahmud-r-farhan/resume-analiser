import { AnimatePresence, motion } from "framer-motion";
import { Info, CheckCircle2 } from "lucide-react";

export default function WelcomeModal() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl shadow-2xl max-w-xl w-full border border-slate-700 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-[#4e54c8] via-[#8f94fb] to-[#d16ba5] p-6">
            <div className="flex items-center gap-3">
              <Info className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome to CV Optimizer
              </h2>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-gray-200 leading-relaxed text-base">
                This application uses{" "}
                <span className="font-semibold text-blue-400">
                  OpenRouter's free LLM models API
                </span>{" "}
                to analyze and optimize your CV for specific job positions.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 text-gray-300">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Key Features:
              </h3>
              <ul className="space-y-2 ml-6 text-base leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>AI-powered CV analysis tailored to job descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Multiple free AI models to choose from</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Download results in Markdown or DOCX format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Auto-save job descriptions (resume data stays in-memory)</span>
                </li>
              </ul>
            </div>

            {/* Privacy Note */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm">
              <p className="text-amber-200 leading-relaxed">
                <strong className="font-semibold">Note:</strong> Your CV file is processed in-memory only and not stored permanently for privacy reasons.
              </p>
            </div>
          </div>

          {/* Footer Button */}
          <div className="p-6 pt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              aria-label="Continue to Application"
              className="w-full bg-gradient-to-br from-[#4e54c8] via-[#8f94fb] to-[#d16ba5] text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Application
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}