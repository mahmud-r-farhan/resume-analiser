import React from 'react';
import ScaleOnView from './ScaleOnView.jsx';
import { Upload, Sparkles, Download } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-28 px-6 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <ScaleOnView>
              <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  3 Steps to More Interviews
                </h2>
              </div>
            </ScaleOnView>

            <div className="grid md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30" />

              {[
                { step: "01", title: "Upload Resume", icon: Upload, desc: "PDF, DOCX, or paste & takes 5 seconds" },
                { step: "02", title: "AI Analyzes", icon: Sparkles, desc: "Deep scan + smart suggestions in 30s" },
                { step: "03", title: "Download & Apply", icon: Download, desc: "Get your optimized resume instantly" }
              ].map((s, i) => (
                <ScaleOnView key={i} delay={i * 0.2}>
                  <div className="text-center">
                    <div className="relative inline-block mb-8">
                      <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-black shadow-2xl">
                        {s.step}
                      </div>
                      <div className="absolute -bottom-4 -right-4 p-4 bg-slate-800 rounded-2xl border border-slate-700">
                        <s.icon className="w-10 h-10 text-blue-400" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-bold mb-4">{s.title}</h3>
                    <p className="text-slate-400 text-lg">{s.desc}</p>
                  </div>
                </ScaleOnView>
              ))}
            </div>
          </div>
        </section>
    );
};

export default HowItWorks;