import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download as DownloadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { parseJSONSafe } from '../../utils/api';

export default function DownloadHistoryTab({ token, onRefresh }) {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_ENDPOINT;
      const res = await fetch(`${apiBase}/profile/downloads?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const parsed = await parseJSONSafe(res);
      if (parsed.ok) {
        setDownloads(parsed.data.data);
      }
    } catch (error) {
      toast.error('Failed to load download history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-4 border-[#4DCFFF]/30 border-t-[#4DCFFF] rounded-full"></div></div>;
  }

  if (downloads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#C7CBE6]">No downloads yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 px-4 text-[#A7BFFF] font-semibold">Job Title</th>
            <th className="text-left py-3 px-4 text-[#A7BFFF] font-semibold">Template</th>
            <th className="text-left py-3 px-4 text-[#A7BFFF] font-semibold">Fit Score</th>
            <th className="text-left py-3 px-4 text-[#A7BFFF] font-semibold">Downloads</th>
            <th className="text-left py-3 px-4 text-[#A7BFFF] font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {downloads.map((item, idx) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td className="py-3 px-4 text-white">{item.jobTitle}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded bg-[#4DCFFF]/20 text-[#4DCFFF] text-xs font-medium">
                  {item.template}
                </span>
              </td>
              <td className="py-3 px-4 text-[#C7CBE6]">{item.fitScore}%</td>
              <td className="py-3 px-4">
                <span className="flex items-center gap-1 text-[#C7CBE6]">
                  <DownloadIcon className="w-3 h-3" />
                  {item.downloadCount}
                </span>
              </td>
              <td className="py-3 px-4 text-[#C7CBE6]">
                {new Date(item.generatedAt).toLocaleDateString()}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
