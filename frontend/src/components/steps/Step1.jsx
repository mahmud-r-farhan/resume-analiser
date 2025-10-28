import { motion } from 'framer-motion';
import { Upload, ArrowRight } from 'lucide-react';
import FileUpload from '../FileUpload';

function Step1({ cvFile, handleFileChange, dragActive, dragHandlers, setStep, canProceedToStep2 }) {
  return (
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
  );
}

export default Step1;