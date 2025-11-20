import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Infinity, ArrowLeft } from 'lucide-react';
import PurchaseModal from './PurchaseModal';
import { useState } from 'react';

const PurchasePage = ({ onClose }) => {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const benefits = [
    {
      icon: Infinity,
      title: 'Unlimited Resume Creation',
      description: 'Generate as many optimized resumes as you need without weekly limits.',
      color: 'from-blue-400 to-cyan-400',
    },
    {
      icon: Sparkles,
      title: 'Premium LLM Models',
      description: 'Access to advanced AI models for superior resume optimization and analysis.',
      color: 'from-purple-400 to-pink-400',
    },
    {
      icon: Zap,
      title: 'Priority Processing',
      description: 'Faster resume generation with priority queue access.',
      color: 'from-yellow-400 to-orange-400',
    },
    {
      icon: Check,
      title: 'Advanced Features',
      description: 'Unlock all premium templates and advanced customization options.',
      color: 'from-green-400 to-emerald-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f1b43] via-[#231551] to-[#581d49] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#4DCFFF]/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#9C4DFF]/20 via-transparent to-transparent"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onClose}
          className="flex items-center gap-2 text-[#C7CBE6] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-linear-to-r from-[#4DCFFF] via-[#9C4DFF] to-[#FF6B9C] bg-clip-text text-transparent">
            Upgrade to Premium
          </h1>
          <p className="text-xl text-[#C7CBE6] max-w-2xl mx-auto">
            Unlock unlimited resume creation and access to premium AI models for the best career optimization experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-3xl border border-white/10 bg-[#1A0F3D]/50 backdrop-blur-xl p-6 shadow-xl"
              >
                <div className={`inline-flex p-3 rounded-xl bg-linear-to-r ${benefit.color} mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-[#C7CBE6] leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-[#1A0F3D]/70 backdrop-blur-xl p-8 shadow-2xl max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-green-400">Premium Plan</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Unlimited Access</h2>
            <p className="text-[#C7CBE6]">
              Get everything you need to create perfect resumes for every job application.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Unlimited optimized resume generation</span>
            </div>
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Access to premium AI models (GPT-4, Claude, etc.)</span>
            </div>
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>Priority processing and faster results</span>
            </div>
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>All premium templates and customization</span>
            </div>
            <div className="flex items-center gap-3 text-[#E0E0E0]">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span>24/7 priority support</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPurchaseModal(true)}
            className="w-full py-4 px-8 rounded-xl bg-linear-to-r from-[#4DCFFF] via-[#9C4DFF] to-[#FF6B9C] text-white font-bold text-lg shadow-lg shadow-[#9C4DFF]/30 transition"
          >
            Pay Now
          </motion.button>
        </motion.div>
      </div>

      <PurchaseModal isOpen={showPurchaseModal} onClose={() => setShowPurchaseModal(false)} />
    </div>
  );
};

export default PurchasePage;

