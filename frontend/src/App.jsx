import { useState } from 'react';
import axios from 'axios';
import UploadCV from './components/UploadCV';
import JobDescription from './components/JobDescription';
import Results from './components/Results';

function App() {
  const [cvFile, setCvFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('z-ai/glm-4-5-air:free');

  const handleSubmit = async () => {
    if (!cvFile || !jobDesc) return alert('Missing inputs');
    setLoading(true);

    const formData = new FormData();
    formData.append('cv', cvFile);
    formData.append('jobDescription', jobDesc);
    formData.append('model', model);

    try {
      const res = await axios.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(res.data.analysis);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">CV Optimizer</h1>
      <UploadCV onUpload={setCvFile} />
      <JobDescription onChange={setJobDesc} />
      <div className="mb-4">
        <label className="block text-gray-700">Select LLM Model</label>
        <select value={model} onChange={(e) => setModel(e.target.value)} className="border p-2 w-full">
          <option value="z-ai/glm-4-5-air:free">Z.AI: GLM 4.5 Air (free)</option>
          <option value="tng/deepseek-r1t2-chimera:free">TNG: DeepSeek R1T2 Chimera (free)</option>
          <option value="google/gemini-2-0-flash-experimental:free">Google: Gemini 2.0 Flash Experimental (free)</option>
          <option value="openai/gpt-oss-20b:free">OpenAI: gpt-oss-20b (free)</option>
        </select>
      </div>
      <button onClick={handleSubmit} disabled={loading} className="bg-blue-500 text-white p-2 rounded">
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      <Results analysis={analysis} />
    </div>
  );
}

export default App;