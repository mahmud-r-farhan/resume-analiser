import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import useAuthStore from '../store/authStore';

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
          <div onClick={toggleSidebar} className="flex gap-2 justify-center text-sm text-gray-400 mt-4 relative cursor-pointer">
              <p>Welcome back,</p>
              <div className="relative group cursor-default">
                <p>{user.fullName}</p>
                <div
                  className="
                    absolute left-1/2 -translate-x-1/2 top-full mt-2
                    px-3 py-1.5 text-sm text-gray-700
                    bg-white rounded-md shadow-md border
                    opacity-0 scale-95 pointer-events-none
                    group-hover:opacity-100 group-hover:scale-100
                    transition-all duration-200 ease-out
                    whitespace-nowrap z-20 text-start
                  "
                > 
                 <p>{user.email}</p>

                {/* Detailed User Info Tooltip 
                    <p>Username: {user.username}</p>
                    <p>Name: {user.fullName}</p>
                    <p>Email: {user.email}</p>
                    <p>Account Type: {user.isPremium ? 'Premium' : 'Free'}</p>
                    <p>Resume Quota: {user.resumeQuota.count}/3</p>
                    <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    */}
                </div>
              </div>
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