import React, { useState, useEffect } from 'react';
import { BookOpen, Lock, Mail, AlertCircle, Eye, EyeOff, ShieldAlert } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 60;
const DEMO_EMAIL = 'student@studymate.edu';
const DEMO_PASSWORD = 'studymate2026';

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read persisted attempts and lockout from localStorage
  const [attempts, setAttempts] = useState<number>(() => {
    const saved = localStorage.getItem('studymate_login_attempts');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lockoutTime, setLockoutTime] = useState<number | null>(() => {
    const saved = localStorage.getItem('studymate_lockout_until');
    if (saved) {
      const until = parseInt(saved, 10);
      if (Date.now() < until) {
        return Math.ceil((until - Date.now()) / 1000);
      }
    }
    return null;
  });

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutTime === null || lockoutTime <= 0) return;

    const timer = setInterval(() => {
      setLockoutTime((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('studymate_lockout_until');
          localStorage.setItem('studymate_login_attempts', '0');
          setAttempts(0);
          setError(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutTime !== null && lockoutTime > 0) {
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    // Check credentials
    if (trimmedEmail === DEMO_EMAIL && trimmedPassword === DEMO_PASSWORD) {
      // Successful login
      localStorage.setItem('studymate_login_attempts', '0');
      localStorage.removeItem('studymate_lockout_until');
      setAttempts(0);
      setError(null);
      onLoginSuccess();
    } else {
      // Failed login
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      localStorage.setItem('studymate_login_attempts', nextAttempts.toString());

      if (nextAttempts >= MAX_ATTEMPTS) {
        const lockoutUntil = Date.now() + LOCKOUT_SECONDS * 1000;
        localStorage.setItem('studymate_lockout_until', lockoutUntil.toString());
        setLockoutTime(LOCKOUT_SECONDS);
        setError(`Maximum login limit of ${MAX_ATTEMPTS} attempts exceeded. Access locked for ${LOCKOUT_SECONDS} seconds.`);
      } else {
        const remaining = MAX_ATTEMPTS - nextAttempts;
        setError(`Invalid credentials. ${remaining} ${remaining === 1 ? 'attempt' : 'attempts'} remaining.`);
      }
    }
  };

  const isLocked = lockoutTime !== null && lockoutTime > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-lg bg-[#111827] text-white flex items-center justify-center mx-auto mb-4 shadow-xs">
          <BookOpen className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
          Sign in to StudyMate
        </h2>
        <p className="mt-1.5 text-xs text-[#6B7280]">
          Enter your academic credentials to access your study documents
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 border border-[#E5E7EB] rounded-lg shadow-xs">
          {/* Lockout Warning Banner */}
          {isLocked && (
            <div className="mb-5 p-3.5 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md flex items-start space-x-2.5 text-[#DC2626] text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Account Temporarily Locked</p>
                <p className="mt-0.5 text-[11px] leading-relaxed">
                  You have reached the 3-attempt limit. Please wait{' '}
                  <span className="font-bold">{lockoutTime}s</span> before trying again.
                </p>
              </div>
            </div>
          )}

          {/* Standard Error Alert */}
          {!isLocked && error && (
            <div className="mb-5 p-3 bg-[#FEF2F2] border border-[#FCA5A5] rounded-md flex items-center space-x-2 text-[#DC2626] text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1">
                Student Email
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLocked}
                  placeholder="student@studymate.edu"
                  className="block w-full pl-9 pr-3 py-2 text-xs border border-[#E5E7EB] rounded-md bg-[#FFFFFF] text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111827] disabled:opacity-50 disabled:bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] mb-1">
                Password
              </label>
              <div className="relative rounded-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLocked}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-10 py-2 text-xs border border-[#E5E7EB] rounded-md bg-[#FFFFFF] text-[#111827] placeholder-[#9CA3AF] focus:outline-hidden focus:border-[#111827] disabled:opacity-50 disabled:bg-[#F8FAFC]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9CA3AF] hover:text-[#111827] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLocked}
                className="w-full py-2.5 px-4 bg-[#111827] hover:bg-[#374151] text-[#FFFFFF] text-xs font-semibold rounded-md shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLocked ? `Locked (${lockoutTime}s)` : 'Sign In'}
              </button>
            </div>
          </form>


        </div>
      </div>
    </div>
  );
};
