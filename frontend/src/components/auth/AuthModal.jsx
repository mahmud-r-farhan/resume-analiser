import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import VerifyEmailModal from './VerifyEmailModal';
import ForgotPasswordModal from './ForgotPasswordModal';
import ResetOtpModal from './ResetOtpModal';
import ResetPasswordModal from './ResetPasswordModal';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resetToken, setResetToken] = useState('');

  if (!isOpen) return null;

  const sharedProps = {
    onClose,
    setMode,
    setStep,
    pendingEmail,
    setPendingEmail,
    resetToken,
    setResetToken,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Login */}
          {mode === 'login' && step === 'form' && (
            <LoginModal {...sharedProps} />
          )}

          {/* Register */}
          {mode === 'register' && step === 'form' && (
            <RegisterModal {...sharedProps} />
          )}
          {mode === 'register' && step === 'verifyEmail' && (
            <VerifyEmailModal {...sharedProps} />
          )}

          {/* Forgot Password Flow */}
          {mode === 'forgot' && step === 'form' && (
            <ForgotPasswordModal {...sharedProps} />
          )}
          {mode === 'forgot' && step === 'resetOtp' && (
            <ResetOtpModal {...sharedProps} />
          )}
          {mode === 'forgot' && step === 'resetPassword' && (
            <ResetPasswordModal {...sharedProps} />
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;