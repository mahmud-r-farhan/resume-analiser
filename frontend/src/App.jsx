import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Upload, FileText, Sparkles, AlertCircle, CheckCircle2,
  Loader2, ArrowRight, ArrowLeft, Zap, Download,
  Trash2, RefreshCw, Info, X, FileDown, BookOpen
} from 'lucide-react';

// Zustand Store with persistence
const useStore = create(
  persist(
    (set) => ({
      cvFile: null,
      jobDesc: '',
      model: 'deepseek/deepseek-v3-base:free',
      analysis: '',
      setCvFile: (file) => set({ cvFile: file }),
      setJobDesc: (desc) => set({ jobDesc: desc }),
      setModel: (model) => set({ model }),
      setAnalysis: (analysis) => set({ analysis }),
      clearStore: () => set({ cvFile: null, jobDesc: '', analysis: '', model: 'deepseek/deepseek-v3-base:free' }),
    }),
    {
      name: 'cv-optimizer-storage',
      partialize: (state) => ({
        jobDesc: state.jobDesc,
        model: state.model,
      }),
    }
  )
);

// Welcome Modal Component
function WelcomeModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-700 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Info className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Welcome to CV Optimizer</h2>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-gray-200 leading-relaxed">
                This application uses <span className="font-semibold text-blue-400">OpenRouter's free LLM models API</span> to analyze and optimize your CV for specific job positions.
              </p>
            </div>
            <div className="space-y-3 text-gray-300">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                Key Features:
              </h3>
              <ul className="space-y-2 ml-7 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>AI-powered CV analysis tailored to job descriptions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Multiple free AI models to choose from</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Download results in Markdown or DOCX format</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Auto-save job descriptions (resume data stays in-memory)</span>
                </li>
              </ul>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-sm">
              <p className="text-amber-200">
                <strong>Note:</strong> Your CV file is processed in-memory only and not stored permanently for privacy reasons.
              </p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Application
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// File Upload Component
function FileUpload({ cvFile, onFileChange, dragActive, onDragHandlers }) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer ${
        dragActive
          ? 'border-blue-500 bg-blue-500/10'
          : cvFile
          ? 'border-green-500 bg-green-500/10'
          : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
      }`}
      {...onDragHandlers}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={onFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center pointer-events-none">
        {cvFile ? (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <CheckCircle2 className="w-16 h-16 text-green-400 mb-4" />
            <p className="font-semibold text-xl text-white mb-2">{cvFile.name}</p>
            <p className="text-gray-400">
              {(cvFile.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-sm text-gray-500 mt-2">Click to change file</p>
          </motion.div>
        ) : (
          <div>
            <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-300 font-medium mb-2 text-lg">
              Drop your PDF here or click to browse
            </p>
            <p className="text-gray-500">PDF files only, max 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Upload CV' },
    { number: 2, label: 'Job Details' },
    { number: 3, label: 'Analysis' }
  ];
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, idx) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={false}
              animate={{
                scale: currentStep === step.number ? 1.1 : 1,
                backgroundColor: currentStep > step.number
                  ? 'rgba(34, 197, 94, 1)'
                  : currentStep === step.number
                  ? 'rgba(59, 130, 246, 1)'
                  : 'rgba(71, 85, 105, 0.5)'
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
            >
              {currentStep > step.number ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                step.number
              )}
            </motion.div>
            <p className="text-xs text-gray-400 mt-2 hidden sm:block">{step.label}</p>
          </div>
          {idx < steps.length - 1 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: currentStep > step.number ? '100%' : '0%',
                backgroundColor: currentStep > step.number ? 'rgba(34, 197, 94, 1)' : 'rgba(71, 85, 105, 0.5)'
              }}
              className="h-1 w-16 sm:w-24 mx-2 rounded-full"
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Download Button Component
function DownloadButtons({ analysis, cvFileName }) {
  const downloadMarkdown = () => {
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${cvFileName || 'result'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Markdown file downloaded!');
  };
  const downloadDocx = () => {
    // Simple DOCX-like format (HTML that Word can open)
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>CV Analysis Report</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; }
          h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 20px; }
          p { margin: 10px 0; }
          pre { background: #f3f4f6; padding: 15px; border-radius: 5px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>CV Optimization Analysis Report</h1>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <pre>${analysis}</pre>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_Analysis_${cvFileName || 'result'}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Document file downloaded!');
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadMarkdown}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg border border-slate-600"
      >
        <FileDown className="w-5 h-5" />
        Download Markdown
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadDocx}
        className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg border border-slate-600"
      >
        <BookOpen className="w-5 h-5" />
        Download Document
      </motion.button>
    </div>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [localCvFile, setLocalCvFile] = useState(null);
  const { cvFile, jobDesc, model, analysis, setCvFile, setJobDesc, setModel, setAnalysis, clearStore } = useStore();

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('cv-optimizer-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    }
  }, []);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('cv-optimizer-welcome-seen', 'true');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setLocalCvFile(file);
        setCvFile({ name: file.name, size: file.size });
        setError('');
      } else {
        setError('Please upload a PDF file');
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setLocalCvFile(file);
        setCvFile({ name: file.name, size: file.size });
        setError('');
      } else {
        setError('Please upload a PDF file');
        toast.error('Please upload a PDF file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!localCvFile || !jobDesc.trim()) {
      setError('Please provide both CV and job description');
      toast.error("Please provide both CV and job description");
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis('');
    setStep(3);
    const formData = new FormData();
    formData.append('cv', localCvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', model);
    try {
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || '/api/analyze';
      
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();
      setAnalysis(data.analysis);
      toast.success('Analysis complete!');
    } catch (err) {
      setError(err.message || 'Failed to analyze CV. Please try again.');
      toast.error(err.message || 'Failed to analyze CV');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLocalCvFile(null);
    clearStore();
    setError('');
    setStep(1);
    toast.success('Form reset successfully');
  };

  const clearAnalysisAndContinue = () => {
    setAnalysis('');
    setStep(1);
    toast.info('Ready for new analysis');
  };

  const canProceedToStep2 = localCvFile !== null;
  const canAnalyze = localCvFile && jobDesc.trim();

  const dragHandlers = {
    onDragEnter: handleDrag,
    onDragLeave: handleDrag,
    onDragOver: handleDrag,
    onDrop: handleDrop
  };

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      
      <div className="min-h-screen bg-gradient-to-br from-[#1A0F3D] via-[#1A0F3D] to-[#4B2B7D] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DCFFF]/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#9C4DFF]/20 via-transparent to-transparent"></div>
        
        <Toaster position="top-right" expand={true} richColors />
        
        <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-10 h-10 text-[#4DCFFF] mr-3" />
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#4DCFFF] via-[#9C4DFF] to-[#FF6B9C] bg-clip-text text-transparent">
                Professional Resume Optimizer
              </h1>
            </div>
            <p className="text-[#E0E0E0] text-base sm:text-lg max-w-2xl mx-auto">
              AI-powered resume analysis and enhancement designed to boost your career growth.
            </p>
          </motion.header>
          <StepIndicator currentStep={step} />
          {/* Error Alert */}
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
          </AnimatePresence>
          {/* Main Content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Upload CV */}
            {step === 1 && (
              <motion.section
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[#1A0F3D]/40 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-[#4B2B7D]/50"
              >
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                    <Upload className="w-8 h-8 mr-3 text-blue-400" />
                    Upload Your Resume
                  </h2>
                  <p className="text-[#E0E0E0]">Step 1: Start by uploading your current resume in PDF format. Our AI will analyze it to identify strengths, weaknesses, and opportunities for improvement.</p>
                </div>
                <FileUpload
                  cvFile={cvFile}
                  onFileChange={handleFileChange}
                  dragActive={dragActive}
                  onDragHandlers={dragHandlers}
                />
                <motion.div className="mt-8 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#9C4DFF] to-[#FF6B9C] text-white font-semibold py-4 px-8 rounded-xl disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:opacity-50"
                  >
                    Continue to Job Details
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.section>
            )}
            {/* Step 2: Job Description */}
            {step === 2 && (
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
                      <option value="deepseek/deepseek-v3-base:free">DeepSeek: V3 Base (Free) - Technical Analysis</option>
                      <option value="google/gemini-2.5-pro-exp-03-25:free">Google: Gemini 2.5 Pro Exp (Free) - Advanced Reasoning</option>
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
                    disabled={!canAnalyze}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#9C4DFF] to-[#FF6B9C] text-white font-semibold py-4 px-8 rounded-xl disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5" />
                    Start AI Analysis
                  </motion.button>
                </div>
              </motion.section>
            )}
            {/* Step 3: Results */}
            {step === 3 && (
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
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <Loader2 className="w-16 h-16 text-[#4DCFFF] animate-spin mb-6" />
                    <p className="text-xl text-[#E0E0E0] mb-2">Analyzing your CV with AI...</p>
                    <p className="text-[#E0E0E0]/70">This typically takes 30-60 seconds</p>
                  </motion.div>
                ) : analysis ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="bg-[#1A0F3D]/30 rounded-2xl p-6 sm:p-8 border border-slate-600/50 mb-6">
                      <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-wrap text-[#E0E0E0] leading-relaxed">
                          {analysis}
                        </div>
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;