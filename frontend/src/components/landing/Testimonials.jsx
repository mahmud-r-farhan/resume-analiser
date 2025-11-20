import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import ScaleOnView from './ScaleOnView.jsx';

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-28 px-6">
          <div className="max-w-7xl mx-auto">
            <ScaleOnView>
              <h2 className="text-center text-5xl md:text-6xl font-black mb-20">
                Don't Take Our Word For It
              </h2>
            </ScaleOnView>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { name: "Mahmud Rahman", role: "Software Engineer → ...", text: "Went from 68% → 96% ATS score. Got 5 interviews in one week.", rating: 5 },
                { name: "Michael Torres", role: "Product Manager → ...", text: "The AI rewrite suggestions are pure magic. Landed my dream role.", rating: 5 },
                { name: "李祖阳 Zhāng", role: "Data Scientist → ...", text: "Best $29 I ever spent on my career. Cannot recommend enough!", rating: 5 }
              ].map((t, i) => (
                <ScaleOnView key={i} delay={i * 0.15}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8"
                  >
                    <div className="flex gap-1 mb-6">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <Quote className="w-12 h-12 text-blue-400/20 mb-6" />
                    <p className="text-lg text-slate-300 mb-8 leading-relaxed">"{t.text}"</p>
                    <div>
                      <p className="font-bold text-xl">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.role}</p>
                    </div>
                  </motion.div>
                </ScaleOnView>
              ))}
            </div>
          </div>
        </section>
    );
};

export default Testimonials;