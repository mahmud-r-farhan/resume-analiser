import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';

function Sidebar({ onClose }) {
  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="fixed left-0 top-0 bottom-0 w-72 bg-[#1A0F3D]/80 backdrop-blur-md p-6 overflow-y-auto z-50 shadow-2xl border-r border-[#4B2B7D]/50"
    >
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="text-[#E0E0E0] hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="text-center">
        <img
          src="https://avatars.githubusercontent.com/u/114731414?v=4"
          alt="Mahmud Rahman"
          className="rounded-full w-32 h-32 mx-auto mb-4 shadow-lg"
        />
        <h3 className="text-2xl font-bold text-white">Mahmud Rahman</h3>
        <p className="text-[#E0E0E0] mt-2 mb-6 text-center">
         Creative Developer specializing in MERN stack and AI-powered applications. Passionate about building intuitive UIs and optimizing career tools.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 mx-auto bg-gradient-to-r from-[#4DCFFF] to-[#9C4DFF] text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg cursor-pointer"
          href="https://www.linkedin.com/in/mahmud-r-farhan/"
        >
          Hire Me
          <ArrowRight className="w-5 h-5" />
        </motion.a>
      </div>
    </motion.aside>
  );
}

export default Sidebar;