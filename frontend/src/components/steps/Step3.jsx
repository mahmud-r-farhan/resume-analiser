import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  Zap,
  RefreshCw,
  Trash2,
  FileText,
} from 'lucide-react';

import DownloadButtons from '../DownloadButtons';
import AnalysisHighlights from '../analysis/AnalysisHighlights';
import AnalysisFullReport from '../analysis/AnalysisFullReport';
import FitScoreGauge from '../analysis/FitScoreGauge';
import ResumePreview from '../analysis/ResumePreview';
import { extractFitScore, parseAnalysisSections } from '../../utils/analysisParser';
import { exportResumeMarkdownToPdf } from '../../utils/pdf';

const Step3 = ({
  loading,
  analysis,
  optimizedCV,
  optimizing,
  handleOptimize,
  template,
  setTemplate,
  cvFile,
  clearAnalysisAndContinue,
  resetForm,
  fitScore,
  model,
}) => {
  const [lastGeneratedTemplate, setLastGeneratedTemplate] = useState(null);
  const sections = useMemo(() => parseAnalysisSections(analysis), [analysis]);
  const highlightSections = useMemo(
    () =>
      sections.filter(
        (section) => !section.title.toLowerCase().includes('fit score'),
      ),
    [sections],
  );
  const derivedFitScore = useMemo(
    () => extractFitScore(analysis, fitScore),
    [analysis, fitScore],
  );

  const resumeFileName = useMemo(() => {
    if (!cvFile?.name) return 'optimized_resume';
    return cvFile.name.replace(/\.[^/.]+$/, '');
  }, [cvFile]);

  const handleDownloadOptimizedPdf = useCallback(() => {
    exportResumeMarkdownToPdf({
      markdown: optimizedCV,
      template,
      fileName: resumeFileName,
    });
  }, [optimizedCV, template, resumeFileName]);

  useEffect(() => {
    if (optimizedCV) {
      setLastGeneratedTemplate(template);
    }
    // We intentionally exclude `template` to capture the template at generation time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optimizedCV]);

  const templateNeedsRefresh =
    Boolean(optimizedCV) &&
    lastGeneratedTemplate &&
    lastGeneratedTemplate !== template;

  const showAnalysis = Boolean(analysis && !loading);

  return (
    <Motion.section
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="rounded-3xl border border-white/10 bg-[#120A2A]/70 p-6 sm:p-10 shadow-2xl shadow-black/30 backdrop-blur-lg"
    >
      <header className="mb-6">
        <h2 className="flex items-center text-2xl font-bold sm:text-3xl">
          <Sparkles className="mr-3 h-8 w-8 text-green-400" />
          Premium Optimization Analysis
        </h2>
        <p className="mt-2 text-sm text-[#C7CBE6]">
          Step 3 · Detailed insights with ATS-ready resume tailored to your target role.
        </p>
      </header>

      {loading && (
        <Motion.div
          className="flex flex-col items-center justify-center space-y-6 py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader2 className="h-16 w-16 animate-spin text-[#4DCFFF]" />
          <p className="text-xl font-semibold text-[#E0E0E0]">Premium AI analyzing…</p>
          <div className="flex gap-4 text-[#E0E0E0]/80">
            <div className="flex flex-col items-center text-sm">
              <Zap className="h-7 w-7 animate-pulse text-yellow-400" />
              <span>Extracting impact</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <Sparkles className="h-7 w-7 animate-pulse text-purple-400" />
              <span>Matching keywords</span>
            </div>
            <div className="flex flex-col items-center text-sm">
              <FileText className="h-7 w-7 animate-pulse text-blue-400" />
              <span>Drafting guidance</span>
            </div>
          </div>
          <p className="text-sm text-[#E0E0E0]/60">
            This process typically takes 30–60 seconds. Hang tight!
          </p>
        </Motion.div>
      )}

      {showAnalysis && (
        <Motion.div
          key="analysis-content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          <div className="">
            <div className="">
              <div className="">
                <FitScoreGauge score={derivedFitScore} model={model} />
                <AnalysisHighlights sections={highlightSections} />
              </div>
              <DownloadButtons analysis={analysis} cvFileName={resumeFileName} />
            </div>

            <div className="flex flex-col space-y-4 rounded-3xl border border-white/10 bg-black/10 p-6 xl:max-h-[70vh] xl:overflow-hidden">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Generate Optimized Resume</h3>
                  <p className="text-sm text-[#C7CBE6]">
                    Apply AI recommendations instantly with an ATS-safe markdown resume.
                  </p>
                </div>
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="flex items-center gap-2 rounded-xl bg-linear-to-r from-[#4DCFFF] to-[#9C4DFF] px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Zap className="h-5 w-5" />
                  {optimizing ? 'Optimizing…' : 'Generate Premium CV'}
                </Motion.button>
              </div>
              <div className="flex-1 min-h-0 mt-2">
                <ResumePreview
                  optimizedCV={optimizedCV}
                  template={template}
                  onTemplateChange={setTemplate}
                  onDownload={handleDownloadOptimizedPdf}
                  isOptimizing={optimizing}
                  needsTemplateRefresh={templateNeedsRefresh}
                  lastGeneratedTemplate={lastGeneratedTemplate}
                />
              </div>
            </div>
          </div>

          <AnalysisFullReport analysis={analysis} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearAnalysisAndContinue}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#9C4DFF] to-[#FF6B9C] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-black/30 transition"
            >
              <RefreshCw className="h-5 w-5" />
              Analyze Another Position
            </Motion.button>
            <Motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetForm}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/60 px-6 py-4 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
            >
              <Trash2 className="h-5 w-5" />
              Clear All Data
            </Motion.button>
          </div>
        </Motion.div>
      )}
    </Motion.section>
  );
};

export default Step3;
