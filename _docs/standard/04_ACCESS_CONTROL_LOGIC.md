# KoreaScout — 등급별 접근 권한 정의서 (헌법)

> **Updated:** 2026-03-03
> **이 문서는 KoreaScout의 핵심 비즈니스 로직이다.**
> **모든 page.tsx, route.ts 작업 시 반드시 이 문서를 먼저 읽고 준수하라.**
> **CEO 지시 없이 이 로직을 임의로 변경하는 것은 절대 금지한다.**

---

## Gate 1: Week 목록 (/weekly)

| 등급 | 접근 권한 | 비고 |
|------|---------|------|
| 미로그인 | 전체 차단 → /login 리다이렉트 | 목록 자체를 볼 수 없음 |
| Free | 14일 지난 Week 중 최신 1개만 진입 가능 | Sliding Window |
| Standard | 가입 시점 최신 3개 + 가입 후 발행 Week 누적 | Golden Handcuffs |
| Alpha | Standard와 동일 | Week 권한은 Standard와 차이 없음 |

---

## Gate 2: 상품 리스트 (/weekly/[weekId])

| 등급 | 접근 권한 | 비고 |
|------|---------|------|
| 미로그인 | 접근 불가 | Gate 1에서 차단됨 |
| Free | is_premium=FALSE 상품만 클릭 가능 | RLS 처리 (약 50%) |
| Standard | 전체 상품 클릭 가능 | — |
| Alpha | 전체 상품 클릭 가능 | — |

---

## Gate 3: 상품 상세 (/weekly/[weekId]/[id])

| 등급 | 접근 권한 | 비고 |
|------|---------|------|
| 미로그인 | 접근 불가 | — |
| Free | 기본 정보만 (Section 1~2) | Standard/Alpha 데이터 🔒 |
| Standard | Section 1~4 전체 열람 | Alpha 전용 섹션 🔒 |
| Alpha | 전체 데이터 열람 ✅ | 소싱처, HS Code 등 포함 |

---

## Golden Handcuffs 상세 규칙

### 신규 가입
- 결제 완료 시점을 subscription_start_at으로 기록
- 해당 시점 기준 최신 3개 Week 즉시 오픈
- 그 이전 과거 Week는 영구 봉쇄

### 구독 유지
- 매주 새로 발행되는 Week가 자동으로 누적 오픈
- 구독 기간이 길수록 열람 가능한 Week 증가

### 재가입 페널티 (먹튀 방지 핵심)
- 해지 후 재가입 시 subscription_start_at을 현재 시각으로 리셋
- 기존에 누적됐던 열람 권한 전부 증발
- 재가입 시점 최신 3개 Week부터 다시 시작
- subscription_reset_at에 리셋 시각 기록 (감사 로그)

### 최신 3개 기준
- 플랫폼 전체 published_at 기준 최신 3개 Week
- 어느 시점에 가입해도 동일한 미끼 경험 제공

---

## Free Sliding Window 상세 규칙

- published_at 기준으로 14일이 경과한 Week 중
- 가장 최근 1개만 오픈
- 나머지 과거 Week (14일 지났어도): 🔒 봉쇄
- 최신 Week (14일 미경과): 🔒 봉쇄
- 목적: "딱 1개만 맛보기" → 결제 압박 극대화

---

## 구현 파일 매핑

| 파일 | 담당 Gate | 주요 로직 |
|------|---------|---------|
| app/weekly/page.tsx | Gate 1 | 미로그인 차단, Free Sliding Window, Golden Handcuffs |
| app/weekly/[weekId]/page.tsx | Gate 1 보조 | 직접 URL 접근 차단 |
| app/weekly/[weekId]/[id]/page.tsx | Gate 3 | canSeeStandard/canSeeAlpha 분기 |
| lib/auth-server.ts | 공통 | tier, subscription_start_at 반환 |
| Supabase RLS | Gate 2 | is_premium=FALSE Free 필터링 |
| LemonSqueezy Webhook | 구독 관리 | subscription_start_at SET/RESET |

---

> **v1.0 — 2026-03-03 확정**
> CEO 지시 없이 이 로직을 변경하는 것은 절대 금지.
> 변경 시 이 문서도 반드시 동시 업데이트.
