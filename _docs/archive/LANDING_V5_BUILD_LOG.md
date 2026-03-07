# Landing Page v5.0 Supreme Build Log (Final Revised)

## 생성 파일
- components/HeroCTA.tsx (use client — DUAL CTA: Request Access + View Sample Report)
- components/GrandEntrance.tsx (use client)
- components/IntelligenceTicker.tsx (Server)
- components/LandingTimeWidget.tsx (Server — red-400/60 예외 허용)
- components/AlphaVaultPreview.tsx (Server)
- app/page.tsx (async Server Component)
- app/auth/callback/route.ts
- app/sample-report/page.tsx (기존 유지)
- public/videos/README.md

## IRON RULE 수정 이력
- red-400/60: LandingTimeWidget 수동 bar 전용 예외 추가
- STEP 0: cat app/pricing/page.tsx 전체 추가
- STEP 0: types/supabase.ts 없음 — types/database.ts 사용 (profiles.tier, scout_final_reports)

## 헌법 준수
- 10_LUXURY_UI_AUDIT.md: 정독 후 작업
- UI_PREMIUM_AUDIT_REPORT.md: 해당 경로 없음
- SAMPLE_REPORT_AUDIT.md: 정독 후 작업

## DB/API
- Alpha count: createServiceRoleClient, profiles, tier "alpha" (pricing 페이지와 동일)
- Checkout URL: 141f6710 (Standard), 41bb4d4b (Alpha) 변경 없음
- IntelligenceTicker: scout_final_reports, status=published, order published_at desc
