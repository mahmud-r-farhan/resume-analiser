import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Check, Sparkles } from 'lucide-react';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

const templateDescriptions = {
  classic:
    'Timeless reverse-chronological layout. Perfect for traditional industries and senior roles.',
  modern:
    'Bold two-column design with color accents. Ideal for tech, design, and creative positions.',
  functional:
    'Skills-first structure that highlights capabilities over timeline. Great for career changers.',
};

const ResumePreview = ({
  optimizedCV,
  template = 'classic',
  onTemplateChange,
  onDownload,
  isOptimizing = false,
  needsTemplateRefresh = false,
  lastGeneratedTemplate,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!optimizedCV) return;
    try {
      await navigator.clipboard.writeText(optimizedCV);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy resume', error);
    }
  };

  return (
    <section className="space-y-6 rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h3 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Sparkles className="h-6 w-6 text-[#4DCFFF]" />
            Your Optimized Resume
          </h3>
          <p className="mt-1 text-sm text-[#C7CBE6]">
            AI-tailored, ATS-optimized, and ready to impress hiring managers.
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">
            Design Template
          </label>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/85 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-[#4DCFFF] focus:ring-2 focus:ring-[#4DCFFF]/30"
          >
            <option value="classic">Classic — Timeless & Professional</option>
            <option value="modern">Modern — Bold & Contemporary</option>
            <option value="functional">Functional — Skills-First Power</option>
          </select>
        </div>
      </header>

      {/* Template Description */}
      <motion.p
        key={template}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 text-sm text-[#D3D8FF] backdrop-blur-sm"
      >
        {templateDescriptions[template]}
      </motion.p>

      {/* Template Change Warning */}
      {needsTemplateRefresh && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-[#FFCF6B]/40 bg-[#4A3513]/40 px-5 py-3.5 text-sm text-[#FFE6B3]"
        >
          <strong className="text-white">Template changed</strong> from{' '}
          <span className="font-bold uppercase text-white">
            {lastGeneratedTemplate}
          </span>
          . Regenerate to apply the new layout with perfectly matched content.
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* PDF Download */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDownload}
          disabled={!optimizedCV}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF6B9C] via-[#FF8B9C] to-[#4DCFFF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          Download {template.charAt(0).toUpperCase() + template.slice(1)} PDF
        </motion.button>

        {/* Copy Markdown */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCopy}
          disabled={!optimizedCV}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-[#4DCFFF]" />
              Copy Markdown
            </>
          )}
        </motion.button>

        {isOptimizing && (
          <span className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-[#4DCFFF]">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#4DCFFF]" />
            Optimizing...
          </span>
        )}
      </div>

      {/* Live Preview */}
      <div className="max-h-[50vh] lg:max-h-[60vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#141726]/90 p-6 shadow-inner">
        {optimizedCV ? (
          <MarkdownRenderer content={optimizedCV} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-white/5 p-8">
              <Sparkles className="h-16 w-16 text-white/20" />
            </div>
            <p className="mt-6 text-xl font-light text-white/40">
              No resume generated yet
            </p>
            <p className="mt-2 text-sm text-[#C7CBE6]">
              Choose a template and click "Generate Premium CV" to see your masterpiece
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumePreview;