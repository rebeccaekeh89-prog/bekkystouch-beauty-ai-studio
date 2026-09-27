import React from 'react';

interface FooterProps {
  onOpenShadeFinder: () => void;
  onSelectCategory?: (category: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShadeFinder, onSelectCategory }) => {
  return (
    <footer className="bg-[#151412] text-stone-400 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="font-serif text-2xl font-bold text-white tracking-tight">
              Bekky&apos;s Touch
            </a>
            <p className="text-stone-400 text-xs max-w-sm leading-relaxed">
              Curated beauty essentials designed to enhance natural elegance for every complexion. Proudly cruelty-free, skin-first, and formulated with luxurious botanical integrity.
            </p>
            <p className="text-[11px] text-stone-500 italic">
              London · United Kingdom
            </p>
          </div>

          {/* Column 1: Shop Collections */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Collection
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#shop?category=face"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory?.('FACE');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Complexion &amp; Face
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=lips"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory?.('LIPS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Lip Care &amp; Gloss
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=eyes"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory?.('EYES');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Eyes &amp; Lashes
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=brows"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory?.('BROWS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Brows &amp; Definition
                </a>
              </li>
              <li>
                <a
                  href="#shop?category=tools"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory?.('TOOLS');
                  }}
                  className="hover:text-white transition-colors cursor-pointer block py-0.5"
                >
                  Artisanal Brushes &amp; Tools
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Experience */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Experience
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={onOpenShadeFinder}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Shade Finder Matcher
                </button>
              </li>
              <li>
                <a href="#values" className="hover:text-white transition-colors">
                  Clean Formula Standards
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">
                  Verified Reviews
                </a>
              </li>
              <li>
                <span className="text-stone-500">Beauty Masterclasses (Coming Soon)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
              Support &amp; Care
            </h4>
            <ul className="space-y-2">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Track Your Order
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Shipping &amp; Free Returns
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Sustainability Policy
                </span>
              </li>
              <li>
                <a href="mailto:rebeccaekeh89@gmail.com" className="hover:text-white transition-colors">
                  Contact Bekky&apos;s Team
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Bekky&apos;s Touch Beauty Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Notice</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <span>·</span>
            <span className="hover:text-stone-400 cursor-pointer">Cookie Preferences</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
