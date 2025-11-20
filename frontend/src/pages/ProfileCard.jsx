import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Create motion components the new way (removes deprecation warning)
const m = motion;

const ProfileCard = () => {
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 10;
    const y = (e.clientY - top - height / 2) / 10;
    imageRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) translateZ(20px)`;
  };

  const handleMouseLeave = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
    }
  };

  // Fixed elastic easing → use spring instead (feels almost identical)
  const springConfig = {
    type: "spring",
    stiffness: 300,
    damping: 20,
    mass: 0.8
  };

  const socialIcons = [
    { Icon: () => <Github className="w-6 h-6" />, href: "https://github.com/mahmud-r-farhan", color: "hover:bg-gray-800" },
    { Icon: () => <Linkedin className="w-6 h-6" />, href: "https://www.linkedin.com/in/mahmud-r-farhan/", color: "hover:bg-blue-700" },
    { Icon: () => <Mail className="w-6 h-6" />, href: "mailto:dev@devplus.fun", color: "hover:bg-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8 overflow-hidden relative">
      {/* Beams Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <m.div
              key={i}
              className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-cyan-500 to-transparent blur-sm"
              style={{ left: `${i * 9}%` }}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 8 + i * 0.5, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </div>

      {/* Card */}
      <m.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl max-w-lg mx-auto overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-1000" />

          <div className="relative z-10 text-center">
            {/* 3D Image */}
            <m.div
              ref={imageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative mx-auto w-48 h-48 mb-8"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-black">
                  <img src="https://avatars.githubusercontent.com/u/114731414?v=4" alt="Profile" className="w-full h-full object-cover" />
                </div>
              </div>
              <Sparkles className="absolute -top-4 -right-4 text-cyan-400 w-10 h-10 animate-ping" />
            </m.div>

            <m.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Mahmud Rahman
            </m.h1>

            <m.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mt-2">
              Full Stack Developer & AI Enthusiast
            </m.p>

            <m.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
                Passionate about building innovative web applications and AI-powered solutions that enhance user experiences and drive business growth.
            </m.p>

            <m.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-10"
            >
                <Link
                    to="/" // Replace this with the actual route path you want
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full font-semibold text-white shadow-lg hover:shadow-cyan-500/50"
            >
                    Home
                    <ExternalLink className="w-5 h-5" />
                </Link>
            </m.div>

            {/* Social Icons with spring bounce */}
            <div className="flex justify-center gap-6 mt-10">
              {socialIcons.map((social, i) => (
                <m.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...springConfig, delay: 0.5 + i * 0.1 }}
                  whileHover={{ y: -12, scale: 1.2 }}
                  className={`p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 transition-all ${social.color}`}
                >
                  <social.Icon />
                </m.a>
              ))}
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <m.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
            initial={{ x: Math.random() * 500 - 250, y: Math.random() * 500 - 250, opacity: 0 }}
            animate={{ y: -400, opacity: [0, 1, 0] }}
            transition={{ duration: 8 + i, repeat: Infinity, delay: i * 1.5 }}
          />
        ))}
      </m.div>
    </div>
  );
};

export default ProfileCard;