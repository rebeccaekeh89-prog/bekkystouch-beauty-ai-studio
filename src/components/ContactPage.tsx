import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

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
  const [phone, setPhone] = useState('');
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
        "Contact Bekky's Touch Beauty by email for product questions and order support."
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in your name, email address, and message.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 10) {
      setErrorMessage('Please write a message with at least 10 characters so we can best assist you.');
      return;
    }

    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const mailtoLink = `mailto:rebeccaekeh89@gmail.com?subject=${encodeURIComponent(
    `[Bekky's Touch] ${subject} from ${name || 'Customer'}`
  )}&body=${encodeURIComponent(
    `Hello Bekky's Touch Team,\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nInquiry Type: ${subject}\n\nMessage:\n${message}\n`
  )}`;

  return (
    <div className="bg-[#FAF9F5] min-h-screen text-stone-800">
      {/* Header */}
      <section className="py-16 sm:py-20 border-b border-[#ECE7DE] bg-gradient-to-b from-[#F4EFE6] to-[#FAF9F5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200 text-amber-950 text-xs font-semibold uppercase tracking-widest shadow-2xs mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Client Services &amp; Concierge</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-stone-900 tracking-tight">
            We are here to assist you.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-stone-600 max-w-xl mx-auto leading-relaxed font-light">
            Have a question about an order or a product? Get in touch by email.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-stone-900">
                Contact Details
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                Connect directly with our client care team for boutique support and recommendations.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Card */}
              <div className="p-5 bg-white rounded-2xl border border-stone-200/90 shadow-xs flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 border border-amber-200/80 flex items-center justify-center text-amber-900 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-stone-900">Direct Email</h3>
                  <a
                    href="mailto:rebeccaekeh89@gmail.com"
                    className="text-xs text-amber-900 hover:text-amber-950 underline font-medium block mt-0.5 break-all"
                  >
                    rebeccaekeh89@gmail.com
                  </a>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Please allow time for a reply.
                  </p>
                </div>
              </div>

              {/* Shade Match Callout */}
              <div className="p-5 bg-[#FAF4EA] rounded-2xl border border-[#E9DFCE] text-amber-950 flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-sm font-semibold">Unsure of your shade?</h3>
                  <p className="text-xs text-amber-900/80 mt-1">
                    Take our 60-second Shade Finder Matcher to discover your complexion match.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenShadeFinder}
                  className="px-3 py-1.5 bg-[#1E1B18] text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
                >
                  Find Shade
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-10">
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-stone-900">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
                    Your email app should open with your message. Please press Send there to contact us.
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={mailtoLink}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#FAF9F5] border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-stone-600" />
                      <span>Open in Mail Client</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setPhone('');
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
                      Complete the fields below and our team will get back to you promptly.
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Contact Phone <span className="text-stone-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="w-full px-3.5 py-2.5 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 transition-all"
                      />
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
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Message <span className="text-rose-500">*</span>
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
                      Inquiries are directed to <span className="text-stone-600 font-medium">rebeccaekeh89@gmail.com</span>
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
        </div>
      </section>
    </div>
  );
};
