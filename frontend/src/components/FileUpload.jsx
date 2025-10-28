import { motion } from 'framer-motion';
import { Upload, CheckCircle2 } from 'lucide-react';

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
            <p className="text-gray-500">PDF files only, max 5MB</p>  {/* Updated to match backend limit */}
          </div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;