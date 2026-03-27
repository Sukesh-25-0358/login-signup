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

const plans = [
  {
    name: "Basic",
    oldPrice: "$80",
    newPrice: "$40",
    saveText: "Save 50%",
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
    newPrice: "$180",
    saveText: "Save 30%",
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

export default function PlanningPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavId>("billing");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingYearly, setBillingYearly] = useState(false);
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

  return (
    <main className="min-h-screen bg-[#efefef]">
      <nav className="w-full bg-[#06224C]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:flex-nowrap sm:px-6">
          <div className="flex min-w-0 flex-shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/25 text-white md:hidden"
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

          <div className="hidden min-w-0 flex-1 md:flex md:items-center">
            <nav
              className="flex w-full min-w-0 flex-wrap items-center justify-evenly gap-x-2 gap-y-2 text-[13px] text-white/90 sm:text-sm sm:gap-x-3"
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

          <div className="ml-auto flex flex-wrap shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 md:hidden">
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer sm:h-6 sm:w-6"
                aria-label="Open quick action 1"
              >
                <img src="/logoplan.webp" alt="" className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer sm:h-6 sm:w-6"
                aria-label="Open quick action 2"
              >
                <img src="/logoplan2.webp" alt="" className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4" />
              </button>
              <button
                type="button"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer sm:h-6 sm:w-6"
                aria-label="Open quick action 3"
              >
                <img src="/logoplan3.webp" alt="" className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4" />
              </button>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer"
                aria-label="Quick action 1"
              >
                <img src="/logoplan.webp" alt="" className="h-4 w-4 object-contain" />
              </button>
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer"
                aria-label="Quick action 2"
              >
                <img src="/logoplan2.webp" alt="" className="h-4 w-4 object-contain" />
              </button>
              <button
                type="button"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-white border-0 p-0 m-0 cursor-pointer"
                aria-label="Quick action 3"
              >
                <img src="/logoplan3.webp" alt="" className="h-4 w-4 object-contain" />
              </button>
            </div>

            <div className="relative" ref={profileWrapRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileOpen((o) => !o);
                }}
                className="items-center gap-2 lg:flex"
                aria-expanded={profileOpen}
                aria-haspopup="true"
              >
                <img
                  src="/photo.webp"
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="max-w-[140px] truncate text-left text-[11px] text-white sm:max-w-[180px]">
                  {PLANNING_DISPLAY_USER_NAME}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  className={`hidden shrink-0 text-white/90 transition-transform sm:block ${profileOpen ? "rotate-180" : ""}`}
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
          <div className="border-t border-white/20 px-3 pb-3 pt-2 md:hidden">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`rounded-md border px-2 py-2 text-left text-xs ${
                    activeNav === item.id
                      ? "border-[#f0e6d4] bg-white/10 text-white"
                      : "border-white/20 text-white/90"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
        <div className="rounded-sm border border-[#dbe3ef] bg-white shadow-sm">
          <section
            ref={plansSectionRef}
            id="planning-billing-content"
            className="scroll-mt-4 px-3 py-5 sm:px-8 sm:py-8"
          >
            <div className="mx-auto mb-4 max-w-5xl rounded bg-gradient-to-r from-[#06224C] to-[#1A5BBC] px-4 py-2 text-center text-[11px] font-semibold text-white sm:text-xs">
              Upgrade Now: Get - 50% Off on Selected Plans
            </div>

            <div className="rounded bg-[#edf3fb] px-3 py-6 sm:px-8">
              <h1 className="text-center text-3xl font-bold text-[#0b3268] sm:text-[44px] sm:leading-tight">
                Choose the Best Plan for You
              </h1>
              <p className="mt-2 text-center text-[11px] text-[#6d7f9d] sm:text-xs">
                Create your website for free and upgrade when you’re ready.
              </p>

              <div className="mt-3 flex justify-center">
                <Link
                  href="/page-not-found"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#06224C] to-[#1A5BBC] px-5 py-2.5 text-[11px] font-semibold text-white hover:opacity-90 sm:text-xs"
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
                </Link>
              </div>

              <div className="mt-5 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:mt-6 sm:justify-between sm:text-left">
                <p className="w-full text-[11px] font-bold leading-snug text-[#1f3861] sm:w-auto sm:shrink-0">
                  What you get with every plan:
                </p>
                <span className="text-[10px] font-normal text-[#63789b] sm:text-[11px]">
                  Custom Domain
                </span>
                <span className="text-[10px] font-normal text-[#63789b] sm:text-[11px]">
                  Reliable web hosting
                </span>
                <span className="text-[10px] font-normal text-[#63789b] sm:text-[11px]">
                  24/7 customer care
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setBillingYearly(false)}
                  className={`text-[11px] ${
                    !billingYearly
                      ? "font-bold text-[#1f3861]"
                      : "font-normal text-[#63789b]"
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
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-[#94a3b8] bg-white px-0.5"
                >
                  <span
                    className={`pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-[#06224C] shadow-sm transition-transform duration-200 ${
                      billingYearly ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setBillingYearly(true)}
                  className={`text-[11px] ${
                    billingYearly
                      ? "font-bold text-[#1f3861]"
                      : "font-normal text-[#63789b]"
                  }`}
                >
                  Bill Yearly
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                {plans.map((plan) => (
                  <article
                    key={plan.name}
                    className="group relative rounded border border-[#d8e1ec] bg-white p-4 text-[#17335c] shadow-sm transition-all duration-200 hover:border-transparent hover:bg-gradient-to-b hover:from-[#06224C] hover:to-[#1A5BBC] hover:text-white hover:shadow-md"
                  >
                    {plan.isRecommended && (
                      <div className="absolute right-0 top-0 z-10 rounded-bl-md border border-white/10 bg-[#1A5BBC] px-3 py-1.5 text-[9px] font-extrabold leading-none tracking-wide text-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] transition-colors group-hover:border-[#06224C]/40 group-hover:bg-white group-hover:text-[#06224C] hover:border-[#06224C]/40 hover:bg-white hover:text-[#06224C]">
                        RECOMMENDED
                      </div>
                    )}
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base font-bold">{plan.name}</h2>
                        <p className="text-xs opacity-80">Per month</p>
                      </div>
                    </div>

                    <div className="mb-2 flex items-end justify-between">
                      <div className="flex items-end gap-2">
                        <div className="text-sm font-bold text-[#1f3861] line-through transition-colors group-hover:text-white">{plan.oldPrice}</div>
                        <div className="text-[10px] font-semibold text-[#5e80b5] transition-colors group-hover:text-white">
                          {plan.saveText}
                        </div>
                      </div>
                      <div className="rounded border border-[#bed2f3] bg-[#f4f8ff] px-2 py-1 text-lg font-bold text-[#0f3e87] group-hover:border-white/30 group-hover:bg-white group-hover:text-[#0f3e87]">
                        {plan.newPrice}
                      </div>
                    </div>
                    <div className="mb-3 h-px w-full bg-[#dbe3ef] group-hover:bg-white/30" />

                    <ul className="space-y-2 text-xs leading-relaxed sm:text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <FaCheckCircle className="mt-0.5 text-[11px] opacity-90" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/page-not-found"
                      className="mt-4 block rounded-full bg-gradient-to-r from-[#06224C] to-[#1A5BBC] py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors transition-opacity duration-200 group-hover:bg-none group-hover:bg-white group-hover:text-[#154fa2] group-hover:opacity-100 hover:bg-none hover:bg-white hover:text-[#154fa2]"
                    >
                      Purchase Plan
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
