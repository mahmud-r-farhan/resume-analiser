import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { Link } from 'react-router-dom';

function Header({ toggleSidebar, openAuthModal }) {

  const { user, setAuth } = useAuthStore();


  const handleLoginClick = () => {
    openAuthModal?.('login');

  };
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-12 relative"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-10 h-10 text-[#4DCFFF] mr-3 cursor-pointer" onClick={toggleSidebar} />
        </motion.div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-linear-to-r from-[#4DCFFF] via-[#9C4DFF] to-[#FF6B9C] bg-clip-text text-transparent">
          Premium Resume Optimizer
        </h1>
      </div>
      <p className="text-[#E0E0E0] text-base sm:text-lg max-w-2xl mx-auto">
        AI-powered premium resume enhancement for perfect job matches.
      </p>
        {user ? (
          <div className="flex gap-4 justify-center text-sm text-gray-400 mt-4 relative">
            <p>Welcome back,</p>
            <Link
              to="/profile"
              className="text-[#A7BFFF] hover:text-white underline cursor-pointer transition-colors"
            >
              {user.fullName}
            </Link>
          </div> 
        ) : (
        <div  onClick={handleLoginClick} className='text-center text-sm text-gray-400 mt-4 cursor-pointer'> 
          <p>Greetings, Guest</p> 
        </div>
        )}
    </motion.header>
  );
}

export default Header;