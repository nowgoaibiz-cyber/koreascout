# ROUND 4 Investigation Report

Date: Wednesday May 13, 2026

Target: Creative Assets — Multiple Videos & YouTube References

**Method note:** 요청된 `grep`/`sed`/`bash` 루프는 Windows PowerShell에서 `Select-String`·`Get-ChildItem`으로 **순차 실행**했습니다. 중간 산출물: `c:\k-productscout\round4_assets.txt`, `c:\k-productscout\round4_db_fields.txt`, `c:\k-productscout\round4_context.txt`.

---

## Location

**File:** `c:\k-productscout\components\report\SupplierContact.tsx`

**Section Lines (UI — "Creative Assets" 제목 ~ 그리드/빈 상태):** **425–482**

**관련 데이터 구성 (같은 파일):** `assetCards` 배열 **135–204** — 여기서 "Raw Ad Footage" 카드가 `video_url`로 정의됨.

**기타 문자열 일치:** `c:\k-productscout\components\LandingTimeWidget.tsx` **21** — 마케팅 카피 `"Video + creative assets"` (리포트 섹션과 무관).

---

## Current Code

### Creative Assets 그리드 (제목 + 카드 렌더)

```425:482:c:\k-productscout\components\report\SupplierContact.tsx
        <div className="bg-[#F8F7F4] rounded-2xl p-10">
          <p className="text-xl font-bold text-[#1A1916] mb-10">Creative Assets</p>
          <LockedValue locked={!canSeeAlpha} tier="alpha" minHeight="120px">
            {assetCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {assetCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-[#E8E6E1] overflow-hidden group hover:border-[#16A34A] transition-all duration-300 hover:shadow-[0_4px_20px_0_rgb(22_163_74/0.1)]"
                  >
                    <div className="aspect-video bg-[#F8F7F4] relative flex items-center justify-center overflow-hidden">
                      {card.thumbnailSrc ? (
                        <img
                          src={card.thumbnailSrc}
                          alt={card.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 text-[#1A1916] opacity-5 flex items-center justify-center">{card.icon}</div>
                      </div>
                      {card.platform && (
                        <span className="absolute top-3 left-3 bg-black/70 text-white text-[10px] font-bold rounded px-2 py-1 uppercase tracking-wide z-10">
                          {card.platform}
                        </span>
                      )}
                      <div className="absolute inset-0 bg-[#16A34A]/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-10">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                          {card.hoverIcon}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-xl font-bold text-[#1A1916] mb-2">{card.title}</p>
                      <p className={`${refC} mb-6`}>{card.description}</p>
                      <a
                        href={card.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-colors duration-200 ${
                          card.isPrimary ? "bg-[#1A1916] text-white hover:bg-[#2D2B26]" : "bg-white border border-[#E8E6E1] text-[#1A1916] hover:border-[#1A1916]"
                        }`}
                      >
                        {card.ctaText}
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-[#9E9C98]">No creative assets available.</p>
            )}
          </LockedValue>
        </div>
```

### Raw Ad Footage 카드 정의 (`assetCards` 내)

```148:159:c:\k-productscout\components\report\SupplierContact.tsx
    videoUrl && {
      id: "video",
      platform: "Video" as const,
      title: "Raw Ad Footage",
      description: "Unedited footage ready for your market adaptation.",
      href: videoUrl,
      thumbnailSrc: getGoogleDriveThumbnail(videoUrl),
      ctaText: "Watch & Download",
      isPrimary: false,
      icon: <Film className="w-32 h-32 text-[#1A1916]" />,
      hoverIcon: <Download className="w-5 h-5 text-[#1A1916]" />,
    },
```

URL 상수는 **55–56행**에서 읽음: `viral_video_url`, `video_url`.

---

## Available DB Fields

### Video Fields

| Field | Status |
|--------|--------|
| `video_url` | **exists** — `c:\k-productscout\types\database.ts` **74**; `SupplierContact.tsx` **56**, **148–154**; admin `c:\k-productscout\app\admin\[id]\page.tsx` **86**, **288**, **1482–1483** |
| `video_url_2` | **missing** (저장소 전역 검색 일치 없음) |
| `video_url_3` | **missing** |

### YouTube Reference Fields

| Field | Status |
|--------|--------|
| `youtube_ref_1` … `youtube_ref_4` | **missing** (`*.tsx`에서 `youtube_ref` / `youtubeRef` / `youtube.*ref` 패턴 일치 없음) |

### Alternative Field Names Found

- **`viral_video_url`** — DB `types/database.ts` **77**; UI에서는 "Viral Reference" 카드 (**136–147**). `video_url`과 별도 단일 URL.
- **`marketing_assets_url`**, **`ai_detail_page_links`**, **`ai_image_url`** — 크리에이티브 키트 카드로 동일 그리드에 합류 (**160–192**), 비디오 전용 필드는 아님.
- **`youtube` 키** — `c:\k-productscout\data\sampleReportData.ts` **109** (`youtube: { score: 76 }`) 및 `c:\k-productscout\components\report\TrendSignalDashboard.tsx` **30** (라벨 `"YouTube"`)는 **점수/대시보드 맥락**이며, 리포트의 YouTube **참조 URL** 컬럼과는 무관.

---

## Current Implementation

### Video Display

- **단일** `report.video_url`이 있으면 `assetCards`에 **카드 1개**("Raw Ad Footage")가 추가됨 (**148–159**).
- 썸네일은 **`getGoogleDriveThumbnail(videoUrl)`** — Google Drive `/file/d/{id}/` 패턴에서만 썸네일 URL 생성 (**9–17**). 다른 호스트(예: YouTube 직링크)는 썸네일 없이 아이콘만 보일 수 있음.
- 링크는 카드 하단 `<a href={card.href}>`로 새 탭 오픈 (**463–473**).

### YouTube Display

- **전용 YouTube 참조 섹션 없음.** 위 필드도 없음.

---

## Required Changes

### 1. Raw Ad Footage Section

- Support up to 3 videos (`video_url`, `video_url_2`, `video_url_3`)
- Each video shows conditionally (only if URL exists)
- Add subtitle: "Filmed by KoreaScout"
- Video cards with titles

### 2. YouTube References Section

- NEW section below Raw Ad Footage
- Support up to 4 YouTube videos
- Card layout with thumbnail/title
- Conditional rendering (only show if URLs exist)

---

## Implementation Strategy

- [ ] Add support for `video_url_2` and `video_url_3` (스키마·타입·admin·파이프라인 선행)
- [ ] Conditional rendering for each video
- [ ] Add "YouTube Trend References" section
- [ ] Support `youtube_ref_1` through `youtube_ref_4` (스키마·타입·admin 선행)
- [ ] Card design for YouTube videos
- [ ] Proper spacing and visual hierarchy

---

## END OF REPORT
