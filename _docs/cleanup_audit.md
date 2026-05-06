# Cleanup Audit

## 1) `app/page.tsx` — Free 티어 카드의 "INSTANT ACCESS" 코드 (정확 복사)

```tsx
              {/* FREE */}
              <div className="bg-white border border-[#E8E6E1] rounded-2xl flex flex-col h-full p-8 md:p-12">
                <div className="min-h-[100px]">
                  <p className="text-3xl md:text-4xl font-black text-[#1A1916] tracking-tighter leading-none mb-8">
                    Scout Free
                  </p>
                  <div className="mb-1">
                    <span className="text-5xl font-black text-[#1A1916] leading-none tracking-tighter">
                      {PRICING.CURRENCY}{PRICING.FREE.monthly}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#9E9C98] uppercase tracking-[0.2em] mb-1">
                    Forever Free
                  </p>
                </div>
                <div className="w-8 h-px bg-[#E8E6E1] my-5" />
                <div className="bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl px-4 py-3 min-h-[120px] flex items-center">
                  <p className="text-sm text-[#1A1916] leading-relaxed">
                    <span className="font-black uppercase">INSTANT ACCESS:</span>{" "}
                    <span className="font-medium">INSTANT ACCESS: Access 1 sample report — no credit card required.</span>
                  </p>
                </div>
                <div className="flex-grow my-8">
                  <p className="text-base font-medium text-[#6B6860] leading-relaxed">
                    See what KoreaScout finds. Before you commit.
                  </p>
                </div>
                <div className="mt-auto">
                  <a
                    href="/signup"
                    className="block w-full text-center py-3 rounded-xl border-2 border-[#1A1916] text-sm font-black text-[#1A1916] hover:bg-[#1A1916] hover:text-white transition-all duration-200"
                  >
                    Unlock Free Intelligence
                  </a>
                  <p className="text-xs text-[#9E9C98] text-center mt-3">
                    1 sample report · free forever · no card needed
                  </p>
                </div>
              </div>
```

## 2) `app/weekly/page.tsx`

### 2-a) "Beta Launch / April 25" 팝업 코드 전체 (정확 복사)

```tsx
      <div
        id="prelaunch-popup"
        className="fixed inset-0 z-[1000] hidden items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        aria-hidden="true"
      >
        <div className="bg-[#0A0908] border border-[#1A1916] rounded-2xl shadow-xl w-full max-w-sm mx-auto p-6">
          <h2 className="text-[#F8F7F4] font-bold text-xl">
            🔍 Beta Launch: April 25
          </h2>
          <p className="mt-4 text-[#9E9C98] text-sm leading-relaxed whitespace-pre-line">
            {"KoreaScout is in the final stages of curating this week's K-beauty intelligence reports.\n\nBeta access opens April 25, 2026."}
          </p>
          <button
            id="prelaunch-popup-close"
            type="button"
            className="mt-6 bg-[#16A34A] text-white rounded-xl px-6 py-3 hover:bg-[#15803D] transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
      <Script id="weekly-prelaunch-popup" strategy="afterInteractive">
        {`
          (function () {
            var cutoff = new Date('2026-04-25');
            if (new Date() >= cutoff) return;
            var tier = ${JSON.stringify(tier)};
            if (!tier) return;
            var key = 'ks:prelaunch:dismissed';
            if (window.localStorage.getItem(key) === '1') return;
            var popup = document.getElementById('prelaunch-popup');
            var close = document.getElementById('prelaunch-popup-close');
            if (!popup || !close) return;
            popup.classList.remove('hidden');
            popup.classList.add('flex');
            popup.setAttribute('aria-hidden', 'false');
            var dismiss = function () {
              window.localStorage.setItem(key, '1');
              popup.classList.remove('flex');
              popup.classList.add('hidden');
              popup.setAttribute('aria-hidden', 'true');
            };
            close.addEventListener('click', dismiss, { once: true });
            popup.addEventListener('click', function (e) {
              if (e.target === popup) dismiss();
            });
          })();
        `}
      </Script>
```

### 2-b) "Coming Soon" 캐러셀 코드 전체 (정확 복사)

```tsx
      {/* 2. TREND NEWS — Massive rolling hero banner */}
      <section className="bg-[#1A1916] px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden min-h-[320px] md:min-h-[400px] border border-[#BBF7D0]/20 flex items-end group cursor-pointer">
            {/* Placeholder background (replace with dynamic image later) */}
            <div
              className="absolute inset-0 bg-[#0A0908] bg-cover bg-center opacity-50 group-hover:opacity-60 transition-opacity"
              style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200)",
              }}
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1916] via-[#1A1916]/80 to-transparent" />
            {/* Carousel nav — left */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} aria-hidden />
            </div>
            {/* Carousel nav — right */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur border border-white/10 text-white/90 hover:bg-black/50 transition-colors">
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} aria-hidden />
            </div>
            {/* Pagination dots — bottom center */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" aria-current="true" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
              <span className="w-2 h-2 rounded-full bg-white/40" />
            </div>
            {/* Content */}
            <div className="relative z-10 p-6 md:p-8 w-full">
              <span className="inline-block px-3 py-1 bg-[#16A34A] text-white text-xs font-bold uppercase tracking-wider rounded-sm mb-3">
                HOT ISSUE
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight group-hover:text-[#BBF7D0] transition-colors">
                Coming Soon
              </h2>
            </div>
          </div>
        </div>
      </section>
```

### 2-c) `FREE_DELAY_DAYS` / `freeOpenWeekId` 잔존 여부

- `FREE_DELAY_DAYS`: 없음
- `freeOpenWeekId`: 없음
