import React from 'react';
import ScaleOnView from './ScaleOnView.jsx';

const TrustedBy = () => {
    return (
        <ScaleOnView>
          <section className="py-16 border-y border-slate-800 bg-slate-900/40">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-slate-400 uppercase tracking-wider text-sm font-semibold mb-10">Trusted by professionals at</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-12 items-center opacity-60">
                {['Company', 'Company', 'Company', 'Company', 'Company', 'Company'].map(c => (
                  <div key={c} className="text-2xl md:text-3xl font-bold text-slate-500 hover:text-white transition">{c}</div>
                ))}
              </div>
            </div>
          </section>
        </ScaleOnView>
    );
};

export default TrustedBy;