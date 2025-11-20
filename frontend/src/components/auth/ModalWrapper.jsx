import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const tabs = [
  { id: 'login', label: 'Login' },
  { id: 'register', label: 'Create account' },
  { id: 'forgot', label: 'Forgot password' },
];

const ModalWrapper = ({ children, onClose, title, currentMode, setMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 12 }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#120A2A]/95 p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#A7BFFF]">
              Premium account
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>
            <p className="mt-1 text-sm text-[#C7CBE6]">
              Save your resume progress, unlock weekly limits, and keep your job applications organized.
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-3 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`text-sm font-medium transition ${currentMode === tab.id
                ? "text-white border-b-2 border-[#4DCFFF]"
                : "text-white/50 hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Children (the form) */}
        {children}

      </motion.div>
    </motion.div>
  );
};

export default ModalWrapper;