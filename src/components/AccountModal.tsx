import React, { useState, useEffect } from 'react';
import { CustomerOrder } from '../types';
import { X, User, Package, MapPin, LogOut, Check, ArrowLeft, Mail, Lock, KeyRound, AlertCircle } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string } | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  onResetPassword: (email: string) => Promise<void>;
  onUpdatePassword?: (password: string) => Promise<{ name: string; email: string }>;
  onSignOut: () => void;
  pastOrders: CustomerOrder[];
  initialMode?: 'signin' | 'signup' | 'forgot' | 'update_password';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignUp,
  onResetPassword,
  onUpdatePassword,
  onSignOut,
  pastOrders,
  initialMode = 'signin'
}) => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'update_password'>(initialMode);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      if (initialMode) setMode(initialMode);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !password) return;
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onSignIn(emailInput.trim(), password);
      setPassword('');
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not access your account.');
    } finally {
      setBusy(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !password) return;
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const signedIn = await onSignUp(nameInput.trim(), emailInput.trim(), password);
      if (signedIn) {
        setSuccessMessage('Account created and signed in successfully!');
        setPassword('');
        setTimeout(() => onClose(), 1200);
      } else {
        setSuccessMessage('Account created! Please check your email inbox to confirm your account, then sign in.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onResetPassword(email);
      setSuccessMessage(`We've sent a password reset link to ${email}. Please check your inbox and spam folder.`);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not send reset link. Please verify your email.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!onUpdatePassword) {
      setErrorMessage('Password update is not available.');
      return;
    }
    setBusy(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await onUpdatePassword(password);
      setSuccessMessage('Your password has been successfully updated! You are now signed in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setMode('signin');
        onClose();
      }, 1500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Could not update password.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentUser ? (
              <User className="w-5 h-5 text-stone-800" />
            ) : mode === 'forgot' ? (
              <KeyRound className="w-5 h-5 text-stone-800" />
            ) : mode === 'update_password' ? (
              <Lock className="w-5 h-5 text-stone-800" />
            ) : (
              <User className="w-5 h-5 text-stone-800" />
            )}
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              {currentUser
                ? 'My Account'
                : mode === 'forgot'
                ? 'Reset Your Password'
                : mode === 'signup'
                ? 'Create Your Account'
                : mode === 'update_password'
                ? 'Set New Password'
                : 'Sign In to Bekky’s Touch'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div>
            {/* Tabs */}
            <div className="flex border-b border-stone-200 bg-stone-50/50 px-6 pt-3 gap-6 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-2.5 transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-stone-900 text-stone-900'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                Profile &amp; Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`pb-2.5 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-stone-900 text-stone-900'
                    : 'text-stone-400 hover:text-stone-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Order History ({pastOrders.length})</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'profile' ? (
                <div className="space-y-4">
                  <div className="p-4 bg-[#FAF9F5] rounded-xl border border-stone-200 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-serif text-lg font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-semibold text-stone-900">{currentUser.name}</h3>
                      <p className="text-xs text-stone-500">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-stone-200">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Complimentary UK delivery active</span>
                    </div>
                    <div className="flex items-start gap-2 p-3 bg-white rounded-lg border border-stone-200">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800 block">Default UK Address:</span>
                        <span>No saved address yet.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-end">
                    <button
                      type="button"
                      onClick={onSignOut}
                      className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {pastOrders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                      <p className="text-xs text-stone-500">No past orders yet on this browser.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {pastOrders.map((order, idx) => (
                        <div key={idx} className="p-3.5 bg-[#FAF9F5] border border-stone-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-stone-900">{order.orderId}</span>
                            <span className="text-stone-500 text-[11px]">{order.date}</span>
                          </div>
                          <div className="text-[11px] text-stone-600">
                            {order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-xs font-semibold">
                            <span className="text-stone-500 font-normal">Total Paid</span>
                            <span className="tabular-nums">£{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : mode === 'forgot' ? (
          /* FORGOT PASSWORD FORM */
          <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Enter the email address associated with your Bekky’s Touch account. We will send you a secure link to reset your password.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Reset Link Sent
                </p>
                <p>{successMessage}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="name@example.com"
                  autoFocus
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </form>
        ) : mode === 'update_password' ? (
          /* UPDATE PASSWORD FORM */
          <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Create a new secure password for your Bekky’s Touch account.
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">New Password (min. 6 characters)</label>
              <div className="relative">
                <input
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="••••••••"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        ) : (
          /* SIGN IN / SIGN UP FORM */
          <form onSubmit={mode === 'signup' ? handleSignUp : handleSignIn} className="p-6 space-y-4">
            <p className="text-xs text-stone-600">
              {mode === 'signup'
                ? 'Create an account to save delivery preferences, track orders, and receive member privileges.'
                : 'Sign in to access your orders, saved addresses, and VIP beauty perks.'}
            </p>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="e.g. Rebecca Ekeh"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="name@example.com"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-stone-700">Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] text-stone-500 hover:text-stone-900 underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  minLength={6}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:border-stone-800"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              disabled={busy}
              type="submit"
              className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Please wait...</span>
                </>
              ) : mode === 'signup' ? (
                <span>Create Account</span>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                className="text-xs text-stone-600 hover:text-stone-900 font-medium cursor-pointer"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
              >
                {mode === 'signup' ? 'Already have an account? Sign in' : 'New here? Create an account'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
