import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#F8F7F4] pt-20">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16">
        <h1 className="text-3xl font-bold text-[#1A1916] mb-8">My Account</h1>

        <div className="bg-white rounded-2xl border border-[#E8E6E1] p-6 shadow-[0_1px_3px_0_rgb(26_25_22/0.06)]">
          <p className="text-xs font-medium text-[#9E9C98] uppercase tracking-wider mb-1">
            Signed in as
          </p>
          <p className="text-sm font-semibold text-[#1A1916]">{user.email}</p>

          <div className="bg-[#F8F7F4] rounded-xl border border-[#E8E6E1] p-4 mt-4">
            <p className="text-sm text-[#6B6860] leading-relaxed">
              Subscription management and LemonSqueezy customer portal will be
              available after Phase 4.
            </p>
          </div>

          <div className="mt-6">
            <LogoutButton className="border border-[#FECACA] text-[#DC2626] text-sm font-medium px-4 py-2 rounded-md hover:bg-[#FEE2E2] transition-colors" />
          </div>
        </div>

        <p className="mt-6">
          <Link
            href="/"
            className="text-sm font-medium text-[#16A34A] hover:text-[#15803D]"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
