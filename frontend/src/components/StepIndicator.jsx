import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Upload' },
    { number: 2, label: 'Job Details' },
    { number: 3, label: 'Analysis' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12">
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center relative z-10">
                {/* Step Circle */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.05 : 1,
                    boxShadow: isActive 
                      ? '0 0 0 4px rgba(59, 130, 246, 0.2)' 
                      : '0 0 0 0px rgba(59, 130, 246, 0)'
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20 
                  }}
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center 
                    font-bold text-white relative
                    ${isCompleted ? 'bg-gradient-to-br from-green-400 to-green-600' : ''}
                    ${isActive ? 'bg-gradient-to-br from-[#4DCFFF] to-[#9B51FF]' : ''}
                    ${isPending ? 'bg-slate-700 border-2 border-slate-600' : ''}
                  `}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-7 h-7" />
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={false}
                      animate={{ 
                        scale: isActive ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ 
                        repeat: isActive ? Infinity : 0,
                        duration: 2,
                        ease: "easeInOut"
                      }}
                      className="text-lg"
                    >
                      {step.number}
                    </motion.span>
                  )}
                  
                  {/* Active pulse effect */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-[#4DCFFF]"
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.4, opacity: 0 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <motion.p
                  initial={false}
                  animate={{
                    color: isActive 
                      ? '#4DCFFF' 
                      : isCompleted 
                      ? 'rgb(34, 197, 94)' 
                      : 'rgb(148, 163, 184)',
                    fontWeight: isActive ? 600 : 500
                  }}
                  className="text-sm mt-3 text-center whitespace-nowrap"
                >
                  {step.label}
                </motion.p>
              </div>

              {/* Connector Line */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 mx-3 bg-slate-700 rounded-full relative overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: isCompleted ? '100%' : '0%'
                    }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                  />
                  
                  {/* Shimmer effect on active line */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '200%' }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;