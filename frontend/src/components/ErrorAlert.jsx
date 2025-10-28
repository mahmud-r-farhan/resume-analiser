import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

function ErrorAlert({ error, uploadLimitReached }) {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start backdrop-blur-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-red-300">{error}</p>
        </motion.div>
      )}
      {uploadLimitReached && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start backdrop-blur-sm"
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
          <p className="text-yellow-300">Upload limit reached: maximum 4 CVs per 24 hours.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorAlert;