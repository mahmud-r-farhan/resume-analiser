import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Download as DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { parseJSONSafe } from '../../utils/api';

export default function OptimizationHistoryTab({ token, onRefresh }) {
  const [optimizations, setOptimizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOptimizations();
  }, [page]);

  const fetchOptimizations = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/optimizations?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        setOptimizations(parsed.data.data);
      }
    } catch (error) {
      toast.error('Failed to load optimizations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (optimizationId) => {
    if (!window.confirm('Delete this optimization?')) return;

    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/optimizations/${optimizationId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        toast.success('Optimization deleted');
        fetchOptimizations();
        onRefresh?.();
      }
    } catch (error) {
      toast.error('Failed to delete optimization');
    }
  };

  const handleDownload = async (resumeId) => {
    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/download/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Download failed');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `resume_${Date.now()}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success('Resume downloaded');
      fetchOptimizations();
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#4DCFFF]/30 border-t-[#4DCFFF] rounded-full"></div></div>;
  }

  if (optimizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7CBE6]">No optimized resumes yet. Generate your first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {optimizations.map((opt, idx) => (
        <motion.div
          key={opt._id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <div className="flex-1">
            <p className="text-white font-medium">{opt.jobTitle || 'Untitled Position'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-[#C7CBE6]">
              <span className="px-2 py-1 rounded bg-[#4DCFFF]/20 text-[#4DCFFF]">
                {opt.template}
              </span>
              <span>Fit: {opt.fitScore}%</span>
              <span>{new Date(opt.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDownload(opt._id)}
              className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"
              title="Download PDF"
            >
              <DownloadIcon className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDelete(opt._id)}
              className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
