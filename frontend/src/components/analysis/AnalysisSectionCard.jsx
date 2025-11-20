import { motion } from 'framer-motion';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

const accentStyles = {
  default: 'from-[#2A1E55]/70 to-[#1C1A3A]/70 border-white/10',
  strengths: 'from-[#113B4C]/70 to-[#0C1F2F]/80 border-[#4DCFFF]/30',
  gaps: 'from-[#4C1127]/70 to-[#2F0C1F]/80 border-[#FF6B9C]/30',
  keywords: 'from-[#1C2F4C]/80 to-[#121B2F]/90 border-[#4DCFFF]/20',
  ats: 'from-[#26314C]/70 to-[#181F33]/80 border-[#A28DFF]/30',
  summary: 'from-[#2D2455]/80 to-[#1F173D]/80 border-[#9C4DFF]/25',
};

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.35 },
  }),
};

const AnalysisSectionCard = ({ title, content, accent = 'default', index = 0 }) => {
  if (!content) return null;

  const accentClass = accentStyles[accent] || accentStyles.default;

  return (
    <motion.article
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${accentClass} p-6 sm:p-7 shadow-lg shadow-black/20`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-1.5 rounded-full bg-gradient-to-b from-[#4DCFFF] to-[#9C4DFF]" />
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      </div>
      <MarkdownRenderer content={content} className="text-sm sm:text-base" />
    </motion.article>
  );
};

export default AnalysisSectionCard;

