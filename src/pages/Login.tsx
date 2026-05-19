import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../context/StoreContext';
import { Truck, Mail, Lock, User as UserIcon, ArrowRight, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AuthMode = 'login' | 'register' | 'verify';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const { login, loginEmail, register, user, loading, resendVerification, t } = useStore();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  React.useEffect(() => {
    if (!loading && user) {
      const from = (location.state as any)?.from?.pathname || params.get('redirect') || '/';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location, params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoadingAction(true);
    
    try {
      if (mode === 'login') {
        await loginEmail(email, password);
      } else if (mode === 'register') {
        await register(email, password, name);
        // We'll let them in even without verification for better UX in dev
        // setMode('verify'); 
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification();
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (err) {
      setError('Failed to resend. Please try again later.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-zinc-50/50">
      <Helmet>
        <title>{mode === 'register' ? 'Register' : 'Login'} | Sprinter Plus</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-sky-200 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[30%] h-[30%] bg-zinc-200 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        layout
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-lg bg-white border border-zinc-200 rounded-[48px] p-8 lg:p-14 shadow-3xl shadow-zinc-200/50"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto mb-6 bg-zinc-900 rounded-[24px] grid place-items-center shadow-xl shadow-zinc-900/20">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight mb-3">
            {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create Account' : 'Check Your Inbox'}
          </h1>
          <p className="text-zinc-500 font-medium">
            {mode === 'verify' 
              ? `We sent a verification link to ${user?.email}`
              : 'The standard for Sprinter parts in Europe.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'verify' ? (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="p-6 bg-sky-50 rounded-3xl flex items-start gap-4">
                <Mail className="w-6 h-6 text-sky-600 mt-1 shrink-0" />
                <div>
                  <h3 className="font-bold text-sky-900 mb-1">Verify your email</h3>
                  <p className="text-sm text-sky-700/80 leading-relaxed font-medium">
                    Please click the link in the email we just sent you. You won't be able to access the store until your email is verified.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleResend}
                  disabled={emailSent}
                  className="w-full h-16 bg-zinc-100 text-zinc-600 font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-zinc-200 transition-all duration-300 disabled:opacity-50"
                >
                  {emailSent ? <CheckCircle2 className="w-5 h-5" /> : null}
                  {emailSent ? 'EMAIL SENT!' : 'RESEND VERIFICATION'}
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full h-16 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-sky-500 transition-all duration-300"
                >
                  I'VE VERIFIED MY EMAIL
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <button 
                type="button"
                onClick={() => login()}
                className="w-full h-16 bg-white border-2 border-zinc-100 text-zinc-900 font-black rounded-2xl flex items-center justify-center gap-4 hover:border-zinc-900 transition-all duration-300 active:scale-[0.98] shadow-sm"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="" />
                {t('googleSignIn').toUpperCase()}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
                <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest"><span className="bg-white px-4 text-zinc-300">Or use email</span></div>
              </div>

              {mode === 'register' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full h-16 pl-14 pr-6 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full h-16 pl-14 pr-6 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-300" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-16 pl-14 pr-6 bg-zinc-50 border border-zinc-100 rounded-2xl font-bold text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingAction}
                className="w-full h-16 bg-zinc-900 text-white font-black rounded-2xl flex items-center justify-center gap-4 hover:bg-sky-500 transition-all duration-300 group shadow-xl shadow-zinc-900/10 active:scale-[0.98] disabled:opacity-50"
              >
                {loadingAction ? 'PROCESSING...' : mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="text-center mt-8">
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-[11px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
                >
                  {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-6 pt-10 border-t border-zinc-100 opacity-40">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4" /> <span className="text-[10px] font-black uppercase tracking-[0.2em]">SSL SECURED</span></div>
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
          <div className="text-[10px] font-black uppercase tracking-[0.2em]">GDPR COMPLIANT</div>
        </div>
      </motion.div>
    </div>
  );
}
