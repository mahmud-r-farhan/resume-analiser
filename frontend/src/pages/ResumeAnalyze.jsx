import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

import useStore from '../store/store';
import useAuthStore from '../store/authStore';
import WelcomeModal from '../components/WelcomeModal';
import StepIndicator from '../components/StepIndicator';
import Header from '../components/Header';
import ErrorAlert from '../components/error-boundary/ErrorAlert';
import Step1 from '../components/steps/Step1';
import Step2 from '../components/steps/Step2';
import Step3 from '../components/steps/Step3';
import Sidebar from '../components/Sidebar';
import QuotaExceededModal from '../components/premium/QuotaExceededModal';
import PurchasePage from '../components/premium/PurchasePage';
import AuthModal from '../components/auth/AuthModal';
import { parseJSONSafe } from '../utils/api';

function ResumeAnalyze() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [localCvFile, setLocalCvFile] = useState(null);
  const [uploadLimitReached, setUploadLimitReached] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [template, setTemplate] = useState('classic');
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showPurchasePage, setShowPurchasePage] = useState(false);
  const [quotaResetAt, setQuotaResetAt] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const { token } = useAuthStore();
  const {
    cvFile,
    jobDesc,
    model,
    analysis,
    optimizedCV,
    fitScore,
    setCvFile,
    setJobDesc,
    setModel,
    setAnalysis,
    setOptimizedCV,
    setFitScore,
    clearStore
  } = useStore();

  useEffect(() => {


    const handleResize = () => setSidebarOpen(window.innerWidth >= 2880);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const openAuthModal = (mode = 'login') => {
    setAuthInitialMode(mode);
    setShowAuthModal(true);
  };

  const handleWelcomeClose = () => setShowWelcome(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
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
      toast.error('Please provide both CV and job description');
      return;
    }
    setLoading(true);
    setError('');
    setAnalysis('');
    setFitScore(null);
    setStep(3);
    setUploadLimitReached(false);
    const formData = new FormData();
    formData.append('cv', localCvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', model);
    try {
      const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/analyze`;
      const res = await fetch(apiEndpoint, { method: 'POST', body: formData });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        if (parsed.status === 429) {
          setUploadLimitReached(true);
          toast.warning(parsed.data?.message || parsed.data?.error || 'Upload rate limited');
          setStep(2);
          return;
        }
        throw new Error(parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || `Server error: ${parsed.status}`);
      }
      setAnalysis(parsed.data.analysis);
      setFitScore(parsed.data.fitScore ?? null);
      toast.success('Analysis complete!');
    } catch (err) {
      setError(err.message || 'Failed to analyze CV. Please try again.');
      toast.error(err.message || 'Failed to analyze CV');
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!localCvFile || !jobDesc.trim() || !analysis) return;
    if (!token) {
      setAuthInitialMode('login');
      setShowAuthModal(true);
      return;
    }
    setOptimizing(true);
    setError('');
    setOptimizedCV('');
    setFitScore(null);
    const formData = new FormData();
    formData.append('cv', localCvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('analysis', analysis);
    formData.append('model', model);
    formData.append('template', template);
    try {
      const apiEndpoint = `${import.meta.env.VITE_API_ENDPOINT}/optimize`;
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const parsed = await parseJSONSafe(res);
      if (!parsed.ok) {
        if (parsed.data?.quotaExceeded) {
          setQuotaResetAt(parsed.data.resetAt);
          setShowQuotaModal(true);
          return;
        }
        if (parsed.status === 401) {
          setAuthInitialMode('login');
          setShowAuthModal(true);
          return;
        }
        throw new Error(parsed.data?.error || parsed.data?.message || parsed.data?.__rawText || 'Optimization failed');
      }
      setOptimizedCV(parsed.data.optimizedCV);
      toast.success('Optimization complete! Download your premium CV.');
    } catch (err) {
      setError(err.message || 'Failed to optimize CV.');
      toast.error(err.message || 'Failed to optimize CV');
    } finally {
      setOptimizing(false);
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
    setOptimizedCV('');
    setFitScore(null);
    setStep(1);
    toast.info('Ready for new analysis');
  };

  const canProceedToStep2 = localCvFile !== null;
  const canAnalyze = localCvFile && jobDesc.trim().length >= 50;

  if (showPurchasePage) {
    return <PurchasePage onClose={() => setShowPurchasePage(false)} />;
  }

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authInitialMode}
      />
      <QuotaExceededModal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        onUpgrade={() => {
          setShowQuotaModal(false);
          setShowPurchasePage(true);
        }}
        resetAt={quotaResetAt}
      />
      <div className="min-h-screen bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DCFFF]/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#9C4DFF]/20 via-transparent to-transparent"></div>

        <Toaster position="top-right" expand={true} richColors />

        <div className="relative">
          <AnimatePresence>
            {sidebarOpen && <Sidebar onClose={toggleSidebar} openAuthModal={openAuthModal} />}
          </AnimatePresence>

          <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72 ml-0' : 'ml-0'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
              <Header toggleSidebar={toggleSidebar} openAuthModal={openAuthModal}/>
              <StepIndicator currentStep={step} />
              <ErrorAlert error={error} uploadLimitReached={uploadLimitReached} />
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <Step1
                    key="step1"
                    cvFile={cvFile}
                    handleFileChange={handleFileChange}
                    dragActive={dragActive}
                    dragHandlers={{ onDragEnter: handleDrag, onDragLeave: handleDrag, onDragOver: handleDrag, onDrop: handleDrop }}
                    setStep={setStep}
                    canProceedToStep2={canProceedToStep2}
                  />
                )}
                {step === 2 && (
                  <Step2
                    key="step2"
                    jobDesc={jobDesc}
                    setJobDesc={setJobDesc}
                    model={model}
                    setModel={setModel}
                    setStep={setStep}
                    handleSubmit={handleSubmit}
                    canAnalyze={canAnalyze}
                    loading={loading}
                    uploadLimitReached={uploadLimitReached}
                  />
                )}
                {step === 3 && (
                  <Step3
                    key="step3"
                    loading={loading}
                    analysis={analysis}
                    optimizedCV={optimizedCV}
                    optimizing={optimizing}
                    handleOptimize={handleOptimize}
                    template={template}
                    setTemplate={setTemplate}
                    cvFile={cvFile}
                    clearAnalysisAndContinue={clearAnalysisAndContinue}
                    resetForm={resetForm}
                    fitScore={fitScore}
                    model={model}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResumeAnalyze;