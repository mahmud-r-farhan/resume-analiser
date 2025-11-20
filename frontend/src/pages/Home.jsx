import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, CheckCircle, TrendingUp, Users, Play, X, 
  Sparkles, ArrowRight 
} from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

import TrustedBy from '../components/landing/TrustedBy.jsx';
import Features from '../components/landing/Features.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import Testimonials from '../components/landing/Testimonials.jsx';
import Pricing from '../components/landing/Pricing.jsx';
import FinalCTA from '../components/landing/FinalCTA.jsx';
import UploadLogList from '../components/UploadLogList.jsx';
import UserCount from '../components/UserCount.jsx';
import Footer from '../components/landing/Footer.jsx';


// Create motion wrapper for RouterLink
const MotionLink = motion(RouterLink);

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showVideoModal && videoRef.current) {
      videoRef.current.play();
    }
  }, [showVideoModal]);

  return (
    <>
      {/* Video Modal */}
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-2xl px-4"
          onClick={() => setShowVideoModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <video ref={videoRef} className="w-full h-full"  autoPlay playsInline>
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled ? 'bg-slate-950/90 backdrop-blur-2xl shadow-2xl border-b border-slate-800/50' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <div className="flex items-center gap-3">
                 <img src="/logo.png" alt="Logo" loading="lazy" />
            </div>

            <div className="hidden lg:flex items-center gap-10">
              {['Features', 'How It Works', 'Testimonials', 'Pricing'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-slate-300 hover:text-white font-medium transition relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 
                    bg-gradient-to-r from-blue-400 to-purple-400 
                    group-hover:w-full transition-all"
                  />
                </a>
              ))}
            </div>

            <MotionLink
              to="/analyze"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 px-8 py-3.5 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/50 transition-all"
            >
              Get Started Free
            </MotionLink>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 120, 0] }}
              transition={{ duration: 30, repeat: Infinity }}
              className="absolute top-0 -left-48 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
              transition={{ duration: 35, repeat: Infinity }}
              className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
            />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full mb-8">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-300">AI-Powered Resume Optimization</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  Turn Your Resume Into
                  <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Interview Magnets
                  </span>
                </h1>

                <p className="text-xl text-slate-300 mb-10 max-w-2xl">
                  Beat ATS systems. Outshine competitors. Land 3x more interviews with AI that understands recruiters in 2025.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mb-12">
                  <MotionLink
                    to="/analyze"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative px-9 py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/40 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Analyze Resume Free <ArrowRight className="group-hover:translate-x-2 transition" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                  </MotionLink>

                  <motion.button
                    onClick={() => setShowVideoModal(true)}
                    whileHover={{ scale: 1.05 }}
                    className="px-9 py-5 border-2 border-slate-700 rounded-2xl font-semibold flex items-center justify-center gap-3 hover:border-blue-500/70 hover:bg-slate-800/60 transition"
                  >
                    <Play className="w-5 h-5" /> Watch Demo
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-8 text-sm text-slate-400">
                  <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> No Card Needed</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /> Results in 45 Seconds</div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-400" /><UploadLogList />Analyzed</div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative">
                <motion.div
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute -top-10 -left-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700 px-6 py-4 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <TrendingUp className="w-8 h-8 text-green-400" />
                    <div>
                      <p className="text-3xl font-black text-green-400">90%</p>
                      <p className="text-xs text-slate-400">ATS Pass Rate</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [15, -15, 15] }}
                  transition={{ duration: 7, repeat: Infinity }}
                  className="absolute -bottom-10 -right-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700 px-6 py-4 rounded-2xl shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-blue-400" />
                    <div>
                      <p className="text-3xl font-black text-blue-400"><UserCount /></p>
                      <p className="text-xs text-slate-400">Happy Users</p>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl p-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="Logo" />
                        <div>
                          <div className="h-4 w-32 bg-slate-700 rounded" />
                          <div className="h-3 w-24 bg-slate-600 rounded mt-2" />
                        </div>
                      </div>
                      <div className="px-6 py-2 bg-green-500/20 text-green-400 rounded-xl text-sm font-bold">
                        90 / 100
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {['Keywords', 'Structure', 'Impact'].map((t) => (
                        <div key={t} className="bg-slate-800/50 p-5 rounded-2xl text-center">
                          <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            A+
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{t}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustedBy />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}