# KoreaScout — Claude Code 작업 룰북

## ⚠️ 절대 원칙 (위반 시 프로젝트 파괴)

1. **`claude_robot_agent/` 폴더 외에는 절대 손대지 마라.**
   - Next.js 웹앱 파일들 (pages/, components/, app/, public/, etc.) 절대 금지
   - package.json, tsconfig.json, next.config.js 등 절대 금지
   - `.env` 파일 절대 금지

2. **요청받은 함수/섹션만 수정해라. 나머지는 손대지 마라.**

3. **기존 로직을 갈아엎지 마라. 추가/수정만 해라.**

4. **`git push` 시도하지 마라. 이 환경은 403으로 막혀있다.**

5. **수정 완료 후 반드시 전체 파일을 `cat`으로 출력해라. `...`으로 생략 절대 금지.**

---

## 작업 가능 영역

```
claude_robot_agent/
└── news_bot.py   ← 여기만
```

---

## 수정 요청 시 프로세스

1. 해당 함수 현재 코드 먼저 `cat`으로 출력
2. 수정 내용 설명
3. 수정 실행
4. 전체 파일 `cat`으로 재출력 (생략 없이 전체)

---

## 프로젝트 개요

- 서비스명: KoreaScout (koreascout.com)
- 운영: 지금행컴퍼니 (1인 창업)
- `claude_robot_agent/news_bot.py`: Telegram K뷰티 뉴스봇
  - Google News RSS 수집 → Claude 필터링 → 텔레그램 대화형 선택 → X/Threads/LinkedIn 포스팅 생성
- 나머지: Next.js + Supabase + Vercel 웹앱 (건드리면 서비스 다운)
