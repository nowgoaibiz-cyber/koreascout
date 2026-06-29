import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function ExpiredReportPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">
      <header className="px-6 sm:px-8 pt-8 pb-4">
        <Link href="https://koreascout.com" aria-label="KoreaScout home">
          <Logo className="h-8 w-auto" />
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 sm:px-8 pb-20">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] p-10 text-center">
          <p className="text-4xl mb-6" aria-hidden>
            ⏳
          </p>
          <h1 className="text-2xl font-bold text-[#1A1916] mb-3">
            This report link has expired
          </h1>
          <p className="text-sm text-[#6B6860] leading-relaxed mb-8">
            Shared report links are valid for 60 days. If you need a new link, please contact our team.
          </p>
          <a
            href="mailto:support@koreascout.com"
            className="inline-flex items-center justify-center rounded-lg bg-[#16A34A] px-6 py-3 text-sm font-semibold text-white hover:bg-[#15803D] transition-colors"
          >
            support@koreascout.com
          </a>
        </div>
      </main>
    </div>
  );
}
