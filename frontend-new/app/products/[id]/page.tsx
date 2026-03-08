'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { NFTCertificate } from '@/components/nft-certificate';
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  ArrowLeft,
  Trash2,
  Award,
  Mic,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import {
  blockchainProvenanceService,
  type ProvenanceRecord,
} from '@/lib/blockchain-provenance-service';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { addToCart, removeFromCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [nftCertificate, setNftCertificate] = useState<ProvenanceRecord | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Handle scroll for navigation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load NFT certificate for this product
  useEffect(() => {
    const loadCertificate = async () => {
      try {
        const certificate = await blockchainProvenanceService.getProvenanceByProductId(id);
        if (certificate) {
          setNftCertificate(certificate);
        } else {
          // Create a mock certificate for demonstration
          const mockCertificate = await blockchainProvenanceService.createProvenanceRecord({
            productId: id,
            productName: product.name,
            craftType: 'Textile',
            artisanId: product.id.toString(),
            artisanName: product.artisan,
            giTag: 'GI-RJ-2024-001',
            materialOrigin: ['Rajasthan', 'India'],
            manufacturingLocation: {
              city: 'Jaipur',
              state: 'Rajasthan',
              country: 'India',
            },
            images: [product.image],
            attributes: [
              { trait_type: 'Material', value: 'Pure Cotton' },
              { trait_type: 'Technique', value: 'Hand-Woven' },
              { trait_type: 'Color', value: 'Natural Dyes' },
              { trait_type: 'Length', value: '5.5 meters' },
            ],
          });
          setNftCertificate(mockCertificate);
        }
      } catch (error) {
        console.error('Failed to load NFT certificate:', error);
      }
    };

    loadCertificate();
  }, [id]);

  // Mock product data
  const product = {
    id: Number.parseInt(id),
    name: 'Hand-Woven Saree',
    artisan: 'Priya Textiles',
    location: 'Jaipur, Rajasthan',
    price: 4500,
    originalPrice: 5500,
    rating: 4.8,
    reviews: 124,
    image: '/placeholder.svg?key=saree-detail',
    images: [
      '/placeholder.svg?key=saree1',
      '/placeholder.svg?key=saree2',
      '/placeholder.svg?key=saree3',
    ],
    description: `
      This exquisite hand-woven saree showcases the timeless craftsmanship of Jaipur's finest artisans. 
      Made from pure cotton with traditional weaving techniques, each piece is unique and tells a story 
      of generations of expertise. The intricate patterns are created using natural dyes, ensuring 
      eco-friendly and sustainable production.
    `,
    features: [
      'Pure cotton material',
      'Hand-woven with traditional techniques',
      'Natural dyes used',
      'Approximately 5.5 meters in length',
      'Includes matching blouse piece',
      'Dry clean recommended',
    ],
    inStock: true,
    shippingTime: '3-5 business days',
    returnPolicy: '30 days easy returns',
    warranty: 'Authenticity guaranteed',
  };

  return (
    <main className="bg-warm-cream min-h-screen">
      <Navigation scrolled={scrolled} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Button and Voice Search */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-warm-charcoal hover:text-primary group flex items-center gap-2 transition"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="font-semibold">Back to Shop</span>
          </button>

          <Link
            href="/voice"
            className="bg-primary hover:bg-secondary flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white transition"
          >
            <Mic className="h-5 w-5" />
            <span className="hidden sm:inline">Voice Search</span>
          </Link>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="bg-warm-sand aspect-square overflow-hidden rounded-2xl">
              <img
                src={product.image || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className="border-primary aspect-square overflow-hidden rounded-lg border-2"
                >
                  <img
                    src={img || '/placeholder.svg'}
                    alt={`View ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <p className="text-secondary text-sm font-semibold tracking-wide uppercase">
                By {product.artisan}
              </p>
              <h1 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-warm-charcoal/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-warm-charcoal/60">{product.reviews} reviews</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-4">
                <span className="text-primary text-4xl font-bold">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-warm-charcoal/50 text-xl line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">
                About This Product
              </h3>
              <p className="text-warm-charcoal/70 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="text-warm-charcoal/70 flex items-start gap-3">
                    <span className="text-primary mt-1 font-bold">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Artisan Info */}
            <div className="bg-warm-sand/50 rounded-lg p-6">
              <p className="text-warm-charcoal/60 mb-2 text-sm">Handcrafted by</p>
              <h4 className="text-warm-charcoal font-serif text-xl font-bold">{product.artisan}</h4>
              <p className="text-warm-charcoal/60 mt-1">{product.location}</p>
              <Link
                href={`/artisans/${product.id}`}
                className="border-primary text-primary hover:bg-primary mt-4 inline-block rounded-lg border-2 px-6 py-2 font-semibold transition hover:text-white"
              >
                Visit Artisan Profile
              </Link>
            </div>

            {/* Add to Cart */}
            <div className="border-border space-y-4 border-t pt-8">
              {/* Show quantity selector only after first add to cart */}
              {hasAddedToCart && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (quantity === 1) {
                        removeFromCart(product.id.toString());
                        setHasAddedToCart(false);
                        setQuantity(1);
                      } else {
                        setQuantity(quantity - 1);
                      }
                    }}
                    className={`h-12 w-12 rounded-lg border transition ${
                      quantity === 1
                        ? 'border-red-300 text-red-600 hover:bg-red-50'
                        : 'border-border hover:bg-warm-sand text-warm-charcoal'
                    }`}
                  >
                    {quantity === 1 ? <Trash2 className="mx-auto h-5 w-5" /> : '−'}
                  </button>
                  <span className="w-12 text-center text-2xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="border-border hover:bg-warm-sand h-12 w-12 rounded-lg border transition"
                  >
                    +
                  </button>
                </div>
              )}

              <button
                disabled={!product.inStock}
                onClick={() => {
                  addToCart(
                    {
                      id: product.id.toString(),
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      artisan: product.artisan,
                    },
                    quantity
                  );
                  setHasAddedToCart(true);
                }}
                className="bg-accent hover:bg-secondary flex w-full items-center justify-center gap-2 rounded-lg py-4 text-lg font-semibold text-white transition disabled:opacity-50"
              >
                <ShoppingCart className="h-6 w-6" />
                {hasAddedToCart ? 'Add More to Cart' : 'Add to Cart'}
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="border-primary text-primary hover:bg-primary flex w-full items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition hover:text-white"
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
              </button>

              <button className="border-border text-warm-charcoal hover:bg-warm-sand flex w-full items-center justify-center gap-2 rounded-lg border-2 py-3 font-semibold transition">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="border-border grid grid-cols-3 gap-4 border-t pt-8">
              <div className="space-y-2 text-center">
                <Truck className="text-primary mx-auto h-6 w-6" />
                <p className="text-warm-charcoal text-sm font-semibold">Free Shipping</p>
                <p className="text-warm-charcoal/60 text-xs">All orders over ₹500</p>
              </div>
              <div className="space-y-2 text-center">
                <RotateCcw className="text-primary mx-auto h-6 w-6" />
                <p className="text-warm-charcoal text-sm font-semibold">Easy Returns</p>
                <p className="text-warm-charcoal/60 text-xs">{product.returnPolicy}</p>
              </div>
              <div className="space-y-2 text-center">
                <Shield className="text-primary mx-auto h-6 w-6" />
                <p className="text-warm-charcoal text-sm font-semibold">Secure</p>
                <p className="text-warm-charcoal/60 text-xs">{product.warranty}</p>
              </div>
            </div>
          </div>
        </div>

        {/* NFT Certificate Section */}
        {nftCertificate && (
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="text-primary h-8 w-8" />
                <div>
                  <h2 className="text-warm-charcoal font-serif text-2xl font-bold">
                    NFT Certificate of Authenticity
                  </h2>
                  <p className="text-warm-charcoal/60 text-sm">
                    Blockchain-verified provenance and authenticity
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificate(!showCertificate)}
                className="border-primary text-primary hover:bg-primary rounded-lg border-2 px-6 py-2 font-semibold transition hover:text-white"
              >
                {showCertificate ? 'Hide' : 'View'} Certificate
              </button>
            </div>

            {showCertificate && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <NFTCertificate record={nftCertificate} showActions={true} />
              </div>
            )}

            {!showCertificate && (
              <div className="bg-warm-sand/50 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <Shield className="text-primary h-6 w-6" />
                    <div>
                      <p className="text-warm-charcoal text-sm font-semibold">
                        Blockchain Verified
                      </p>
                      <p className="text-warm-charcoal/60 text-xs">
                        {nftCertificate.blockchainNetwork.charAt(0).toUpperCase() +
                          nftCertificate.blockchainNetwork.slice(1)}{' '}
                        Network
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="text-primary h-6 w-6" />
                    <div>
                      <p className="text-warm-charcoal text-sm font-semibold">
                        Certificate #{nftCertificate.certificateNumber}
                      </p>
                      <p className="text-warm-charcoal/60 text-xs">
                        Status: {nftCertificate.verificationStatus}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="text-primary h-6 w-6" />
                    <div>
                      <p className="text-warm-charcoal text-sm font-semibold">
                        Provenance Tracked
                      </p>
                      <p className="text-warm-charcoal/60 text-xs">
                        {nftCertificate.provenance.length} stages verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
