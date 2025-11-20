import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Target, Zap, BarChart3, Shield, Clock, Award } from 'lucide-react';
import ScaleOnView from './ScaleOnView.jsx';


const Features = () => {
    return (
        <div>
        <section id="features" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <ScaleOnView>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-5 py-2 rounded-full mb-8">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Everything You Need in Premium</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black mb-6">
                  Features That Actually
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Get You Hired</span>
                </h2>
              </div>
            </ScaleOnView>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Target, title: "ATS-Optimized Scoring", desc: "See exactly how ATS systems score your resume — 99% accurate.", color: "from-blue-500 to-cyan-500" },
                { icon: Zap, title: "AI Rewrite Suggestions", desc: "Bullet-by-bullet improvements powered by latest hiring trends.", color: "from-purple-500 to-pink-500" },
                { icon: BarChart3, title: "Industry Benchmarks", desc: "Compare against top 10% resumes in your field.", color: "from-orange-500 to-red-500" },
                { icon: Shield, title: "Bank-Level Privacy", desc: "Your resume is encrypted and auto-deleted after 24h.", color: "from-green-500 to-emerald-500" },
                { icon: Clock, title: "Real-Time Editing", desc: "Watch your score climb as you type — no refresh needed.", color: "from-yellow-500 to-orange-500" },
                { icon: Award, title: "12+ Designer Templates", desc: "Recruiter-approved layouts for every industry.", color: "from-indigo-500 to-purple-500" }
              ].map((f, i) => (
                <ScaleOnView key={i} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-8 hover:border-slate-600 transition-all"
                  >
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${f.color} bg-opacity-10 mb-6 group-hover:scale-110 transition`}>
                      <f.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition">
                      {f.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed">{f.desc}</p>
                  </motion.div>
                </ScaleOnView>
              ))}
            </div>
          </div>
        </section>
        </div>
    );
};

export default Features;