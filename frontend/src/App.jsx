import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import {
  Upload, FileText, Sparkles, AlertCircle, Loader2, ArrowRight, ArrowLeft, Zap,
  Trash2, RefreshCw, X, Menu, Atom, Server, Database, Braces, Download
} from 'lucide-react';

import useStore from './store';
import WelcomeModal from './components/WelcomeModal';
import FileUpload from './components/FileUpload';
import StepIndicator from './components/StepIndicator';

function DownloadButtons({ analysis, cvFileName }) {
  const handleDownloadMD = () => {
    const blob = new Blob([analysis], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cvFileName || 'cv'}_optimization.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let y = 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);

    analysis.split('\n').forEach((line) => {
      if (line.trim() === '') {
        y += 5; // Add space for empty lines
        return;
      }

      let fontSize = 12;
      let fontStyle = 'normal';
      let text = line;

      if (line.startsWith('# ')) {
        fontSize = 20;
        fontStyle = 'bold';
        text = line.slice(2);
      } else if (line.startsWith('## ')) {
        fontSize = 16;
        fontStyle = 'bold';
        text = line.slice(3);
      } else if (line.startsWith('### ')) {
        fontSize = 14;
        fontStyle = 'bold';
        text = line.slice(4);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        text = '• ' + line.slice(2);
      }

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);

      const wrappedText = doc.splitTextToSize(text, 180);
      doc.text(wrappedText, 10, y);
      y += wrappedText.length * (fontSize / 2 + 2);
    });

    doc.save(`${cvFileName || 'cv'}_optimization.pdf`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadMD}
        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold rounded-xl transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        Download as Markdown
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDownloadPDF}
        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#FF6B9C] to-[#9C4DFF] text-white font-semibold rounded-xl transition-all shadow-lg"
      >
        <Download className="w-5 h-5" />
        Download as PDF
      </motion.button>
    </div>
  );
}

function Sidebar({ onClose }) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed left-0 top-0 bottom-0 w-72 bg-[#1A0F3D]/80 backdrop-blur-md p-6 overflow-y-auto z-50 shadow-2xl border-r border-[#4B2B7D]/50"
    >
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-[#E0E0E0] hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="text-center">
        <img
          src="https://avatars.githubusercontent.com/u/114731414?v=4"
          alt="Mahmud Rahman"
          className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
        />
        <h3 className="text-2xl font-bold text-white">Mahmud Rahman</h3>
        <p className="text-[#E0E0E0] mt-2 mb-6 text-center">
         Creative Developer specializing in MERN stack and AI-powered applications. Passionate about building intuitive UIs and optimizing career tools.
        </p>
        <motion.a
        
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg cursor-pointer"
          href="https://www.linkedin.com/in/mahmud-r-farhan/"
        >
          Hire Me
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
     
    </motion.aside>
  );
}

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [localCvFile, setLocalCvFile] = useState(null);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { cvFile, jobDesc, model, analysis, setCvFile, setJobDesc, setModel, setAnalysis, clearStore } = useStore();

  useEffect(() => {
    // Check if user has seen welcome modal
    const hasSeenWelcome = localStorage.getItem('cv-optimizer-welcome-seen');
    if (hasSeenWelcome) {
      setShowWelcome(false);
    } else {
      localStorage.setItem('cv-optimizer-welcome-seen', 'true');
    }

    // Set initial sidebar state based on screen size
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 2880);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
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
      if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) { 
        setLocalCvFile(file);
        setCvFile({ name: file.name, size: file.size });
        setError('');
      } else {
        setError('Please upload a PDF file under 5MB');
        toast.error('Please upload a PDF file under 5MB');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {  
        setLocalCvFile(file);
        setCvFile({ name: file.name, size: file.size });
        setError('');
      } else {
        setError('Please upload a PDF file under 5MB');
        toast.error('Please upload a PDF file under 5MB');
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
    setUploadLimitReached(false);
    const formData = new FormData();
    formData.append('cv', localCvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', model);
    try {
      const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 429) {
          setUploadLimitReached(true);
          toast.warning(data.message || 'Upload limit reached: max 4 per 24 hours.');
          setStep(2); 
          return; 
        } else {
          throw new Error(data.error || `Server error: ${res.status}`);
        }
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
  const canAnalyze = localCvFile && jobDesc.trim().length >= 50;  

  const dragHandlers = {
    onDragEnter: handleDrag,
    onDragLeave: handleDrag,
    onDragOver: handleDrag,
    onDrop: handleDrop
  };

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      
      <div className="min-h-screen bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DCFFF]/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#9C4DFF]/20 via-transparent to-transparent"></div>
        
        <Toaster position="top-right" expand={true} richColors />
        
        <div className="relative">
          <AnimatePresence>
            {sidebarOpen && <Sidebar onClose={toggleSidebar} />}
          </AnimatePresence>
          
          <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72 ml-0' : 'ml-0'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {/* Header */}
              <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12 relative"
              >
                <div className="flex items-center justify-center mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-10 h-10 text-[#4DCFFF] mr-3 cursor-pointer" 
                     onClick={toggleSidebar}/>
                         
                  </motion.div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#4DCFFF] via-[#9C4DFF] to-[#FF6B9C] bg-clip-text text-transparent">
                   Resume Optimizer
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
                {uploadLimitReached && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-start backdrop-blur-sm"
                  >
                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-300">Upload limit reached: maximum 4 CVs per 24 hours.</p>
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
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;