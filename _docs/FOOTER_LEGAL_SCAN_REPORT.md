# Footer & Legal Pages 전수조사 보고서
작성일: 2026-03-24

## 1. Footer (app/page.tsx)
```tsx
<footer className="bg-[#F8F7F4] border-t border-[#E8E6E1] py-8 px-6">
  <div className="mx-auto flex max-w-6xl flex-col flex-wrap items-center justify-between gap-4 sm:flex-row">
    <div className="flex flex-col gap-1">
      <p className="text-sm text-[#9E9C98]">© 2026 KoreaScout. All rights reserved.</p>
      <div className="flex gap-4">
        <a href="/legal/terms" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Terms of Service</a>
        <a href="/legal/privacy" className="text-xs text-[#9E9C98] hover:text-[#0A0908] transition-colors">Privacy Policy</a>
      </div>
    </div>
    <div className="flex gap-6">
      <Link
        href="/pricing"
        className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
      >
        Pricing
      </Link>
      <Link
        href="/sample-report"
        className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
      >
        Sample Report
      </Link>
      <Link
        href="/contact"
        className="text-sm font-medium text-[#1A1916] transition-colors duration-200 hover:text-[#16A34A]"
      >
        Contact
      </Link>
    </div>
  </div>
</footer>
```

## 2. Terms of Service (app/legal/terms/page.tsx)
```tsx
export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-[#0A0908] mb-2">Terms of Service</h1>
        <p className="text-sm text-[#9E9C98] mb-12">Last updated: March 2026</p>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">1. Service Description</h2>
          <p className="text-[#4A4845] leading-relaxed">KoreaScout is a subscription-based B2B intelligence platform providing weekly Korean product trend reports for global sellers. The service is operated by Haengbok Jwa. Payment processing, tax collection, and receipts are handled by LemonSqueezy, acting as the Merchant of Record. By using this service, you confirm you are at least 18 years of age.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">2. No Refund Policy</h2>
          <p className="text-[#4A4845] leading-relaxed">All purchases are final and non-refundable. Upon completion of payment, users are granted immediate access to KoreaScout's proprietary intelligence reports and Premium Sourcing Vault — digital assets that cannot be returned. No refunds, whether full or prorated, will be issued under any circumstances.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">3. Recurring Billing & Cancellation</h2>
          <p className="text-[#4A4845] leading-relaxed">Subscriptions are automatically renewed on a monthly basis. By subscribing, you acknowledge and consent to recurring charges until you cancel. Subscribers may cancel at any time. Upon cancellation, full access to the subscribed tier is retained through the end of the current billing cycle. No partial refunds will be issued for unused days.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">4. Service Delivery & Availability</h2>
          <p className="text-[#4A4845] leading-relaxed">KoreaScout targets weekly delivery of curated intelligence reports. The exact number of featured products per issue may vary based on market conditions and our quality standards. KoreaScout does not guarantee a fixed number of reports per issue, and fluctuations in report volume do not constitute grounds for a refund. KoreaScout does not guarantee 100% uptime and shall not be liable for temporary service interruptions caused by technical issues, maintenance, or factors beyond our control.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">5. Single-User License & Anti-Scraping</h2>
          <p className="text-[#4A4845] leading-relaxed">Each subscription is a Single-User License. Account sharing, unauthorized scraping, automated data extraction, reproduction, resale, or redistribution of KoreaScout content in any format is strictly prohibited. We monitor access patterns and IP addresses to ensure compliance. Violation will result in immediate permanent account termination without refund. KoreaScout reserves the right to pursue legal action under applicable laws.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">6. Limitation of Liability</h2>
          <p className="text-[#4A4845] leading-relaxed">KoreaScout's total liability for any claim shall not exceed the amount paid by the user for the most recent single month of service. KoreaScout is not liable for any secondary business losses, inventory risks, or financial decisions made based on our reports.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">7. Human-Curated, AI-Assisted Disclaimer</h2>
          <p className="text-[#4A4845] leading-relaxed">KoreaScout's intelligence reports are curated by local Korean market experts. Artificial intelligence is utilized solely as an assisting tool for data translation and supplementary analysis. All data is provided on an "As-Is" basis. KoreaScout makes no guarantees regarding market outcomes and shall not be held liable for any business or financial decisions made based on our reports.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">8. Content Rights Disclaimer</h2>
          <p className="text-[#4A4845] leading-relaxed">KoreaScout reports are based on publicly available market data. We do not claim ownership of any third-party brands or products mentioned. Our curation is strictly for informational and editorial purposes.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">9. Governing Law</h2>
          <p className="text-[#4A4845] leading-relaxed">These Terms shall be governed by the laws of the Republic of Korea. Any disputes not resolved through LemonSqueezy as Merchant of Record shall be subject to the exclusive jurisdiction of the courts of South Korea.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">10. Contact</h2>
          <p className="text-[#4A4845] leading-relaxed">For any questions regarding these Terms, contact us at <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">support@koreascout.com</a>.</p>
        </section>
      </div>
    </main>
  );
}
```

## 3. Privacy Policy EN (app/legal/privacy/page.tsx)
```tsx
export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-[#0A0908] mb-2">Privacy Policy</h1>
        <a
          href="/legal/privacy-kr"
          className="inline-block text-sm text-[#16A34A] underline mb-4"
        >
          🇰🇷 한국어 버전 보기 (국문 개인정보처리방침)
        </a>
        <p className="text-sm text-[#9E9C98] mb-12">Last updated: March 2026</p>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">1. Data We Collect</h2>
          <p className="text-[#4A4845] leading-relaxed">We collect your email address and subscription tier for the purpose of providing access to KoreaScout services. Payment information is processed exclusively by LemonSqueezy and is never stored on our servers.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">2. How We Use Your Data & Cookies</h2>
          <p className="text-[#4A4845] leading-relaxed">Your data is used solely to authenticate your account and deliver the service. We use essential cookies strictly for user authentication and session management. We do not use advertising or tracking cookies. We do not sell, share, or distribute your personal information to third parties.</p>
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
```

## 4. Privacy Policy KR (app/legal/privacy-kr/page.tsx)
```tsx
export default function PrivacyPolicyKr() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-[#0A0908] mb-2">개인정보처리방침</h1>
        <p className="text-sm text-[#9E9C98] mb-12">최종 수정일: 2026년 3월</p>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">1. 수집하는 개인정보 항목</h2>
          <p className="text-[#4A4845] leading-relaxed">
            KoreaScout는 서비스 제공을 위해 이메일 주소와 구독 등급 정보를 수집합니다.
            결제 정보는 LemonSqueezy에서 단독으로 처리되며, 당사 서버에는 저장되지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">
            2. 개인정보의 수집 및 이용 목적
          </h2>
          <p className="text-[#4A4845] leading-relaxed">
            수집한 개인정보는 계정 인증 및 서비스 제공 목적으로만 이용합니다. 필수 쿠키는 사용자
            인증과 세션 관리를 위해서만 사용하며, 광고 또는 추적 쿠키는 사용하지 않습니다. 당사는
            이용자의 개인정보를 판매, 공유 또는 무단 배포하지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">3. 개인정보의 보유 및 이용 기간</h2>
          <p className="text-[#4A4845] leading-relaxed">
            이용자의 개인정보는 회원 탈퇴 시 즉시 파기하는 것을 원칙으로 합니다. 단, 관계 법령에
            따라 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보관 후 지체 없이 파기합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">4. 개인정보의 제3자 제공</h2>
          <p className="text-[#4A4845] leading-relaxed">
            당사는 결제 처리 목적으로 LemonSqueezy에 이메일 주소 및 구독 등급 정보를 제공합니다.
            이를 제외하고 이용자의 개인정보를 제3자에게 제공하지 않습니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">5. 개인정보 처리 위탁</h2>
          <p className="text-[#4A4845] leading-relaxed">
            원활한 서비스 제공을 위해 다음과 같이 개인정보 처리 업무를 위탁합니다. Supabase는 인증
            및 데이터 저장을 담당하며, LemonSqueezy는 Merchant of Record로서 결제 처리를
            담당합니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">
            6. 정보주체의 권리·의무 및 행사방법
          </h2>
          <p className="text-[#4A4845] leading-relaxed">
            정보주체는 언제든지 개인정보의 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 관련
            요청은{" "}
            <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">
              support@koreascout.com
            </a>
            으로 접수해 주시기 바랍니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">7. 개인정보 보호책임자</h2>
          <p className="text-[#4A4845] leading-relaxed">
            서비스명: KoreaScout
            <br />
            운영사: 지금행컴퍼니
            <br />
            이메일:{" "}
            <a href="mailto:support@koreascout.com" className="text-[#16A34A] underline">
              support@koreascout.com
            </a>
            <br />
            사업자등록번호 및 대표자명은 추후 업데이트 예정입니다.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-[#0A0908] mb-3">8. 개인정보처리방침 변경</h2>
          <p className="text-[#4A4845] leading-relaxed">
            본 개인정보처리방침의 내용 추가, 삭제 및 수정이 있는 경우 변경사항을 웹사이트를 통해
            공지합니다.
          </p>
        </section>
      </div>
    </main>
  );
}
```

## 5. 현황 분석
- Footer 현재 표시 항목: 저작권(`© 2026 KoreaScout. All rights reserved.`), 법적 링크(`Terms of Service`, `Privacy Policy`), 일반 링크(`Pricing`, `Sample Report`, `Contact`)
- Footer 누락 항목: 사업자등록번호, 대표자명, 사업장 주소, 운영사/법인명 명시, 문의 이메일 직표기, 환불정책 전용 링크
- Terms 현재 사업자정보: 없음 (사업자등록번호/대표자명/주소 미기재)
- Privacy EN 현재 사업자정보: 없음 (사업자등록번호/대표자명/주소 미기재)
- Privacy KR 현재 사업자정보: 있음, `app/legal/privacy-kr/page.tsx` 내 개인정보 보호책임자 섹션(운영사: 지금행컴퍼니 / 사업자등록번호 및 대표자명 추후 업데이트 문구)
- 지금행컴퍼니 표기 위치:
  - `app/legal/privacy-kr/page.tsx` (운영사: 지금행컴퍼니)
  - `app/page.tsx` (Operated by 지금행컴퍼니 in Seoul 문구)
  - `app/page.tsx` (— 지금행컴퍼니 (Jigeumhaeng Co.) · Seoul, Korea)
- 코리아스카우트/KoreaScout 표기 위치:
  - `app/page.tsx` (metadata title, 본문 카피, Founder’s Note, Footer 저작권)
  - `app/legal/terms/page.tsx` (서비스 설명/면책/권리/책임 관련 본문 다수)
  - `app/legal/privacy/page.tsx` (Data We Collect 섹션)
  - `app/legal/privacy-kr/page.tsx` (수집항목 섹션, 개인정보 보호책임자 섹션)
