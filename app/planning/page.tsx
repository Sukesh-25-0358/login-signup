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

const plans = [
  {
    name: "Basic",
    oldPrice: "$80",
    newPrice: "$40",
    saveText: "Save 50%",
    yearlyOldPrice: "$960",
    yearlyNewPrice: "$400",
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
    yearlyNewPrice: "$1,500",
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

export default function PlanningPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>("billing");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);
  const [planningView, setPlanningView] = useState<PlanningView>("plans");
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryEntry[]>(DEFAULT_BILLING_HISTORY);
  const plansSectionRef = useRef<HTMLElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);

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

  function handlePurchasePlan(plan: Plan) {
    setSelectedPlan(plan);
    setPlanningView("payment");
    setPaymentLoading(false);
  }

  function handleCompletePayment() {
    if (!selectedPlan) return;
    setPaymentLoading(true);
    window.setTimeout(() => {
      const now = new Date();
      const invoiceId = `INV-${Math.floor(100000 + Math.random() * 899999)}`;
      const active = getActivePrice(selectedPlan);
      const createdInvoice: InvoiceData = {
        invoiceId,
        date: now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
        planName: `${selectedPlan.name} ${billingYearly ? "(Yearly)" : "(Monthly)"}`,
        amount: active.newPrice,
        name: PLANNING_DISPLAY_USER_NAME,
        email: "srinu@gmail.com",
        contactNo: "9848xxxx19",
        address: "Chennai - 636008",
      };
      setInvoiceData(createdInvoice);
      setBillingHistory((prev) => [
        {
          date: createdInvoice.date,
          invoiceId: createdInvoice.invoiceId,
          amount: createdInvoice.amount,
          status: "Paid",
        },
        ...prev,
      ]);
      setPaymentLoading(false);
      setPlanningView("invoice");
    }, 2400);
  }

  return (
    <main className="planning-page min-h-[100dvh] w-full bg-[#efefef] overflow-x-hidden">
      <nav className="w-full bg-[#06224C]">
        <div className="flex w-full flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-8 xl:flex-nowrap">
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
                  className={`shrink-0 border-b-2 pb-0.5 transition-colors ${
                    activeNav === item.id
                      ? "border-[#f0e6d4] font-medium text-white"
                      : "border-transparent hover:text-white"
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
                <img src="/logoplan.webp" alt="" className="h-[17px] w-[17px] object-contain" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-8 w-8 touch-manipulation`}
                aria-label="Settings"
              >
                <img src="/logoplan2.webp" alt="" className="h-[17px] w-[17px] object-contain" />
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
                <img src="/logoplan.webp" alt="" className="h-4 w-4 object-contain" />
              </button>
              <button
                type="button"
                className={`${planningHeaderQuickIconBtn} h-6 w-6`}
                aria-label="Settings"
              >
                <img src="/logoplan2.webp" alt="" className="h-4 w-4 object-contain" />
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
                Create your website for free and upgrade when you’re ready.
              </p>

              <div className="mt-5 flex justify-center sm:mt-6">
                <button
                  type="button"
                  onClick={() => handlePurchasePlan(plans[0])}
                  className="inline-flex items-center gap-2 rounded-full border-0 bg-gradient-to-r from-[#06224C] to-[#1A5BBC] px-5 py-2.5 text-[11px] font-semibold text-white no-underline shadow-md transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#06224C]/45 hover:ring-2 hover:ring-white/55 active:translate-y-0 active:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/90 sm:text-xs"
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
                <div className="flex w-full max-w-xl items-center gap-3 sm:gap-5">
                  <button
                    type="button"
                    onClick={() => setBillingYearly(false)}
                    className={`inline-flex min-h-9 min-w-0 flex-1 cursor-pointer items-center justify-end border-0 bg-transparent py-1.5 pl-2 pr-1 text-right text-sm leading-tight transition-colors sm:pr-2 ${
                      !billingYearly
                        ? "font-bold text-[#0c1e36]"
                        : "font-medium text-[#3d4f63]"
                    }`}
                  >
                    Bill Monthly
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={billingYearly}
                    aria-label="Toggle monthly or yearly billing"
                    onClick={() => setBillingYearly((v) => !v)}
                    className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center self-center rounded-full border border-[#94a3b8] bg-white px-0.5 align-middle"
                  >
                    <span
                      className={`pointer-events-none absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#06224C] shadow-sm transition-transform duration-200 ${
                        billingYearly ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingYearly(true)}
                    className={`inline-flex min-h-9 min-w-0 flex-1 cursor-pointer items-center justify-start border-0 bg-transparent py-1.5 pl-1 pr-2 text-left text-sm leading-tight transition-colors sm:pl-2 ${
                      billingYearly
                        ? "font-bold text-[#0c1e36]"
                        : "font-medium text-[#3d4f63]"
                    }`}
                  >
                    Bill Yearly
                  </button>
                </div>
              </div>
              </div>

              <div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 md:items-stretch">
                {plans.map((plan) => (
                  <article
                    key={plan.name}
                    className="group relative flex h-full min-h-0 flex-col rounded border border-[#d8e1ec] bg-white p-4 text-[#0f172a] shadow-sm transition-all duration-200 hover:border-transparent hover:bg-gradient-to-b hover:from-[#06224C] hover:to-[#1A5BBC] hover:text-white hover:shadow-md sm:p-4"
                  >
                    {plan.isRecommended && (
                      <div className="absolute right-0 top-0 z-10 rounded-bl-md border border-white/10 bg-[#1A5BBC] px-3 py-1.5 text-[9px] font-extrabold leading-none tracking-wide text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors group-hover:border-[#06224C]/40 group-hover:bg-white group-hover:text-[#06224C] hover:border-[#06224C]/40 hover:bg-white hover:text-[#06224C]">
                        RECOMMENDED
                      </div>
                    )}
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold leading-tight transition-colors group-hover:text-white">{plan.name}</h2>
                        <p className="mt-0.5 text-xs leading-tight text-[#1e3a5c] transition-colors group-hover:text-white">
                          {billingYearly ? "Per year" : "Per month"}
                        </p>
                      </div>
                    </div>

                    <div className="mb-1.5 flex items-end justify-between gap-2">
                      <div className="flex min-w-0 items-end gap-1.5">
                        <div className="text-sm font-bold text-[#0f172a] line-through transition-colors group-hover:text-white">
                          {billingYearly ? plan.yearlyOldPrice : plan.oldPrice}
                        </div>
                        <div className="text-[10px] font-semibold leading-tight text-[#2d4a6e] transition-colors group-hover:text-white">
                          {billingYearly ? plan.yearlySaveText : plan.saveText}
                        </div>
                      </div>
                      <div className="relative -top-2 mr-3 shrink-0 rounded border border-[#94b4e0] bg-[#e8f0fc] px-3.5 py-1.5 text-xl font-bold leading-none text-[#082a5c] transition-colors group-hover:border-white/30 group-hover:bg-white group-hover:text-[#0f3e87]">
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
                className="mx-auto w-full text-white"
                style={{
                  maxWidth: 740,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #2b66be 0%, #0a2a5f 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.2)",
                }}
              >
                <div className="border-b border-white/20 px-6 py-8 text-center">
                  <h2 className="text-3xl font-bold">Secure Payment</h2>
                  <p className="mt-2 text-sm text-white/85">Enter your payment details to Upgrade</p>
                </div>
                <div className="mx-auto w-full px-6 py-8" style={{ maxWidth: 430 }}>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Card Number"
                    className="mb-4 block w-full rounded border border-white/40 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
                    style={{ width: "100%" }}
                  />
                  <div className="mb-6 grid grid-cols-2 gap-2" style={{ width: "100%" }}>
                    <input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="rounded border border-white/40 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
                    />
                    <input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="Cvv"
                      className="rounded border border-white/40 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/70 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-4 text-sm">
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pm" checked={paymentMethod === "paypal"} onChange={() => setPaymentMethod("paypal")} />
                      Paypal
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pm" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                      Credit / Debit Card
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pm" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
                      Net Banking
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="radio" name="pm" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")} />
                      Online Payment ( g-pay / Phone pay )
                    </label>
                  </div>
                </div>
                <div className="border-t border-white/20 px-6 py-6 text-center">
                  <button
                    type="button"
                    onClick={handleCompletePayment}
                    disabled={paymentLoading}
                    className="inline-flex min-w-[180px] items-center justify-center rounded bg-white px-6 py-2 text-sm font-semibold text-[#1f2937] disabled:opacity-70"
                  >
                    {paymentLoading ? "Processing payment..." : "Complete Payment"}
                  </button>
                </div>
              </div>
            )}

            {planningView === "invoice" && invoiceData && (
              <div
                className="mx-auto w-full text-white"
                style={{
                  maxWidth: 900,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #2a66be 0%, #0b2a5c 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.25)",
                }}
              >
                <div className="px-8 py-6 text-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                  <h2 className="text-[36px] font-bold leading-tight">Invoice Details</h2>
                </div>
                <div className="space-y-8 px-8 py-7">
                  <div className="mx-auto w-full max-w-2xl space-y-4 text-[15px]">
                    <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Invoice ID</span><span>:</span><span>{invoiceData.invoiceId}</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Date</span><span>:</span><span>{invoiceData.date}</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Plan</span><span>:</span><span>{invoiceData.planName}</span></div>
                    <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Amount</span><span>:</span><span>{invoiceData.amount}</span></div>
                  </div>
                  <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                    <h3 className="mx-auto mb-5 w-full max-w-2xl text-[30px] font-semibold">Billing Information</h3>
                    <div className="mx-auto w-full max-w-2xl space-y-4 text-[15px]">
                      <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Name</span><span>:</span><span>{invoiceData.name}</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Email</span><span>:</span><span>{invoiceData.email}</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Contact No</span><span>:</span><span>{invoiceData.contactNo}</span></div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 24px 1fr", alignItems: "center" }}><span>Address</span><span>:</span><span>{invoiceData.address}</span></div>
                    </div>
                  </div>
                </div>
                <div className="px-8 py-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <button
                    type="button"
                    onClick={() => setPlanningView("history")}
                    className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-[15px] font-semibold text-[#1f2937]"
                  >
                    <span aria-hidden>↓</span>
                    Download Invoice
                  </button>
                </div>
              </div>
            )}

            {planningView === "history" && (
              <div
                className="mx-auto my-6 w-full p-4 text-white"
                style={{
                  maxWidth: 560,
                  borderRadius: 8,
                  background: "linear-gradient(180deg, #2f6dca 0%, #0a2a5f 100%)",
                  boxShadow: "0 2px 0 rgba(0,0,0,0.28)",
                  border: "2px solid #8aa0c1",
                }}
              >
                <div className="mx-auto mb-4 flex w-full max-w-[470px] items-center justify-between pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.17)" }}>
                  <h2 className="text-[34px] font-bold leading-tight tracking-[0.2px]">Billing History</h2>
                  <div
                    className="flex items-center overflow-hidden rounded-md bg-white"
                    style={{ color: "#1f2937", fontSize: 10, lineHeight: 1.2, boxShadow: "0 0 0 1px rgba(15,23,42,0.08)" }}
                  >
                    <button type="button" style={{ borderRight: "1px solid #e2e8f0", padding: "7px 10px", color: "#1f2937" }}>All Invoices</button>
                    <button type="button" style={{ padding: "7px 10px", color: "#1f2937" }}>This Year ▾</button>
                  </div>
                </div>
                <div className="mx-auto w-full max-w-[470px] overflow-x-auto rounded-md bg-white" style={{ boxShadow: "inset 0 0 0 1px rgba(15,23,42,0.08)" }}>
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
                      {billingHistory.map((entry) => (
                        <tr key={`${entry.invoiceId}-${entry.date}`} style={{ borderTop: "1px solid #e2e8f0" }}>
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
