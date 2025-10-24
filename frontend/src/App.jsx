import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, Loader2, ArrowRight, ArrowLeft, Zap } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [model, setModel] = useState('z-ai/glm-4-5-air:free');
  const [dragActive, setDragActive] = useState(false);

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
        setCvFile(file);
        setError('');
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setCvFile(file);
        setError('');
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!cvFile || !jobDesc.trim()) {
      setError('Please provide both CV and job description');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis('');
    setStep(3);

    const formData = new FormData();
    formData.append('cv', cvFile);
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
    } catch (err) {
      setError(err.message || 'Failed to analyze CV. Please try again.');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCvFile(null);
    setJobDesc('');
    setAnalysis('');
    setError('');
    setStep(1);
  };

  const canProceedToStep2 = cvFile !== null;
  const canAnalyze = cvFile && jobDesc.trim();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const stepIndicatorVariants = {
    inactive: { scale: 1, backgroundColor: "rgba(71, 85, 105, 0.5)" },
    active: { 
      scale: 1.1, 
      backgroundColor: "rgba(59, 130, 246, 1)",
      transition: { duration: 0.3 }
    },
    complete: { 
      scale: 1, 
      backgroundColor: "rgba(34, 197, 94, 1)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-12 h-12 text-blue-500 mr-3" />
            </motion.div>
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              CV Optimizer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            AI-powered CV analysis for your dream job
          </p>
        </motion.div>

        {/* Step Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center mb-12 gap-8"
        >
          {[1, 2, 3].map((s, idx) => (
            <div key={s} className="flex items-center">
              <motion.div
                variants={stepIndicatorVariants}
                animate={
                  step > s ? "complete" : step === s ? "active" : "inactive"
                }
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
              >
                {step > s ? <CheckCircle2 className="w-12 h-12" /> : s}
              </motion.div>
              {idx < 2 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step > s ? "100%" : "0%" }}
                  className="h-1 w-14 sm:w-20 bg-green-500  pl-10 rounded-full"
                />
              )}
            </div>
          ))}
        </motion.div>

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
            <motion.div
              key="step1"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-700/50"
            >
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                  <Upload className="w-8 h-8 mr-3 text-blue-400" />
                  Upload Your CV
                </h2>
                <p className="text-gray-400">Step 1: Let's start with your resume</p>
              </div>

              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-500/10'
                    : cvFile
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-600 hover:border-slate-500 bg-slate-700/30'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
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
                    </motion.div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-300 font-medium mb-2 text-lg">
                        Drop your PDF here or click to browse
                      </p>
                      <p className="text-gray-500">PDF files only, max 10MB</p>
                    </motion.div>
                  )}
                </div>
              </div>

              <motion.div 
                className="mt-8 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:opacity-50"
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-700/50"
            >
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                  <FileText className="w-8 h-8 mr-3 text-purple-400" />
                  Job Description
                </h2>
                <p className="text-gray-400">Step 2: Paste the job posting you're applying for</p>
              </div>

              <div className="mb-6">
                <div className="relative">
                  <textarea
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    placeholder="Paste the complete job description here... Include requirements, responsibilities, and qualifications."
                    className="w-full px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-white placeholder-gray-500"
                    rows="12"
                  />
                </div>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm text-gray-500">
                    {jobDesc.length} characters
                  </p>
                  <p className="text-sm text-gray-500">
                    {jobDesc.trim().split(/\s+/).filter(w => w).length} words
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  AI Model Selection
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white"
                >
                  <option value="z-ai/glm-4-5-air:free">Z.AI: GLM 4.5 Air (Free)</option>
                  <option value="tng/deepseek-r1t2-chimera:free">TNG: DeepSeek R1T2 Chimera (Free)</option>
                  <option value="google/gemini-2-0-flash-experimental:free">Google: Gemini 2.0 Flash (Free)</option>
                  <option value="openai/gpt-oss-20b:free">OpenAI: GPT OSS 20B (Free)</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(1)}
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-600 text-gray-300 font-semibold rounded-xl hover:bg-slate-700/50 transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!canAnalyze}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed transition-all shadow-lg disabled:opacity-50"
                >
                  <Zap className="w-5 h-5" />
                  Analyze CV
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Results */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 border border-slate-700/50"
            >
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center">
                  <Sparkles className="w-8 h-8 mr-3 text-green-400" />
                  Analysis Results
                </h2>
                <p className="text-gray-400">Your personalized CV optimization report</p>
              </div>

              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <Loader2 className="w-16 h-16 text-blue-400 animate-spin mb-6" />
                  <p className="text-xl text-gray-300 mb-2">Analyzing your CV...</p>
                  <p className="text-gray-500">This may take a few moments</p>
                </motion.div>
              ) : analysis ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-slate-700/30 rounded-2xl p-6 sm:p-8 border border-slate-600/50 mb-6">
                    <div className="prose prose-invert max-w-none">
                      <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                        {analysis}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetForm}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg"
                    >
                      Analyze Another CV
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reset Button (always visible except on step 1) */}
        {step !== 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-center"
          >
            <button
              onClick={resetForm}
              disabled={loading}
              className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;