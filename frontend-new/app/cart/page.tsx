'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artisan: string;
  category: string;
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Hand-Woven Saree',
    price: 4500,
    quantity: 1,
    image: '/hand-woven-saree.jpg',
    artisan: 'Priya Textiles',
    category: 'Textiles',
  },
  {
    id: 2,
    name: 'Kundan Necklace',
    price: 8900,
    quantity: 2,
    image: '/kundan-necklace.jpg',
    artisan: 'Meera Jewelry',
    category: 'Jewelry',
  },
  {
    id: 3,
    name: 'Blue Pottery Bowl',
    price: 2800,
    quantity: 1,
    image: '/blue-pottery-bowl.jpg',
    artisan: 'Khurja Crafts',
    category: 'Pottery',
  },
];

export default function CartPage() {
  const [scrolled] = useState(false);
  const [cartItems, setCartItems] = useState(mockCartItems);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 5000 ? 0 : 200;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-8 pt-28 sm:px-6 sm:py-12 sm:pt-32 lg:px-8">
        <div className="mb-8 flex flex-col items-start gap-4 sm:mb-12 sm:flex-row sm:items-center sm:gap-3">
          <ShoppingCart className="text-primary h-7 w-7 sm:h-8 sm:w-8" />
          <h1 className="text-warm-charcoal font-serif text-3xl font-bold sm:text-4xl">
            Shopping Cart
          </h1>
          <span className="bg-primary/10 text-primary ml-auto rounded-full px-3 py-2 text-xs font-semibold sm:px-4 sm:text-sm">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
          </span>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="card-light flex gap-4 p-4 sm:p-5">
                  {/* Image */}
                  <div className="bg-warm-sand h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg sm:h-24 sm:w-24">
                    <img
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-primary mb-1 text-xs font-semibold">{item.category}</p>
                      <h3 className="text-warm-charcoal line-clamp-2 font-serif text-sm font-bold sm:text-lg">
                        {item.name}
                      </h3>
                      <p className="text-warm-charcoal/60 mt-1 text-xs sm:text-sm">
                        {item.artisan}
                      </p>
                    </div>
                    <p className="text-primary mt-2 text-base font-bold sm:text-lg">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-warm-charcoal/60 hover:text-primary transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <div className="bg-warm-sand flex items-center gap-2 rounded-lg px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="hover:bg-warm-cream rounded p-1 transition"
                      >
                        <Minus className="text-warm-charcoal h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="hover:bg-warm-cream rounded p-1 transition"
                      >
                        <Plus className="text-warm-charcoal h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              {/* Summary Card */}
              <div className="card-light sticky top-28 space-y-5 p-5 sm:top-32 sm:p-6">
                <h2 className="text-warm-charcoal font-serif text-lg font-bold sm:text-xl">
                  Order Summary
                </h2>

                <div className="border-border space-y-3 border-b pb-5 sm:pb-6">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-warm-charcoal/60">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-warm-charcoal/60">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-warm-charcoal/60">Tax (5%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between text-base sm:text-lg">
                  <span className="text-warm-charcoal font-bold">Total</span>
                  <span className="text-primary font-bold">₹{total.toLocaleString()}</span>
                </div>

                {subtotal > 5000 && (
                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-primary text-xs font-semibold">FREE SHIPPING</p>
                    <p className="text-primary/70 text-xs">You qualified for free shipping!</p>
                  </div>
                )}

                <button className="bg-primary hover:bg-warm-rust flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button className="border-primary text-primary hover:bg-primary/5 w-full rounded-lg border-2 py-3 font-semibold transition">
                  Continue Shopping
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex gap-3 text-xs sm:text-sm">
                  <Truck className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-warm-charcoal font-semibold">Free shipping over ₹5000</p>
                    <p className="text-warm-charcoal/60 text-xs">On orders above ₹5000</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs sm:text-sm">
                  <Shield className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-warm-charcoal font-semibold">Secure checkout</p>
                    <p className="text-warm-charcoal/60 text-xs">Your data is safe with us</p>
                  </div>
                </div>
                <div className="flex gap-3 text-xs sm:text-sm">
                  <RotateCcw className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="text-warm-charcoal font-semibold">Easy returns</p>
                    <p className="text-warm-charcoal/60 text-xs">30-day return guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center sm:py-16">
            <ShoppingCart className="text-warm-sand mx-auto mb-4 h-12 w-12 sm:h-16 sm:w-16" />
            <h2 className="text-warm-charcoal mb-2 font-serif text-2xl font-bold sm:text-3xl">
              Cart is Empty
            </h2>
            <p className="text-warm-charcoal/60 mb-6 text-sm sm:text-base">
              Add some beautiful handcrafted items to your cart
            </p>
            <a
              href="/shop"
              className="bg-primary hover:bg-warm-rust inline-block rounded-lg px-6 py-3 font-semibold text-white transition"
            >
              Start Shopping
            </a>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
