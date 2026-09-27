import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface OurStoryPageProps {
  onNavigateHome: () => void;
  onOpenShadeFinder: () => void;
  onSelectCategory?: (category: string) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigateHome, onOpenShadeFinder }) => {
  useEffect(() => {
    document.title = "Our Story | Bekky's Touch Beauty";
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      "Discover the products and beauty philosophy behind Bekky's Touch Beauty.");
  }, []);
  return <div className="bg-[#FAF9F5] min-h-screen text-stone-800">
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#F4EFE6] to-[#FAF9F5] text-center px-4">
      <h1 className="font-serif text-4xl sm:text-6xl font-semibold">Our Story</h1>
      <p className="mt-6 max-w-2xl mx-auto text-stone-600 leading-relaxed">Bekky's Touch Beauty brings together beauty essentials for different complexions. Explore the collection, find a shade that suits you, and make each look your own.</p>
    </section>
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
      <img src="/Philosophy.png" alt="Bekky's Touch Beauty collection" className="w-full rounded-3xl object-cover" />
      <div><h2 className="font-serif text-3xl mb-5">Beauty, your way</h2>
        <p className="text-stone-600 leading-relaxed mb-5">From complexion products to colour and finishing touches, our collection is here to help you choose what feels right for you.</p>
        <p className="text-stone-600 leading-relaxed mb-7">Choose the products and shades that fit your style. Browse the collection, explore the finishes, and build a beauty routine that feels like yours.</p>
        <div className="flex flex-wrap gap-3"><button onClick={onNavigateHome} className="px-6 py-3 bg-[#1E1B18] text-white rounded-xl flex items-center gap-2">Explore the collection <ArrowRight size={16}/></button><button onClick={onOpenShadeFinder} className="px-6 py-3 border border-stone-300 rounded-xl">Find your shade</button></div>
      </div>
    </section>
  </div>;
};
