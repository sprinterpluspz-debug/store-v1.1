import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, LogOut, CheckCircle2, Search } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';

export default function VerifyEmail() {
  const { user, resendVerification, checkVerificationStatus, logout, t } = useStore();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendVerification();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setChecking(true);
    try {
      await checkVerificationStatus();
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setChecking(false), 1000);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-3xl p-10 text-center"
      >
        <div className="w-20 h-20 bg-sky-50 text-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <Mail className="w-10 h-10" />
        </div>
        
        <h1 className="text-3xl font-black text-zinc-900 mb-4 tracking-tight">Verify your email</h1>
        <p className="text-zinc-500 font-medium mb-10">
          We've sent a verification link to <span className="text-zinc-900 font-bold">{user.email}</span>. 
          Please check your inbox and follow the instructions to activate your account.
        </p>

        <div className="space-y-4">
          <button 
            onClick={checkStatus}
            disabled={checking}
            className="w-full h-16 bg-sky-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-600 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            {checking ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5" />
                I've verified my email
              </>
            )}
          </button>

          <button 
            onClick={handleResend}
            disabled={loading || resent}
            className="w-full h-16 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-sky-500 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : resent ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Sent! Check again
              </>
            ) : (
              'Resend Verification Email'
            )}
          </button>

          <button 
            onClick={logout}
            className="w-full h-16 bg-white border-2 border-zinc-100 text-zinc-400 font-black rounded-2xl flex items-center justify-center gap-3 hover:border-zinc-900 hover:text-zinc-900 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>

        <p className="mt-10 text-[10px] font-black text-zinc-300 uppercase tracking-widest">
          Didn't receive it? Check your spam folder.
        </p>
      </motion.div>
    </div>
  );
}
