"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const buyCategories = [
  { label: "All Categories" },
  { label: "Products" },
  { label: "Blog" },
  { label: "Contact" },
  { label: "Limited Sale" },
  { label: "Best Seller" },
  { label: "New Arrivals" },
];

const buyAllSubCategories: Array<{ key: string; label: string; productIds: string[] }> = [
  { key: "mobiles", label: "Mobiles", productIds: ["phone"] },
  { key: "audio", label: "Audio", productIds: ["audio", "speaker"] },
  { key: "laptops", label: "Laptops", productIds: ["laptop"] },
  { key: "cameras", label: "Cameras", productIds: ["camera"] },
  { key: "televisions", label: "Televisions", productIds: ["television"] },
  { key: "tablets", label: "Tablets", productIds: ["tablet"] },
  { key: "wearables", label: "Wearables", productIds: ["watch"] },
  { key: "accessories", label: "Accessories", productIds: ["keyboard", "mouse"] },
];

const buyAllSubCategorySets = new Map(
  buyAllSubCategories.map((entry) => [entry.key, new Set(entry.productIds)])
);

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
  { id: "phone", name: "Phone", image: "/phone.webp", badge: "", price: "$899.00", unitPriceCents: 899_00 },
  { id: "audio", name: "Audio", image: "/audio.webp", badge: "50%", price: "$149.00", unitPriceCents: 149_00 },
  { id: "laptop", name: "Laptop", image: "/laptop.webp", badge: "", price: "$1,299.00", unitPriceCents: 129_900 },
  { id: "camera", name: "Camera", image: "/camera.webp", badge: "", price: "$79.00", unitPriceCents: 79_00 },
  { id: "television", name: "Television", image: "/television.webp", badge: "", price: "$599.00", unitPriceCents: 599_00 },
  { id: "tablet", name: "Tablet", image: "/tablet.webp", badge: "", price: "$399.00", unitPriceCents: 399_00 },
  { id: "watch", name: "Watch", image: "/watch.webp", badge: "", price: "$199.00", unitPriceCents: 199_00 },
  { id: "speaker", name: "Speaker", image: "/speaker.webp", badge: "", price: "$89.00", unitPriceCents: 89_00 },
  { id: "keyboard", name: "Keyboard", image: "/keyboard.webp", badge: "", price: "$49.00", unitPriceCents: 49_00 },
  { id: "mouse", name: "Mouse", image: "/mouse.webp", badge: "", price: "$29.00", unitPriceCents: 29_00 },
];

const bestSellerIds = new Set(["phone", "laptop", "television", "camera", "audio"]);
const newArrivalIds = new Set(["watch", "speaker", "keyboard", "mouse", "tablet"]);

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

function BuyScreenStacklyFooter() {
  const [footerEmail, setFooterEmail] = useState("");
  const [footerToast, setFooterToast] = useState<string | null>(null);
  const footerToastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (footerToastTimerRef.current) {
        window.clearTimeout(footerToastTimerRef.current);
      }
    };
  }, []);

  const handleFooterSend = useCallback(() => {
    const trimmedEmail = footerEmail.trim();
    if (!trimmedEmail) {
      setFooterToast("Please enter your email.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFooterToast("Please enter a valid email address.");
    } else {
      setFooterEmail("");
      setFooterToast("Mail sent successfully.");
    }
    if (footerToastTimerRef.current) {
      window.clearTimeout(footerToastTimerRef.current);
    }
    footerToastTimerRef.current = window.setTimeout(() => {
      setFooterToast(null);
    }, 2200);
  }, [footerEmail]);

  return (
    <footer className="buyscreen-stackly-footer mt-3 w-full bg-[#001632] text-[#d1d5db] antialiased sm:mt-4">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-8 sm:py-14 lg:py-16">
        <div className="grid gap-12 sm:gap-14 lg:grid-cols-5 lg:gap-8 xl:gap-12">
          <div className="min-w-0 lg:col-span-1">
            <form
              className="flex max-w-[20rem] items-center gap-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                handleFooterSend();
              }}
            >
              <div className="flex min-w-0 flex-1 items-center rounded-full bg-white px-3 py-1.5 shadow-sm">
                <FaEnvelope className="h-4 w-4 shrink-0 text-[#9ca3af]" aria-hidden />
                <input
                  type="email"
                  name="footer-email"
                  autoComplete="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent px-2 text-sm text-[#374151] outline-none placeholder:text-[#c4b5fd]"
                />
              </div>
              <button
                type="submit"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
                aria-label="Subscribe to newsletter"
              >
                <FaPaperPlane className="h-4 w-4" aria-hidden />
              </button>
            </form>
            <h3 className="mt-8 text-sm font-bold text-white">Headquarters</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#d1d5db]">
              MMR COMPLEX, SALEM,
              <br />
              Tamil Nadu 636008
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Product</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Features", href: "/page-not-found" },
                { label: "Templates", href: "/page-not-found" },
                { label: "Pricing", href: "/page-not-found" },
                { label: "Changelog", href: "/page-not-found" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[#d1d5db] transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Resources</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Documentation", href: "/page-not-found" },
                { label: "API Reference", href: "/page-not-found" },
                { label: "Blog", href: "/page-not-found" },
                { label: "Status", href: "/page-not-found" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[#d1d5db] transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-white">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About", href: "/page-not-found" },
                { label: "Privacy Policy", href: "/page-not-found" },
                { label: "Terms of Service", href: "/page-not-found" },
                { label: "Contact", href: "/page-not-found" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[#d1d5db] transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-1">
            <div className="inline-flex h-8 w-fit min-w-[92px] items-center justify-center overflow-hidden rounded-[50%] bg-white px-3 sm:h-9 sm:min-w-[104px]">
              <Image
                src="/stackly-logo.webp"
                alt="Stackly logo"
                width={160}
                height={40}
                className="h-[18px] w-auto sm:h-[20px]"
                unoptimized
              />
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#d1d5db]">
              The <strong className="font-semibold text-white">NO-CODE</strong> website builder for everyone. Powered by AWS infrastructure,
              built by The <strong className="font-semibold text-white">Stackly</strong> team.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/15 pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="inline-flex w-fit max-w-full flex-wrap items-center gap-4 rounded-full bg-white px-4 py-2.5 text-[#001632] shadow-sm sm:gap-5">
            <a href="https://www.facebook.com/thestackly" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#1877f2]" aria-label="Facebook">
              <FaFacebookF className="h-4 w-4" />
            </a>
            <a href="https://www.youtube.com/@thestackly" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#ff0000]" aria-label="YouTube">
              <FaYoutube className="h-4 w-4" />
            </a>
            <a href="https://www.instagram.com/thestackly" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#e4405f]" aria-label="Instagram">
              <FaInstagram className="h-4 w-4" />
            </a>
            <a href="https://x.com/thestackly" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#111827]" aria-label="X">
              <FaXTwitter className="h-4 w-4" />
            </a>
            <a href="https://www.linkedin.com/company/thestackly" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#0a66c2]" aria-label="LinkedIn">
              <FaLinkedinIn className="h-4 w-4" />
            </a>
            <a href="https://thestackly.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-[#18a3a4]" aria-label="Website">
              <FaGlobe className="h-4 w-4" />
            </a>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#d1d5db] sm:justify-end">
            <a href="https://thestackly.com/terms-of-service" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              Terms of Use
            </a>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              |
            </span>
            <a href="https://thestackly.com/privacy-policy" target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              Privacy Policy
            </a>
            <span className="hidden text-white/25 sm:inline" aria-hidden>
              |
            </span>
            <span className="text-[#d1d5db]">© 2018-2026 thestackly.com, Inc.</span>
          </div>
        </div>
      </div>
      {footerToast ? (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-[240] -translate-x-1/2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#06224C] shadow-lg">
          {footerToast}
        </div>
      ) : null}
    </footer>
  );
}

export default function BuyScreenPage() {
  const router = useRouter();
  const [activeProductStart, setActiveProductStart] = useState(0);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryLabel, setActiveCategoryLabel] = useState("All Categories");
  const [activeSubCategoryKey, setActiveSubCategoryKey] = useState<string | null>(null);
  const [isAllCategoriesDropdownOpen, setIsAllCategoriesDropdownOpen] = useState(false);
  const [isTopHeaderMenuOpen, setIsTopHeaderMenuOpen] = useState(false);
  const [isTopHeaderSearchOpen, setIsTopHeaderSearchOpen] = useState(false);
  const [isTopHeaderProfileMenuOpen, setIsTopHeaderProfileMenuOpen] = useState(false);
  const [isMobileHeroViewport, setIsMobileHeroViewport] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [licenseProduct, setLicenseProduct] = useState<BuyProduct | null>(null);
  const [licenseQty, setLicenseQty] = useState(1);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const allCategoriesWrapRef = useRef<HTMLDivElement | null>(null);
  const userMenuWrapRef = useRef<HTMLDivElement | null>(null);
  const featuredProductsRef = useRef<HTMLElement | null>(null);
  const topHeaderBarRef = useRef<HTMLDivElement | null>(null);
  const topHeaderSearchInputRef = useRef<HTMLInputElement | null>(null);
  const productsViewportRef = useRef<HTMLDivElement | null>(null);
  const productsTouchStartXRef = useRef<number | null>(null);
  const productsTouchStartYRef = useRef<number | null>(null);
  const [carouselCols, setCarouselCols] = useState(3);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const categoryFilteredProducts = buyProducts.filter((product) => {
    if (activeSubCategoryKey) {
      const subSet = buyAllSubCategorySets.get(activeSubCategoryKey);
      if (subSet) return subSet.has(product.id);
    }
    if (activeCategoryLabel === "All Categories" || activeCategoryLabel === "Products") return true;
    if (activeCategoryLabel === "Limited Sale") return Boolean(product.badge);
    if (activeCategoryLabel === "Best Seller") return bestSellerIds.has(product.id);
    if (activeCategoryLabel === "New Arrivals") return newArrivalIds.has(product.id);
    return true;
  });
  const searchFilteredProducts = normalizedSearchQuery
    ? categoryFilteredProducts.filter((product) => product.name.toLowerCase().includes(normalizedSearchQuery))
    : categoryFilteredProducts;
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

  useEffect(() => {
    if (!isAllCategoriesDropdownOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!allCategoriesWrapRef.current?.contains(target)) {
        setIsAllCategoriesDropdownOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [isAllCategoriesDropdownOpen]);

  useEffect(() => {
    if (!isUserMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!userMenuWrapRef.current?.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsUserMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [isUserMenuOpen]);

  useEffect(() => {
    if (!isTopHeaderSearchOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!topHeaderBarRef.current?.contains(target)) {
        setIsTopHeaderSearchOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsTopHeaderSearchOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [isTopHeaderSearchOpen]);

  useEffect(() => {
    if (!isTopHeaderProfileMenuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (!target.closest("[data-top-header-profile-wrap]")) {
        setIsTopHeaderProfileMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsTopHeaderProfileMenuOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [isTopHeaderProfileMenuOpen]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileHeroViewport(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isTopHeaderSearchOpen) return;
    const id = window.requestAnimationFrame(() => {
      topHeaderSearchInputRef.current?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [isTopHeaderSearchOpen]);

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

  const handleCategoryClick = useCallback(
    (label: string) => {
      if (label === "Blog" || label === "Contact") {
        router.push("/page-not-found");
        return;
      }
      setActiveSubCategoryKey(null);
      setIsAllCategoriesDropdownOpen(false);
      setIsUserMenuOpen(false);
      setActiveCategoryLabel(label);
      setShowAllProducts(false);
      setSearchQuery("");
      setActiveProductStart(0);
      featuredProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsCategoryMenuOpen(false);
    },
    [router]
  );

  const handleSubCategoryClick = useCallback((key: string) => {
    setActiveCategoryLabel("All Categories");
    setActiveSubCategoryKey(key);
    setIsAllCategoriesDropdownOpen(false);
    setIsUserMenuOpen(false);
    setShowAllProducts(false);
    setSearchQuery("");
    setActiveProductStart(0);
    featuredProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsCategoryMenuOpen(false);
  }, []);

  const handleTopHeaderItemClick = useCallback(
    (item: string) => {
      if (item === "About Us" || item === "Contact") {
        router.push("/page-not-found");
        return;
      }
      setIsTopHeaderMenuOpen(false);
    },
    [router]
  );

  const handleProductsTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isCarouselMode || typeof window === "undefined" || window.innerWidth > 1023 || e.touches.length !== 1) return;
      productsTouchStartXRef.current = e.touches[0]?.clientX ?? null;
      productsTouchStartYRef.current = e.touches[0]?.clientY ?? null;
    },
    [isCarouselMode]
  );

  const handleProductsTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const startX = productsTouchStartXRef.current;
    const startY = productsTouchStartYRef.current;
    if (startX == null || startY == null || e.touches.length !== 1) return;
    const dx = (e.touches[0]?.clientX ?? startX) - startX;
    const dy = (e.touches[0]?.clientY ?? startY) - startY;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      e.preventDefault();
    }
  }, []);

  const handleProductsTouchCancel = useCallback(() => {
    productsTouchStartXRef.current = null;
    productsTouchStartYRef.current = null;
  }, []);

  const handleProductsTouchFinal = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const startX = productsTouchStartXRef.current;
      const startY = productsTouchStartYRef.current;
      const endTouch = e.changedTouches[0];
      productsTouchStartXRef.current = null;
      productsTouchStartYRef.current = null;
      if (!isCarouselMode || startX == null || startY == null || !endTouch) return;
      const dx = endTouch.clientX - startX;
      const dy = endTouch.clientY - startY;
      if (Math.abs(dx) < 28 || Math.abs(dx) <= Math.abs(dy)) return;
      moveProducts(dx < 0 ? 1 : -1);
    },
    [isCarouselMode, moveProducts]
  );

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
  const carouselSlots = isCarouselMode ? Math.max(1, carouselCols) : 1;

  const lineTotalCents = licenseProduct ? licenseProduct.unitPriceCents * licenseQty : 0;
  const cartTotalCents = cartItems.reduce((sum, item) => sum + item.product.unitPriceCents * item.qty, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="buyscreen-page min-h-[100dvh] overflow-x-hidden bg-white text-[#111827]">
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
              <p className="whitespace-nowrap text-lg font-bold tabular-nums sm:text-xl" style={{ color: NAVY }}>
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

              <div className="mt-6 grid grid-cols-3 items-center gap-2 rounded-full border-2 p-2 sm:px-3" style={{ borderColor: NAVY }}>
              <button
                type="button"
                className="justify-self-start flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-40 sm:h-9 sm:w-9"
                style={{ backgroundColor: NAVY }}
                aria-label="Decrease quantity"
                disabled={licenseQty <= 1}
                onClick={() => setLicenseQty((q) => Math.max(1, q - 1))}
              >
                <span className="text-lg font-light leading-none">−</span>
              </button>
              <div className="min-w-0 w-full rounded-md border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-2 py-1.5 text-center text-lg font-semibold tabular-nums text-[#0f172a]">
                {licenseQty}
              </div>
              <button
                type="button"
                className="justify-self-end flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 sm:h-9 sm:w-9"
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
                      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
                        <span className="text-sm font-bold tabular-nums text-[#111827]">{formatUsd(item.product.unitPriceCents * item.qty)}</span>
                        <button
                          type="button"
                          onClick={() => removeCartItem(item.product.id)}
                          className="w-full rounded-md border border-[#fecaca] px-2 py-1 text-xs font-semibold text-[#dc2626] hover:bg-[#fef2f2] sm:w-auto"
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

      <section className="relative left-1/2 mb-4 w-screen -translate-x-1/2 overflow-visible bg-[#06224C]">
        <div ref={topHeaderBarRef}>
        <div className="buyscreen-top-header-inner mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile / tablet / desktop-zoom: hamburger + logo + actions (cart/search/profile stay right) */}
        <div className="buyscreen-top-header-row buyscreen-top-header-mobile-row flex min-w-0 flex-wrap items-center justify-between gap-2 py-2.5 lg:hidden">
          <div className="flex min-w-0 shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setIsTopHeaderMenuOpen((v) => !v)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/25 text-white transition-colors hover:bg-white/15 planning-zoom-show-hamburger"
            aria-label="Toggle top navigation menu"
            aria-expanded={isTopHeaderMenuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex h-8 min-w-[82px] shrink-0 items-center justify-center overflow-hidden rounded-[50%] bg-white px-2.5 sm:h-9 sm:min-w-[92px] sm:px-3">
            <Image src="/stackly-logo.webp" alt="Stackly logo" width={160} height={40} className="h-[18px] w-auto sm:h-[20px]" unoptimized />
          </div>
          </div>

          <div className="buyscreen-top-header-actions flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/80 text-white transition-colors hover:bg-white/15 hover:text-[#fef3c7] sm:h-8 sm:w-8"
              aria-label="Cart"
              onClick={() => router.push("/page-not-found")}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L20.6 7H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10" cy="19" r="1.4" fill="currentColor" />
                <circle cx="17" cy="19" r="1.4" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#06224C] transition-colors hover:bg-[#fef3c7] hover:text-[#06224C] sm:h-8 sm:w-8"
              aria-label="Search"
              aria-expanded={isTopHeaderSearchOpen}
              onClick={(e) => {
                e.stopPropagation();
                setIsTopHeaderSearchOpen((v) => !v);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
            <div data-top-header-profile-wrap className="buyscreen-user-menu-wrap relative shrink-0">
              <button
                type="button"
                className="overflow-hidden rounded-full border border-white/40 transition-colors hover:border-[#fef3c7] hover:bg-white/10"
                aria-label="Profile"
                aria-expanded={isTopHeaderProfileMenuOpen}
                aria-haspopup="menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTopHeaderProfileMenuOpen((prev) => !prev);
                }}
              >
                <Image src="/photo.webp" alt="Profile" width={36} height={36} className="h-7 w-7 object-cover sm:h-8 sm:w-8" unoptimized />
              </button>
              <div
                className={`buyscreen-user-menu-dropdown ${isTopHeaderProfileMenuOpen ? "buyscreen-user-menu-dropdown--open" : ""}`}
                role="menu"
                aria-hidden={!isTopHeaderProfileMenuOpen}
              >
                <button
                  type="button"
                  role="menuitem"
                  className="buyscreen-user-menu-item"
                  onClick={() => {
                    setIsTopHeaderProfileMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: equal space between each segment — logo … nav links … actions (cart stays right with inner icon gaps) */}
        <div className="buyscreen-top-header-row buyscreen-top-header-desktop-row hidden w-full min-w-0 items-center py-3 lg:flex">
          <nav
            className="flex w-full min-w-0 flex-nowrap items-center justify-between gap-0 text-[13px] font-semibold text-white"
            aria-label="Main"
          >
            <div className="flex h-9 min-w-[104px] shrink-0 items-center justify-center overflow-hidden rounded-[50%] bg-white px-3">
              <Image src="/stackly-logo.webp" alt="Stackly logo" width={160} height={40} className="h-[20px] w-auto" unoptimized />
            </div>
            <button
              type="button"
              className="buyscreen-top-header-nav-item shrink-0 whitespace-nowrap text-[13px] font-semibold"
              onClick={() => handleTopHeaderItemClick("Home")}
            >
              Home
            </button>
            <button
              type="button"
              className="buyscreen-top-header-nav-item shrink-0 whitespace-nowrap text-[13px] font-semibold"
              onClick={() => handleTopHeaderItemClick("About Us")}
            >
              About Us
            </button>
            <button
              type="button"
              className="buyscreen-top-header-nav-item inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] font-semibold"
              onClick={() => handleTopHeaderItemClick("Our Products")}
            >
              Our Products
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
                <path d="m5.5 7.5 4.5 5 4.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="buyscreen-top-header-nav-item inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[13px] font-semibold"
              onClick={() => handleTopHeaderItemClick("Categories")}
            >
              Categories
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden className="shrink-0">
                <path d="m5.5 7.5 4.5 5 4.5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              className="buyscreen-top-header-nav-item shrink-0 whitespace-nowrap text-[13px] font-semibold"
              onClick={() => handleTopHeaderItemClick("Contact")}
            >
              Contact
            </button>
            <div className="buyscreen-top-header-actions flex shrink-0 items-center gap-3 sm:gap-4">
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/90 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-white/15 hover:text-[#fef3c7]"
                aria-label="Cart"
                onClick={() => router.push("/page-not-found")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L20.6 7H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="19" r="1.4" fill="currentColor" />
                  <circle cx="17" cy="19" r="1.4" fill="currentColor" />
                </svg>
                Cart
              </button>
              <button
                type="button"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#06224C] transition-colors hover:bg-[#fef3c7] hover:text-[#06224C]"
                aria-label="Search"
                aria-expanded={isTopHeaderSearchOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTopHeaderSearchOpen((v) => !v);
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
              <div data-top-header-profile-wrap className="buyscreen-user-menu-wrap relative shrink-0">
                <button
                  type="button"
                  className="overflow-hidden rounded-full border border-white/40 transition-colors hover:border-[#fef3c7] hover:bg-white/10"
                  aria-label="Profile"
                  aria-expanded={isTopHeaderProfileMenuOpen}
                  aria-haspopup="menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTopHeaderProfileMenuOpen((prev) => !prev);
                  }}
                >
                  <Image src="/photo.webp" alt="Profile" width={36} height={36} className="h-9 w-9 object-cover" unoptimized />
                </button>
                <div
                  className={`buyscreen-user-menu-dropdown ${isTopHeaderProfileMenuOpen ? "buyscreen-user-menu-dropdown--open" : ""}`}
                  role="menu"
                  aria-hidden={!isTopHeaderProfileMenuOpen}
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="buyscreen-user-menu-item"
                    onClick={() => {
                      setIsTopHeaderProfileMenuOpen(false);
                      router.push("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
        </div>
        {isTopHeaderSearchOpen ? (
          <div className="border-t border-white/20">
            <div className="mx-auto w-full max-w-7xl px-4 pb-3 pt-2 sm:px-6 lg:px-8">
              <label className="flex h-10 w-full items-center gap-2 rounded-md border-2 border-[#cbd5e1] bg-white px-3 text-sm text-[#4b5563]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[#374151]" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
                <input
                  ref={topHeaderSearchInputRef}
                  type="search"
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
                  aria-label="Search products"
                />
              </label>
            </div>
          </div>
        ) : null}
        </div>
          {isTopHeaderMenuOpen ? (
            <div className="border-t border-white/20 lg:hidden planning-zoom-show-mobile-menu">
              <div className="mx-auto w-full max-w-7xl px-4 pb-3 pt-2 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-2">
                {["Home", "About Us", "Our Products", "Categories", "Contact"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="buyscreen-top-header-nav-item buyscreen-top-header-nav-item--grid px-2 py-2 text-left text-xs"
                    onClick={() => handleTopHeaderItemClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
              </div>
            </div>
          ) : null}
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 pb-3 pt-0 sm:px-6 sm:pb-4 sm:pt-0 lg:px-8 lg:pb-6 lg:pt-0">

        <div className="mb-6 flex justify-end sm:mb-8">
          <button
            type="button"
            className="rounded-md bg-[#171717] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#0f2f66] hover:text-white"
            onClick={() => router.push("/page-not-found")}
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
              <label className="buyscreen-search flex h-8 w-[150px] items-center rounded-md border-2 border-[#cbd5e1] px-2 text-[11px] text-[#4b5563] sm:h-9 sm:w-[180px] sm:text-xs">
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
                <button type="button" className="buyscreen-cart-trigger flex items-center gap-2 rounded-md px-2 py-1" onClick={() => setIsCartOpen(true)}>
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
                    <span className="buyscreen-cart-secondary block text-[11px] tabular-nums sm:text-xs">{cartItems.length ? formatUsd(cartTotalCents) : "Empty"}</span>
                  </span>
                </button>
                <span className="h-6 w-px shrink-0 bg-[#d1d5db]" aria-hidden />
                <div ref={userMenuWrapRef} className="buyscreen-user-menu-wrap relative shrink-0">
                  <button
                    type="button"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="menu"
                    className="buyscreen-user-summary buyscreen-user-trigger flex min-w-0 items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1 text-left text-inherit"
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden>
                      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M5.8 19.2c1.1-2.5 3.3-3.8 6.2-3.8s5.1 1.3 6.2 3.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-[11px] font-semibold sm:text-xs">User</span>
                      <span className="buyscreen-user-secondary block text-[11px] sm:text-xs">Account</span>
                    </span>
                  </button>
                  <div
                    className={`buyscreen-user-menu-dropdown ${isUserMenuOpen ? "buyscreen-user-menu-dropdown--open" : ""}`}
                    role="menu"
                    aria-hidden={!isUserMenuOpen}
                  >
                    <button
                      type="button"
                      role="menuitem"
                      className="buyscreen-user-menu-item"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        router.push("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
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
                item.label === "All Categories" ? (
                  <div key={item.label} ref={allCategoriesWrapRef} className="buyscreen-all-categories-wrap relative shrink-0">
                    <button
                      type="button"
                      aria-expanded={isAllCategoriesDropdownOpen}
                      className="buyscreen-all-categories-toggle inline-flex items-center gap-1 rounded-md px-2 py-1 text-left text-[10px] font-semibold transition-colors duration-150 hover:bg-white hover:text-[#06224C] sm:text-xs"
                      onClick={() => setIsAllCategoriesDropdownOpen((prev) => !prev)}
                    >
                      All Categories
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <div className={`buyscreen-all-categories-dropdown ${isAllCategoriesDropdownOpen ? "buyscreen-all-categories-dropdown--open" : ""}`}>
                      {buyAllSubCategories.map((subCategory) => (
                        <button
                          key={subCategory.key}
                          type="button"
                          className="buyscreen-all-categories-item"
                          onClick={() => handleSubCategoryClick(subCategory.key)}
                        >
                          {subCategory.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.label}
                    type="button"
                    className={`buyscreen-category-item shrink-0 rounded-md text-left transition-colors duration-150 hover:bg-white hover:text-[#06224C] ${item.label === "Limited Sale" ? "lg:ml-auto" : ""}`}
                    onClick={() => handleCategoryClick(item.label)}
                  >
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </nav>

          <div className="space-y-10 px-4 py-10 sm:space-y-12 sm:px-8 sm:py-12">
            <section className="buyscreen-hero relative flex aspect-[4/5] items-center overflow-hidden rounded-xl border border-[#efefef] p-4 sm:aspect-[16/10] sm:p-8 lg:aspect-[16/9] lg:p-10">
              <Image
                src={isMobileHeroViewport ? "/hero-mobile.webp" : "/background.webp"}
                alt="Electronics hero background"
                fill
                className="object-cover object-center"
                unoptimized
                priority
                onError={() => {
                  setIsMobileHeroViewport(false);
                }}
              />
              <div className="absolute inset-0 z-[1] bg-[#001632]/45" aria-hidden />
              <div className="buyscreen-hero-content relative z-10 w-full min-w-0 max-w-full px-1 text-center sm:max-w-xl sm:px-0 lg:text-left">
                <h1 className="text-[clamp(1.05rem,5.1vw,1.75rem)] font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                  Your One-Stop Electronic Market
                </h1>
                <p className="mx-auto mt-2 max-w-xl text-[clamp(0.7rem,2.9vw,0.95rem)] leading-relaxed text-white sm:mt-3 sm:text-base lg:mx-0">
                  Welcome to e-shop, a place where you can buy everything about electronics. Sale every day.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-md bg-[#06224C] px-4 py-2 text-xs font-semibold text-white sm:mt-6 sm:px-5 sm:py-2.5 sm:text-sm"
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
                <div
                  ref={productsViewportRef}
                  className="min-w-0 flex-1 overflow-hidden"
                  onTouchStart={handleProductsTouchStart}
                  onTouchMove={handleProductsTouchMove}
                  onTouchEnd={handleProductsTouchFinal}
                  onTouchCancel={handleProductsTouchCancel}
                >
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
                      <div className="buyscreen-product-actions-mobile grid grid-cols-3 place-items-center gap-1 border-t border-[#f3f4f6] px-1 py-1 lg:hidden">
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
              {isCarouselMode && totalProducts > 1 ? (
                <p className="mt-3 text-center text-[11px] font-medium text-[#6b7280] lg:hidden">Swipe for more products</p>
              ) : null}
              {!displayedProducts.length ? (
                <p className="mt-4 rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-4 py-4 text-sm text-[#6b7280]">
                  No products found for "{searchQuery}".
                </p>
              ) : null}
            </section>
          </div>
        </section>
      </div>
      <BuyScreenStacklyFooter />
      {actionToast ? (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[130] max-w-[260px] rounded-md bg-[#111827] px-3 py-2 text-xs font-medium text-white shadow-lg sm:text-sm">
          {actionToast}
        </div>
      ) : null}
    </main>
  );
}
