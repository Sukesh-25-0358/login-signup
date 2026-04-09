"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

/**
 * Shown in the header until session/API provides the real name.
 * Replace with `session.user.name` (or equivalent) when auth is connected.
 */
const PLANNING_DISPLAY_USER_NAME = "Pentakota Srinivas";

const NAV_ITEMS = [
  { id: "workspace" as const, label: "Workspace" },
  { id: "myWebsites" as const, label: "My Websites" },
  { id: "templates" as const, label: "Templates" },
  { id: "domains" as const, label: "Domains" },
  { id: "billing" as const, label: "Billing" },
];

type NavId = (typeof NAV_ITEMS)[number]["id"];

/** Shared hover / focus / active styles for Help, Settings, Notifications in the planning header */
const planningHeaderQuickIconBtn =
  "flex items-center justify-center rounded-full border border-transparent bg-white p-0 m-0 cursor-pointer shadow-sm transition-all duration-150 ease-out hover:border-white/50 hover:bg-slate-100 hover:shadow-md hover:shadow-black/20 hover:ring-2 hover:ring-white/60 active:scale-[0.96] active:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#06224C]";

/** Vector bell — stays sharp at any zoom/DPR (unlike raster WebP) */
function PlanningHeaderBellIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <path
        d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanningHeaderHelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden shapeRendering="geometricPrecision">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M9.75 9.5a2.25 2.25 0 1 1 3.9 1.55c-.55.57-1.15 1-1.65 1.6-.27.33-.42.7-.42 1.1v.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="16.8" r="1" fill="currentColor" />
    </svg>
  );
}

function PlanningHeaderSettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden shapeRendering="geometricPrecision">
      <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" stroke="currentColor" strokeWidth="2" />
      <path d="M19 12a7.1 7.1 0 0 0-.07-.95l2.02-1.57-2-3.46-2.48.81a7.5 7.5 0 0 0-1.65-.96L14.4 3h-4.8l-.42 2.87c-.59.23-1.14.55-1.65.96l-2.48-.81-2 3.46 2.02 1.57a7.9 7.9 0 0 0 0 1.9L3.05 14.52l2 3.46 2.48-.81c.5.41 1.06.73 1.65.96L9.6 21h4.8l.42-2.87c.59-.23 1.14-.55 1.65-.96l2.48.81 2-3.46-2.02-1.57c.05-.31.07-.63.07-.95Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
    </svg>
  );
}

const plans = [
  {
    name: "Basic",
    oldPrice: "$80",
    newPrice: "$40",
    saveText: "Save 50%",
    yearlyOldPrice: "$960",
    yearlyNewPrice: "$403",
    yearlySaveText: "Save 58%",
    features: [
      "Free domain for 1 year",
      "20 GB storage space",
      "Multi-cloud hosting",
      "Light marketing suite",
      "2 site collaborators",
    ],
  },
  {
    name: "Business Plan",
    oldPrice: "$300",
    newPrice: "$150",
    saveText: "Save 50%",
    yearlyOldPrice: "$3,600",
    yearlyNewPrice: "$1,512",
    yearlySaveText: "Save 58%",
    isRecommended: true,
    features: [
      "Free domain for 1 year",
      "100 GB storage space",
      "Multi-cloud hosting",
      "Standard marketing suite",
      "Accept payments",
      "Basic eCommerce",
      "Scheduling and services",
      "10 site collaborators",
    ],
  },
  {
    name: "Advanced",
    oldPrice: "$400",
    newPrice: "$280",
    saveText: "Save 30%",
    yearlyOldPrice: "$4,800",
    yearlyNewPrice: "$3,360",
    yearlySaveText: "Save 30%",
    features: [
      "Free domain for 1 year",
      "300 GB storage space",
      "Multi-cloud hosting",
      "Legacy marketing suite",
      "Accept payments",
      "Basic eCommerce",
      "Scheduling and services",
      "5 site collaborators",
    ],
  },
];

type Plan = (typeof plans)[number];
type PlanningView = "plans" | "payment" | "invoice" | "history";
type PaymentMethodId = "paypal" | "card" | "netbanking" | "online";

const CARD_NUMBER_MAX_LEN = 19;
const CARD_CVV_MAX_LEN = 4;

function cardDigitsOnly(value: string, maxLen: number) {
  return value.replace(/\D/g, "").slice(0, maxLen);
}

/** Digits only, shown as MM/YY after the month (slash is not a digit; typed / is stripped). */
function formatCardExpiryMmYy(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

type BillingHistoryEntry = {
  date: string;
  invoiceId: string;
  amount: string;
  status: "Paid" | "Free";
};

type InvoiceData = {
  invoiceId: string;
  date: string;
  planName: string;
  amount: string;
  name: string;
  email: string;
  contactNo: string;
  address: string;
};

function historyYearFromDate(date: string) {
  const m = date.match(/(\d{4})$/);
  return m ? Number(m[1]) : NaN;
}

const DEFAULT_BILLING_HISTORY: BillingHistoryEntry[] = [
  { date: "Apr 02 2026", invoiceId: "INV-200987", amount: "$39.00", status: "Paid" },
  { date: "Mar 15 2026", invoiceId: "INV-121289", amount: "$39.00", status: "Paid" },
  { date: "Feb 08 2026", invoiceId: "INV-100123", amount: "$39.00", status: "Paid" },
  { date: "Jan 20 2026", invoiceId: "INV-100154", amount: "$39.00", status: "Paid" },
  { date: "Dec 20 2025", invoiceId: "INV-101164", amount: "$39.00", status: "Paid" },
  { date: "Dec 10 2025", invoiceId: "INV-100140", amount: "$0.00", status: "Free" },
  { date: "Nov 20 2025", invoiceId: "INV-100100", amount: "$0.00", status: "Free" },
  { date: "Oct 08 2025", invoiceId: "INV-100240", amount: "$0.00", status: "Free" },
];

const PLANNING_BILLING_HISTORY_KEY = "stacklyPlanningBillingHistory";

function isBillingHistoryEntry(x: unknown): x is BillingHistoryEntry {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.date === "string" &&
    typeof o.invoiceId === "string" &&
    typeof o.amount === "string" &&
    (o.status === "Paid" || o.status === "Free")
  );
}

function loadBillingHistoryFromStorage(): BillingHistoryEntry[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PLANNING_BILLING_HISTORY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    const rows = parsed.filter(isBillingHistoryEntry);
    return rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

function saveBillingHistoryToStorage(entries: BillingHistoryEntry[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLANNING_BILLING_HISTORY_KEY, JSON.stringify(entries));
  } catch {
    /* ignore quota / private mode */
  }
}

export default function PlanningPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>("billing");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);
  const [planningView, setPlanningView] = useState<PlanningView>("plans");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isFreeCheckout, setIsFreeCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [netBank, setNetBank] = useState("");
  const [onlineWallet, setOnlineWallet] = useState<"gpay" | "phonepe">("gpay");
  const [upiId, setUpiId] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryEntry[]>(DEFAULT_BILLING_HISTORY);
  const [historyYearFilter, setHistoryYearFilter] = useState<string>("this");
  const plansSectionRef = useRef<HTMLElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const currentYear = new Date().getFullYear();
  const extraHistoryYears = [2024, 2023, 2022, 2021];
  const historyYears = Array.from(
    new Set(
      [
        currentYear,
        ...extraHistoryYears,
        ...billingHistory
          .map((e) => historyYearFromDate(e.date))
          .filter((y) => Number.isFinite(y))
          .map((y) => Number(y)),
      ],
    ),
  ).sort((a, b) => b - a);
  const activeHistoryYear = historyYearFilter === "this" ? currentYear : Number(historyYearFilter);
  const filteredBillingHistory =
    historyYearFilter === "all"
      ? billingHistory
      : billingHistory.filter((entry) => historyYearFromDate(entry.date) === activeHistoryYear);

  useEffect(() => {
    const stored = loadBillingHistoryFromStorage();
    if (stored) setBillingHistory(stored);
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileWrapRef.current?.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleNavClick(id: NavId) {
    setActiveNav(id);
    setMobileMenuOpen(false);
    if (id === "billing") {
      plansSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.setTimeout(() => {
      router.push("/page-not-found");
    }, 140);
  }

  function getActivePrice(plan: Plan) {
    return {
      oldPrice: billingYearly ? plan.yearlyOldPrice : plan.oldPrice,
      newPrice: billingYearly ? plan.yearlyNewPrice : plan.newPrice,
      saveText: billingYearly ? plan.yearlySaveText : plan.saveText,
      period: billingYearly ? "Per year" : "Per month",
    };
  }

  function handlePurchasePlan(plan: Plan, freeCheckout = false) {
    setSelectedPlan(plan);
    setPlanningView("payment");
    setPaymentLoading(false);
    setIsFreeCheckout(freeCheckout);
    setPaymentMethod("card");
    setPaypalEmail("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvv("");
    setNetBank("");
    setOnlineWallet("gpay");
    setUpiId("");
  }

  function handleBackToPlans() {
    setPlanningView("plans");
    setSelectedPlan(null);
    setPaymentLoading(false);
    setIsFreeCheckout(false);
  }

  function paymentSubtitle() {
    switch (paymentMethod) {
      case "paypal":
        return "Sign in with PayPal to complete your upgrade.";
      case "card":
        return "Enter your card details to upgrade.";
      case "netbanking":
        return "Choose your bank and authorize payment.";
      case "online":
        return "Pay with UPI — open your app or enter your UPI ID.";
      default:
        return "Enter your payment details to Upgrade";
    }
  }

  function handleCompletePayment() {
    if (!selectedPlan) return;
    setPaymentLoading(true);
    window.setTimeout(() => {
      const now = new Date();
      const invoiceId = `INV-${Math.floor(100000 + Math.random() * 899999)}`;
      const active = getActivePrice(selectedPlan);
      const finalAmount = isFreeCheckout ? "$0" : active.newPrice;
      const createdInvoice: InvoiceData = {
        invoiceId,
        date: now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        planName: `${selectedPlan.name} ${isFreeCheckout ? "(Free)" : billingYearly ? "(Yearly)" : "(Monthly)"}`,
        amount: finalAmount,
        name: PLANNING_DISPLAY_USER_NAME,
        email: "srinu@gmail.com",
        contactNo: "9848xxxx19",
        address: "Chennai - 636008",
      };
      setInvoiceData(createdInvoice);
      setBillingHistory((prev) => {
        const row: BillingHistoryEntry = {
          date: createdInvoice.date,
          invoiceId: createdInvoice.invoiceId,
          amount: createdInvoice.amount,
          status: isFreeCheckout ? "Free" : "Paid",
        };
        const next = [row, ...prev.filter((e) => e.invoiceId !== row.invoiceId)];
        saveBillingHistoryToStorage(next);
        return next;
      });
      setPaymentLoading(false);
      setIsFreeCheckout(false);
      setPlanningView("invoice");
    }, 2400);
  }

  return (
    <main className="planning-page min-h-[100dvh] w-full bg-[#efefef] overflow-x-hidden">
      <nav className="planning-top-nav w-full bg-[#06224C]">
        <div className="planning-top-nav-inner flex w-full flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-8 xl:flex-nowrap">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/25 text-white md:hidden planning-zoom-show-hamburger"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 5.5H17M3 10H17M3 14.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex h-8 min-w-[92px] items-center justify-center overflow-hidden rounded-[50%] bg-white px-3 sm:h-9 sm:min-w-[104px]">
              <img
                src="/stackly-logo.webp"
                alt="Stackly logo"
                className="h-[18px] w-auto sm:h-[20px]"
              />
            </div>
          </div>

          <div className="hidden min-w-0 flex-1 md:flex md:items-center planning-zoom-hide-primary-nav">
            <nav
              className="flex w-full min-w-0 flex-wrap items-center justify-evenly gap-x-2 gap-y-2 text-[13px] text-white sm:text-sm sm:gap-x-3"
              aria-label="Main"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`shrink-0 rounded-md border-b-2 px-2 py-1 transition-colors ${
                    activeNav === item.id
                      ? "border-[#f0e6d4] bg-white/10 font-medium text-white"
                      : "border-transparent hover:bg-white/10 hover:text-white"
                  }`}
                  aria-current={activeNav === item.id ? "page" : undefined}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="ml-auto flex min-w-0 flex-nowrap items-center gap-4 sm:gap-5 lg:gap-6">
            <div className="flex shrink-0 items-center gap-3 md:hidden">
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-8 w-8 touch-manipulation`}
                aria-label="Help"
              >
                <PlanningHeaderHelpIcon className="pointer-events-none h-[17px] w-[17px] shrink-0 text-[#06224C]" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-8 w-8 touch-manipulation`}
                aria-label="Settings"
              >
                <PlanningHeaderSettingsIcon className="pointer-events-none h-[17px] w-[17px] shrink-0 text-[#06224C]" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-8 w-8 touch-manipulation`}
                aria-label="Notifications"
              >
                <PlanningHeaderBellIcon className="pointer-events-none h-[18px] w-[18px] shrink-0 text-[#06224C]" />
              </button>
            </div>

            <div className="hidden items-center gap-5 md:flex lg:gap-6">
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-6 w-6`}
                aria-label="Help"
              >
                <PlanningHeaderHelpIcon className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-6 w-6`}
                aria-label="Settings"
              >
                <PlanningHeaderSettingsIcon className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-6 w-6`}
                aria-label="Notifications"
              >
                <PlanningHeaderBellIcon className="pointer-events-none h-4 w-4 shrink-0 text-[#06224C]" />
              </button>
            </div>

            <div className="relative shrink-0" ref={profileWrapRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((o) => !o);
                }}
                className="flex items-center gap-2 rounded-full py-0.5 pl-0.5 pr-1 transition-colors duration-150 ease-out hover:bg-white/15 active:bg-white/25 md:rounded-lg md:px-2 md:py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#06224C]"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label={`Profile menu, ${PLANNING_DISPLAY_USER_NAME}`}
              >
                <img
                  src="/photo.webp"
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover md:h-7 md:w-7"
                />
                <span className="hidden max-w-[140px] truncate text-left text-[11px] text-white md:inline md:max-w-[180px]">
                  {PLANNING_DISPLAY_USER_NAME}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className={`hidden shrink-0 text-white/90 transition-transform md:block ${profileOpen ? "rotate-180" : ""}`}
                >
                  <path
                    d="M3.5 5L6 7.5L8.5 5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                </svg>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                  role="menu"
                >
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-left text-xs text-gray-800 hover:bg-gray-50"
                    role="menuitem"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="border-t border-white/20 px-3 pb-3 pt-2 md:hidden planning-zoom-show-mobile-menu">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-md border px-2 py-2 text-left text-xs ${
                    activeNav === item.id
                      ? "border-[#f0e6d4] bg-white/10 text-white"
                      : "border-white/25 text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="w-full">
        <div className="w-full border border-[#dbe3ef] bg-white shadow-sm">
          <section
            ref={plansSectionRef}
            id="planning-billing-content"
            className="scroll-mt-4 px-3 py-5 sm:px-8 sm:py-8"
          >
            <div className="mb-4 w-full rounded-sm bg-gradient-to-r from-[#06224C] to-[#1A5BBC] px-4 py-2 text-center text-[11px] font-semibold text-white sm:text-xs">
              Upgrade Now: Get - 50% Off on Selected Plans
            </div>

            {planningView === "plans" && (
            <div className="rounded bg-[#edf3fb] px-5 py-8 sm:px-8 sm:py-10 md:px-10">
              <div className="mx-auto w-full max-w-5xl">
              <h1 className="text-center text-3xl font-bold text-[#0b3268] sm:text-[44px] sm:leading-tight">
                Choose the Best Plan for You
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-center text-[13px] font-medium leading-relaxed text-[#0f172a] sm:text-sm md:text-base">
                Create your website for free and upgrade when you’re ready
              </p>

              <div className="mt-5 flex justify-center sm:mt-6">
                <button
                  type="button"
                  onClick={() => handlePurchasePlan(plans[0], true)}
                  className="inline-flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-[#06224C] to-[#1A5BBC] px-5 py-2.5 text-[11px] font-semibold text-white no-underline shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#06224C]/45 hover:ring-2 hover:ring-white/55 active:translate-y-0 active:shadow-md sm:text-xs"
                >
                  <span>Start Your Free Plan</span>
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10"
                        cy="10"
                        r="8.25"
                        stroke="white"
                        strokeWidth="1.2"
                        fill="none"
                      />
                      <path
                        d="M8 10h4M11.5 7l3 3-3 3"
                        stroke="white"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="mt-8 w-full pl-3 sm:pl-5 md:pl-8 lg:pl-10">
                <div className="grid w-full min-w-0 grid-cols-1 gap-y-3 md:grid-cols-4 md:items-center md:gap-x-4 lg:gap-x-6">
                  <p className="min-w-0 text-center text-sm font-bold leading-snug text-[#0c1e36] md:text-left">
                    What you get with every plan:
                  </p>
                  <span className="min-w-0 text-center text-sm font-medium text-[#0f172a] sm:text-center">
                    Custom Domain
                  </span>
                  <span className="min-w-0 text-center text-sm font-medium text-[#0f172a] sm:text-center">
                    Reliable web hosting
                  </span>
                  <span className="min-w-0 text-center text-sm font-medium text-[#0f172a] sm:text-center">
                    24/7 customer care
                  </span>
                </div>
              </div>

              <div className="mt-8 flex w-full justify-center px-3 sm:px-4">
                <div className="planning-billing-toggle-wrap flex w-full max-w-xl items-center gap-3 sm:gap-5">
                  <span
                    className={`planning-billing-label inline-flex min-h-9 min-w-0 flex-1 select-none items-center justify-end py-1.5 pl-2 pr-1 text-right text-sm leading-tight sm:pr-2 ${
                      !billingYearly ? "font-bold text-[#0c1e36]" : "font-medium text-[#3d4f63]"
                    }`}
                  >
                    Bill Monthly
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={billingYearly}
                    aria-label="Toggle monthly or yearly billing"
                    onClick={() => setBillingYearly((v) => !v)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center self-center rounded-full border border-[#94a3b8] bg-white px-0.5 align-middle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06224C]/40 focus-visible:ring-offset-2"
                  >
                    <span
                      className={`pointer-events-none absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#06224C] shadow-sm transition-transform duration-200 ${
                        billingYearly ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span
                    className={`planning-billing-label inline-flex min-h-9 min-w-0 flex-1 select-none items-center justify-start py-1.5 pl-1 pr-2 text-left text-sm leading-tight sm:pl-2 ${
                      billingYearly ? "font-bold text-[#0c1e36]" : "font-medium text-[#3d4f63]"
                    }`}
                  >
                    Bill Yearly
                  </span>
                </div>
              </div>
              </div>

              <div className="planning-plans-grid mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 md:items-stretch">
                {plans.map((plan) => (
                  <article
                    key={plan.name}
                    className={`group relative flex h-full min-h-0 flex-col rounded border border-[#d8e1ec] bg-white p-4 text-[#0f172a] shadow-sm transition-all duration-200 hover:border-transparent hover:bg-gradient-to-b hover:from-[#06224C] hover:to-[#1A5BBC] hover:text-white hover:shadow-md sm:p-4 ${
                      plan.isRecommended ? "planning-recommended-card" : ""
                    }`}
                  >
                    {plan.isRecommended && (
                      <div className="planning-recommended-badge absolute right-0 top-0 z-10 rounded-bl-md border border-white/10 bg-[#1A5BBC] px-3 py-1.5 text-[9px] font-extrabold leading-none tracking-wide text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors group-hover:border-[#06224C]/40 group-hover:bg-white group-hover:text-[#06224C] hover:border-[#06224C]/40 hover:bg-white hover:text-[#06224C]">
                        RECOMMENDED
                      </div>
                    )}
                    <div className={`mb-1.5 flex items-center justify-between gap-2 ${plan.isRecommended ? "planning-recommended-content-offset" : ""}`}>
                      <div>
                        <h2 className="text-base font-bold leading-tight transition-colors group-hover:text-white">{plan.name}</h2>
                        <p className="mt-0.5 text-xs leading-tight text-[#1e3a5c] transition-colors group-hover:text-white">
                          {billingYearly ? "Per year" : "Per month"}
                        </p>
                      </div>
                    </div>

                    <div className="planning-price-row mb-1.5 flex items-start justify-between gap-2 lg:items-end">
                      <div className="planning-price-oldsave flex min-w-0 flex-wrap items-end gap-x-1.5 gap-y-0.5 pr-1">
                        <div className="text-sm font-bold text-[#0f172a] line-through transition-colors group-hover:text-white">
                          {billingYearly ? plan.yearlyOldPrice : plan.oldPrice}
                        </div>
                        <div className="text-[10px] font-semibold leading-tight text-[#2d4a6e] transition-colors group-hover:text-white">
                          {billingYearly ? plan.yearlySaveText : plan.saveText}
                        </div>
                      </div>
                      <div className="planning-price-chip relative top-0 mr-1 shrink-0 rounded border border-[#94b4e0] bg-[#e8f0fc] px-2 py-1 text-base font-bold leading-none text-[#082a5c] transition-colors lg:-top-2 lg:mr-3 lg:px-3.5 lg:py-1.5 lg:text-xl group-hover:border-white/30 group-hover:bg-white group-hover:text-[#0f3e87]">
                        {billingYearly ? plan.yearlyNewPrice : plan.newPrice}
                      </div>
                    </div>
                    <div className="mb-2 h-px w-full bg-[#dbe3ef] transition-colors group-hover:bg-white/30" />

                    <ul className="space-y-1 text-xs leading-snug text-[#0f172a] transition-colors group-hover:text-white sm:text-sm sm:leading-snug">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-1.5">
                          <FaCheckCircle className="mt-px shrink-0 text-[10px] text-[#0b3268] transition-colors group-hover:text-white" aria-hidden={true} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-2 min-h-0 w-full flex-1 shrink-0" aria-hidden />

                    <button
                      type="button"
                      onClick={() => handlePurchasePlan(plan)}
                      className="block w-full shrink-0 rounded-full bg-gradient-to-r from-[#06224C] to-[#1A5BBC] py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors transition-opacity duration-200 group-hover:bg-none group-hover:bg-white group-hover:text-[#154fa2] group-hover:opacity-100 hover:bg-none hover:bg-white hover:text-[#154fa2]"
                    >
                      Purchase Plan
                    </button>
                  </article>
                ))}
              </div>
            </div>
            )}

            {planningView === "payment" && selectedPlan && (
              <div
                className="planning-payment-view mx-auto w-full text-white"
                style={{
                  maxWidth: 740,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #2b66be 0%, #0a2a5f 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                <div className="border-b border-white/20 px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6">
                  <div className="mb-4 text-left">
                    <button
                      type="button"
                      onClick={handleBackToPlans}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-sm"
                      aria-label="Back to plans"
                    >
                      ← Back to plans
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold sm:text-3xl">Secure Payment</h2>
                    <p className="mt-2 text-xs text-white/85 sm:text-sm">{paymentSubtitle()}</p>
                  </div>
                </div>
                <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8" style={{ maxWidth: 430 }}>
                  <div className="space-y-3 text-xs sm:space-y-4 sm:text-sm">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        className="accent-white"
                        checked={paymentMethod === "paypal"}
                        onChange={() => setPaymentMethod("paypal")}
                      />
                      Paypal
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        className="accent-white"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                      />
                      Credit / Debit Card
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        className="accent-white"
                        checked={paymentMethod === "netbanking"}
                        onChange={() => setPaymentMethod("netbanking")}
                      />
                      Net Banking
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        className="accent-white"
                        checked={paymentMethod === "online"}
                        onChange={() => setPaymentMethod("online")}
                      />
                      Online Payment ( g-pay / Phone pay )
                    </label>
                  </div>

                  <div className="mt-5 border-t border-white/15 pt-5 text-xs sm:text-sm">
                    {paymentMethod === "paypal" && (
                      <div className="space-y-3">
                        <p className="text-white/80">You will be redirected to PayPal to log in and approve this payment.</p>
                        <input
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="PayPal email"
                          className="block w-full rounded border border-white/40 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/70 focus:outline-none sm:text-sm"
                          style={{ width: "100%" }}
                        />
                      </div>
                    )}

                    {paymentMethod === "card" && (
                      <div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(cardDigitsOnly(e.target.value, CARD_NUMBER_MAX_LEN))}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          autoComplete="cc-number"
                          placeholder="Card Number"
                          className="mb-4 block w-full rounded border border-white/40 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/70 focus:outline-none sm:text-sm"
                          style={{ width: "100%" }}
                        />
                        <div className="grid grid-cols-2 gap-2" style={{ width: "100%" }}>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatCardExpiryMmYy(e.target.value))}
                            inputMode="numeric"
                            pattern="[0-9/]*"
                            autoComplete="cc-exp"
                            placeholder="MM/YY"
                            className="rounded border border-white/40 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/70 focus:outline-none sm:text-sm"
                          />
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(cardDigitsOnly(e.target.value, CARD_CVV_MAX_LEN))}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="cc-csc"
                            placeholder="Cvv"
                            className="rounded border border-white/40 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/70 focus:outline-none sm:text-sm"
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "netbanking" && (
                      <div className="space-y-3">
                        <label className="block text-white/90">Select your bank</label>
                        <select
                          value={netBank}
                          onChange={(e) => setNetBank(e.target.value)}
                          className="w-full rounded border border-white/40 bg-[#0a2a5f]/80 px-3 py-2 text-xs text-white focus:outline-none sm:text-sm"
                        >
                          <option value="">Choose bank…</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                          <option value="other">Other bank</option>
                        </select>
                        <p className="text-[11px] leading-snug text-white/75">
                          You will be taken to your bank&apos;s website to authorize payment, then returned here.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "online" && (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="onlineWallet"
                              className="accent-white"
                              checked={onlineWallet === "gpay"}
                              onChange={() => setOnlineWallet("gpay")}
                            />
                            Google Pay
                          </label>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="onlineWallet"
                              className="accent-white"
                              checked={onlineWallet === "phonepe"}
                              onChange={() => setOnlineWallet("phonepe")}
                            />
                            PhonePe
                          </label>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-white/90">UPI ID</label>
                          <input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="name@bank / name@upi"
                            autoComplete="off"
                            className="block w-full rounded border border-white/40 bg-transparent px-3 py-2 text-xs text-white placeholder:text-white/70 focus:outline-none sm:text-sm"
                            style={{ width: "100%" }}
                          />
                          <p className="mt-2 text-[11px] leading-snug text-white/75">
                            {onlineWallet === "gpay"
                              ? "Open Google Pay and approve the request, or pay with your UPI ID above."
                              : "Open PhonePe and approve the request, or pay with your UPI ID above."}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="border-t border-white/20 px-4 py-5 text-center sm:px-6 sm:py-6">
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={paymentLoading}
                    className="inline-flex min-w-[160px] items-center justify-center rounded bg-white px-5 py-2 text-xs font-semibold text-[#1f2937] disabled:opacity-70 sm:min-w-[180px] sm:px-6 sm:text-sm"
                  >
                    {paymentLoading ? "Processing payment..." : "Complete Payment"}
                  </button>
                </div>
              </div>
            )}

            {planningView === "invoice" && invoiceData && (
              <div
                className="planning-invoice-view mx-auto w-full text-white"
                style={{
                  maxWidth: 900,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #2a66be 0%, #0b2a5c 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
                }}
              >
                <div className="px-4 py-5 sm:px-8 sm:py-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                  <div className="mb-4 text-left">
                    <button
                      type="button"
                      onClick={handleBackToPlans}
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-sm"
                      aria-label="Back to plans"
                    >
                      ← Back to plans
                    </button>
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold leading-tight sm:text-[36px]">Invoice Details</h2>
                  </div>
                </div>
                <div className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-8 sm:py-7">
                  <div className="mx-auto w-full max-w-2xl space-y-3 text-xs sm:space-y-4 sm:text-[15px]">
                    <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Invoice ID</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.invoiceId}</span></div>
                    <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Date</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.date}</span></div>
                    <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Plan</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.planName}</span></div>
                    <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Amount</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.amount}</span></div>
                  </div>
                  <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                    <h3 className="mx-auto mb-4 w-full max-w-2xl text-xl font-semibold sm:mb-5 sm:text-[30px]">Billing Information</h3>
                    <div className="mx-auto w-full max-w-2xl space-y-3 text-xs sm:space-y-4 sm:text-[15px]">
                      <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Name</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.name}</span></div>
                      <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Email</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.email}</span></div>
                      <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Contact No</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.contactNo}</span></div>
                      <div className="planning-invoice-row" style={{ display: "grid", gridTemplateColumns: "96px 14px minmax(0,1fr)", alignItems: "center" }}><span>Address</span><span>:</span><span className="planning-invoice-value break-words">{invoiceData.address}</span></div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 text-center sm:px-8 sm:py-6" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <button
                    type="button"
                    onClick={() => setPlanningView("history")}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2 text-xs font-semibold text-[#1f2937] sm:px-6 sm:py-2.5 sm:text-[15px]"
                  >
                    <span aria-hidden>↓</span>
                    Download Invoice
                  </button>
                </div>
              </div>
            )}

            {planningView === "history" && (
              <div
                className="planning-history-view mx-auto my-4 w-full p-3 text-white sm:my-6 sm:p-4"
                style={{
                  maxWidth: 560,
                  borderRadius: 8,
                  background: "linear-gradient(180deg, #2f6dca 0%, #0a2a5f 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.28)",
                  border: "2px solid #8aa0c1",
                }}
              >
                <div className="mx-auto mb-3 w-full max-w-[470px] text-left">
                  <button
                    type="button"
                    onClick={handleBackToPlans}
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:text-sm"
                    aria-label="Back to plans"
                  >
                    ← Back to plans
                  </button>
                </div>
                <div className="planning-history-track mx-auto mb-3 flex w-full max-w-[470px] items-center justify-between pb-3 sm:mb-4 sm:pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.17)" }}>
                  <h2 className="text-2xl font-bold leading-tight tracking-[0.2px] sm:text-[34px]">Billing History</h2>
                  <div
                    className="flex items-center overflow-hidden rounded-md bg-white"
                    style={{ color: "#1f2937", fontSize: 10, lineHeight: 1.2, boxShadow: "0 0 0 1px rgba(15,23,42,0.08)" }}
                  >
                    <button
                      type="button"
                      onClick={() => setHistoryYearFilter("all")}
                      style={{
                        borderRight: "1px solid #e2e8f0",
                        padding: "7px 10px",
                        color: "#1f2937",
                        background: historyYearFilter === "all" ? "#eef2ff" : "transparent",
                        fontWeight: historyYearFilter === "all" ? 700 : 500,
                      }}
                    >
                      All Invoices
                    </button>
                    <select
                      id="historyYearSelect"
                      value={historyYearFilter}
                      onChange={(e) => setHistoryYearFilter(e.target.value)}
                      style={{ padding: "7px 10px", color: "#1f2937", border: 0, outline: "none", background: "transparent", fontWeight: historyYearFilter === "all" ? 500 : 700 }}
                    >
                      <option value="this">This Year</option>
                      {historyYears.map((year) => (
                        <option key={year} value={String(year)}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="planning-history-table-wrap mx-auto w-full max-w-[470px] overflow-x-auto rounded-md bg-white" style={{ boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)" }}>
                  <table className="w-full min-w-[470px] text-left" style={{ fontSize: 10.5, color: "#0f172a" }}>
                    <thead className="bg-[#f3f4f6] text-[11px] font-semibold text-[#1f2937]" style={{ borderBottom: "2px solid #d1d5db" }}>
                      <tr>
                        <th className="px-3 py-3.5">Date</th>
                        <th className="px-3 py-3.5">Invoice ID</th>
                        <th className="px-3 py-3.5">Amount</th>
                        <th className="px-3 py-3.5">Status</th>
                        <th className="px-3 py-3.5">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBillingHistory.map((entry, index) => (
                        <tr key={`${entry.invoiceId}-${entry.date}-${index}`} style={{ borderTop: "1px solid #e2e8f0" }}>
                          <td className="px-3 py-3.5">{entry.date}</td>
                          <td className="px-3 py-3.5">{entry.invoiceId}</td>
                          <td className="px-3 py-3.5">{entry.amount}</td>
                          <td className="px-3 py-3.5">
                            <span
                              className="inline-flex min-w-[56px] justify-center rounded-md px-2 py-1 text-[10px] font-bold text-white"
                              style={{ backgroundColor: entry.status === "Paid" ? "#4f8f43" : "#667085" }}
                            >
                              {entry.status}
                            </span>
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className="inline-flex h-6 w-7 items-center justify-center rounded-md text-xs font-bold text-white"
                              style={{ backgroundColor: "#1e7fd8" }}
                              aria-hidden
                            >
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4v8m0 0l-3-3m3 3l3-3M5 14h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
