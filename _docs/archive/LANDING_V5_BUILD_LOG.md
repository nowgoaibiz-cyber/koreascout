# Landing Page v5.0 Supreme Build Log (Final Revised)

## 생성 파일 / 주요 변경
- `components/HeroCTA.tsx` (use client — DUAL CTA: Request Access + View Sample Report)
- `components/GrandEntrance.tsx` (use client — 진입 오버레이)
- `components/IntelligenceTicker.tsx` (Server — Supabase 실시간 스크롤 틱커)
- `components/LandingTimeWidget.tsx` (Server — red-400/60 예외 허용 타임 바)
- `components/AlphaVaultPreview.tsx` (Server — Alpha Vault 프리뷰 카드)
- `app/page.tsx` (async Server Component — Landing v5.0 전체 섹션 구조로 교체)
- `public/videos/README.md` (hero.mp4 스펙 안내)

## Supabase 사용 정리
- 클라이언트: `lib/supabase/client.ts` → `createClient()` (HeroCTA에서 사용)
- 서버: `lib/supabase/server.ts` → `createClient()` (기존 auth-server 등에서 사용)
- 서비스 롤: `lib/supabase/admin.ts` → `createServiceRoleClient()`  
  - Landing v5.0 홈에서 Alpha 멤버 수 카운트용으로 사용:
    - 테이블: `profiles`
    - 컬럼: `tier`
    - 조건: `.eq("tier", "alpha")`
- types/supabase.ts: **존재하지 않음**  
  - 대신 `types/database.ts` 의 `Database` / `ProfilesRow` / `ScoutFinalReportsRow` 등 스키마를 단일 소스로 사용.

## IRON RULE / 디자인 헌법 준수 메모
- Color System:
  - 사용 색: `#0A0908`, `#1A1916`, `#F8F7F4`, `#FFFFFF`, `#16A34A`, `#E8E6E1`, `#6B6860`, `#9E9C98`
  - 예외: `LandingTimeWidget` 좌측 막대에 한해 `bg-red-400/60` 사용 (수동 리서치 바 전용)
  - emerald-*/green-*/gray-* Tailwind semantic 클래스 **신규 코드 전역 미사용**
- Typography:
  - 헤드라인: font-weight 900, letter-spacing -0.03em, `clamp()` 기반 유동 폰트 적용
  - 라벨/메타: `text-[10px]` + wide tracking (`[0.3em+]`) 패턴 유지
- Hover/Interaction:
  - Tailwind 기반 hover: `transition-colors duration-200` 고정
  - 인라인 스타일 기반 버튼: `transition: "all 0.2s ease"` 고정
  - Framer Motion 미사용
- Footer:
  - 모든 푸터를 LUXURY UI 헌법에 맞춘 cream shutter 구조로 정렬:
    - 배경: `bg-[#F8F7F4]`
    - 보더: `border-t border-[#E8E6E1]`
    - 텍스트: `text-[#1A1916]` / `text-[#6B6860]`

## 섹션 구조 (Landing v5.0)
- S1: Cinematic Hero  
  - 비디오 + 그레인 + 그린 스캔라인 + Classified 코너 스탬프  
  - 중앙 헤드라인 + 서브 카피 + `HeroCTA` (Dual CTA)
- S3: Pain — Late-Mover Penalty 내러티브 (3컬럼 카드)
- S4: `LandingTimeWidget` — 58시간 vs 60초 타임/코스트 위젯
- S5: Intelligence Engine + `AlphaVaultPreview` — 7-Layer 브리프 + Alpha Vault
- S6: Launch Kit — Standard+/Alpha 카드 4개
- S7: Viral Sandbox Timeline — Week 01 → Week 20 타임라인
- S8: Pricing — `app/pricing/page.tsx`의 3티어 카드 구조 재사용
  - `STANDARD_CHECKOUT_URL` (141f6710 포함) URL 그대로 유지
  - `ALPHA_CHECKOUT_URL` (41bb4d4b 포함) URL 그대로 유지
  - Alpha 3,000명 한정 카운터: `alphaCount / 3,000` 라이브 카운트 + `isFull` 대기 리스트 분기
  - 카피 v5.0 기준으로 Standard/Alpha 서브카피 교체
- S9: Trust + Founder — Seoul Agency, Expert Moat, Synergy + Founder’s Note + FAQ
- S10: Final CTA — Alpha 잔여 슬롯 + Pricing/Plans 링크

## 기타
- Auth Callback:
  - 기존 `app/auth/callback/route.ts`는 `next` 쿼리 파라미터를 지원하는 고급 구현 이미 존재.
  - `HeroCTA`의 OAuth `redirectTo`는 `/auth/callback?next=/sample-report` 으로 설정해 기존 콜백과 정합 유지.
- Sample Report:
  - `app/sample-report/page.tsx`는 이미 상세 UI + mock 데이터 구조로 구현되어 있어 덮어쓰지 않고 유지.

## 헌법/체크리스트 대응
- `app/page.tsx`: `"use client"` 제거 — Server Component 유지
- `HeroCTA.tsx`, `GrandEntrance.tsx`: `"use client"` 명시
- `IntelligenceTicker.tsx`, `LandingTimeWidget.tsx`, `AlphaVaultPreview.tsx`: `"use client"` 없음 (Server 전용)
- red-400/60: `LandingTimeWidget` 좌측 수동 리서치 바에만 존재
- checkout URL (Lemon Squeezy): 141f6710 / 41bb4d4b 포함 문자열 변경 없음
- Supabase 스키마: `profiles.tier === "alpha"` 기준으로 Alpha 카운트 계산
- types/supabase.ts: 미존재 확인 완료 (`types/database.ts`를 단일 타입 소스로 사용)

