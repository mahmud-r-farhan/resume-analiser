import { useState } from 'react';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

function App() {
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

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', model);

    try {
      // Using environment variable for API endpoint
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
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCvFile(null);
    setJobDesc('');
    setAnalysis('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-blue-600 mr-3" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CV Optimizer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Optimize your CV with AI-powered analysis
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6">
          {/* CV Upload Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Your CV
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : cvFile
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-gray-400'
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
                  <div className="flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mr-3" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{cvFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(cvFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-700 font-medium mb-1">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">PDF files only</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Job Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <textarea
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows="8"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {jobDesc.length} characters
            </p>
          </div>

          {/* Model Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              AI Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="z-ai/glm-4-5-air:free">Z.AI: GLM 4.5 Air (Free)</option>
              <option value="tng/deepseek-r1t2-chimera:free">TNG: DeepSeek R1T2 Chimera (Free)</option>
              <option value="google/gemini-2-0-flash-experimental:free">Google: Gemini 2.0 Flash (Free)</option>
              <option value="openai/gpt-oss-20b:free">OpenAI: GPT OSS 20B (Free)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !cvFile || !jobDesc.trim()}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze CV
                </span>
              )}
            </button>
            {(cvFile || jobDesc || analysis) && (
              <button
                onClick={resetForm}
                disabled={loading}
                className="sm:w-auto px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 animate-fade-in">
            <div className="flex items-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            </div>
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 whitespace-pre-wrap text-gray-800 leading-relaxed">
                {analysis}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;