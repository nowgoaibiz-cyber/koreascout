import Link from "next/link";
import { Check, X, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — K-Product Scout",
  description: "Compare Free, Standard $9, and Alpha $29. Choose your intelligence level.",
};

type FeatureRow =
  | { feature: string; free: boolean; standard: boolean; alpha: boolean }
  | {
      feature: string;
      free: string;
      standard: string;
      alpha: string;
    };

const FEATURES: FeatureRow[] = [
  { feature: "접근 시점", free: "14일 딜레이", standard: "즉시", alpha: "즉시" },
  { feature: "주간 상품 수", free: "절반 (~5)", standard: "전체 (~10)", alpha: "전체 (~10)" },
  { feature: "시장성 점수", free: true, standard: true, alpha: true },
  { feature: "경쟁 강도", free: true, standard: true, alpha: true },
  { feature: "블루오션", free: true, standard: true, alpha: true },
  { feature: "수익률", free: false, standard: true, alpha: true },
  { feature: "검색량", free: false, standard: true, alpha: true },
  { feature: "성장률", free: false, standard: true, alpha: true },
  { feature: "글로벌 가격", free: false, standard: true, alpha: true },
  { feature: "SEO 키워드", free: false, standard: true, alpha: true },
  { feature: "소비자 인사이트", free: false, standard: true, alpha: true },
  { feature: "AI 이미지", free: false, standard: true, alpha: true },
  { feature: "HS Code", free: false, standard: false, alpha: true },
  { feature: "소싱팁", free: false, standard: false, alpha: true },
  { feature: "MOQ/리드타임", free: false, standard: false, alpha: true },
  { feature: "소싱처 연락처", free: false, standard: false, alpha: true },
  { feature: "제조사 웹사이트", free: false, standard: false, alpha: true },
  { feature: "마켓플레이스 링크", free: false, standard: false, alpha: true },
  { feature: "4K 영상", free: false, standard: false, alpha: true },
  { feature: "바이럴 숏폼 영상", free: false, standard: false, alpha: true },
];

function TierCell({
  value,
  isAlphaColumn = false,
}: {
  value: boolean | string;
  isAlphaColumn?: boolean;
}) {
  const baseClass = "p-3 sm:p-4 text-center border-b border-white/10";
  const alphaClass = "border-l border-indigo-500/20 bg-indigo-500/5";
  const className = isAlphaColumn ? `${baseClass} ${alphaClass}` : baseClass;

  if (typeof value === "string") {
    return (
      <td className={`${className} text-sm text-white/80`}>{value}</td>
    );
  }
  return (
    <td className={className}>
      {value ? (
        <Check className="w-5 h-5 text-green-400 mx-auto" aria-hidden />
      ) : (
        <X className="w-5 h-5 text-red-400/80 mx-auto" aria-hidden />
      )}
    </td>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[11px] uppercase tracking-[0.14em] text-indigo-400 font-semibold mb-3">
            ✦ Pricing
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
            Choose Your Intelligence Level
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-xl mx-auto">
            Compare features across Free, Standard, and Alpha. Upgrade anytime.
          </p>
        </div>

        {/* Comparison table — horizontal scroll on small screens */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0f] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-3 sm:p-4 text-left text-sm font-semibold text-white/90 bg-white/[0.02] sticky left-0 z-10 min-w-[140px] sm:min-w-[160px]">
                    Feature
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-white/70 bg-white/[0.02] min-w-[100px]">
                    Free $0
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-white/70 bg-white/[0.02] min-w-[100px]">
                    Standard $9
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-indigo-300 bg-indigo-500/10 border-l border-indigo-500/30 min-w-[100px] relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                      <Sparkles className="w-3 h-3" aria-hidden /> MOST POPULAR
                    </span>
                    Alpha $29
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((row, i) => {
                  const freeVal = "free" in row ? row.free : false;
                  const standardVal = "standard" in row ? row.standard : false;
                  const alphaVal = "alpha" in row ? row.alpha : false;
                  return (
                    <tr
                      key={row.feature}
                      className={i % 2 === 0 ? "bg-white/[0.02]" : ""}
                    >
                      <td className="p-3 sm:p-4 text-sm text-white/80 border-b border-white/10 sticky left-0 z-10 bg-[#0d0d0f] min-w-[140px] sm:min-w-[160px]">
                        {row.feature}
                      </td>
                      <TierCell value={freeVal} />
                      <TierCell value={standardVal} />
                      <TierCell value={alphaVal} isAlphaColumn />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA row — cards on mobile, row on desktop */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Free */}
          <div className="rounded-xl border border-white/10 bg-[#0d0d0f] p-6 text-center">
            <p className="text-sm font-semibold text-white/70 mb-4">Free</p>
            <Link
              href="#"
              className="block w-full py-3 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:border-white/30 hover:text-white transition-colors"
            >
              Continue Free
            </Link>
          </div>
          {/* Standard */}
          <div className="rounded-xl border border-white/10 bg-[#0d0d0f] p-6 text-center">
            <p className="text-sm font-semibold text-white mb-4">Standard — $9/mo</p>
            <Link
              href="https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              Start Standard — $9/mo →
            </Link>
          </div>
          {/* Alpha — highlighted */}
          <div className="rounded-xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-500/15 to-[#0d0d0f] p-6 text-center relative shadow-[0_0_40px_rgba(99,102,241,.15)]">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" aria-hidden /> MOST POPULAR
            </span>
            <p className="text-sm font-semibold text-white mb-4">Alpha — $29/mo</p>
            <Link
              href="https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-xl bg-indigo-500 text-white text-sm font-bold hover:bg-indigo-400 transition-colors shadow-[0_4px_20px_rgba(99,102,241,.3)]"
            >
              Go Alpha — $29/mo →
            </Link>
          </div>
        </div>

        <p className="text-center text-white/45 text-xs mt-6">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
