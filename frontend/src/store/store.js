import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      cvFile: null,
      jobDesc: '',
      model: 'mistralai/mistral-small-3.1-24b-instruct:free',
      analysis: '',
      fitScore: null,
      optimizedCV: '',
      setCvFile: (file) => set({ cvFile: file }),
      setJobDesc: (desc) => set({ jobDesc: desc }),
      setModel: (model) => set({ model }),
      setAnalysis: (analysis) => set({ analysis }),
      setFitScore: (fitScore) => set({ fitScore }),
      setOptimizedCV: (optimizedCV) => set({ optimizedCV }),
      clearStore: () => set({ cvFile: null, jobDesc: '', analysis: '', optimizedCV: '', model: 'mistralai/mistral-small-3.1-24b-instruct:free', fitScore: null }),
    }),
    {
      name: 'cv-optimizer-storage',
      partialize: (state) => ({ jobDesc: state.jobDesc }),
    }
  )
);

export default useStore;