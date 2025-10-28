import { motion } from 'framer-motion';
import { Sparkles, Loader2, Zap, FileText, RefreshCw, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DownloadButtons from '../DownloadButtons';

function Step3({ loading, analysis, cvFile, clearAnalysisAndContinue, resetForm }) {
  return (
    <motion.section
      key="step3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1A0F3D]/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-700/50"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-green-400" />
          Optimization Analysis
        </h2>
        <p className="text-gray-400">Step 3: Your comprehensive CV improvement recommendations</p>
      </div>
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 space-y-6"
        >
          <Loader2 className="w-16 h-16 text-[#4DCFFF] animate-spin" />
          <p className="text-xl text-[#E0E0E0] font-semibold">AI is analyzing your resume...</p>
          <div className="flex gap-4">
            <Zap className="w-8 h-8 text-yellow-400 animate-pulse" />
            <Sparkles className="w-8 h-8 text-purple-400 animate-pulse animation-delay-200" />
            <FileText className="w-8 h-8 text-blue-400 animate-pulse animation-delay-400" />
          </div>
          <div className="text-center text-[#E0E0E0]/80 space-y-2">
            <p>Extracting key skills and experiences...</p>
            <p>Matching with job requirements...</p>
            <p>Generating tailored recommendations...</p>
          </div>
          <p className="text-sm text-[#E0E0E0]/60 mt-4">This process usually takes 30-60 seconds. Hang tight!</p>
        </motion.div>
      ) : analysis ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-[#1A0F3D]/30 rounded-2xl p-6 sm:p-8 border border-slate-600/50 mb-6">
            <div className="prose prose-invert prose-headings:text-[#4DCFFF] prose-a:text-blue-400 prose-code:text-pink-300 prose-pre:bg-black/30 max-w-none text-[#E0E0E0] leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
          
          <div className="space-y-4">
            <DownloadButtons
              analysis={analysis}
              cvFileName={cvFile?.name?.replace('.pdf', '')}
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearAnalysisAndContinue}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C4DFF] to-[#FF6B9C] text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg"
              >
                <RefreshCw className="w-5 h-5" />
                Analyze Another Position
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-red-500/50 text-red-400 hover:bg-red-500/10 font-semibold rounded-xl transition-all"
              >
                <Trash2 className="w-5 h-5" />
                Clear All Data
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </motion.section>
  );
}

export default Step3;