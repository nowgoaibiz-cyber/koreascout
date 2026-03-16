export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-[#0A0908] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[#9E9C98] mb-12">Last updated: March 2026</p>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">1. Data We Collect</h2>
          <p className="text-[#4A4845] leading-relaxed">We collect your email address and subscription tier for the purpose of providing access to KoreaScout services. Payment information is processed exclusively by LemonSqueezy and is never stored on our servers.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">2. How We Use Your Data</h2>
          <p className="text-[#4A4845] leading-relaxed">Your data is used solely to authenticate your account and deliver the service. We do not sell, share, or distribute your personal information to third parties.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">3. Data Storage & Security</h2>
          <p className="text-[#4A4845] leading-relaxed">User authentication and profile data are securely managed via Supabase. Payment processing is handled by LemonSqueezy as Merchant of Record. Both services maintain industry-standard security practices.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">4. GDPR & CCPA Compliance</h2>
          <p className="text-[#4A4845] leading-relaxed">You have the right to request access to, correction of, or deletion of your personal data at any time. To submit a data deletion request, contact us at <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">support@koreascout.com</a>.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">5. Contact</h2>
          <p className="text-[#4A4845] leading-relaxed">For privacy-related inquiries, contact us at <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">support@koreascout.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
