/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Product, CartItem, CustomerOrder } from './types';
import { PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Values } from './components/Values';
import { ShopSection } from './components/ShopSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { ShadeFinderModal } from './components/ShadeFinderModal';
import { PhilosophySection } from './components/PhilosophySection';
import { ReviewsSection } from './components/ReviewsSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { AccountModal } from './components/AccountModal';
import { ImageUploadModal } from './components/ImageUploadModal';
import { Toast } from './components/Toast';
import { restoreUser, signIn, signOut, signUp, resetPassword } from './auth';

export default function App() {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_custom_images');
      if (saved) {
        const overrides: Record<number, string> = JSON.parse(saved);
        return PRODUCTS.map(p => overrides[p.id] ? { ...p, image: overrides[p.id] } : p);
      }
    } catch (e) {
      console.warn('Failed to load custom image overrides', e);
    }
    return PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pastOrders, setPastOrders] = useState<CustomerOrder[]>(() => {
    try {
      const saved = localStorage.getItem('bekkys_touch_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isShadeFinderOpen, setIsShadeFinderOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalTarget, setUploadModalTarget] = useState<'philosophy' | number | null>(null);
  const [philosophyImage, setPhilosophyImage] = useState<string>(() => {
    try {
      return localStorage.getItem('bekkys_touch_philosophy_img') || '/philosophy.jpg';
    } catch {
      return '/philosophy.jpg';
    }
  });
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleUpdateProductImage = async (productId: number, newImageUrl: string) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, image: newImageUrl } : p));
    setCart(prev => prev.map(item => item.id === productId ? { ...item, image: newImageUrl } : item));
    setSelectedProduct(prev => prev && prev.id === productId ? { ...prev, image: newImageUrl } : prev);

    try {
      const saved = localStorage.getItem('bekkys_touch_custom_images');
      const map = saved ? JSON.parse(saved) : {};
      map[productId] = newImageUrl;
      localStorage.setItem('bekkys_touch_custom_images', JSON.stringify(map));
    } catch (e) {
      console.warn('Failed to persist custom image to localStorage', e);
    }

    showToast('Product photo updated successfully!');
  };

  const handleUpdatePhilosophyImage = async (newImageUrl: string) => {
    setPhilosophyImage(newImageUrl);
    try {
      localStorage.setItem('bekkys_touch_philosophy_img', newImageUrl);
    } catch (e) {
      console.warn('Failed to persist philosophy image to localStorage', e);
    }
    showToast('Our Philosophy & Craft photo updated successfully!');
  };

  const handleOpenUploadForProduct = (product: Product) => {
    setUploadModalTarget(product.id);
    setIsUploadModalOpen(true);
  };

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bekkys_touch_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bekkys_touch_orders', JSON.stringify(pastOrders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [pastOrders]);

  useEffect(() => { restoreUser().then(setCurrentUser); }, []);

  // Handle direct hash navigation to #shop
  useEffect(() => {
    if (window.location.hash === '#shop') {
      setTimeout(() => {
        const el = document.getElementById('shop');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleAddToCart = (product: Product, shade?: string, qty: number = 1) => {
    const chosenShade = shade || product.shade;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.selectedShade === chosenShade
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].qty += qty;
        return updated;
      }

      return [
        ...prev,
        {
          ...product,
          qty,
          selectedShade: chosenShade
        }
      ];
    });

    showToast(`Added ${qty}× ${product.name} (${chosenShade}) to bag`);
  };

  const handleUpdateQty = (productId: number, delta: number, shade?: string) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId && item.selectedShade === shade) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: number, shade?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.id === productId && item.selectedShade === shade))
    );
    showToast('Item removed from shopping bag');
  };

  const handleApplyPromo = (code: string): boolean => {
    const valid = ['WELCOME10', 'BEKKYTOUCH', 'GLOW20'];
    if (valid.includes(code.toUpperCase())) {
      setAppliedPromo(code.toUpperCase());
      showToast(`Promo code "${code.toUpperCase()}" applied successfully!`);
      return true;
    }
    return false;
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed');
  };

  const handleAddRoutineToCart = (items: { product: Product; shade: string }[]) => {
    items.forEach(({ product, shade }) => {
      handleAddToCart(product, shade, 1);
    });
    setAppliedPromo('BEKKYTOUCH'); // 15% discount for full routine
    setIsCartOpen(true);
    showToast('Radiant Trio routine added with 15% discount!');
  };

  const handleOrderSuccess = (order: CustomerOrder) => {
    setPastOrders((prev) => [order, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setCompletedOrder(order);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1E1B18]">
      {/* 3-Zone Top Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenShadeFinder={() => setIsShadeFinderOpen(true)}
        onOpenUploadModal={() => {
          setUploadModalTarget(null);
          setIsUploadModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
      />

      <main className="flex-1">
        {/* Campaign Hero */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('shop');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenShadeFinder={() => setIsShadeFinderOpen(true)}
        />

        {/* Trust Pillars */}
        <Values />

        {/* Curated Collection (#shop) */}
        <ShopSection
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, shade) => handleAddToCart(p, shade, 1)}
          onUploadPhoto={handleOpenUploadForProduct}
          onOpenUploadModal={() => {
            setUploadModalTarget(null);
            setIsUploadModalOpen(true);
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Philosophy & Craft */}
        <PhilosophySection
          image={philosophyImage}
          onUploadPhoto={() => {
            setUploadModalTarget('philosophy');
            setIsUploadModalOpen(true);
          }}
        />

        {/* Verified Community Reviews */}
        <ReviewsSection />

        {/* VIP Beauty Club Newsletter */}
        <Newsletter
          onCopyPromo={(code) => {
            handleApplyPromo(code);
            showToast(`Code ${code} activated! Enjoy 10% off at checkout.`);
          }}
        />
      </main>

      {/* Footer */}
      <Footer onOpenShadeFinder={() => setIsShadeFinderOpen(true)} />

      {/* Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onUploadPhoto={handleOpenUploadForProduct}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        appliedPromo={appliedPromo}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={handleRemovePromo}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        appliedPromo={appliedPromo}
        onOrderSuccess={handleOrderSuccess}
        currentUser={currentUser}
      />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
      />

      <ShadeFinderModal
        isOpen={isShadeFinderOpen}
        onClose={() => setIsShadeFinderOpen(false)}
        onAddRoutineToCart={handleAddRoutineToCart}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onSignIn={async (email, password) => {
          const user = await signIn(email, password);
          setCurrentUser(user);
          showToast(`Welcome back, ${user.name}!`);
        }}
        onSignUp={async (name, email, password) => {
          const user = await signUp(name, email, password);
          if (user) setCurrentUser(user);
          return !!user;
        }}
        onResetPassword={resetPassword}
        onSignOut={() => {
          signOut();
          setCurrentUser(null);
          showToast('Signed out of account');
        }}
        pastOrders={pastOrders.filter(order => order.customer.email.toLowerCase() === currentUser?.email.toLowerCase())}
      />

      {/* Exact Product & Philosophy Photo Uploader */}
      <ImageUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        products={products}
        onUpdateProductImage={handleUpdateProductImage}
        onUpdatePhilosophyImage={handleUpdatePhilosophyImage}
        philosophyImage={philosophyImage}
        initialTarget={uploadModalTarget}
      />

      {/* Notification Toast */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
