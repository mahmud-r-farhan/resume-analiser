import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Zap } from 'lucide-react';

function Step2({ jobDesc, setJobDesc, model, setModel, setStep, handleSubmit, canAnalyze, loading, uploadLimitReached }) {
  return (
    <motion.section
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1A0F3D]/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-[#4B2B7D]/50"
    >
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
          <FileText className="w-8 h-8 mr-3 text-purple-400" />
          Target Job Description
        </h2>
        <p className="text-[#E0E0E0]">Step 2: Provide the complete job posting details for analysis</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-[#E0E0E0] mb-3">
            Job Posting Content
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the complete job description here, including:&#10;• Job title and company name&#10;• Key responsibilities&#10;• Required qualifications&#10;• Preferred skills and experience&#10;• Company culture and benefits"
            className="w-full px-6 py-4 bg-[#1A0F3D]/50 border border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
            rows="14"
          />
          <div className="flex justify-between items-center mt-3 text-sm text-[#E0E0E0]/70">
            <span>{jobDesc.length} characters</span>
            <span>{jobDesc.trim().split(/\s+/).filter(w => w).length} words</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#E0E0E0] mb-3">
            AI Model Selection
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 bg-[#1A0F3D]/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
          >
            <option value="deepseek/deepseek-chat-v3.1:free">DeepSeek: V3.1 Chat (Free) - Technical Analysis</option>
            <option value="google/gemini-2.5-flash-preview-0925:free">Google: Gemini 2.5 Flash Preview (Free) - Advanced Reasoning</option>
            <option value="mistralai/mistral-small-3.1-24b-instruct:free">Mistral: Small 3.1 Instruct (Free) - Efficient Optimization</option>
            <option value="meta-llama/llama-4-maverick:free">Meta: Llama 4 Maverick (Free) - Comprehensive Review</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setStep(1)}
          className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-[#4B2B7D] text-[#E0E0E0] font-semibold rounded-xl hover:bg-[#1A0F3D]/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Upload
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!canAnalyze || loading || uploadLimitReached}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C4DFF] to-[#FF6B9C] text-white font-semibold py-4 px-8 rounded-xl disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:opacity-50"
        >
          <Zap className="w-5 h-5" />
          Start AI Analysis
        </motion.button>
      </div>
    </motion.section>
  );
}

export default Step2;