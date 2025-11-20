import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Crown } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import UserCount from '../UserCount.jsx';

// Wrap RouterLink with motion()
const MotionRouterLink = motion(RouterLink);

const FinalCTA = () => {
  return (
    <section className="h-[100vh] justify-center flex flex-col px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-black mb-8"
        >
          Ready to 3x Your Interviews?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center text-center justify-center text-xl text-slate-300 mb-12"
        >
          <div className="items-center justify-center gap-2 md:flex">
        <span className='flex gap-2 justify-center'>Join <Crown className="w-6 h-6 text-yellow-400" /><UserCount /></span> <span>professionals already getting hired faster</span>
        </div></motion.p>

        {/* CTA Button */}
        <MotionRouterLink
          to="/analyze"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-black text-2xl shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
        >
          Start Free Analysis Now
          <ChevronRight className="w-8 h-8" />
        </MotionRouterLink>
      </div>
    </section>
  );
};

export default FinalCTA;