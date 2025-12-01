import { motion as Motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: "Upload" },
    { number: 2, label: "Job Details" },
    { number: 3, label: "Analysis & Optimize" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-12">
      <div className="flex items-center justify-between relative">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isPending = currentStep < step.number;

          return (
            <div
              key={step.number}
              className="flex items-center flex-1 last:flex-initial"
            >
              <div className="flex flex-col items-center relative z-10">
                <Motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive
                      ? "0 0 0 6px rgba(59, 130, 246, 0.25)"
                      : "0 0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    font-bold text-white relative
                    ${
                      isCompleted
                        ? "bg-gradient-to-br from-green-500 to-green-600"
                        : isActive
                        ? "bg-gradient-to-br from-blue-500 to-blue-600"
                        : "bg-slate-700 border-2 border-slate-600"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </Motion.div>
                  ) : (
                    <Motion.span
                      initial={false}
                      animate={isActive ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{
                        repeat: isActive ? Infinity : 0,
                        duration: 1.6,
                        ease: "easeInOut",
                      }}
                      className="text-lg"
                    >
                      {step.number}
                    </Motion.span>
                  )}
                </Motion.div>

                <Motion.p
                  initial={false}
                  animate={{
                    color: isActive
                      ? "#3B82F6"
                      : isCompleted
                      ? "#22c55e"
                      : "#94a3b8",
                    fontWeight: isActive ? 600 : 500,
                  }}
                  className="text-sm mt-3 text-center whitespace-nowrap"
                >
                  {step.label}
                </Motion.p>
              </div>

              {/* --- Connecting Line --- */}
              {idx < steps.length - 1 && (
                <div className="flex-1 h-1 mx-3 bg-slate-700 rounded-full relative overflow-hidden">
                  {/* Completed fill */}
                  <Motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  />

                  {/* Active shimmer */}
                  {isActive && (
                    <Motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent opacity-60"
                      initial={{ x: "-120%" }}
                      animate={{ x: "200%" }}
                      transition={{ repeat: Infinity, duration: 1.3, ease: "easeInOut" }}
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