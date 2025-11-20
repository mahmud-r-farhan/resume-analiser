import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MarkdownRenderer from '../markdown/MarkdownRenderer';
import useAuthStore from '../../store/authStore';

const AnalysisFullReport = ({ analysis }) => {
  const [expanded, setExpanded] = useState(false);

  const { user } = useAuthStore(); 
  // const isPremium = user?.isPremium; // no longer needed

  if (!analysis) return null;

  return (
    <section className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md">

      {/* BUTTON */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className={`
          flex w-full items-center justify-between gap-3 px-6 py-5 text-left text-white
          transition
          hover:bg-white/5
        `}
      >
        <span className="flex items-center gap-3 text-lg font-semibold">
          <FileText className="h-5 w-5 text-[#4DCFFF]" />
          Full Premium Report
        </span>

        {expanded ? (
          <ChevronUp className="h-5 w-5 text-[#9C4DFF]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#9C4DFF]" />
        )}
      </button>

      {/* Report Content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="report-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="px-6 pb-6"
          >
            <MarkdownRenderer content={analysis} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AnalysisFullReport;