"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const buyCategories = [
  { label: "All Categories" },
  { label: "Products" },
  { label: "Blog" },
  { label: "Contact" },
  { label: "Limited Sale" },
  { label: "Best Seller" },
  { label: "New Arrivals" },
];

type BuyFeatureIconType = "responsive" | "secure" | "shipping" | "transparent";

const buyFeatures: Array<{ icon: BuyFeatureIconType; title: string; subtitle: string }> = [
  { icon: "responsive", title: "Responsive", subtitle: "Customer service available 24/7" },
  { icon: "secure", title: "Secure", subtitle: "Certified marketplace since 2017" },
  { icon: "shipping", title: "Shipping", subtitle: "Fast, safe, and reliable worldwide" },
  { icon: "transparent", title: "Transparent", subtitle: "Hassle-free return policy" },
];

type BuyProduct = {
  id: string;
  name: string;
  image: string;
  badge: string;
  price: string;
  unitPriceCents: number;
};

type CartItem = {
  product: BuyProduct;
  qty: number;
};

const buyProducts: BuyProduct[] = [
  { id: "phone", name: "Phone", image: "/phone.jpg", badge: "", price: "$899.00", unitPriceCents: 899_00 },
  { id: "audio", name: "Audio", image: "/audio.jpg", badge: "50%", price: "$149.00", unitPriceCents: 149_00 },
  { id: "laptop", name: "Laptop", image: "/laptop.jpg", badge: "", price: "$1,299.00", unitPriceCents: 129_900 },
  { id: "camera", name: "Camera", image: "/camera.jpg", badge: "", price: "$79.00", unitPriceCents: 79_00 },
  { id: "television", name: "Television", image: "/television.jpg", badge: "", price: "$599.00", unitPriceCents: 599_00 },
  { id: "tablet", name: "Tablet", image: "/tablet.jpg", badge: "", price: "$399.00", unitPriceCents: 399_00 },
  { id: "watch", name: "Watch", image: "/watch.jpg", badge: "", price: "$199.00", unitPriceCents: 199_00 },
  { id: "speaker", name: "Speaker", image: "/speaker.jpg", badge: "", price: "$89.00", unitPriceCents: 89_00 },
  { id: "keyboard", name: "Keyboard", image: "/keyboard.jpg", badge: "", price: "$49.00", unitPriceCents: 49_00 },
  { id: "mouse", name: "Mouse", image: "/mouse.jpg", badge: "", price: "$29.00", unitPriceCents: 29_00 },
];

const licenseBullets = [
  "Quality checked by Stackly before delivery.",
  "Stackly provides licenses ranging from 1 month to 1 year.",
  "Secure checkout and instant confirmation by email.",
];

const NAVY = "#06224C";

/** Fits ~1–5 cards in one row from track width (zoom / resize safe). */
function getCarouselColumnCount(widthPx: number): number {
  if (!widthPx || widthPx <= 0) return 1;
  const gapPx = 16;
  const minCardPx = 148;
  const n = Math.floor((widthPx + gapPx) / (minCardPx + gapPx));
  return Math.max(1, Math.min(5, n));
}

function formatUsd(cents: number): string {
  const n = cents / 100;
  const parts = n.toFixed(2).split(".");
  const intPart = parts[0] ?? "0";
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `$ ${withCommas}.${parts[1] ?? "00"}`;
}

function BuyProductActionButtons({
  isFavorite,
  onCartClick,
  onFavoriteClick,
  onShareClick,
  compact,
}: {
  isFavorite: boolean;
  onCartClick: () => void;
  onFavoriteClick: () => void;
  onShareClick: () => void;
  compact?: boolean;
}) {
  const size = compact ? "h-6 w-6 sm:h-6 sm:w-6" : "h-7 w-7 sm:h-8 sm:w-8";
  const shadow = compact ? "shadow-sm" : "shadow-md";
  const base =
    `flex shrink-0 items-center justify-center rounded-full border-2 border-[#ff664f] transition-colors duration-150 ${size} ${shadow}`;
  const inactive = `${base} bg-white text-[#ff664f] hover:bg-[#ff664f] hover:text-white`;
  const favoriteActive = `${base} bg-[#ff664f] text-white hover:bg-[#ff664f] hover:text-white`;
  const favoriteBtn = isFavorite ? favoriteActive : inactive;
  const icon = compact ? 11 : 14;
  return (
    <>
      <button type="button" className={inactive} aria-label="Add to cart" onClick={(e) => {
        e.stopPropagation();
        onCartClick();
      }}>
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L20.6 7H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="10" cy="19" r="1.5" fill="currentColor" />
          <circle cx="17" cy="19" r="1.5" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        className={favoriteBtn}
        aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={isFavorite}
        onClick={(e) => {
          e.stopPropagation();
          onFavoriteClick();
        }}
      >
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 5.876 9.623 4.75 7.688 4.75 5.099 4.75 3 6.765 3 9.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isFavorite ? "currentColor" : "none"}
          />
        </svg>
      </button>
      <button
        type="button"
        className={inactive}
        aria-label="Share product"
        onClick={(e) => {
          e.stopPropagation();
          onShareClick();
        }}
      >
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <circle cx="18" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="18" cy="19" r="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="m15.5 6.5-7 3.5M8.5 13.5l7 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke={NAVY} strokeWidth="1.5" />
      <path d="m8 12 2.5 2.5L16 9" stroke={NAVY} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BuyScreenPage() {
  const [activeProductStart, setActiveProductStart] = useState(0);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [licenseProduct, setLicenseProduct] = useState<BuyProduct | null>(null);
  const [licenseQty, setLicenseQty] = useState(1);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const featuredProductsRef = useRef<HTMLElement | null>(null);
  const productsViewportRef = useRef<HTMLDivElement | null>(null);
  const [carouselCols, setCarouselCols] = useState(3);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const searchFilteredProducts = normalizedSearchQuery
    ? buyProducts.filter((product) => product.name.toLowerCase().includes(normalizedSearchQuery))
    : buyProducts;
  const totalProducts = searchFilteredProducts.length;
  const isSearching = normalizedSearchQuery.length > 0;
  const isCarouselMode = !showAllProducts && !isSearching;
  const visibleProductCount = isCarouselMode ? carouselCols : Number.POSITIVE_INFINITY;
  const visibleBuyProducts = totalProducts
    ? Array.from({ length: Math.min(visibleProductCount, totalProducts) }, (_, offset) => {
        const index = (activeProductStart + offset) % totalProducts;
        return searchFilteredProducts[index];
      })
    : [];
  const displayedProducts = isSearching || showAllProducts ? searchFilteredProducts : visibleBuyProducts;

  const closeLicenseModal = useCallback(() => {
    setLicenseProduct(null);
    setLicenseQty(1);
  }, []);

  const openLicenseModal = useCallback((product: BuyProduct) => {
    setLicenseProduct(product);
    setLicenseQty(1);
  }, []);

  const confirmLicensePurchase = useCallback(() => {
    if (!licenseProduct) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === licenseProduct.id);
      if (existing) {
        return prev.map((item) => (item.product.id === licenseProduct.id ? { ...item, qty: item.qty + licenseQty } : item));
      }
      return [...prev, { product: licenseProduct, qty: licenseQty }];
    });
    closeLicenseModal();
  }, [licenseProduct, licenseQty, closeLicenseModal]);

  const removeCartItem = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  }, []);

  const showActionToast = useCallback((message: string) => {
    setActionToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setActionToast(null);
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  const toggleFavorite = useCallback(
    (product: BuyProduct) => {
      const isFavorite = favoriteProductIds.includes(product.id);
      setFavoriteProductIds((prev) => (isFavorite ? prev.filter((id) => id !== product.id) : [...prev, product.id]));
      showActionToast(isFavorite ? `${product.name} removed from favorites` : `${product.name} added to favorites`);
    },
    [favoriteProductIds, showActionToast]
  );

  const shareProduct = useCallback(
    async (product: BuyProduct) => {
      const shareUrl = `${window.location.origin}/buyscreen?product=${encodeURIComponent(product.id)}`;
      try {
        if (navigator.share) {
          await navigator.share({
            title: product.name,
            text: `Check out this product: ${product.name}`,
            url: shareUrl,
          });
          showActionToast(`${product.name} shared`);
          return;
        }
        await navigator.clipboard.writeText(shareUrl);
        showActionToast(`Share link copied for ${product.name}`);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        showActionToast("Unable to share right now");
      }
    },
    [showActionToast]
  );

  useEffect(() => {
    if (!licenseProduct && !isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (licenseProduct) closeLicenseModal();
      if (isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [licenseProduct, isCartOpen, closeLicenseModal]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (!isCarouselMode) return;
    const el = productsViewportRef.current;
    if (!el) return;
    const measure = () => {
      setCarouselCols(getCarouselColumnCount(el.getBoundingClientRect().width));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isCarouselMode]);

  function moveProducts(direction: number) {
    if (!totalProducts) return;
    setActiveProductStart((prev) => (prev + direction + totalProducts) % totalProducts);
  }

  function BuyFeatureIcon({ type }: { type: BuyFeatureIconType }) {
    if (type === "responsive") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M4 13a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 13v3a2 2 0 0 0 2 2h1v-5H7a2 2 0 0 0-2 2Zm14 0h-1v5h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2" />
          <path d="M12 17v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    }
    if (type === "secure") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 3 5 6v6c0 4.2 2.6 7.2 7 9 4.4-1.8 7-4.8 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (type === "shipping") {
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M3 7h11v8H3V7Zm11 2h4l3 3v3h-7V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="17" r="1.5" fill="currentColor" />
          <circle cx="18" cy="17" r="1.5" fill="currentColor" />
        </svg>
      );
    }
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 12a9 9 0 0 1 15.4-6.4M21 12a9 9 0 0 1-15.4 6.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16.5 3.5v3h3M7.5 20.5v-3h-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  const productGridClass = showAllProducts || isSearching
    ? "buyscreen-products--grid grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5"
    : "buyscreen-products--carousel";
  const carouselSlots = isCarouselMode ? Math.max(1, displayedProducts.length) : 1;

  const lineTotalCents = licenseProduct ? licenseProduct.unitPriceCents * licenseQty : 0;
  const cartTotalCents = cartItems.reduce((sum, item) => sum + item.product.unitPriceCents * item.qty, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="buyscreen-page min-h-[100dvh] overflow-x-hidden bg-[#efefef] text-[#111827]">
      {licenseProduct ? (
        <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6">
          <button
            type="button"
            className="fixed inset-0 bg-black/45 backdrop-blur-[1px]"
            aria-label="Close dialog"
            onClick={closeLicenseModal}
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="buyscreen-license-title"
            className="relative z-10 my-auto flex max-h-[min(90dvh,720px)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl sm:max-h-[85dvh]"
          >
            <div className="shrink-0 border-b border-[#eef2f7] p-6 pb-4 sm:p-8 sm:pb-4">
              <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="buyscreen-license-title" className="text-base font-semibold sm:text-lg" style={{ color: NAVY }}>
                  Regular license
                </h2>
                <p className="mt-1 text-xs text-[#6b7280]">
                  {licenseProduct.name} · {licenseProduct.price} each
                </p>
              </div>
              <p className="text-lg font-bold tabular-nums sm:text-xl" style={{ color: NAVY }}>
                {formatUsd(lineTotalCents)}
              </p>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-5 sm:px-8 sm:pb-8">
              <ul className="space-y-3 text-sm text-[#374151]">
              {licenseBullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <CheckIcon />
                  <span className="leading-snug">{line}</span>
                </li>
              ))}
              </ul>

              <div
                className="mt-6 grid grid-cols-[auto,1fr,auto] items-center gap-3 overflow-hidden rounded-full border-2 p-2 sm:px-3"
                style={{ borderColor: NAVY }}
              >
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ backgroundColor: NAVY }}
                aria-label="Decrease quantity"
                disabled={licenseQty <= 1}
                onClick={() => setLicenseQty((q) => Math.max(1, q - 1))}
              >
                <span className="text-lg font-light leading-none">−</span>
              </button>
              <div className="min-w-0 rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-3 py-1.5 text-center text-lg font-semibold tabular-nums text-[#0f172a]">
                {licenseQty}
              </div>
              <button
                type="button"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: NAVY }}
                aria-label="Increase quantity"
                onClick={() => setLicenseQty((q) => q + 1)}
              >
                <span className="text-lg font-light leading-none">+</span>
              </button>
              </div>

              <button
                type="button"
                className="mt-6 w-full rounded-xl py-3.5 text-center text-sm font-bold text-white transition-opacity hover:opacity-95 sm:text-base"
                style={{ backgroundColor: NAVY }}
                onClick={confirmLicensePurchase}
              >
                Confirm To Buy
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {isCartOpen ? (
        <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto overscroll-contain p-4 sm:items-center sm:p-6">
          <button type="button" className="fixed inset-0 bg-black/45 backdrop-blur-[1px]" aria-label="Close cart" onClick={() => setIsCartOpen(false)} />
          <div
            role="dialog"
            aria-modal
            aria-labelledby="buyscreen-cart-title"
            className="relative z-10 my-auto flex max-h-[min(90dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-2xl sm:max-h-[85dvh]"
          >
            <div className="shrink-0 border-b border-[#eef2f7] p-6 pb-4 sm:p-8 sm:pb-4">
              <div className="flex items-center justify-between gap-3">
                <h2 id="buyscreen-cart-title" className="text-lg font-semibold text-[#06224C]">
                  Your cart
                </h2>
                <p className="text-sm font-bold tabular-nums text-[#06224C]">{formatUsd(cartTotalCents)}</p>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
              {cartItems.length ? (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#e5e7eb] bg-[#fafafa] px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-semibold text-[#111827]">{item.product.name}</p>
                        <p className="text-xs text-[#6b7280]">
                          {item.product.price} x {item.qty}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-bold tabular-nums text-[#111827]">{formatUsd(item.product.unitPriceCents * item.qty)}</span>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.product.id)}
                          className="rounded-md border border-[#fecaca] px-2 py-1 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-4 text-sm text-[#6b7280]">
                  Your cart is empty. Add products from Featured Products.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
        <div className="mb-6 flex justify-end sm:mb-8">
          <button
            type="button"
            className="rounded-md bg-[#171717] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Buy Now
          </button>
        </div>

        <section className="buyscreen-shell overflow-hidden rounded-lg border border-[#d9d9d9] bg-white shadow-sm">
          <header className="buyscreen-header flex flex-col gap-4 border-b border-[#ededed] px-4 py-4 sm:px-8 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4">
            <div className="flex shrink-0 items-center justify-between lg:justify-start">
              <span className="text-base font-bold tracking-tight text-[#2b2b2b] sm:text-lg">e-shop.</span>
            </div>

            <div className="buyscreen-header-actions flex w-full min-w-0 items-center justify-end gap-2 text-[#4b5563] sm:gap-3 lg:w-auto">
              <label className="buyscreen-search flex h-8 w-[150px] items-center rounded-md border-2 border-[#cbd5e1] bg-[#fafafa] px-2 text-[11px] text-[#4b5563] sm:h-9 sm:w-[180px] sm:text-xs">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setSearchQuery(nextValue);
                    setActiveProductStart(0);
                    setShowAllProducts(false);
                    if (nextValue.trim()) {
                      featuredProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  placeholder="Search..."
                  className="min-w-0 flex-1 bg-transparent text-[#4b5563] outline-none placeholder:text-[#9ca3af]"
                />
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#374151]" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </label>
              <div className="buyscreen-header-trailing flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
                <button type="button" className="buyscreen-cart-trigger flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-[#f5f5f5]" onClick={() => setIsCartOpen(true)}>
                  <span className="relative shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L20.6 7H7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="10" cy="19" r="1.5" fill="currentColor" />
                      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
                    </svg>
                    {cartItemCount > 0 ? (
                      <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ff664f] px-1 text-[10px] font-bold leading-none text-white">
                        {cartItemCount}
                      </span>
                    ) : null}
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[11px] font-semibold sm:text-xs">Cart</span>
                    <span className="block text-[11px] tabular-nums sm:text-xs">{cartItems.length ? formatUsd(cartTotalCents) : "Empty"}</span>
                  </span>
                </button>
                <span className="h-6 w-px shrink-0 bg-[#d1d5db]" aria-hidden />
                <div className="buyscreen-user-summary flex min-w-0 items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
                    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M5.8 19.2c1.1-2.5 3.3-3.8 6.2-3.8s5.1 1.3 6.2 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  <span className="min-w-0 leading-tight">
                    <span className="block text-[11px] font-semibold sm:text-xs">User</span>
                    <span className="block text-[11px] sm:text-xs">Account</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          <nav className="buyscreen-categories border-b border-[#efefef] bg-[#06224C] px-4 py-2.5 text-[10px] font-semibold text-white sm:px-8 sm:text-xs">
            <div className="flex items-center justify-end lg:hidden">
              <button
                type="button"
                aria-expanded={isCategoryMenuOpen}
                aria-controls="buyscreen-category-menu"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-2.5 py-1.5 text-[11px] font-semibold text-white transition-colors duration-150 hover:bg-white hover:text-[#06224C]"
                onClick={() => setIsCategoryMenuOpen((prev) => !prev)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Menu
              </button>
            </div>
            <div
              id="buyscreen-category-menu"
              className={`buyscreen-categories-list ${isCategoryMenuOpen ? "buyscreen-categories-list--open" : ""}`}
            >
              {buyCategories.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`buyscreen-category-item shrink-0 rounded-md text-left transition-colors duration-150 hover:bg-white hover:text-[#06224C] ${item.label === "Limited Sale" ? "lg:ml-auto" : ""}`}
                  onClick={() => setIsCategoryMenuOpen(false)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="space-y-10 px-4 py-10 sm:space-y-12 sm:px-8 sm:py-12">
            <section className="buyscreen-hero relative flex min-h-[320px] items-center overflow-hidden rounded-xl border border-[#efefef] p-6 sm:min-h-[380px] sm:p-8 lg:p-10">
              <Image
                src="/background.png"
                alt=""
                fill
                className="object-fill object-center"
                unoptimized
                priority
              />
              <div className="buyscreen-hero-content relative z-10 min-w-0 max-w-xl text-center lg:text-left">
                <h1 className="text-2xl font-bold leading-tight text-[#171717] sm:text-3xl lg:text-4xl">
                  Your One-Stop Electronic Market
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white sm:text-base lg:mx-0">
                  Welcome to e-shop, a place where you can buy everything about electronics. Sale every day.
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-md bg-[#06224C] px-5 py-2.5 text-sm font-semibold text-white"
                  onClick={() => featuredProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  Shop Now
                </button>
              </div>
            </section>

            <section className="buyscreen-features grid gap-6 border-b border-[#efefef] pb-10 text-sm text-[#4b5563] sm:grid-cols-2 sm:gap-8 lg:flex lg:items-start lg:justify-between">
              {buyFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-4">
                  <span aria-hidden className="mt-0.5 shrink-0 text-[#6b7280]">
                    <BuyFeatureIcon type={feature.icon} />
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-[#111827]">{feature.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-[#6b7280] sm:text-sm">{feature.subtitle}</p>
                  </div>
                </div>
              ))}
            </section>

            <section ref={featuredProductsRef}>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-[#111827] sm:text-xl">Featured Products</h2>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#ff664f] hover:opacity-90"
                  onClick={() => setShowAllProducts(true)}
                >
                  {showAllProducts ? "All Products" : "View All"}
                  {!showAllProducts ? (
                    <span className="text-base" aria-hidden>
                      →
                    </span>
                  ) : null}
                </button>
              </div>

              <div className="buyscreen-products-row flex items-center gap-2 sm:gap-4">
                {!showAllProducts && !isSearching ? (
                  <button type="button" className="buyscreen-products-arrow shrink-0" aria-label="Previous products" onClick={() => moveProducts(-1)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M11.2 7.3 8.4 10l2.8 2.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : null}
                <div ref={productsViewportRef} className="min-w-0 flex-1 overflow-hidden">
                  <div
                    className={`buyscreen-products min-w-0 ${productGridClass}`}
                    style={
                      isCarouselMode
                        ? ({
                            ["--buyscreen-carousel-slots" as string]: String(carouselSlots),
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                  {displayedProducts.map((product, index) => (
                    <article
                      key={`${product.id}-${index}`}
                      className="buyscreen-product-card group relative flex min-w-0 flex-col rounded-lg border border-[#ececec] bg-white p-2 shadow-sm transition-[box-shadow,border-color] duration-200 hover:border-[#d4d4d4] hover:shadow-lg sm:p-3"
                    >
                      <div className="buyscreen-product-image-wrap relative aspect-[4/3] w-full overflow-hidden rounded-md bg-white">
                        <div
                          className="absolute inset-2 rounded-sm bg-white bg-contain bg-center bg-no-repeat"
                          style={{
                            backgroundImage: `url('${product.image}')`,
                          }}
                        />
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden justify-center px-1 pb-2 pt-6 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 lg:flex">
                          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
                            <BuyProductActionButtons
                              compact={false}
                              isFavorite={favoriteProductIds.includes(product.id)}
                              onCartClick={() => openLicenseModal(product)}
                              onFavoriteClick={() => toggleFavorite(product)}
                              onShareClick={() => {
                                void shareProduct(product);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="buyscreen-product-actions-mobile grid grid-cols-3 place-items-center gap-0.5 overflow-hidden border-t border-[#f3f4f6] px-0.5 py-1 lg:hidden">
                        <BuyProductActionButtons
                          compact
                          isFavorite={favoriteProductIds.includes(product.id)}
                          onCartClick={() => openLicenseModal(product)}
                          onFavoriteClick={() => toggleFavorite(product)}
                          onShareClick={() => {
                            void shareProduct(product);
                          }}
                        />
                      </div>
                      <div className="buyscreen-product-meta mt-2 min-w-0 px-0.5 sm:mt-3">
                        {product.badge ? (
                          <p className="mb-1 text-center">
                            <span className="inline-block rounded bg-[#ff664f] px-2 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm">{product.badge}</span>
                          </p>
                        ) : null}
                        <p className="text-center text-[10px] font-semibold uppercase leading-snug tracking-tight text-[#6b7280] [overflow-wrap:anywhere] sm:text-xs sm:leading-normal sm:tracking-[0.06em] md:tracking-[0.08em]">
                          {product.name}
                        </p>
                        <p className="mt-1 text-center text-xs font-bold leading-snug tracking-tight text-[#171717] [overflow-wrap:anywhere] tabular-nums sm:text-sm">
                          {product.price}
                        </p>
                      </div>
                    </article>
                  ))}
                  </div>
                </div>
                {!showAllProducts && !isSearching ? (
                  <button type="button" className="buyscreen-products-arrow shrink-0" aria-label="Next products" onClick={() => moveProducts(1)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M8.8 7.3 11.6 10l-2.8 2.7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ) : null}
              </div>
              {!displayedProducts.length ? (
                <p className="mt-4 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-4 text-sm text-[#6b7280]">
                  No products found for "{searchQuery}".
                </p>
              ) : null}
            </section>
          </div>
        </section>
      </div>
      {actionToast ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[130] max-w-[260px] rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white shadow-lg sm:text-sm">
          {actionToast}
        </div>
      ) : null}
    </main>
  );
}
