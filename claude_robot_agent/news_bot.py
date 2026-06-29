import asyncio
import json
import os
import re
import schedule
import sys
import time
from difflib import SequenceMatcher
import httpx
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path

import anthropic
import feedparser
from googlenewsdecoder import gnewsdecoder
from dotenv import load_dotenv
from telegram import Bot

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

SEEN_NEWS_FILE = Path(__file__).parent / "seen_news.json"
KST = timezone(timedelta(hours=9))

RSS_FEEDS = {
    "🌍 글로벌": [
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EB%AF%B8%EA%B5%AD&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EC%88%98%EC%B6%9C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%98%AC%EB%A6%AC%EB%B8%8C%EC%98%81+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%98%AC%EB%A6%AC%EB%B8%8C%EC%98%81+%EB%AF%B8%EA%B5%AD&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EC%9C%A0%EB%9F%BD&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EB%8F%99%EB%82%A8%EC%95%84&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EC%95%84%EB%A7%88%EC%A1%B4&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%ED%95%9C%EA%B5%AD%ED%99%94%EC%9E%A5%ED%92%88+%EC%88%98%EC%B6%9C&hl=ko&gl=KR&ceid=KR:ko",
    ],
    "🔥 트렌드": [
        "https://news.google.com/rss/search?q=%EB%8B%A4%EC%9D%B4%EC%86%8C+%EB%B7%B0%ED%8B%B0+%EC%8B%A0%EC%A0%9C%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%ED%95%9C%EA%B5%AD%ED%99%94%EC%9E%A5%ED%92%88+%ED%92%88%EC%A0%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%ED%8B%B1%ED%86%A1&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=K%EB%B7%B0%ED%8B%B0+%EB%B0%94%EC%9D%B4%EB%9F%B4&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%98%AC%EB%A6%AC%EB%B8%8C%EC%98%81+%EC%8B%A0%EC%83%81&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=PDRN+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%82%98%EC%9D%B4%EC%95%84%EC%8B%A0%EC%95%84%EB%A7%88%EC%9D%B4%EB%93%9C+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%84%B8%EB%9D%BC%EB%A7%88%EC%9D%B4%EB%93%9C+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
    ],
    "🎭 엔터×뷰티": [
        "https://news.google.com/rss/search?q=%EB%84%B7%ED%94%8C%EB%A6%AD%EC%8A%A4+%EB%B7%B0%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%93%9C%EB%9D%BC%EB%A7%88+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%95%84%EC%9D%B4%EB%8F%8C+%EB%B7%B0%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%97%B0%EC%98%88%EC%9D%B8+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%BC%80%EC%9D%B4%ED%8C%9D+%EB%B7%B0%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%ED%98%91%EC%97%85+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
    ],
    "💄 브랜드": [
        "https://news.google.com/rss/search?q=%EC%95%84%EB%88%A4%EC%95%84+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%ED%86%A0%EB%A6%AC%EB%93%A0+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%84%98%EB%B2%84%EC%A6%88%EC%9D%B8+%EC%8A%A4%ED%82%A8%EC%BC%80%EC%96%B4&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%A1%B0%EC%84%A0%EB%AF%B8%EB%85%80+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%8B%AC%EB%B0%94+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=VT%EC%BD%94%EC%8A%A4%EB%A9%94%ED%8B%B1%EC%8A%A4+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%BD%94%EC%8A%A4%EC%95%8C%EC%97%91%EC%8A%A4+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%9D%BC%EC%9A%B4%EB%93%9C%EB%9E%A9+%EA%B8%80%EB%A1%9C%EB%B2%8C&hl=ko&gl=KR&ceid=KR:ko",
    ],
    "🗺 관광×뷰티": [
        "https://news.google.com/rss/search?q=%EC%99%B8%EA%B5%AD%EC%9D%B8+%EC%98%AC%EB%A6%AC%EB%B8%8C%EC%98%81&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%ED%95%9C%EA%B5%AD+%EB%B7%B0%ED%8B%B0+%EA%B4%80%EA%B4%91&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%AA%85%EB%8F%99+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EB%B0%A9%ED%95%9C+%EB%B7%B0%ED%8B%B0&hl=ko&gl=KR&ceid=KR:ko",
        "https://news.google.com/rss/search?q=%EC%9D%B8%EB%B0%94%EC%9A%B4%EB%93%9C+%ED%99%94%EC%9E%A5%ED%92%88&hl=ko&gl=KR&ceid=KR:ko",
    ],
}


def load_seen_news() -> set:
    if SEEN_NEWS_FILE.exists():
        with open(SEEN_NEWS_FILE, "r", encoding="utf-8") as f:
            return set(json.load(f))
    return set()


def save_seen_news(seen: set) -> None:
    with open(SEEN_NEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(list(seen), f, ensure_ascii=False, indent=2)


def is_within_24h(published_str: str) -> bool:
    if not published_str:
        return True
    try:
        pub_dt = parsedate_to_datetime(published_str)
        now = datetime.now(timezone.utc)
        return (now - pub_dt).total_seconds() < 86400
    except Exception:
        return True


def is_similar_title(title1: str, title2: str, threshold: float = 0.8) -> bool:
    return SequenceMatcher(None, title1.lower(), title2.lower()).ratio() >= threshold


def fetch_all_articles(seen: set) -> list[dict]:
    articles = []
    seen_ids = set()
    for category, urls in RSS_FEEDS.items():
        for url in urls:
            try:
                feed = feedparser.parse(url)
                for entry in feed.entries:
                    article_id = entry.get("id") or entry.get("link", "")
                    if article_id in seen or article_id in seen_ids:
                        continue
                    if not is_within_24h(entry.get("published", "")):
                        continue
                    title = entry.get("title", "")
                    if any(is_similar_title(title, a["title"]) for a in articles):
                        continue
                    seen_ids.add(article_id)
                    articles.append({
                        "id": article_id,
                        "title": entry.get("title", ""),
                        "link": entry.get("link", ""),
                        "published": entry.get("published", ""),
                        "category": category,
                    })
            except Exception as e:
                print(f"RSS 오류: {e}")
    return articles


async def claude_filter(articles: list[dict]) -> list[dict]:
    if not articles:
        return []
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    titles_text = "\n".join(
        f"{i}. [{a['category']}] {a['title']}" for i, a in enumerate(articles)
    )
    prompt = (
        "You are a content curator for KoreaScout — a K-beauty intelligence platform for global sellers.\n\n"
        "Below are Korean beauty news article titles collected from RSS feeds.\n\n"
        "YOUR SELECTION RULES:\n\n"
        "STEP 1 — REMOVE (always cut these):\n"
        "- Near-duplicates: same story from multiple outlets → keep only the most informative title\n"
        "- Aggressive deduplication: if two articles are about the SAME brand doing the SAME thing, keep ONLY 1\n"
        "- Stock prices, earnings, investor reports\n"
        "- ODM/OEM factory news, regulatory filings, cGMP certifications\n"
        "- Job postings, corporate HR news\n"
        "- Purely domestic Korean consumer news with zero global angle\n\n"
        "STEP 2 — PRIORITIZE:\n"
        "🔥 HIGH PRIORITY (aim for 70%):\n"
        "- Celebrity x beauty collabs (Netflix, K-pop idols, actors)\n"
        "- Viral or sold-out products (품절, 바이럴, 틱톡)\n"
        "- Foreign tourists going crazy for K-beauty in Korea\n"
        "- Unexpected brand moments or surprising product launches\n"
        "- 'Only in Korea' stories that global audiences wouldn't know\n"
        "- Daiso beauty finds with insane margin potential\n\n"
        "📊 LOWER PRIORITY (max 30%):\n"
        "- Export records, global market expansion news\n"
        "- Brand entering new country/platform\n"
        "- Industry trend reports with global seller angle\n\n"
        "STEP 3 — SELECT MAX 15 articles total\n\n"
        "OUTPUT RULES:\n"
        "- First line only: comma-separated 0-based indices like: 0,3,7,12\n"
        "- NO explanation, NO words. Maximum 15 numbers.\n\n"
        f"Articles:\n{titles_text}"
    )
    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=100,
        messages=[{"role": "user", "content": prompt}],
    )
    response = message.content[0].text.strip().split('\n')[0]
    selected_indices = list(dict.fromkeys(
        int(part) for part in re.split(r'[,\s]+', response)
        if part.isdigit() and 0 <= int(part) < len(articles)
    ))
    selected_indices = selected_indices[:15]
    return [articles[i] for i in selected_indices] if selected_indices else articles[:15]


def decode_google_url(url: str) -> str:
    try:
        result = gnewsdecoder(url)
        if result.get("status"):
            return result["decoded_url"]
    except Exception:
        pass
    return url


async def generate_x_post(article: dict, body: str) -> str:
    """
    X — 50~100자 저격수
    데이터: <100자가 RT/좋아요 피크. em dash(—) 구조가 스크롤 스탑.
    """
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    body_section = f"Article body:\n{body}\n\n" if body else ""

    prompt = (
        "You write X posts for KoreaScout — K-beauty intelligence for global sellers.\n\n"
        "TARGET LENGTH: 50–100 characters. This is data-proven peak engagement for B2B.\n"
        "If you go over 100 characters, you have failed. Cut ruthlessly.\n\n"
        "THE ONLY STRUCTURE THAT WORKS:\n"
        "[Specific fact] — [What it means for sellers right now.]\n"
        "Use em dash (—) or colon (:) as the pivot. Never a comma.\n\n"
        "WHAT 'SPECIFIC FACT' MEANS:\n"
        "- A brand name, number, place, or action from the article\n"
        "- NOT: 'K-beauty is growing' (vague)\n"
        "- YES: 'Maenyeo Factory just landed in Olive Young LA #2' (specific)\n\n"
        "BANNED WORDS: significant, leverage, landscape, differentiation, "
        "synergy, amid, planting flags, behind the curve, game changer\n\n"
        "BANNED PATTERNS:\n"
        "- Two sentences → delete the second\n"
        "- Starting with 'The' or 'A' → rewrite\n"
        "- Ending with a question → cut it\n\n"
        f"Article title: {article['title']}\n"
        f"Category: {article['category']}\n"
        f"{body_section}"
        "Write ONE line. 50–100 characters. Em dash structure. Nothing else."
    )

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=40,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


async def generate_threads_post(article: dict, body: str) -> str:
    """
    Threads — 1+2+1 구조, 200자 이내
    데이터: 멀티센텐스 + 줄바꿈 + 질문 마무리가 Save 수 최고
    """
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    body_section = f"Article body:\n{body}\n\n" if body else ""

    prompt = (
        "You write Threads posts for KoreaScout — K-beauty intelligence for global sellers.\n\n"
        "STRUCTURE (1-2-1 pattern — proven highest Save rate on Threads):\n"
        "Line 1: Hook — one punchy fact, NO period at end (keeps reader moving)\n"
        "[empty line]\n"
        "Line 2: Context — what makes this fact surprising or important\n"
        "Line 3: Seller angle — what this means in money or distribution terms\n"
        "[empty line]\n"
        "Line 4: Specific question — make industry insiders want to answer\n\n"
        "LENGTH: Under 200 characters total (excluding the link added after).\n"
        "Each line should be SHORT. Cut every unnecessary word.\n\n"
        "THE QUESTION RULE:\n"
        "- Must be specific enough that someone with real knowledge has a real answer\n"
        "- NOT: 'What do you think?' → too vague\n"
        "- YES: 'Which market is moving on NAD first — US or EU?' → specific\n\n"
        "BANNED: sign-off, hashtags, journalist words, consultant words\n\n"
        f"Article title: {article['title']}\n"
        f"Category: {article['category']}\n"
        f"{body_section}"
        "Write the 1-2-1 Threads post now. Under 200 chars. Nothing else."
    )

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=80,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


async def generate_linkedin_post(article: dict, body: str) -> str:
    """
    LinkedIn — 인사이더 분석
    오프닝 한 방 + 불릿 3개(돈/시장 앵글) + 전문가 질문
    """
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    body_section = f"Article body:\n{body}\n\n" if body else ""

    prompt = (
        "You write LinkedIn posts for KoreaScout — K-beauty intelligence for global sellers.\n\n"
        "STRUCTURE:\n"
        "Line 1: One punchy sentence — concrete fact + seller implication (same Tae-o energy)\n"
        "Lines 2-4: Three bullets starting with •\n"
        "  Each bullet = specific market/money insight (size, gap, timing, margin)\n"
        "  Each bullet answers: 'so what does this mean in dollars or distribution?'\n"
        "Line 5: One specific question — industry insiders should want to answer this\n\n"
        "BULLET QUALITY CHECK:\n"
        "- Contains a number, market name, or time window → GOOD\n"
        "- Vague observation without data → REWRITE\n\n"
        "STRICT MAX: 700 characters total\n"
        "NO sign-off. NO hashtags. NO consultant words.\n\n"
        f"Article title: {article['title']}\n"
        f"Category: {article['category']}\n"
        f"{body_section}"
        "Write the LinkedIn post now. Under 700 chars. Nothing else."
    )

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text.strip()


def parse_selection(text: str, total: int) -> list[int]:
    indices = []
    for part in re.split(r"[,\s]+", text.strip()):
        if part.isdigit():
            n = int(part)
            if 1 <= n <= total:
                indices.append(n - 1)
    return list(dict.fromkeys(indices))


async def get_last_update_id(bot: Bot) -> int:
    try:
        updates = await bot.get_updates(offset=-1, timeout=1)
        if updates:
            return updates[-1].update_id
    except Exception:
        pass
    return 0


async def wait_for_message(bot: Bot, chat_id: str, last_update_id: int, timeout: int = 300) -> tuple[str, int]:
    deadline = asyncio.get_event_loop().time() + timeout
    offset = last_update_id + 1
    while asyncio.get_event_loop().time() < deadline:
        try:
            updates = await bot.get_updates(offset=offset, timeout=10, allowed_updates=["message"])
            for update in updates:
                offset = update.update_id + 1
                if update.message and str(update.message.chat_id) == str(chat_id):
                    return update.message.text or "", offset - 1
        except Exception as e:
            print(f"getUpdates 오류: {e}")
        await asyncio.sleep(1)
    return "TIMEOUT", offset - 1


async def run_news_bot() -> None:
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    chat_id = TELEGRAM_CHAT_ID
    now_kst = datetime.now(KST).strftime("%Y-%m-%d %H:%M KST")

    last_update_id = await get_last_update_id(bot)

    # 1. RSS 수집
    await bot.send_message(chat_id=chat_id, text=f"🔍 K뷰티 뉴스 수집 중... ({now_kst})")
    seen = load_seen_news()
    raw_articles = fetch_all_articles(seen)

    if not raw_articles:
        await bot.send_message(chat_id=chat_id, text="📭 새로운 뉴스가 없습니다.")
        return

    # 2. Claude 필터링
    await bot.send_message(chat_id=chat_id, text=f"🤖 필터링 중... ({len(raw_articles)}개 → 최대 15개)")
    filtered = await claude_filter(raw_articles)

    if not filtered:
        await bot.send_message(chat_id=chat_id, text="📭 필터링 후 남은 뉴스가 없습니다.")
        return

    # 3. 제목 리스트 전송
    lines = [f"📰 오늘의 K뷰티 뉴스 ({len(filtered)}건) — {now_kst}\n"]
    for i, a in enumerate(filtered, 1):
        lines.append(f"{i}. {a['category']} {a['title']}\n")
    lines.append("\n포스팅할 번호 입력 (예: 1,3,5)")
    await bot.send_message(chat_id=chat_id, text="\n".join(lines))

    # 4. 번호 입력 대기
    reply1, last_update_id = await wait_for_message(bot, chat_id, last_update_id)
    if reply1 == "TIMEOUT":
        await bot.send_message(chat_id=chat_id, text="⏰ 시간 초과.")
        return

    indices = parse_selection(reply1, len(filtered))
    if not indices:
        await bot.send_message(chat_id=chat_id, text="유효한 번호가 없습니다.")
        return

    selected = [filtered[i] for i in indices]

    # 5. URL 디코딩 후 링크 전송
    for article in selected:
        article["link"] = decode_google_url(article["link"])

    url_lines = [f"🔗 선택한 기사 ({len(selected)}건)\n"]
    for i, a in enumerate(selected, 1):
        url_lines.append(f"{i}. {a['category']} {a['title']}")
        url_lines.append(f"   {a['link']}\n")
    url_lines.append("✅ 전체확정: OK  |  일부확정: 번호 재입력 (1,2,3 기준)  |  취소: NO")
    await bot.send_message(chat_id=chat_id, text="\n".join(url_lines))

    # 6. 최종 확정 대기
    reply2, last_update_id = await wait_for_message(bot, chat_id, last_update_id)
    if reply2 == "TIMEOUT" or reply2.upper() == "NO":
        await bot.send_message(chat_id=chat_id, text="❌ 취소되었습니다.")
        return

    if reply2.upper() == "OK":
        final_articles = selected
    else:
        final_indices = parse_selection(reply2, len(selected))
        final_articles = [selected[i] for i in final_indices] if final_indices else selected

    # 7. 기사별 본문 복붙 받고 포스팅 생성
    save_seen_news(seen | {a["id"] for a in final_articles})

    for article in final_articles:
        await bot.send_message(
            chat_id=chat_id,
            text=f"📋 기사 본문을 붙여넣어 주세요\n\n📰 {article['title']}\n🔗 {article['link']}\n\n기사 전체 내용을 복사해서 보내주세요 👇"
        )

        body_reply, last_update_id = await wait_for_message(bot, chat_id, last_update_id, timeout=600)
        if body_reply == "TIMEOUT":
            await bot.send_message(chat_id=chat_id, text="⏰ 시간 초과. 다음 기사로 넘어갑니다.")
            continue

        article_body = body_reply.strip()

        await bot.send_message(chat_id=chat_id, text="✍️ 포스팅 생성 중...")
        print(f"생성 중: {article['title']}")

        x_post, threads_post, linkedin_post = await asyncio.gather(
            generate_x_post(article, article_body),
            generate_threads_post(article, article_body),
            generate_linkedin_post(article, article_body),
        )

        await bot.send_message(
            chat_id=chat_id,
            text=f"━━━━━━━━━━━━━━━\n𝕏 X 포스팅이에요\n📰 {article['title']}\n━━━━━━━━━━━━━━━"
        )
        await bot.send_message(chat_id=chat_id, text=f"{x_post}\n\n{article['link']}")
        await asyncio.sleep(0.5)

        await bot.send_message(
            chat_id=chat_id,
            text=f"━━━━━━━━━━━━━━━\n🧵 스레드 포스팅이에요\n📰 {article['title']}\n━━━━━━━━━━━━━━━"
        )
        await bot.send_message(chat_id=chat_id, text=f"{threads_post}\n\n{article['link']}")
        await asyncio.sleep(0.5)

        await bot.send_message(
            chat_id=chat_id,
            text=f"━━━━━━━━━━━━━━━\n💼 LinkedIn 포스팅이에요\n📰 {article['title']}\n━━━━━━━━━━━━━━━"
        )
        await bot.send_message(chat_id=chat_id, text=f"{linkedin_post}\n\n{article['link']}")
        await asyncio.sleep(1)

    await bot.send_message(chat_id=chat_id, text="✅ 완료! X/스레드/LinkedIn에 업로드 하세요 🚀")


def run_scheduler() -> None:
    # 06:05 KST → 미국 퇴근 직전 피드
    # 08:00 KST → 미국 퇴근 후 피드
    # 11:00 KST → 미국 저녁 먹고 피드
    # 22:00 KST → 미국 아침 골든타임 (9AM ET) 🥇
    # 23:00 KST → 미국 아침 피크 (10AM ET) 🥇
    schedule.every().day.at("06:05").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("08:00").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("11:00").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("22:00").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("23:00").do(lambda: asyncio.run(run_news_bot()))

    print(f"[{datetime.now().strftime('%H:%M:%S')}] 스케줄러 시작: 06:05 / 08:00 / 11:00 / 22:00 / 23:00 (KST)")
    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    if "--now" in sys.argv:
        asyncio.run(run_news_bot())
    else:
        run_scheduler()
