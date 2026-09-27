import React, { useState } from 'react';
import { CartItem, CustomerOrder } from '../types';
import { X, Lock } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedPromo: string | null;
  onOrderSuccess: (order: CustomerOrder) => void;
  currentUser: { name: string; email: string } | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedPromo,
  onOrderSuccess,
  currentUser
}) => {
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    address: '',
    city: '',
    postcode: '',
    phone: ''
  });

  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountPercent = appliedPromo === 'WELCOME10' ? 0.10 : appliedPromo === 'BEKKYTOUCH' ? 0.15 : appliedPromo === 'GLOW20' ? 0.20 : 0;
  const discount = subtotal * discountPercent;
  const shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setIsProcessing(true);
    setError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postcode: formData.postcode.trim(),
          items: items.map(item => ({ product_id: item.id, quantity: item.qty, shade: item.selectedShade })),
          promo_code: appliedPromo || ''
        })
      });
      const data = await response.json();
      if (!response.ok || !data.orderId) throw new Error(data.error || 'Your order could not be placed.');
      onOrderSuccess({
        orderId: data.orderId,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: [...items], subtotal: data.subtotal, discount: data.discount, shipping: 0, total: data.total,
        customer: { name: formData.name, email: formData.email, address: formData.address, city: formData.city, postcode: formData.postcode },
        paymentMethod: 'Offline payment pending'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Your order could not be placed.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-stone-200 bg-[#FAF9F5] flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">Order details</span>
            <h2 className="font-serif text-2xl font-semibold text-stone-900 mt-0.5">Bekky&apos;s Touch Boutique</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Contact & Shipping */}
            <div>
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-3">1. Shipping Address</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Town / City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                      className="w-full bg-[#FAF9F5] border border-stone-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-stone-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 text-sm text-stone-700">
              <h3 className="font-serif text-lg font-semibold text-stone-900 mb-2">2. Payment</h3>
              <p>Place your order now. Payment will be arranged offline; no card details are collected on this website.</p>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-[#FAF9F5] p-5 rounded-xl border border-stone-200 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-stone-900 pb-2 border-b border-stone-200">
                Order Summary ({items.reduce((a, b) => a + b.qty, 0)})
              </h3>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded object-cover border border-stone-200 bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 truncate">{item.name}</p>
                      <p className="text-stone-500 text-[11px] truncate">
                        Qty: {item.qty} {item.selectedShade ? `· ${item.selectedShade}` : ''}
                      </p>
                    </div>
                    <span className="font-semibold text-stone-900 tabular-nums">
                      £{(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900 tabular-nums">£{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-amber-800">
                    <span>Discount</span>
                    <span className="tabular-nums">-£{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Order total</span>
                  <span className="tabular-nums">£{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#1E1B18] text-[#FAF9F5] rounded-xl font-medium text-xs sm:text-sm tracking-wide hover:bg-stone-800 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Placing order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Place order · £{total.toFixed(2)}</span>
                  </>
                )}
              </button>

              {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
