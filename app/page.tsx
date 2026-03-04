"use client";

import {
  Check,
  X,
  Skull,
  Globe,
  FileText,
  Film,
  Phone,
  Lightbulb,
  Lock,
  ChevronDown,
  Building2,
  ShoppingBag,
  Mail,
  MapPin,
  ArrowRight,
  FileSpreadsheet,
  Archive,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const LEMON_STANDARD_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587";
const LEMON_ALPHA_URL =
  "https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Home() {
  const [memberCount, setMemberCount] = useState(124);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [visible, setVisible] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setVisible((v) => new Set(v).add(entry.target.id));
          }
        });
      },
      { threshold: 0.12 }
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const tick = useCallback(() => {
    if (Math.random() < 0.25 && memberCount < 1000)
      setMemberCount((c) => c + 1);
    setTimeout(tick, 5000 + Math.random() * 10000);
  }, [memberCount]);
  useEffect(() => {
    const t = setTimeout(tick, 8000);
    return () => clearTimeout(t);
  }, [tick]);

  const reveal = (id: string) =>
    `transition-all duration-700 ease-out ${
      visible.has(id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
    }`;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1916] overflow-x-hidden">
      <main className="pt-0">
        {/* Hero */}
        <section
          id="hero"
          className="relative pt-24 pb-20 sm:pt-28 sm:pb-24 px-4 sm:px-6 bg-[#F8F7F4]"
        >
          <div className="relative text-center max-w-[820px] mx-auto">
            <div
              data-reveal
              id="hero-badge"
              className={`inline-flex items-center gap-2 bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs font-semibold px-3 py-1.5 rounded-full mb-6 ${reveal("hero-badge")}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
              Alpha Members Active: <strong>{memberCount}</strong> / 1,000
            </div>
            <h1
              data-reveal
              id="hero-title"
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-5 ${reveal("hero-title")}`}
            >
              <span className="block text-[#1A1916]">Stop Chasing Trends.</span>
              <span className="block text-[#16A34A]">Scout Them First.</span>
            </h1>
            <p
              data-reveal
              id="hero-sub"
              className={`text-[#6B6860] text-base sm:text-lg max-w-[580px] mx-auto mb-8 leading-relaxed ${reveal("hero-sub")}`}
            >
              We decode Korea&apos;s viral trends and deliver a weekly{" "}
              <span className="text-[#1A1916] font-semibold border-b-2 border-[#16A34A] pb-0.5">
                [Digital Execution Blueprint]
              </span>
              . Complete with raw ad assets, supplier contacts, and launch data.
            </p>
            <div
              data-reveal
              id="hero-ctas"
              className={`flex gap-3 justify-center flex-wrap ${reveal("hero-ctas")}`}
            >
              <button
                onClick={() => scrollToId("pricing")}
                className="px-6 py-3 rounded-xl border border-[#E8E6E1] text-[#3D3B36] text-sm font-medium hover:bg-[#F2F1EE] hover:border-[#D4D1CA] transition-all"
              >
                View Sample Report
              </button>
              <button
                onClick={() => scrollToId("pricing")}
                className="px-6 py-3 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-all"
              >
                Get Sourcing Kit ($29) →
              </button>
            </div>
            <div
              data-reveal
              id="hero-trust"
              className={`flex gap-4 sm:gap-6 justify-center flex-wrap mt-4 ${reveal("hero-trust")}`}
            >
              <span className="flex items-center gap-1.5 text-xs text-[#6B6860]">
                <FileText className="w-3.5 h-3.5" /> Instant Digital Download
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#6B6860]">
                <Film className="w-3.5 h-3.5" /> Raw Video Assets
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[#6B6860]">
                <Phone className="w-3.5 h-3.5" /> Direct Contacts
              </span>
            </div>
            <div
              data-reveal
              id="hero-stats"
              className={`flex gap-8 sm:gap-10 justify-center flex-wrap mt-12 ${reveal("hero-stats")}`}
            >
              {[
                { num: "2 WEEKS", label: "Ahead of Global Market" },
                { num: "REAL DATA", label: "Verified Korean Sources" },
                { num: "FULL KIT", label: "Video + Supplier Contacts" },
              ].map((s) => (
                <div key={s.num} className="text-center">
                  <span className="text-2xl font-bold text-[#16A34A] block">
                    {s.num}
                  </span>
                  <span className="text-xs text-[#9E9C98] uppercase tracking-widest">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section
          id="comparison"
          className="py-16 sm:py-24 px-4 sm:px-6 border-t border-b border-[#E8E6E1] bg-white"
        >
          <div
            data-reveal
            id="comparison-header"
            className={`text-center max-w-[680px] mx-auto mb-10 ${reveal("comparison-header")}`}
          >
            <p className="text-xs uppercase tracking-widest text-[#16A34A] font-semibold mb-4">
              The Raw Truth
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1916] mb-3">
              Stop chasing what&apos;s already viral.
              <br />
              Start sourcing where it starts.
            </h2>
            <p className="text-base text-[#6B6860] max-w-[520px] mx-auto">
              The difference between fighting for $1 margins and leading the
              market.
            </p>
          </div>
          <div
            data-reveal
            id="comparison-grid-wrap"
            className={`relative max-w-[900px] mx-auto ${reveal("comparison-grid-wrap")}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl p-6 sm:p-8 bg-[#F8F7F4] border border-[#E8E6E1] text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F2F1EE] border border-[#E8E6E1] text-[#6B6860] text-xs font-bold uppercase tracking-widest mb-5">
                  <Skull className="w-4 h-4" /> The Old Way (Generic Sourcing)
                </div>
                {[
                  "You source after TikTok made it obvious",
                  "You fight on price with 1,000+ competitors",
                  "You reuse blurry, recycled supplier footage",
                  "You guess using lagging spy tools",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3.5 border-b border-[#E8E6E1] last:border-0"
                  >
                    <X className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B6860] leading-snug">
                      <strong className="text-[#3D3B36]">
                        {text.split(" ").slice(0, 2).join(" ")}
                      </strong>{" "}
                      {text.split(" ").slice(2).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6 sm:p-8 bg-[#F8F7F4] border-2 border-[#16A34A]/30 text-left shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] text-xs font-bold uppercase tracking-widest mb-5">
                  <Globe className="w-4 h-4" /> The KoreaScout Way
                </div>
                {[
                  "You spot products rising locally in Korea",
                  "You enter before saturation for higher margins",
                  "You launch with original 4K raw footage",
                  "You act on real domestic demand signals",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 py-3.5 border-b border-[#E8E6E1] last:border-0"
                  >
                    <Check className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#3D3B36] leading-snug">
                      <strong className="text-[#1A1916]">
                        {text.split(" ").slice(0, 3).join(" ")}
                      </strong>{" "}
                      {text.split(" ").slice(3).join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-[#F8F7F4] border border-[#E8E6E1] rounded-full items-center justify-center text-xs font-bold text-[#6B6860]">
              VS
            </div>
          </div>
        </section>

        {/* Sourcing Nodes */}
        <section
          id="sourcing-nodes"
          className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#E8E6E1] bg-[#F8F7F4]"
        >
          <div className="relative max-w-[1100px] mx-auto">
            <div
              data-reveal
              id="sn-header"
              className={`mb-12 sm:mb-16 ${reveal("sn-header")}`}
            >
              <p className="text-xs uppercase tracking-widest text-[#16A34A] font-semibold mb-4">
                How It Gets Made
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-[#1A1916] mb-3">
                We Do The Grunt Work.
                <br />
                You Get The Files.
              </h2>
              <p className="text-sm text-[#6B6860] font-light max-w-[480px] leading-relaxed">
                A weekly execution kit built from Korea&apos;s ground truth. No
                fluff.
              </p>
            </div>
            <div
              data-reveal
              id="sn-layout"
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 ${reveal("sn-layout")}`}
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-[#9E9C98] font-semibold mb-6 pb-3 border-b border-[#E8E6E1]">
                  Our Labor ↓
                </p>
                <div className="space-y-0">
                  {[
                    {
                      n: "01",
                      title: "Data Scanning",
                      desc: "Cross-analyzing SNS buzz with retail sales from Coupang, Daiso, and Olive Young to identify what's genuinely rising—not just being hyped.",
                    },
                    {
                      n: "02",
                      title: "Human Verification",
                      desc: "We physically visit stores to verify product quality and film original 4K raw ad footage—assets you can launch with immediately.",
                    },
                    {
                      n: "03",
                      title: "Supplier Tracing",
                      desc: "We trace and verify direct manufacturer contacts, MOQ, and export terms—so you can place a sample order the same week you read the report.",
                    },
                  ].map((step) => (
                    <div
                      key={step.n}
                      className="grid grid-cols-[40px_1fr] gap-4 py-6 border-b border-[#E8E6E1] last:border-0 items-start"
                    >
                      <span className="text-xs font-bold text-[#9E9C98] tracking-wide pt-0.5">
                        {step.n}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#1A1916] mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-[#6B6860] leading-relaxed">
                          <strong className="text-[#3D3B36]">Key terms</strong> —{" "}
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[#9E9C98] font-semibold mb-6 pb-3 border-b border-[#E8E6E1]">
                  Your Asset ↓
                </p>
                <div className="bg-white border border-[#E8E6E1] rounded-2xl overflow-hidden shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] sticky top-28">
                  <div className="flex items-center gap-2 px-5 py-3.5 bg-[#F8F7F4] border-b border-[#E8E6E1]">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]/40" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]/40" />
                    </div>
                    <span className="flex-1 text-xs text-[#9E9C98]">
                      ~/kps-blueprint/week-{`{current}`}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#9E9C98] bg-[#F2F1EE] border border-[#E8E6E1] px-2 py-0.5 rounded">
                      4 files
                    </span>
                  </div>
                  <div className="divide-y divide-[#E8E6E1]">
                    {[
                      {
                        icon: FileSpreadsheet,
                        name: "/sku_shortlist.csv",
                        desc: "Weekly Top 10–15 candidates ranked by signal strength",
                        badge: "CSV",
                        badgeClass:
                          "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
                      },
                      {
                        icon: Archive,
                        name: "/raw_creatives.zip",
                        desc: "Original 4K raw footage — ready to adapt for your market",
                        badge: "ZIP",
                        badgeClass:
                          "bg-[#FEF3C7] text-[#D97706] border-[#FCD34D]",
                      },
                      {
                        icon: FileSpreadsheet,
                        name: "/supplier_contacts.csv",
                        desc: "Direct emails, KakaoTalk handles & MOQ data per SKU",
                        badge: "CSV",
                        badgeClass:
                          "bg-[#DBEAFE] text-[#2563EB] border-[#93C5FD]",
                      },
                      {
                        icon: Lightbulb,
                        name: "/launch_notes.pdf",
                        desc: "Execution guide — positioning, pricing context & channels",
                        badge: "PDF",
                        badgeClass: "bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]",
                      },
                    ].map((f) => (
                      <div
                        key={f.name}
                        className="grid grid-cols-[48px_1fr_auto] gap-0 px-5 py-3.5 hover:bg-[#F8F7F4] transition-colors items-center"
                      >
                        <f.icon className="w-6 h-6 text-[#6B6860]" />
                        <div>
                          <p className="text-sm font-semibold text-[#1A1916]">
                            {f.name}
                          </p>
                          <p className="text-xs text-[#6B6860] font-light">
                            {f.desc}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded border ${f.badgeClass}`}
                        >
                          {f.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-[#E8E6E1] bg-[#F8F7F4] flex-wrap">
                    <span className="text-xs text-[#9E9C98] font-light italic">
                      Delivered every{" "}
                      <strong className="text-[#3D3B36] not-italic font-medium">
                        Monday morning
                      </strong>{" "}
                      to your inbox
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A] bg-[#DCFCE7] border border-[#BBF7D0] px-3 py-1 rounded">
                      Weekly Drop
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Standard Detail */}
        <section
          id="standard-detail"
          className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-t border-[#E8E6E1]"
        >
          <div className="relative max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div data-reveal id="std-header" className={reveal("std-header")}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#9E9C98] bg-[#F8F7F4] border border-[#E8E6E1] px-3 py-1 rounded mb-4">
                Standard · $9/mo · The Core Engine
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1916] mb-4">
                Stop Scrolling.
                <br />
                Start Scaling.
              </h2>
              <p className="text-sm sm:text-base text-[#6B6860] font-light leading-relaxed">
                Standard is the Core Engine. We filter through the noise to find{" "}
                <strong className="text-[#3D3B36]">Daiso&apos;s hidden gems</strong>
                , <strong className="text-[#3D3B36]">Olive Young&apos;s beauty shifts</strong>
                , and the next viral K-snacks. Our team in Seoul handles the
                grunt work, so you can focus on scaling.
              </p>
            </div>
            <div
              data-reveal
              id="std-grid"
              className={`grid grid-cols-2 gap-4 ${reveal("std-grid")}`}
            >
              {[
                {
                  src: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80",
                  label: "DAISO",
                },
                {
                  src: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80",
                  label: "OLIVE YOUNG",
                },
                {
                  src: "https://images.unsplash.com/photo-1621939514649-28b12e81d196?auto=format&fit=crop&q=80",
                  label: "K-SNACKS",
                },
                {
                  src: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80",
                  label: "ARTBOX",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative aspect-square rounded-xl overflow-hidden border border-[#E8E6E1] group"
                >
                  <Image
                    src={item.src}
                    alt={item.label}
                    fill
                    className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <span className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white font-bold text-xs px-2.5 py-1 rounded-full border border-white/15">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Alpha Vault */}
        <section
          id="alpha-vault"
          className="py-16 sm:py-24 px-4 sm:px-6 bg-[#1A1916] border-t border-[#3D3B36]"
        >
          <div className="relative max-w-[820px] mx-auto text-center">
            <div data-reveal id="vault-header" className={reveal("vault-header")}>
              <p className="text-xs uppercase tracking-widest text-[#D97706] font-bold mb-4">
                Alpha — First 500 Partners Only
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                Verified Assets.
                <br />
                Minimized Risk.
              </h2>
              <p className="text-base text-[#9E9C98] font-light max-w-[540px] mx-auto leading-relaxed">
                Everything the Standard tier signals—fully unredacted—plus
                original 4K footage and direct supplier access you can act on day
                one.
              </p>
            </div>
            <div
              data-reveal
              id="vault-lock"
              className={`inline-flex justify-center my-10 ${reveal("vault-lock")}`}
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#D97706]/10 border border-[#D97706]/25 rounded-3xl flex items-center justify-center hover:scale-110 hover:rotate-[-6deg] transition-all duration-300 cursor-default">
                <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-[#D97706]" />
              </div>
            </div>
            <div
              data-reveal
              id="vault-points"
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 text-left ${reveal("vault-points")}`}
            >
              {[
                {
                  icon: Film,
                  title: "Original 4K Assets",
                  desc: "Filmed physically in Korea by our team — impossible to replicate remotely. High-converting raw footage ready to adapt for your ads from day one.",
                },
                {
                  icon: Globe,
                  title: "Export Feasibility",
                  desc: "We only shortlist products with low regulatory hurdles. Each candidate is pre-screened for cleaner paths to global markets — fewer compliance surprises.",
                },
                {
                  icon: Building2,
                  title: "Optimized B2B Terms",
                  desc: "Direct manufacturer emails and pre-verified MOQ data. Place a sample order the same week you read the report — no Alibaba rabbit holes.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-[#D97706]/5 border border-[#D97706]/15 rounded-2xl p-5 hover:border-[#D97706]/25 hover:bg-[#D97706]/10 transition-all relative overflow-hidden"
                  >
                    <Icon className="w-7 h-7 text-[#D97706] mb-3" />
                    <h3 className="text-sm font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#9E9C98] font-light leading-relaxed">
                      <strong className="text-[#F8F7F4]">Key</strong> —{" "}
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
            <div
              data-reveal
              id="vault-price"
              className={`bg-[#0d0d0f] border border-[#3D3B36] rounded-2xl p-8 sm:p-10 relative overflow-hidden mb-6 ${reveal("vault-price")}`}
            >
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-[#D97706]">
                  $
                </span>
                <span className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white">
                  29
                </span>
                <span className="text-lg text-[#9E9C98] font-light">/mo</span>
              </div>
              <p className="text-sm text-[#9E9C98] mb-6">
                Alpha rate · <s className="text-[#6B6860]">Regular $149/mo</s> ·
                Locked forever for first 500
              </p>
              <a
                href={LEMON_ALPHA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-xl bg-[#16A34A] text-white font-bold text-center hover:bg-[#15803D] transition-colors"
              >
                Apply for Alpha ($29) →
              </a>
              <p className="text-xs text-[#6B6860] mt-4 font-light leading-relaxed">
                Instant digital delivery · No contracts · Cancel anytime
                <br />
                Rate locks permanently — next 500 members pay $79/mo
              </p>
            </div>
          </div>
        </section>

        {/* Founders DNA */}
        <section
          id="founders-dna"
          className="py-16 sm:py-24 px-4 sm:px-6 border-t border-[#E8E6E1] bg-[#F8F7F4]"
        >
          <div className="relative max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div data-reveal id="fd-copy" className={reveal("fd-copy")}>
              <p className="text-xs font-bold uppercase tracking-widest text-[#16A34A] mb-4 flex items-center gap-2">
                Who We Are
              </p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1916] mb-4">
                A Partnership Born
                <br />
                <span className="text-[#16A34A]">in Korea&apos;s Amazon.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#6B6860] font-light leading-relaxed mb-6">
                Our founders met and built their vision within the fast-paced
                operations of <strong className="text-[#3D3B36]">Coupang and Coupang Eats</strong>. We are not just
                researchers; we are{" "}
                <strong className="text-[#3D3B36]">platform operators who live and breathe Korean e-commerce</strong>{" "}
                — and we bring that precision to your sourcing engine.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: ShoppingBag, label: "Coupang" },
                  { icon: Mail, label: "Coupang Eats" },
                  { icon: MapPin, label: "Seoul-Based" },
                ].map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 bg-white border border-[#E8E6E1] rounded-lg px-4 py-2 text-sm font-semibold text-[#6B6860]"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </span>
                ))}
              </div>
            </div>
            <div
              data-reveal
              id="fd-card"
              className={`bg-white border border-[#E8E6E1] rounded-2xl p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] ${reveal("fd-card")}`}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#9E9C98] mb-6 pb-3 border-b border-[#E8E6E1]">
                Operator Credentials
              </p>
              <div className="space-y-0">
                {[
                  {
                    icon: Building2,
                    value: "Coupang Platform Operations",
                    label: "Logistics, B2B ops & demand intelligence · 4 years inside Korea's #1",
                  },
                  {
                    icon: Check,
                    value: "100% Physical Site Verification",
                    label: "Every product shortlisted is visited, filmed, and quality-verified in person — no remote guesswork",
                  },
                  {
                    icon: MapPin,
                    value: "Seoul-Based Strategic Sourcing",
                    label: "On-ground every week across Hongdae, Seongsu, Myeongdong, Gangnam · Not remote · Not algorithmic",
                  },
                ].map((s) => (
                  <div
                    key={s.value}
                    className="py-4 border-b border-[#E8E6E1] last:border-0 grid grid-cols-[auto_1fr] gap-3 items-center"
                  >
                    <s.icon className="w-6 h-6 text-[#9E9C98]" />
                    <div>
                      <p className="text-sm font-bold text-[#1A1916] mb-0.5">
                        {s.value}
                      </p>
                      <p className="text-xs text-[#6B6860] font-light">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Image CTA */}
        <section
          id="image-cta"
          className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-t border-[#E8E6E1] text-center"
        >
          <div data-reveal id="img-cta" className={`relative max-w-[820px] mx-auto ${reveal("img-cta")}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9E9C98] mb-5">
              KoreaScout · Seoul Intelligence
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1A1916] mb-6 uppercase">
              Stop Sourcing
              <br />
              <span className="text-[#16A34A]">Alone.</span>
            </h2>
            <div className="w-14 h-0.5 bg-[#16A34A] rounded mx-auto mb-6" />
            <p className="text-sm text-[#6B6860] font-light tracking-wide uppercase mb-10">
              Start sourcing with experts.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => scrollToId("pricing")}
                className="px-6 py-3 rounded-xl border border-[#E8E6E1] text-[#3D3B36] text-sm font-medium hover:bg-[#F2F1EE] transition-all"
              >
                View Sample Report
              </button>
              <button
                onClick={() => scrollToId("pricing")}
                className="px-6 py-3 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-all"
              >
                Get Sourcing Kit ($29) →
              </button>
            </div>
          </div>
        </section>

        {/* Pricing — 3-Tier */}
        <section
          id="pricing"
          className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F8F7F4]"
        >
          <div
            data-reveal
            id="pricing-header"
            className={`text-center mb-12 sm:mb-14 ${reveal("pricing-header")}`}
          >
            <p className="text-xs uppercase tracking-widest text-[#16A34A] font-semibold mb-3">
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1A1916]">
              Choose Your Intelligence Level.
            </h2>
          </div>
          <div
            data-reveal
            id="pricing-grid"
            className={`flex flex-col md:flex-row gap-6 md:gap-5 justify-center items-center flex-wrap max-w-[1000px] mx-auto ${reveal("pricing-grid")}`}
          >
            {/* Free */}
            <div className="w-full md:w-[274px] bg-white border border-[#E8E6E1] rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] opacity-90 md:scale-[0.94] hover:opacity-100 transition-all">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9E9C98] mb-3">
                Preview
              </p>
              <p className="text-4xl font-extrabold tracking-tight text-[#1A1916] mb-1">
                $0
              </p>
              <p className="text-xs text-[#9E9C98] mb-5">forever free</p>
              <ul className="space-y-2.5 mb-6">
                {["Monthly Trend Newsletter", "Curated K-market insights"].map(
                  (f) => (
                    <li
                      key={f}
                      className="flex gap-2 text-sm text-[#3D3B36] items-start"
                    >
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  )
                )}
                {["Weekly signals", "Asset files", "Supplier contacts"].map(
                  (f) => (
                    <li
                      key={f}
                      className="flex gap-2 text-sm text-[#9E9C98] items-start"
                    >
                      <X className="w-4 h-4 text-[#C4C2BE] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  )
                )}
              </ul>
              <Link
                href="/login"
                className="block w-full py-2.5 rounded-xl border border-[#E8E6E1] text-[#6B6860] text-sm font-medium hover:bg-[#F8F7F4] text-center transition-colors"
              >
                Subscribe Free
              </Link>
            </div>
            {/* Standard $9 */}
            <div className="w-full md:w-[274px] bg-white border border-[#E8E6E1] rounded-2xl p-6 sm:p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] transition-transform hover:border-[#16A34A]/30">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9E9C98] mb-3">
                Standard
              </p>
              <p className="text-4xl font-extrabold tracking-tight text-[#1A1916] mb-1">
                $9
              </p>
              <p className="text-xs text-[#9E9C98] mb-5">
                per month · Essential Intelligence
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Full Weekly Signal List",
                  "Retail Ranking Sync",
                  "3 Sourcing Nodes covered",
                  "Monday morning delivery",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 text-sm text-[#3D3B36] items-start"
                  >
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                <li className="flex gap-2 text-sm text-[#9E9C98] items-start">
                  <X className="w-4 h-4 text-[#C4C2BE] shrink-0 mt-0.5" />
                  Raw assets & supplier data
                </li>
              </ul>
              <a
                href={LEMON_STANDARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-2.5 rounded-xl border border-[#E8E6E1] text-[#6B6860] text-sm font-medium hover:bg-[#F8F7F4] text-center transition-colors"
              >
                Subscribe ($9/mo)
              </a>
            </div>
            {/* Alpha $29 — highlighted */}
            <div className="w-full md:w-[274px] md:scale-105 bg-white border-2 border-[#16A34A] rounded-2xl p-6 sm:p-8 relative shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full whitespace-nowrap flex items-center gap-1">
                0 / 1,000 Alpha Seats
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#16A34A] mb-3 mt-2">
                Alpha
              </p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold text-[#9E9C98] line-through">
                  $149
                </span>
                <p className="text-4xl font-extrabold tracking-tight text-[#16A34A]">
                  $29
                </p>
              </div>
              <p className="text-xs text-[#9E9C98] mb-5">
                per month · Full Intelligence Suite
              </p>
              <ul className="space-y-2.5 mb-6">
                <li className="flex gap-2 text-sm text-[#1A1916] items-start">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                  <strong>Everything in Standard</strong>
                </li>
                {[
                  "Unredacted SKU files & assets",
                  "Original 4K raw ad footage",
                  "Direct manufacturer contacts",
                  "Export feasibility notes",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex gap-2 text-sm text-[#3D3B36] items-start"
                  >
                    <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={LEMON_ALPHA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl bg-[#16A34A] text-white text-sm font-bold text-center hover:bg-[#15803D] transition-colors"
              >
                Apply for Alpha
              </a>
            </div>
          </div>
          {/* Price Ladder */}
          <div
            data-reveal
            id="price-ladder"
            className={`max-w-[760px] mx-auto mt-10 sm:mt-12 bg-[#FEF3C7]/30 border border-[#D97706]/20 rounded-xl p-6 sm:p-7 ${reveal("price-ladder")}`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[#D97706] mb-4">
              Alpha Price Ladder — Lock In Before It Moves
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-0 mb-4">
              <div className="flex-1 w-full sm:w-auto text-center py-3 px-3 bg-[#DCFCE7] border border-[#16A34A]/30 rounded-lg">
                <p className="text-xl font-extrabold text-[#16A34A]">
                  $29
                </p>
                <p className="text-xs text-[#16A34A]/80 leading-tight mt-1">
                  Tier 1
                  <br />
                  First 500 members
                </p>
                <span className="inline-block mt-1.5 text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/25">
                  You Are Here
                </span>
              </div>
              <span className="text-[#9E9C98] sm:px-3">
                <ArrowRight className="w-4 h-4 sm:rotate-0 rotate-90 inline" />
              </span>
              <div className="flex-1 w-full sm:w-auto text-center py-3 px-3 bg-[#F8F7F4] border border-[#E8E6E1] rounded-lg">
                <p className="text-xl font-extrabold text-[#9E9C98]">
                  $79
                </p>
                <p className="text-xs text-[#9E9C98] leading-tight mt-1">
                  Tier 2
                  <br />
                  Up to 1,000 members
                </p>
              </div>
              <span className="text-[#9E9C98] sm:px-3">
                <ArrowRight className="w-4 h-4 sm:rotate-0 rotate-90 inline" />
              </span>
              <div className="flex-1 w-full sm:w-auto text-center py-3 px-3 bg-[#F8F7F4] border border-[#E8E6E1] rounded-lg">
                <p className="text-xl font-extrabold text-[#9E9C98]">
                  $149
                </p>
                <p className="text-xs text-[#9E9C98] leading-tight mt-1">
                  Final Rate
                  <br />
                  Fixed post-1,000
                </p>
              </div>
            </div>
            <p className="text-sm text-[#6B6860] font-light leading-relaxed">
              Lock in your <strong className="text-[#3D3B36] font-medium">lifetime rate now.</strong> We invest heavy
              human resources to verify every lead on the ground in Seoul — the
              $29 rate is a permanent privilege for our first 500 partners.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="py-16 sm:py-24 px-4 sm:px-6 max-w-[720px] mx-auto bg-[#F8F7F4]"
        >
          <div
            data-reveal
            id="faq-header"
            className={`text-center mb-10 ${reveal("faq-header")}`}
          >
            <p className="text-xs uppercase tracking-widest text-[#16A34A] font-semibold mb-3">
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1A1916]">
              Questions?
              <br />
              We&apos;ve got answers.
            </h2>
          </div>
          <div className="space-y-0 border-t border-[#E8E6E1]">
            {[
              {
                q: 'What exactly is a "Digital Execution Blueprint"?',
                a: "It's a weekly digital report—delivered as a PDF and asset folder—covering one emerging Korean product trend. Each blueprint includes: trend analysis, raw video ad creatives, direct supplier contacts with MOQ data, and a step-by-step launch guide. Instant digital delivery—no physical product is shipped.",
              },
              {
                q: "Where does the data come from?",
                a: "We track real Korean retail velocity from Coupang (Korea's #1 e-commerce platform), Olive Young (leading K-beauty chain), Daiso, and GS25/CU convenience stores. This is real retail sales and shelf movement data—not social media trend speculation.",
              },
              {
                q: 'What is "Alpha pricing"?',
                a: "Alpha pricing locks your rate at $29/mo for the first 1,000 members. Once those seats are filled, new subscribers pay $149/mo. Your Alpha rate never increases as long as you stay subscribed.",
              },
              {
                q: "Are the supplier contacts verified and direct?",
                a: "Yes. Alpha members receive verified manufacturer contacts—phone numbers and messaging handles used in Korean B2B trade. We manually verify each contact before including it in a blueprint. This is not included in the Standard plan.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes, no contracts. Cancel anytime from your account. Alpha members who cancel lose their locked pricing permanently and would need to re-subscribe at the standard rate if seats are still available.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="border-b border-[#E8E6E1] py-5"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center gap-4 text-left text-sm font-semibold text-[#1A1916]"
                >
                  {faq.q}
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B6860] shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    openFaq === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm text-[#6B6860] pt-3 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Bottom */}
        <section
          id="cta-bottom"
          className="py-16 sm:py-24 px-4 sm:px-6 text-center bg-white border-t border-[#E8E6E1]"
        >
          <div className="relative max-w-[600px] mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1A1916] mb-4">
              Ready to Scout First?
            </h2>
            <p className="text-base text-[#6B6860] mb-8">
              Join global sellers who lead with Korean intelligence.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <button
                onClick={() => scrollToId("pricing")}
                className="px-6 py-3 rounded-xl border border-[#E8E6E1] text-[#3D3B36] text-sm font-medium hover:bg-[#F2F1EE] transition-all"
              >
                View Pricing
              </button>
              <Link
                href="/pricing"
                className="px-6 py-3 rounded-xl bg-[#16A34A] text-white text-sm font-semibold hover:bg-[#15803D] transition-all inline-block"
              >
                Get Access →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-4 sm:px-12 border-t border-[#E8E6E1] bg-[#F8F7F4] flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <span className="text-base font-medium text-[#6B6860] text-center sm:text-left">
            © 2026 KoreaScout. All rights reserved. · Digital product ·
            Instant delivery.
          </span>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-base font-medium text-[#1A1916] hover:text-[#16A34A] transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-base font-medium text-[#1A1916] hover:text-[#16A34A] transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-base font-medium text-[#1A1916] hover:text-[#16A34A] transition-colors"
            >
              Sample Report
            </a>
            <a
              href="#"
              className="text-base font-medium text-[#1A1916] hover:text-[#16A34A] transition-colors"
            >
              Contact
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
