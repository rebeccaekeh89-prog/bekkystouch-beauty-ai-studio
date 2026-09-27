import React, { useState } from 'react';
import { CustomerOrder } from '../types';
import { X, User, Package, MapPin, LogOut, Check } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; email: string } | null;
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  onResetPassword: (email: string) => Promise<void>;
  onSignOut: () => void;
  pastOrders: CustomerOrder[];
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onSignUp,
  onResetPassword,
  onSignOut,
  pastOrders
}) => {
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMessage('');
    try {
      if (mode === 'signup') {
        const signedIn = await onSignUp(nameInput.trim(), emailInput.trim(), password);
        setMessage(signedIn ? 'Account created.' : 'Check your email to confirm your account, then sign in.');
      } else {
        await onSignIn(emailInput.trim(), password);
        setPassword('');
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not access your account.'); }
    finally { setBusy(false); }
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
            <User className="w-5 h-5 text-stone-800" />
            <h2 className="font-serif text-xl font-semibold text-stone-900">
              {currentUser ? 'My Account' : 'Sign In to Bekky’s Touch'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors"
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
              {activeTab === 'profile' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4 p-4 bg-[#FAF9F5] rounded-xl border border-stone-200">
                    <div className="w-12 h-12 rounded-full bg-stone-900 text-white font-serif text-xl flex items-center justify-center font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900">{currentUser.name}</h4>
                      <p className="text-xs text-stone-500">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                        VIP Beauty Club Member
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800 block">Default UK Address:</span>
                        <span>No saved address yet.</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex justify-between items-center">
                    <button
                      onClick={onSignOut}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {pastOrders.length === 0 ? (
                    <div className="text-center py-8 text-stone-500 space-y-2">
                      <Package className="w-8 h-8 mx-auto text-stone-300" />
                      <p className="text-xs">No orders placed yet.</p>
                      <button
                        onClick={onClose}
                        className="text-xs font-semibold text-stone-900 underline"
                      >
                        Start shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {pastOrders.map((ord, idx) => (
                        <div key={idx} className="p-3 border border-stone-200 rounded-xl text-xs space-y-2 bg-[#FAF9F5]">
                          <div className="flex justify-between items-center font-medium">
                            <span className="font-mono font-bold text-stone-900">{ord.orderId}</span>
                            <span className="text-emerald-700 font-semibold">Confirmed</span>
                          </div>
                          <div className="text-stone-500 text-[11px]">
                            {ord.date} · {ord.items.length} items · Total: <strong>£{ord.total.toFixed(2)}</strong>
                          </div>
                          <div className="pt-1 text-[11px] text-stone-600 truncate">
                            Items: {ord.items.map(i => i.name).join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <p className="text-xs text-stone-600">
              Sign in to access your account. Orders placed on this browser appear in the order list.
            </p>

            {mode === 'signup' && <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Your Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                required
                placeholder="Your full name"
              />
            </div>}

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-stone-800"
                placeholder="name@example.com"
              />
            </div>

            <div><label className="block text-xs font-medium text-stone-700 mb-1">Password</label>
              <input type="password" minLength={6} required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs" />
            </div>
            {message && <p role="status" className="text-xs text-stone-700">{message}</p>}
            <button disabled={busy} type="submit" className="w-full py-2.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer mt-2"
            >
              {busy ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
            <button type="button" className="text-xs underline" onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(''); }}>
              {mode === 'signup' ? 'Already registered? Sign in' : 'New here? Create an account'}
            </button>
            <button type="button" className="text-xs underline ml-4" onClick={async () => {
              if (!emailInput.trim()) { setMessage('Enter your email address first.'); return; }
              try { await onResetPassword(emailInput.trim()); setMessage('If this email has an account, a reset link will be sent.'); }
              catch (error) { setMessage(error instanceof Error ? error.message : 'Could not send reset link.'); }
            }}>Forgot password?</button>
          </form>
        )}
      </div>
    </div>
  );
};
