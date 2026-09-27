import React, { useEffect } from 'react';
import { ArrowRight, Heart, Sparkles } from 'lucide-react';

interface OurStoryPageProps {
  onNavigateHome: () => void;
  onOpenShadeFinder: () => void;
  onSelectCategory?: (category: string) => void;
}

export const OurStoryPage: React.FC<OurStoryPageProps> = ({ onNavigateHome, onOpenShadeFinder }) => {
  useEffect(() => {
    document.title = "Our Story | Bekky's Touch Beauty";
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      "Get to know Bekky's Touch Beauty: beauty essentials, shades and finishing touches for a look that feels like you."
    );
  }, []);

  const explore = () => {
    onNavigateHome();
    window.setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-stone-900">
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <img
          src="/Philosophy.png"
          alt="The Bekky's Touch Beauty collection"
          className="aspect-[4/5] w-full rounded-3xl object-cover shadow-sm"
        />
        <div>
          <span className="text-sm font-semibold uppercase tracking-widest text-amber-900">Our Story</span>
          <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">Beauty that feels like you.</h1>
          <p className="mt-4 text-lg font-medium text-amber-950">Your shade. Your mood. Your moment.</p>
          <p className="mt-6 text-base leading-relaxed text-stone-700">
            A little colour can change your mood. A favourite shade can make you feel ready for anything. At Bekky’s Touch Beauty, we believe those moments belong to everyone.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            Beauty is personal. Some mornings you want a quick, fresh look; other days, you want to have fun with colour. There’s no single “right” way to show up as yourself.
          </p>
          <p className="mt-4 text-base leading-relaxed text-stone-700">
            That idea is at the heart of Bekky’s Touch. Our collection brings together complexion products, colour and finishing touches so you can explore what suits your skin, your style and your day.
          </p>
          <p className="mt-6 font-serif text-xl italic text-amber-950">A touch of beauty. A whole lot of you.</p>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-amber-900">What matters to us</span>
            <h2 className="mt-3 font-serif text-3xl font-semibold sm:text-4xl">Your routine. Your rules.</h2>
            <p className="mt-4 text-base leading-relaxed text-stone-700">Start with one favourite or build a whole new look. Make it yours.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6">
              <Heart className="h-6 w-6 text-amber-900" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold">Feel like yourself</h3>
              <p className="mt-2 text-base leading-relaxed text-stone-700">Makeup can be a small act of self-expression. Wear what makes you feel comfortable and confident.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6">
              <Sparkles className="h-6 w-6 text-amber-900" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold">Find your fit</h3>
              <p className="mt-2 text-base leading-relaxed text-stone-700">Explore shades and finishes at your own pace. Your favourite look is the one you enjoy wearing.</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-[#FAF9F5] p-6">
              <ArrowRight className="h-6 w-6 text-amber-900" aria-hidden="true" />
              <h3 className="mt-4 font-serif text-xl font-semibold">Keep it simple</h3>
              <p className="mt-2 text-base leading-relaxed text-stone-700">From an everyday essential to a finishing touch, choose what works for your routine.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="rounded-3xl bg-[#1E1B18] px-6 py-10 text-center text-white sm:px-12 sm:py-14">
          <h2 className="font-serif text-3xl font-semibold sm:text-4xl">Ready to make it yours?</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-stone-200">Your next favourite could be one shade away. Take a look around or find a place to start.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={explore} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-stone-900 hover:bg-stone-100">
              Explore the collection <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={onOpenShadeFinder} className="rounded-xl border border-stone-400 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Find your shade</button>
          </div>
        </div>
      </section>
    </div>
  );
};
