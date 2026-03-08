'use client';

import { useState, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import { NFTCertificate } from '@/components/nft-certificate';
import { ErrorMessage } from '@/components/error-message';
import { NotFoundPage } from '@/components/not-found-page';
import { RelatedProducts } from '@/components/related-products';
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
import { useProduct } from '@/hooks/useProduct';
import { formatPrice, paiseToRupees } from '@/lib/transformers';
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

  // Fetch product from API
  const { product, loading, error, refetch } = useProduct(id);

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
    if (!product) return;

    const loadCertificate = async () => {
      try {
        const certificate = await blockchainProvenanceService.getProvenanceByProductId(id);
        if (certificate) {
          setNftCertificate(certificate);
        } else {
          // Create a mock certificate for demonstration
          const mockCertificate = await blockchainProvenanceService.createProvenanceRecord({
            productId: id,
            productName: product.title,
            craftType: product.tags[0] || 'Handcraft',
            artisanId: product.artisanId,
            artisanName: product.artisan?.name || 'Artisan',
            giTag: 'GI-RJ-2024-001',
            materialOrigin: [product.artisan?.region || 'India'],
            manufacturingLocation: {
              city: product.artisan?.region?.split(',')[0] || 'Unknown',
              state: product.artisan?.region?.split(',')[1]?.trim() || 'Unknown',
              country: 'India',
            },
            images: product.images.map((img) => img.url),
            attributes: [
              { trait_type: 'Material', value: product.material.join(', ') },
              { trait_type: 'Colors', value: product.colors.join(', ') },
              ...product.tags.map((tag) => ({ trait_type: 'Category', value: tag })),
            ],
          });
          setNftCertificate(mockCertificate);
        }
      } catch (error) {
        console.error('Failed to load NFT certificate:', error);
      }
    };

    loadCertificate();
  }, [id, product]);

  // Handle loading state
  if (loading) {
    return (
      <main className="bg-warm-cream min-h-screen">
        <Navigation scrolled={scrolled} />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center text-warm-charcoal/60">Loading product...</div>
        </div>
        <Footer />
      </main>
    );
  }

  // Handle 404 error
  if (error || !product) {
    return <NotFoundPage />;
  }

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
                src={product.images[0]?.url || '/placeholder.svg'}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.slice(1, 4).map((img, idx) => (
                <button
                  key={idx}
                  className="border-primary aspect-square overflow-hidden rounded-lg border-2"
                >
                  <img
                    src={img.url || '/placeholder.svg'}
                    alt={img.alt || `View ${idx + 2}`}
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
                By {product.artisan?.name || 'Artisan'}
              </p>
              <h1 className="text-warm-charcoal mt-2 font-serif text-4xl font-bold">
                {product.title}
              </h1>

              {/* Rating - using viewCount as proxy for popularity */}
              <div className="mt-4 flex items-center gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-warm-charcoal/20'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-warm-charcoal/60">{product.viewCount} views</span>
              </div>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-baseline gap-4">
                <span className="text-primary text-4xl font-bold">{formatPrice(product.price)}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">
                About This Product
              </h3>
              <p className="text-warm-charcoal/70 leading-relaxed">{product.description}</p>
              
              {product.culturalContext && (
                <div className="mt-4">
                  <h4 className="text-warm-charcoal mb-2 font-semibold">Cultural Context</h4>
                  <p className="text-warm-charcoal/70 leading-relaxed">{product.culturalContext}</p>
                </div>
              )}
              
              {product.artisanStory && (
                <div className="mt-4">
                  <h4 className="text-warm-charcoal mb-2 font-semibold">Artisan Story</h4>
                  <p className="text-warm-charcoal/70 leading-relaxed">{product.artisanStory}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-warm-charcoal mb-4 font-serif text-lg font-bold">Key Features</h3>
              <ul className="space-y-2">
                {product.material.length > 0 && (
                  <li className="text-warm-charcoal/70 flex items-start gap-3">
                    <span className="text-primary mt-1 font-bold">•</span>
                    <span>Materials: {product.material.join(', ')}</span>
                  </li>
                )}
                {product.colors.length > 0 && (
                  <li className="text-warm-charcoal/70 flex items-start gap-3">
                    <span className="text-primary mt-1 font-bold">•</span>
                    <span>Colors: {product.colors.join(', ')}</span>
                  </li>
                )}
                {product.tags.length > 0 && (
                  <li className="text-warm-charcoal/70 flex items-start gap-3">
                    <span className="text-primary mt-1 font-bold">•</span>
                    <span>Categories: {product.tags.join(', ')}</span>
                  </li>
                )}
                <li className="text-warm-charcoal/70 flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span>Handcrafted with traditional techniques</span>
                </li>
                <li className="text-warm-charcoal/70 flex items-start gap-3">
                  <span className="text-primary mt-1 font-bold">•</span>
                  <span>Authenticity guaranteed</span>
                </li>
              </ul>
            </div>

            {/* Artisan Info */}
            <div className="bg-warm-sand/50 rounded-lg p-6">
              <p className="text-warm-charcoal/60 mb-2 text-sm">Handcrafted by</p>
              <h4 className="text-warm-charcoal font-serif text-xl font-bold">
                {product.artisan?.name || 'Artisan'}
              </h4>
              <p className="text-warm-charcoal/60 mt-1">{product.artisan?.region || 'India'}</p>
              {product.artisan?.bio && (
                <p className="text-warm-charcoal/70 mt-2 text-sm">{product.artisan.bio}</p>
              )}
              <Link
                href={`/artisans/${product.artisanId}`}
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
                        removeFromCart(product.id);
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
                disabled={product.status !== 'published'}
                onClick={() => {
                  addToCart(
                    {
                      id: product.id,
                      name: product.title,
                      price: paiseToRupees(product.price),
                      image: product.images[0]?.url || '/placeholder.svg',
                      artisan: product.artisan?.name || 'Artisan',
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
                <p className="text-warm-charcoal/60 text-xs">{product.status === 'published' ? '30 days easy returns' : 'Not available'}</p>
              </div>
              <div className="space-y-2 text-center">
                <Shield className="text-primary mx-auto h-6 w-6" />
                <p className="text-warm-charcoal text-sm font-semibold">Secure</p>
                <p className="text-warm-charcoal/60 text-xs">Authenticity guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts currentProductId={product.id} category={product.tags[0]} />

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
