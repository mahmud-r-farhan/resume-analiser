import { motion } from 'framer-motion';
import { BarChart3, FileText, Download, Zap } from 'lucide-react';

export default function ProfileStats({ stats }) {
  const statCards = [
    {
      icon: FileText,
      label: 'Total Analyses',
      value: stats.totalAnalyses,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'from-blue-500/10 to-cyan-500/10',
    },
    {
      icon: Zap,
      label: 'Optimized Resumes',
      value: stats.totalOptimizations,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'from-purple-500/10 to-pink-500/10',
    },
    {
      icon: Download,
      label: 'Total Downloads',
      value: stats.totalDownloads,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'from-green-500/10 to-emerald-500/10',
    },
    {
      icon: BarChart3,
      label: 'Resume Quota',
      value: typeof stats.resumeQuota.remaining === 'string' 
        ? stats.resumeQuota.remaining 
        : `${stats.resumeQuota.remaining}/${3}`,
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'from-yellow-500/10 to-orange-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.bgColor} backdrop-blur-xl p-6 shadow-lg`}
          >
            <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${card.color} mb-4`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-[#C7CBE6] text-sm font-medium mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
