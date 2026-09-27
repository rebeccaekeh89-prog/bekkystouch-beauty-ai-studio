import React, { useState } from 'react';
import { ShoppingBag, Search, Sparkles, User, X, Menu, Camera } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAccount: () => void;
  onOpenShadeFinder: () => void;
  onOpenUploadModal?: () => void;
  onSelectCategory?: (category: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: { name: string; email: string } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAccount,
  onOpenShadeFinder,
  onOpenUploadModal,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  currentUser
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E8E4DC] transition-all">
      {/* Slim Top Announcement Banner */}
      {!announcementDismissed && (
        <div className="bg-[#1E1B18] text-[#FAF9F5] text-xs py-2 px-4 flex items-center justify-between transition-all">
          <div className="w-6" />
          <p className="text-center font-medium tracking-wide">
            ✦ Free UK delivery on every order · Use code <span className="underline decoration-amber-400 font-semibold">WELCOME10</span> for 10% off
          </p>
          <button
            onClick={() => setAnnouncementDismissed(true)}
            className="text-stone-400 hover:text-white transition-colors p-1"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Strict 3-Zone Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <a
          href="#"
          className="text-2xl sm:text-3xl font-serif tracking-tight text-[#1E1B18] hover:opacity-80 transition-opacity whitespace-nowrap"
        >
          Bekky&apos;s Touch
        </a>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-700 tracking-wide">
          <a
            href="#shop"
            onClick={(e) => {
              if (onSelectCategory) {
                e.preventDefault();
                onSelectCategory('ALL');
              }
            }}
            className="hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#1E1B18] after:transition-all"
          >
            Shop Collection
          </a>
          <button
            onClick={onOpenShadeFinder}
            className="hover:text-[#1E1B18] transition-colors py-1 flex items-center gap-1.5 text-stone-700 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Shade Finder</span>
          </button>
          <a
            href="#values"
            className="hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#1E1B18] after:transition-all"
          >
            Philosophy
          </a>
          <a
            href="#reviews"
            className="hover:text-[#1E1B18] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#1E1B18] after:transition-all"
          >
            Reviews
          </a>
        </nav>

        {/* Zone 3: 1-2 Primary Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Trigger */}
          <div className="relative">
            {showSearch ? (
              <div className="flex items-center bg-white border border-stone-300 rounded-full px-3 py-1.5 shadow-xs w-48 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search formulas, shades..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none w-full"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setShowSearch(false);
                    onSearchChange('');
                  }}
                  className="text-stone-400 hover:text-stone-700 ml-1 p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100/80 transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account Button */}
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100/80 transition-colors cursor-pointer"
            aria-label="User account"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">
              {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
            </span>
          </button>

          {/* Upload Product Photos Button */}
          {onOpenUploadModal && (
            <button
              onClick={onOpenUploadModal}
              title="Upload exact product photos"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 bg-[#F4EFE6] hover:bg-[#EAE2D5] border border-stone-300 rounded-full transition-colors cursor-pointer shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-stone-700" />
              <span className="hidden md:inline">Upload Photos</span>
            </button>
          )}

          {/* Shopping Bag Button with Badge */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 bg-[#1E1B18] text-[#FAF9F5] rounded-full hover:bg-stone-800 transition-transform active:scale-95 shadow-xs cursor-pointer"
            aria-label={`Shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center tabular-nums">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-[#FAF9F5] px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <a
              href="#shop"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (onSelectCategory) {
                  e.preventDefault();
                  onSelectCategory('ALL');
                }
              }}
              className="block text-sm font-semibold text-stone-900 py-1"
            >
              Shop Collection
            </a>
            <div className="flex flex-wrap gap-1.5 pt-1.5 pb-2">
              {[
                { name: 'All', id: 'ALL' },
                { name: 'Face', id: 'FACE' },
                { name: 'Lips', id: 'LIPS' },
                { name: 'Eyes', id: 'EYES' },
                { name: 'Brows', id: 'BROWS' },
                { name: 'Tools', id: 'TOOLS' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSelectCategory?.(c.id);
                  }}
                  className="text-xs px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenShadeFinder();
            }}
            className="flex items-center gap-2 text-sm font-medium text-stone-800 py-1.5 w-full text-left"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Find Your Shade</span>
          </button>
          <a
            href="#values"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-1.5"
          >
            Our Philosophy
          </a>
          <a
            href="#reviews"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-stone-800 py-1.5"
          >
            Customer Reviews
          </a>
        </div>
      )}
    </header>
  );
};
