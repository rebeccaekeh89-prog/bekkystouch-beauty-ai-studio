import React, { useState, useEffect } from 'react';
import { supabaseUrl, supabasePublishableKey } from '../auth';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigateHome: () => void;
  onOpenShadeFinder: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigateHome,
  onOpenShadeFinder
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('Order & Shipping Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = "Contact Client Services | Bekky's Touch Beauty";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        "Contact Bekky's Touch Beauty using our private enquiry form for product questions and order support."
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(email.trim()) || message.trim().length < 10) {
      setErrorMessage('Please enter your name, a valid email address, and a message of at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/contact_messages`, {
        method: 'POST',
        headers: {
          apikey: supabasePublishableKey,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: null,
          order_number: orderNumber.trim() || null,
          subject,
          message: message.trim()
        })
      });
      if (!response.ok) throw new Error('We could not receive your message. Please try again.');
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'We could not receive your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-stone-800">
      <section className="pt-16 sm:pt-20 pb-8 text-center px-4">
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-stone-900">Contact Us</h1>
        <p className="mt-4 text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
          Have a question about an order or a product? Send us a message below.
        </p>
      </section>

      {/* Main Content */}
      <section className="pb-16 sm:pb-24 px-4 sm:px-6">
        <div className="w-full max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-10">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-stone-900">
                    Message Received
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    Thank you for getting in touch. Your message has been received. Please allow time for a reply.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">

                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setOrderNumber('');
                        setMessage('');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-stone-900">
                      Send a Message
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Complete the fields below to send your message. We will reply to the email address you provide.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Eleanor Vance"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. eleanor@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                      >
                        <option value="Order & Shipping Inquiry">Order &amp; Shipping Inquiry</option>
                        <option value="Shade Match Recommendation">Shade Match Recommendation</option>
                        <option value="Product Ingredients & Clean Beauty">Product Ingredients &amp; Clean Beauty</option>
                        <option value="VIP Beauty Club & Perks">VIP Beauty Club &amp; Perks</option>
                        <option value="General Question">General Question</option>
                      </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Order Number <span className="text-stone-400 font-normal">(Optional)</span></label>
                    <input type="text" maxLength={80} value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="If your question is about an order" className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know how we can help you..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all resize-y"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-[11px] text-stone-400">
                      Your details are used to respond to this enquiry.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
        </div>
      </section>
    </div>
  );
};
