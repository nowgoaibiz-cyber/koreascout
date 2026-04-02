# Supabase DB 스캔 결과

스캔 시각: 2026-04-02 (로컬 실행)

## 실행 방식

Supabase SQL Editor에 직접 연결할 수 없어, 프로젝트 `.env.local`의 `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`로 `@supabase/supabase-js`를 통해 동일 데이터를 조회했습니다.

### 스키마와 요청 SQL의 차이

| 구분 | 내용 |
|------|------|
| `weeks.created_at` | **존재하지 않음** (PostgreSQL 오류: column weeks.created_at does not exist). 요청하신 `ORDER BY created_at DESC` 대신 **`ORDER BY week_id DESC`** 로 대체 조회했습니다. |
| `manufacturer_name` / `manufacturer_email` | **존재하지 않음**. 실제 컬럼은 **`m_name`**, **`contact_email`** 입니다. 집계·상세는 이 컬럼으로 수행했습니다. |

---

## 1) weeks 테이블 (요청: week_id, week_label, status, product_count, created_at 정렬)

| week_id | week_label | status | product_count |
|---------|------------|--------|---------------|
| 2026-W10 | 1차 RAW 리포트 | hidden | 0 |
| 2026-W09 | 2차 RAW 리포트 | hidden | 0 |
| 2026-LAUNCH2 | 예비후보(영상없음) | hidden | 0 |
| 2026-LAUNCH | 최종런칭리스트 | published | 0 |

`created_at` 컬럼 없음 → 위 표에는 포함되지 않았습니다.

---

## 2) scout_final_reports 집계 (`week_id = '2026-LAUNCH'`, `m_name` / `contact_email` 기준)

| week_id | total | published | draft | missing_name | missing_image | missing_manufacturer | missing_email | missing_video |
|---------|-------|-----------|-------|--------------|---------------|---------------------|---------------|---------------|
| 2026-LAUNCH | 64 | 64 | 0 | 0 | 0 | 6 | 31 | 64 |

참고: `week_id = '2026-LAUNCH'` 행은 모두 `status = published` 였습니다 (`draft` 0).

---

## 3) 누락 항목 상세 (전체 64행, `naver_product_name` 순)

선택 컬럼: `id`, `naver_product_name`, `translated_name`, `m_name`, `contact_email`, `video_url`, `image_url`, `status`

```json
[
  {
    "id": "d58a2e92-43f6-410b-944e-dd6fdb8f1f6a",
    "naver_product_name": "[넘버즈인] 1번 판토텐산 스킨케어100 블러파우더 7g 11A19250300",
    "translated_name": "Numbuzin No.1 Pantothenic Acid Skincare 100 Blur Powder",
    "m_name": "넘버즈인",
    "contact_email": "marketing@benow.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5729873/57298736494.3.jpg",
    "status": "published"
  },
  {
    "id": "ea91a4b2-74b5-4a12-b5d8-852304809017",
    "naver_product_name": "[단독기획] 아누아 복숭아 70 나이아신아마이드 세럼 30ml 2입",
    "translated_name": "ANUA Peach 70 Niacinamide Serum 30ml",
    "m_name": "아누아",
    "contact_email": "business@anua.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5434840/54348400871.1.jpg",
    "status": "published"
  },
  {
    "id": "5088eaf4-ed1c-4709-98f8-740f493bac78",
    "naver_product_name": "[듀이 립 증정] 지베르니 밀착 커버 파운데이션 30ml (SPF 30 PA++)",
    "translated_name": "Giverny Close Cover Foundation",
    "m_name": "지베르니",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_1245962/12459625978.80.jpg",
    "status": "published"
  },
  {
    "id": "ce5f8d7e-388a-4811-b40c-a94ad2dfb98d",
    "naver_product_name": "[라로슈포제] NEW 히알루 B5 수분탄력 세럼 50ml",
    "translated_name": "La Roche-Posay Hyalu B5 Serum",
    "m_name": "라로슈포제",
    "contact_email": "larocheposay@kr.loreal.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_9028740/90287403727.9.jpg",
    "status": "published"
  },
  {
    "id": "07ab8429-f321-4442-ac5e-cf7cb5e14915",
    "naver_product_name": "[수정화장] 네이밍 스킨 핏 컨실러 브러쉬 3colors",
    "translated_name": "Naming Skin Fit Concealer Brush",
    "m_name": "네이밍",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5614814/56148143978.jpg",
    "status": "published"
  },
  {
    "id": "1946162e-c8b8-4a22-a1fb-46bf010c2f5a",
    "naver_product_name": "[아이소이] 모이스춰 닥터 크림 70ml (장수진크림)",
    "translated_name": "Isoi Moisture Doctor Jangsujin Hydration Cream",
    "m_name": "아이소이",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8940712/89407126599.8.jpg",
    "status": "published"
  },
  {
    "id": "77880c8b-9395-459e-a245-247cfea32a48",
    "naver_product_name": "01 딥브라운 더봄 스키니브로우 펜슬  3개",
    "translated_name": "The Bom Skinny Brow Pencil 01 Deep Brown",
    "m_name": "",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5862272/58622725252.jpg",
    "status": "published"
  },
  {
    "id": "fad1150b-5ffd-4fe5-96a8-0ea000ef4b24",
    "naver_product_name": "1+1 아비브 어성초 테카 캡슐 세럼 카밍 드롭",
    "translated_name": "Abib Heartleaf TECA Capsule Serum Calming Drop",
    "m_name": "아비브",
    "contact_email": "global.abib@fourco.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8822472/88224722043.9.jpg",
    "status": "published"
  },
  {
    "id": "3e30c12f-40db-403d-a65c-ae9e7619a74f",
    "naver_product_name": "1+1 아비브 어성초 흔적 에센스 패드 클리어터치 140매",
    "translated_name": "Abib Heartleaf Trace Essence Pad Clear Touch",
    "m_name": "아비브",
    "contact_email": "abib.global@gmail.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8970303/89703032305.jpg",
    "status": "published"
  },
  {
    "id": "4e8272cf-d8f4-4301-bef7-9e55d5c74581",
    "naver_product_name": "AHC 아이크림 시즌14 풀리프트 T괄사 리프팅 40ml 4개+팩1",
    "translated_name": "AHC Ten Revolution Real Eye Cream for Face / AHC Age Renew Eye Cream",
    "m_name": "한국콜마(주) / AHC",
    "contact_email": "hyoil@kolmar.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5815117/58151174658.1.jpg",
    "status": "published"
  },
  {
    "id": "70bdec38-eacb-40bc-a3f6-98f4712dd762",
    "naver_product_name": "VT PDRN 광채수분크림",
    "translated_name": "VT PDRN Radiance Hydrating Cream",
    "m_name": "(주)예그리나 / (주)브이티코스메틱",
    "contact_email": "hansh@yegreenacos.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5557169/55571693700.2.jpg",
    "status": "published"
  },
  {
    "id": "caf4e4b6-1e55-47cd-baac-4ee939b3dde0",
    "naver_product_name": "VT PDRN 광채토너 200ml / 안개분사 스프레이 공병 120ml 세트",
    "translated_name": "VT PDRN Glow Toner",
    "m_name": "(주)이앤씨 / (주)브이티코스메틱",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5556916/55569162334.1.jpg",
    "status": "published"
  },
  {
    "id": "ad24689a-52b7-4c16-9a85-cf73acc253d6",
    "naver_product_name": "넘버즈인 1번 시카 갈아만든 초록패드 70매, 1개",
    "translated_name": "Numbuzin No.1 Ground Cica Green Pad 70 Sheets",
    "m_name": "넘버즈인",
    "contact_email": "marketing@benow.co.kr (Generic domain - verify before outreach)",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192936/51929360106.20241213211803.jpg",
    "status": "published"
  },
  {
    "id": "a68aeda9-0531-41cd-b5cd-406d036b268c",
    "naver_product_name": "넘버즈인 3번 도자기결 파데스킵 톤업베이지 50ml(SPF50+), 1개",
    "translated_name": "Numbuzin No.3 Porcelain Texture Pade-Skip Tone-Up Beige",
    "m_name": "넘버즈인",
    "contact_email": "marketing@benow.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192959/51929590983.20241213221823.jpg",
    "status": "published"
  },
  {
    "id": "e7978f0b-065e-4912-b42c-d9e1fbc8f742",
    "naver_product_name": "다이소 [91 퓨어 운초]프릴루드 딘토 운초 블러 매트 리퀴드 파운데이션 25 ml 1061161",
    "translated_name": "Prelude Dinto 91 Pure Wooncho Blur-Matte Liquid Foundation",
    "m_name": "(주)트렌드메이커 / 딘토",
    "contact_email": "dinto@trendmaker.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5251285/52512856191.jpg",
    "status": "published"
  },
  {
    "id": "a8d51afb-57db-4b5a-9586-66ada9d73f3f",
    "naver_product_name": "다이소 [92 세이지 운초]프릴루드 딘토 운초블러 래디언스쿠션 15 g 1071671",
    "translated_name": "Prelude Dinto Uncho Blur Radiance Cushion",
    "m_name": "(주)트렌드메이커 / Dinto",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5727253/57272534077.jpg",
    "status": "published"
  },
  {
    "id": "00c7616f-0428-4219-8f35-e1fbb081e0d0",
    "naver_product_name": "다이소 SNP 프렙 펩타로닉 아이패치 24매입 1062719",
    "translated_name": "SNP Peptaronic Hydrogel Eye Patch",
    "m_name": "",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5350291/53502916343.jpg",
    "status": "published"
  },
  {
    "id": "1960b526-c0e7-45ac-916c-54bcc33e7059",
    "naver_product_name": "다이소 VT PDRN 광채선에센스 50 ml 1067497",
    "translated_name": "VT PDRN Glow Sun Essence",
    "m_name": "(주)코디 / (주)브이티코스메틱",
    "contact_email": "inquiry@kodi-corp.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5557083/55570837561.1.jpg",
    "status": "published"
  },
  {
    "id": "4104751f-ddc6-47c6-a24c-a268cb4dcad7",
    "naver_product_name": "다이소 손앤박 아티 스프레드 하이라이터 밤(01 클리어) 1060676",
    "translated_name": "Son & Park Art Spread Highlighter Balm",
    "m_name": "(주)코코 / (주)에스앤피코스메틱",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5202972/52029720374.1.jpg",
    "status": "published"
  },
  {
    "id": "8a7c10ca-ea21-4082-9b6a-96489c86ad60",
    "naver_product_name": "다이소 줌 바이 정샘물 메이크업 픽서 50 ml 1072801",
    "translated_name": "ZOOM BY JUNG SAEM MOOL Makeup Fixer",
    "m_name": "(주)코스메카코리아 / (주)정샘물뷰티",
    "contact_email": "jsryu@cosmecca.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5837021/58370219657.1.jpg",
    "status": "published"
  },
  {
    "id": "7ed4f4cc-e611-401d-b820-3e328f40c220",
    "naver_product_name": "다이소 클리덤 리포좀 비타민C 기미볼세럼 15 ml 1068722",
    "translated_name": "Cleaderm Liposome Vitamin C Freckle Cheek Spot Serum",
    "m_name": "종근당건강",
    "contact_email": "CS_CKDCARE@ckdhc.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5680707/56807076548.2.jpg",
    "status": "published"
  },
  {
    "id": "02d56b37-8163-46ec-8894-eaa5ddb9e86d",
    "naver_product_name": "다이소 태그 듀이멜팅밤(3호_피그휘그) 1067393",
    "translated_name": "TAG Dewy Melting Balm #3 Pig Hueg",
    "m_name": "(주)씨앤씨인터내셔널 / (주)투쿨포스쿨",
    "contact_email": "hjan@cnccosmetic.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5649842/56498421893.1.jpg",
    "status": "published"
  },
  {
    "id": "afd06eb4-c4c4-44e1-954c-57a357b4eb8a",
    "naver_product_name": "다이소 파티온 노스카나인 퍼스트스텝 세럼클렌저 100 ml 1071640",
    "translated_name": "Fation Nosca9 First Step Serum Cleanser",
    "m_name": "동아제약(주) / 노스카나인",
    "contact_email": "dmall@donga.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5723016/57230165686.1.jpg",
    "status": "published"
  },
  {
    "id": "51d9ec45-86a1-4a93-98c9-d73e202c4783",
    "naver_product_name": "다이소 플루365 바디 스크럽 100 g 코튼머스크 향 1042249",
    "translated_name": "Plu 365 3-in-1 Body Scrub",
    "m_name": "(주) 지본 코스메틱 / 플루",
    "contact_email": "zivoncos@plu.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_4478857/44788579825.3.jpg",
    "status": "published"
  },
  {
    "id": "dceadf21-1706-4ed6-b63d-5f4b5c2760fe",
    "naver_product_name": "더샘 커버 퍼펙션 트리플 팟 컨실러 7colors",
    "translated_name": "The Saem Cover Perfection Triple Pot Concealer Glow",
    "m_name": "더샘",
    "contact_email": "jang3438@thesaem.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8737944/87379448306.11.jpg",
    "status": "published"
  },
  {
    "id": "665c718d-cb70-4b0e-b8ea-5b1b5efd0d55",
    "naver_product_name": "마데카21 테카 솔루션 수딩 미스트 토너 200ml, 1개",
    "translated_name": "Madeca 21 Teca Solution Soothing Mist Toner - Centella Asiatica Derma-Cosmetic",
    "m_name": "코스맥스(주) / 동국제약주식회사",
    "contact_email": "3waau.all@cosmax.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_4478856/44788569027.4.jpg",
    "status": "published"
  },
  {
    "id": "5a635b4c-8ac3-45d4-8bfc-a25000488767",
    "naver_product_name": "마몽드 플로라 글로우 로즈 리퀴드 마스크 80ml, 1개",
    "translated_name": "Mamonde Flora Glow Rose Liquid Mask",
    "m_name": "마몽드",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192951/51929519277.20250521101117.jpg",
    "status": "published"
  },
  {
    "id": "119db599-a27d-468b-9e6b-2b8f54dee167",
    "naver_product_name": "마미케어 바다포도 스킨팩, 80매, 1개",
    "translated_name": "Mommy Care Sea Grape Pore Refining Skin Pack 80-Sheet Bundle",
    "m_name": "(주)올리브인터내셔널 / 마미케어",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5818338/58183380455.jpg",
    "status": "published"
  },
  {
    "id": "b678ea25-c916-421f-8ec8-297f0f5086de",
    "naver_product_name": "마미케어 바다포도 젤리미스트 100ml, 5개",
    "translated_name": "Mommy Care Sea Grape Pore Refining Jelly Mist",
    "m_name": "(주)올리브인터내셔널 / 마미케어",
    "contact_email": "cs@oliveinter.com (Generic domain - verify before outreach)",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5818281/58182811680.jpg",
    "status": "published"
  },
  {
    "id": "6235d300-782d-4bd7-acee-8601d3d2633d",
    "naver_product_name": "메디힐 PDRN 모공 탄력 세럼 40+40ml 기획",
    "translated_name": "Mediheal PDRN Pore Tightening Elasticity Serum",
    "m_name": "메디힐",
    "contact_email": "ymkim@medihealcos.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8961535/89615354343.1.jpg",
    "status": "published"
  },
  {
    "id": "19448ad9-a78d-4a27-a8f7-f9305a1e3ce2",
    "naver_product_name": "메디힐 마데카소사이드 수분 선세럼 흔적 리페어 (SPF 50+) 50ml, 2개",
    "translated_name": "Mediheal Madecassoside Moisture Sun Serum Trace Repair",
    "m_name": "메디힐",
    "contact_email": "ymkim@medihealcos.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8997178/89971789749.3.jpg",
    "status": "published"
  },
  {
    "id": "152822c1-b4c0-4dfa-b821-713c081bf793",
    "naver_product_name": "메디힐 마데카소사이드 흔적 패드 100매+리필 100매",
    "translated_name": "Mediheal Madecassoside Blemish Trace Pads",
    "m_name": "메디힐",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8976974/89769740309.2.jpg",
    "status": "published"
  },
  {
    "id": "c1294c3e-8a97-480f-a4f1-8f38f6e43762",
    "naver_product_name": "메이크프렘 세이프 미 릴리프 모이스처 클렌징 밀크 500ml, 1개",
    "translated_name": "MakePrem Safe Me Relief Moisture Cleansing Milk",
    "m_name": "메이크프렘",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192948/51929489963.20241213220122.jpg",
    "status": "published"
  },
  {
    "id": "a27d16b4-c498-4021-b24a-ae4511059f52",
    "naver_product_name": "밀크터치 4D 볼륨 유리알 광택 오너먼트 프리즘 펄 글로스 키링 아이시, 4.5ml",
    "translated_name": "Milktouch Face Contour Cream Brightener - Pure Lemon Tone-Up",
    "m_name": "",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5842466/58424666274.1.jpg",
    "status": "published"
  },
  {
    "id": "c9e3df34-b401-4017-8961-3666f41584a9",
    "naver_product_name": "바이오힐보 판테셀 리페어 시카 앰플 미스트 100ml, 1개",
    "translated_name": "BioHeal BOH Panthenol Repair Cica Ampoule Mist",
    "m_name": "바이오힐보",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192948/51929489692.20241213215939.jpg",
    "status": "published"
  },
  {
    "id": "9f88cdf2-2ac9-4d94-919e-4dd86a5bb493",
    "naver_product_name": "바이오힐보 프로바이오덤 콜라겐 톤업 선크림 50ml(SPF50+), 1개",
    "translated_name": "Bioheal Boh Probiome Collagen Tone-Up Sunscreen SPF50+ PA++++",
    "m_name": "바이오힐보",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192949/51929496757.20241213220219.jpg",
    "status": "published"
  },
  {
    "id": "76b9af0f-6451-4ff2-bfbd-59e191d344cd",
    "naver_product_name": "비디비치 1+1 비디비치 블랙 퍼펙션 커버 핏 쿠션 21NW 내추럴 13g + 13g",
    "translated_name": "VIDIVICI Black Perfection Cover Fit Cushion 21",
    "m_name": "비디비치",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_9056607/90566073804.jpg",
    "status": "published"
  },
  {
    "id": "b82603af-e8b1-493d-a605-b546e5d72585",
    "naver_product_name": "샤르드 아이백 리프트 1100샷 리들 패치 4매입, 1개",
    "translated_name": "Charde Eye Bag Lift 1100-Shot Microneedle Patch",
    "m_name": "샤르드",
    "contact_email": "sales@newselect.co",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5620838/56208382530.20250811092733.jpg",
    "status": "published"
  },
  {
    "id": "f3d48d1b-af66-45b9-9092-2c06325c8d06",
    "naver_product_name": "아누아 피디알엔 히알루론산 캡슐 100 세럼 30ml, 2개",
    "translated_name": "ANUA PDRN Hyaluronic Acid Capsule 100 Serum 30mL",
    "m_name": "아누아",
    "contact_email": "business@anua.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5319129/53191296017.20250224153705.jpg",
    "status": "published"
  },
  {
    "id": "5c86cf00-1ce9-4ac7-9b33-d0bae3c924dd",
    "naver_product_name": "아크네스 화이트 티트리 포밍워시 100ml, 1개",
    "translated_name": "Acnes White Tea Tree Foaming Wash",
    "m_name": "(주)웰코스 / 아크네스",
    "contact_email": "master@welcos.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5723021/57230213364.2.jpg",
    "status": "published"
  },
  {
    "id": "37ebbc2e-fd64-4fdf-a795-f529420a8f6d",
    "naver_product_name": "어바웃톤 스킨 레이어 핏 쿠션 파운데이션 13g  21쿨라이트  1개",
    "translated_name": "About Tone Skin Layer Fit Cushion 21 Cool Light",
    "m_name": "어바웃톤",
    "contact_email": "plan22255@bbia.co.kr (Generic domain - verify before outreach)",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5458409/54584099484.24.jpg",
    "status": "published"
  },
  {
    "id": "0d05d5bd-2a51-4ae6-bc61-849047c639e0",
    "naver_product_name": "에스엔피 프렙 각질결톤 마스크 80ml",
    "translated_name": "SNP Prep Flake Tone Peeling Mask",
    "m_name": "",
    "contact_email": "OverseasS2@sdbiotech.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5350291/53502916343.jpg",
    "status": "published"
  },
  {
    "id": "3697915b-21ca-498e-b5dd-abc68a39c4d3",
    "naver_product_name": "웰라쥬 리얼 히알루로닉 블루 100 앰플 100ml(신형), 1개",
    "translated_name": "Wellage Real Hyaluronic Blue 100 Ampoule",
    "m_name": "웰라쥬",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5665470/56654701754.20250909172456.jpg",
    "status": "published"
  },
  {
    "id": "61fd1b84-a708-421e-abc9-0e978f476482",
    "naver_product_name": "정샘물 에센셜 물 마이크로 피팅 미스트 120ml, 1개",
    "translated_name": "Jung Saem Mool Essential Water Micro Fitting Mist",
    "m_name": "정샘물",
    "contact_email": "overseas@jsmbeauty.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192920/51929200802.20241213204753.jpg",
    "status": "published"
  },
  {
    "id": "2663255d-0719-4be7-98d4-b8894094e1c6",
    "naver_product_name": "줌 바이 정샘물 광프렙 부스터 30ml",
    "translated_name": "Zoom by Jung Saem Mool Glow Prep Booster",
    "m_name": "주식회사 뉴앤뉴 / (주)정샘물뷰티",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5837032/58370322892.1.jpg",
    "status": "published"
  },
  {
    "id": "1e34bbaa-61c1-46f9-a896-ddb096a5d0a0",
    "naver_product_name": "줌 바이 정샘물 톤프렙 부스터 30ml x 3개",
    "translated_name": "Zoom by Jungsaemmool Tone Prep Booster",
    "m_name": "주식회사 뉴앤뉴 / (주)정샘물뷰티",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5837019/58370199421.1.jpg",
    "status": "published"
  },
  {
    "id": "a47e2318-71fb-428b-ba64-7e23d6106e4c",
    "naver_product_name": "줌 바이 정샘물 프렙 스킨패드 3매",
    "translated_name": "Zoom by Jung Saemmool Prep Skin Pad / Jung Saemmool Dual-Sided Hydrating Prep Pad",
    "m_name": "(주)메가코스 / (주)정샘물뷰티",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5837026/58370265599.1.jpg",
    "status": "published"
  },
  {
    "id": "58649760-816a-4129-8fdf-6a6f2e8c6cb2",
    "naver_product_name": "코스메카코리아 TAG 벨벳 커버 쿠션  본품(SPF50+), 누드 라이트, 15g",
    "translated_name": "TAG Velvet Cover Cushion",
    "m_name": "(주)코스메카코리아 / (주)투쿨포스쿨",
    "contact_email": "jsryu@cosmecca.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_4680731/46807319071.1.jpg",
    "status": "published"
  },
  {
    "id": "da4c42fd-e99c-4b85-afda-d5faf6f048a3",
    "naver_product_name": "클리덤 저분자 콜라겐 아이 마사지 앰플 15ml, 1개",
    "translated_name": "Cleaderm Low Molecular Collagen Eye Massage Ampoule",
    "m_name": "종근당건강",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5155013/51550134393.2.jpg",
    "status": "published"
  },
  {
    "id": "714d3db8-2e5c-4b56-bf88-fd38248b737a",
    "naver_product_name": "클리오 킬 커버 파운웨어 쿠션 21C 란제리 16g CLO-36107",
    "translated_name": "Clio Kill Cover Founwear Cushion The Original 21C Lingerie",
    "m_name": "클리오",
    "contact_email": "hnlee@clio.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5890872/58908720963.jpg",
    "status": "published"
  },
  {
    "id": "c4daf475-f2a6-4f40-8f84-db1345f71e61",
    "naver_product_name": "태그 코렉팅 선 베이스 1호 글림 아이보리",
    "translated_name": "TAG Correcting Sun Base #1 Glimmer Ivory",
    "m_name": "(주)미누스토리 / (주)투쿨포스쿨",
    "contact_email": "katalian82@minustory.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5649842/56498422084.1.jpg",
    "status": "published"
  },
  {
    "id": "cc40f583-1d90-4c46-8973-869db46daafe",
    "naver_product_name": "토르홉 사우난지앙 솔트 마스크 90g (+무민스트레스볼 기획) 온열소금팩",
    "translated_name": "Torhop SaunanJian Salt Mask Moomin Edition",
    "m_name": "토르홉",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_9074523/90745232229.jpg",
    "status": "published"
  },
  {
    "id": "a356d404-fdf4-4e19-a353-e769d07bef0f",
    "naver_product_name": "토리든 솔리드인 세라마이드 립 에센스  11ml, 2개",
    "translated_name": "Torriden Solid-In Ceramide Lip Essence",
    "m_name": "토리든",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5901418/59014181607.20260223122125.jpg",
    "status": "published"
  },
  {
    "id": "bb0e6a85-4a77-4395-9b80-fd47f70121cc",
    "naver_product_name": "투에딧 반질밀착 베이스 세숑에디션 30ml, 1개",
    "translated_name": "Twoedit Blur Powder Pact - Clean White",
    "m_name": "애경산업",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5147430/51474301820.1.jpg",
    "status": "published"
  },
  {
    "id": "6d62fd09-f515-4355-995f-ee962be9466e",
    "naver_product_name": "투쿨포스쿨 투쿨포스쿨 스웨이 립 벨벳 02 너티 핑크",
    "translated_name": "Too Cool For School Sway Lip Velvet 02 Naughty Pink",
    "m_name": "투쿨포스쿨",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5924653/59246538872.jpg",
    "status": "published"
  },
  {
    "id": "497ddb1c-c591-4846-8bd1-41da286d115d",
    "naver_product_name": "파넬 시카마누 클리어 패치 멀티 68매, 1개",
    "translated_name": "Cicamanu Clear Patch Multi",
    "m_name": "파넬",
    "contact_email": "parnell@parnell.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192928/51929282864.20241213210646.jpg",
    "status": "published"
  },
  {
    "id": "02dfc31a-b0d3-4804-a501-b0fa45441222",
    "naver_product_name": "파티온 노스카나인 트러블 세럼 30ml, 2개",
    "translated_name": "Partion Noscar Nine Trouble Serum",
    "m_name": "",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5723020/57230204004.2.jpg",
    "status": "published"
  },
  {
    "id": "25188e7a-7192-4598-b981-f1957f43d12a",
    "naver_product_name": "파티온 노스카나인 퍼스트스텝 진정 세럼 미스트 150ml, 1개",
    "translated_name": "Fation Nosca9 First Step Calming Serum Mist",
    "m_name": "",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5723045/57230453437.3.jpg",
    "status": "published"
  },
  {
    "id": "70ed906a-9a85-461a-979b-f7a600dd5a88",
    "naver_product_name": "프릴루드딘토 라벨르로즈 리퀴드치크 10ml 컬러 4종 발그레한 볼터치",
    "translated_name": "Prelude Dinto La Belle Rose Liquid Cheek #61 Baby Rose",
    "m_name": "(주)트렌드메이커 / 딘토",
    "contact_email": "",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5727280/57272807512.jpg",
    "status": "published"
  },
  {
    "id": "d7a29c58-44cf-4b65-981f-48cd8fb51971",
    "naver_product_name": "플레이 101 바이 에뛰드 슬림 아이브로우 펜슬 03 밀크티 브라운",
    "translated_name": "Play 101 by ETUDE Slim Eyebrow Pencil 03 Milk Tea Brown",
    "m_name": "모나미코스메틱 / (주) 에뛰드",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5903992/59039924878.jpg",
    "status": "published"
  },
  {
    "id": "5aa31544-e437-4bd7-97b4-107f59d877ca",
    "naver_product_name": "플레이101 바이 에뛰드 슬림 레이어드 쿠션 02미디엄베이지 15g",
    "translated_name": "Play 101 by Etude Slim Layered Cushion 02 Medium Beige",
    "m_name": "(주)코스비전 / (주)에뛰드",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5904027/59040277974.jpg",
    "status": "published"
  },
  {
    "id": "b06598bf-2f76-4092-8395-afe4f80cd95d",
    "naver_product_name": "피노 프리미엄 터치 헤어 마스크 비 시세이도 일본 손상모 헤어팩 230g",
    "translated_name": "Fino Premium Touch Hair Mask",
    "m_name": "FINO",
    "contact_email": null,
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_8807394/88073947504.jpg",
    "status": "published"
  },
  {
    "id": "844cf884-9036-4f92-82ee-34d0ab8b5c15",
    "naver_product_name": "피지오겔 사이언수티컬즈 데일리뮨 앰플 50ml + 10ml, 1개",
    "translated_name": "Physiogel Scientiuals DailyMoon Ampoule Serum",
    "m_name": "피지오겔",
    "contact_email": "physiogel@lghnh.com",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_5192918/51929184471.20241213204815.jpg",
    "status": "published"
  },
  {
    "id": "355c516d-da27-4d66-9a22-28174c70ef7e",
    "naver_product_name": "해서린 스팟케어 클리어 젤 15ml, 1개",
    "translated_name": "HATHERINE Spot Care Clear Gel",
    "m_name": "아이큐어(주) / (주)디와이디",
    "contact_email": "icure@icure.co.kr",
    "video_url": null,
    "image_url": "https://shopping-phinf.pstatic.net/main_4934525/49345253843.2.jpg",
    "status": "published"
  }
]
```