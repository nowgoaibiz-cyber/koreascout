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
  const baseClass = "p-3 sm:p-4 text-center border-b border-[#E8E6E1]";
  const alphaClass = "border-l border-[#3D3B36] bg-[#1A1916]";
  const className = isAlphaColumn ? `${baseClass} ${alphaClass}` : baseClass;

  if (typeof value === "string") {
    return (
      <td className={className + (isAlphaColumn ? " text-sm text-[#F8F7F4]" : " text-sm text-[#3D3B36]")}>{value}</td>
    );
  }
  return (
    <td className={className}>
      {value ? (
        <Check className="w-5 h-5 text-[#16A34A] mx-auto" aria-hidden />
      ) : (
        <X className="w-5 h-5 text-red-400/80 mx-auto" aria-hidden />
      )}
    </td>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-[72px]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E6E1] -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 mb-10 sm:mb-14">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs uppercase tracking-widest text-[#9E9C98] font-semibold mb-3">
              ✦ Pricing
            </p>
            <h1 className="text-3xl font-bold text-[#1A1916] mb-2">
              Choose Your Intelligence Level
            </h1>
            <p className="text-base text-[#6B6860] max-w-xl mx-auto">
              Compare features across Free, Standard, and Alpha. Upgrade anytime.
            </p>
          </div>
        </div>

        {/* Comparison table — horizontal scroll on small screens */}
        <div className="rounded-2xl border border-[#E8E6E1] bg-white overflow-hidden shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-[#E8E6E1]">
                  <th className="p-3 sm:p-4 text-left text-sm font-semibold text-[#1A1916] bg-[#F8F7F4] sticky left-0 z-10 min-w-[140px] sm:min-w-[160px]">
                    Feature
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-[#6B6860] bg-[#F8F7F4] min-w-[100px]">
                    Free $0
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-[#6B6860] bg-[#F8F7F4] min-w-[100px]">
                    Standard $9
                  </th>
                  <th className="p-3 sm:p-4 text-center text-sm font-semibold text-[#F8F7F4] bg-[#1A1916] border-l border-[#3D3B36] min-w-[100px] relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#16A34A] text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
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
                      className={i % 2 === 0 ? "bg-[#F8F7F4]" : ""}
                    >
                      <td className="p-3 sm:p-4 text-sm text-[#3D3B36] border-b border-[#E8E6E1] sticky left-0 z-10 bg-white min-w-[140px] sm:min-w-[160px]">
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
          <div className="bg-white rounded-2xl border border-[#E8E6E1] p-8 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] text-center">
            <p className="text-sm font-semibold text-[#3D3B36] mb-4">Free</p>
            <Link
              href="#"
              className="block w-full py-3 rounded-lg border border-[#E8E6E1] text-[#6B6860] text-sm text-center hover:bg-[#F8F7F4] transition-colors"
            >
              Continue Free
            </Link>
          </div>
          {/* Standard — recommended */}
          <div className="bg-white rounded-2xl border-2 border-[#16A34A] p-8 relative shadow-[0_4px_6px_-1px_rgb(26_25_22/0.08)] text-center">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-xs font-semibold px-4 py-1 rounded-full">
              Most Popular
            </span>
            <p className="text-sm font-semibold text-[#1A1916] mb-4">Standard — $9/mo</p>
            <Link
              href="https://k-productscout26.lemonsqueezy.com/checkout/buy/141f6710-c704-4ab3-b7c7-f30b2c587587"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-lg bg-[#16A34A] text-white font-semibold text-sm text-center hover:bg-[#15803D] transition-colors"
            >
              Start Standard — $9/mo →
            </Link>
          </div>
          {/* Alpha — dark card */}
          <div className="bg-[#1A1916] rounded-2xl border border-[#3D3B36] p-8 relative text-center">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D97706] text-white text-xs font-semibold px-4 py-1 rounded-full">
              Early Bird
            </span>
            <p className="text-sm font-semibold text-white mb-4">Alpha — $29/mo</p>
            <Link
              href="https://k-productscout26.lemonsqueezy.com/checkout/buy/41bb4d4b-b9d6-4a60-8e19-19287c35516d"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-lg bg-[#16A34A] text-white font-semibold text-sm text-center hover:bg-[#15803D] transition-colors"
            >
              Go Alpha — $29/mo →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs mt-6 text-[#6B6860]">
          <Link href="/" className="text-[#16A34A] hover:text-[#15803D]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
