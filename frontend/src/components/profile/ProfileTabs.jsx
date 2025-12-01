import { useState } from 'react';
import { FileText, Zap } from 'lucide-react';
import AnalysisHistoryTab from './AnalysisHistoryTab';
import OptimizationHistoryTab from './OptimizationHistoryTab';

export default function ProfileTabs({ token, onRefresh }) {
  const [activeTab, setActiveTab] = useState('analyses');

  const tabs = [
    { id: 'analyses', label: 'Analyses', icon: FileText },
    { id: 'optimizations', label: 'Optimizations', icon: Zap },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-[#120A2A]/50 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-all ${activeTab === tab.id
                ? 'text-white border-b-2 border-[#4DCFFF] bg-white/5'
                : 'text-[#C7CBE6] hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'analyses' && <AnalysisHistoryTab token={token} onRefresh={onRefresh} />}
        {activeTab === 'optimizations' && <OptimizationHistoryTab token={token} onRefresh={onRefresh} />}
        {activeTab === 'downloads' && <DownloadHistoryTab token={token} onRefresh={onRefresh} />}
      </div>
    </div>
  );
}
