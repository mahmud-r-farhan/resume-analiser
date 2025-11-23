import React from 'react';
import { Mail, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Logo & Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/logo.png" 
                alt="ResumeAI Logo" 
                className="h-10 w-10 object-contain"
                loading="lazy"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Resume Analizer
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs">
              Build professional resumes in minutes with AI-powered suggestions and beautiful templates.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3 text-slate-400">
                <li>
                  <Link
                    to={"/analyze"} 
                    className="text-sm hover:text-white transition-colors duration-200 inline-flex items-center gap-2 group"
                  >
                    <span className="w-2 group-hover:w-4 transition-all duration-300">→</span>
                    Analyze
                  </Link>
                </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex gap-4 mb-6">
              {[Github, Linkedin, Twitter, Globe ].map((Icon, i) => {
                const urls = {
                  Github: "https://github.com/mahmud-r-farhan/resume-analiser",
                  Linkedin: "https://www.linkedin.com/in/mahmud-r-farhan/",
                  Twitter: "https://x.com/mahmud_r_farhan",
                  Globe: "https://gravatar.com/floawd"
                };
                const socialNames = ['Github', 'Linkedin', 'Twitter', 'Globe'];
                const iconName = socialNames[i];

                return (
                  <a
                    key={i}
                    href={urls[iconName]}
                    className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 transition-all duration-300 hover:scale-110"
                    aria-label={iconName}
                  >
                    <Icon className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
            <p className="text-xs text-slate-500">
              Have questions? <a href="mailto:dev@devplus.fun" className="text-blue-400 hover:underline">dev@devplus.fun</a>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2025 Resume Analizer. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-slate-300 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;