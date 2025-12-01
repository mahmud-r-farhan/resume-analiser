import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Check, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import MarkdownRenderer from '../markdown/MarkdownRenderer';

const ResumePreview = ({
  optimizedCV,
  resumeId,
  template = 'classic',
  onTemplateChange,
  isOptimizing = false,
  needsTemplateRefresh = false,
  lastGeneratedTemplate,
  fitScore,
  model,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = async () => {
    if (!optimizedCV) return;
    try {
      await navigator.clipboard.writeText(optimizedCV);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = useCallback(async () => {
    if (!optimizedCV) {
      toast.error('No resume content to download');
      return;
    }

    setDownloading(true);
    try {
      const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/generate-pdf`;
      const token = localStorage.getItem('authToken') ||
        JSON.parse(localStorage.getItem('cv-auth-storage') || '{}')?.state?.token;

      if (!token) {
        toast.error('Authentication required to download');
        setDownloading(false);
        return;
      }

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          markdown: optimizedCV,
          template,
          fileName: `resume_${template}`,
          resumeId, // Pass to backend
          fitScore: fitScore || null,
          model: model || 'unknown'
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || `HTTP ${res.status}`);
      }

      // Get blob and download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${template}_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Resume downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error(err.message || 'Failed to download resume');
    } finally {
      setDownloading(false);
    }
  }, [optimizedCV, resumeId, template, fitScore, model]);

  const templateDescriptions = {
    classic: 'Timeless reverse-chronological layout. Perfect for traditional industries and senior roles.',
    modern: 'Bold two-column design with color accents. Ideal for tech, design, and creative positions.',
    functional: 'Skills-first structure that highlights capabilities over timeline. Great for career changers.',
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
          className="rounded-2xl border border-[#FFCF6B]/40 bg-[#4A3513]/40 px-5 py-3.5 text-sm text-[#FFE6B3] flex gap-3"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Template changed</strong> from{' '}
            <span className="font-bold uppercase text-white">
              {lastGeneratedTemplate}
            </span>
            . Regenerate to apply the new layout.
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* PDF Download */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          disabled={!optimizedCV || downloading}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#FF6B9C] via-[#FF8B9C] to-[#4DCFFF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-5 w-5" />
          {downloading ? 'Downloading...' : `Download ${template.charAt(0).toUpperCase() + template.slice(1)} PDF`}
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
              Click "Generate Premium CV" in Step 3 to create your optimized resume
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResumePreview;