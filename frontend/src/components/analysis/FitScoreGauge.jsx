import { motion } from 'framer-motion';

const getScoreColor = (score) => {
  if (score >= 80) return ['#4DCFFF', '#7EFFA1'];
  if (score >= 60) return ['#FFCF6B', '#FF9F6B'];
  return ['#FF6B9C', '#FF4D6B'];
};

const circleCircumference = 2 * Math.PI * 54;

const FitScoreGauge = ({ score, model }) => {
  const clamped = typeof score === 'number' ? Math.max(0, Math.min(100, score)) : null;
  const [startColor, endColor] = clamped !== null ? getScoreColor(clamped) : ['#4DCFFF', '#9C4DFF'];
  const offset =
    clamped !== null ? circleCircumference - (circleCircumference * clamped) / 100 : circleCircumference;

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-6 text-white shadow-lg shadow-black/25">
      <div className="relative flex h-40 w-40 items-center justify-center">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            className="text-white/20"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
          />
          <motion.circle
            stroke={`url(#scoreGradient)`}
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            r="54"
            cx="60"
            cy="60"
            strokeDasharray={circleCircumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circleCircumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <span className="text-sm uppercase tracking-[0.25em] text-white/60">Fit Score</span>
          <span className="text-4xl font-bold">
            {clamped !== null ? `${clamped}` : '--'}
            <span className="text-lg font-medium text-white/60">/100</span>
          </span>
        </div>
      </div>
      {model && (
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/50">
          Model • {model}
        </p>
      )}
      <p className="mt-3 text-center text-sm text-[#C7CBE6]">
        {clamped !== null
          ? 'Your resume alignment with the role based on keyword fit, seniority, and accomplishments.'
          : 'Perform an analysis to see how your resume aligns with the target role.'}
      </p>
    </div>
  );
};

export default FitScoreGauge;

