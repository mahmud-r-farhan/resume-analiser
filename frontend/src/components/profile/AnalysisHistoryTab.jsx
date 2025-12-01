import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { parseJSONSafe } from '../../utils/api';

export default function AnalysisHistoryTab({ token, onRefresh }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchAnalyses();
  }, [page]);

  const fetchAnalyses = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/analyses?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        setAnalyses(parsed.data.data);
      }
    } catch (error) {
      toast.error('Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (analysisId) => {
    if (!window.confirm('Delete this analysis?')) return;

    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/analyses/${analysisId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        toast.success('Analysis deleted');
        fetchAnalyses();
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to delete analysis');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#4DCFFF]/30 border-t-[#4DCFFF] rounded-full"></div></div>;
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7CBE6]">No analyses yet. Start analyzing resumes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {analyses.map((analysis, idx) => (
        <motion.div
          key={analysis._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex-1">
            <p className="text-white font-medium">{analysis.cvFileName}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#C7CBE6]">
              <span>Fit Score: {analysis.fitScore}</span>
              <span>Model: {analysis.model}</span>
              <span>{new Date(analysis.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleDelete(analysis._id)}
            className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </motion.div>
      ))}
    </div>
  );
}
