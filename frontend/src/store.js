import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      cvFile: null,
      jobDesc: '',
      model: 'deepseek/deepseek-chat-v3.1:free',
      analysis: '',
      setCvFile: (file) => set({ cvFile: file }),
      setJobDesc: (desc) => set({ jobDesc: desc }),
      setModel: (model) => set({ model }),
      setAnalysis: (analysis) => set({ analysis }),
      clearStore: () => set({ cvFile: null, jobDesc: '', analysis: '', model: 'deepseek/deepseek-chat-v3.1:free' }),
    }),
    {
      name: 'cv-optimizer-storage',
      partialize: (state) => ({
        jobDesc: state.jobDesc,
      }),
    }
  )
);

export default useStore;