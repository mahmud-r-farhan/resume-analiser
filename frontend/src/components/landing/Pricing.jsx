import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Zap, 
  Crown, 
  Sparkles,
  ArrowRight 
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import AnalysisCount from '../AnalysisCount.jsx';
import PurchaseModal from '../premium/PurchaseModal.jsx';

// Wrap RouterLink so Framer Motion can animate it
const MotionRouterLink = motion(RouterLink);

const Pricing = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <section id="pricing" className="py-28 px-6 bg-slate-900/50 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/2 translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 px-5 py-2 rounded-full mb-8">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="text-purple-300 font-semibold">Simple, Transparent Pricing</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black pb-4">
            Choose Your Plan
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent p-2">
              Start Free, Upgrade When Ready
            </span>
          </h2>

          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Get instant AI feedback for free. Unlock unlimited rewrites and premium features with Pro.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
        >
          {/* Free Plan */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 hover:border-slate-600 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-3xl font-bold text-white">Free</h3>
                  <p className="text-slate-400 mt-1">Perfect for getting started</p>
                </div>

                <div className="text-right">
                  <p className="text-5xl font-black text-white">$0</p>
                  <p className="text-slate-400 text-sm">Forever free</p>
                </div>
              </div>

              {/* FIXED BUTTON */}
              <MotionRouterLink
                to="/analyze"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full block text-center py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 transition-all mb-10"
              >
                Start Free Analysis
              </MotionRouterLink>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    Everything in Free:
                  </h4>

                  <ul className="space-y-3 text-slate-300">
                    {[
                      "AI-powered resume scoring",
                      "ATS compatibility check",
                      "Keyword optimization suggestions",
                      "3 resume analyses per month",
                      "Basic rewrite suggestions",
                      "Export as PDF or Markdown"
                    ].map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -12 }}
            className="group relative bg-gradient-to-br from-purple-900/40 via-blue-900/40 to-slate-900/80 backdrop-blur-2xl border-2 border-purple-500/50 rounded-3xl p-8 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-500"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                <Zap className="w-4 h-4" />
                MOST POPULAR
              </div>
            </div>

            <div className="relative z-10 mt-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-4xl font-black text-white flex items-center gap-3">
                    Pro
                    <Crown className="w-8 h-8 text-yellow-400" />
                  </h3>
                  <p className="text-slate-300 mt-1">For serious job hunters</p>
                </div>

                <div className="text-right">
                  <p className="text-5xl font-black text-white">
                    $29
                    <span className="text-2xl text-slate-300">/month</span>
                  </p>
                  <p className="text-green-400 font-semibold">Save 40% with yearly</p>
                </div>
              </div>
              
              <motion.button
                onClick={() => setIsModalOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full block text-center py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 rounded-2xl font-bold text-lg text-black shadow-xl shadow-orange-500/50 hover:shadow-2xl hover:shadow-orange-500/70 transition-all mb-10"
              >
                Upgrade to Pro Now <ArrowRight className="inline ml-2" />
              </motion.button>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Everything in Free, plus:
                  </h4>

                  <ul className="space-y-3 text-slate-200">
                    {[
                      "Unlimited resume analyses & rewrites",
                      "Advanced AI models (Grok, Claude, GPT, etc.)",
                      "Tailor resume to specific job descriptions",
                      "15+ premium designer templates",
                      "Cover letter generator",
                      "LinkedIn profile optimization",
                      "Priority support & faster processing",
                      "Download in Word, PDF, or JSON"
                    ].map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base font-medium">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-slate-400 items-center justify-center gap-2 sm:flex-none md:inline-flex">
            <span title='Guest' className="text-green-400 font-semibold"><AnalysisCount /></span> job seekers trusted ResumeAI in 2025 • 
            Cancel anytime • No credit card required for free plan
          </p>
        </motion.div>

      </div>

      <PurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default Pricing;