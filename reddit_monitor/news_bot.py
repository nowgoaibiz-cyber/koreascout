import asyncio
import json
import os
import re
import schedule
import sys
import time
from datetime import datetime, timezone, timedelta
from difflib import SequenceMatcher
from email.utils import parsedate_to_datetime
from pathlib import Path

import anthropic
import feedparser
import httpx
from dotenv import load_dotenv
from googlenewsdecoder import gnewsdecoder
from telegram import Bot, Update
from telegram.ext import Application, MessageHandler, filters

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

SEEN_NEWS_FILE = Path(__file__).parent / "seen_news.json"
MAX_ARTICLES = 15

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


def decode_google_url(url: str) -> str:
    try:
        result = gnewsdecoder(url)
        if result.get("status"):
            return result["decoded_url"]
    except Exception:
        pass
    return url


async def fetch_article_body(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            clean = re.sub(r"<[^>]+>", " ", resp.text)
            clean = re.sub(r"\s+", " ", clean).strip()
            return clean[:3000]
    except Exception:
        return ""


def build_news_message(articles: list[dict]) -> str:
    lines = [f"📰 오늘의 K뷰티 뉴스 ({len(articles)}건)\n"]
    for i, a in enumerate(articles, 1):
        lines.append(f"{i}. {a['category']} {a['title']}")
    lines.append("\n선택할 번호를 입력하세요 (예: 1,3,5)")
    return "\n".join(lines)


def parse_selection(text: str, total: int) -> list[int]:
    indices = []
    for part in re.split(r"[,\s]+", text.strip()):
        if part.isdigit():
            n = int(part)
            if 1 <= n <= total:
                indices.append(n - 1)
    return list(dict.fromkeys(indices))


async def generate_posts(article: dict) -> tuple[str, str, str]:
    client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
    prompt = (
        "You are Tae-o, a Korean beauty industry insider running KoreaScout — "
        "tracking K-beauty trends for global sellers. You're on the ground in Korea.\n\n"
        f"Article title: {article['title']}\n"
        f"Category: {article['category']}\n\n"
        "Write THREE social media posts in English:\n\n"
        "[X]\n"
        "- STRICT MAX 217 characters. Count carefully. Link (23 chars) will be added after.\n"
        "- One punchy impact line — opinionated, real person reacting\n"
        "- Hook global sellers with FOMO or market insight\n"
        "- NO sign-off, NO '— KoreaScout', NO username\n"
        "- Do NOT include any URL\n\n"
        "[Threads]\n"
        "- STRICT MAX 477 characters. Count carefully. Link (23 chars) will be added after.\n"
        "- One punchy impact line + a bit more context\n"
        "- Feel like a real post, not a press release\n"
        "- NO sign-off, NO '— KoreaScout', NO username\n"
        "- Do NOT include any URL\n\n"
        "[LinkedIn]\n"
        "- One punchy opening line\n"
        "- 3 insight lines for global sellers (each starting with •)\n"
        "- One closing question to spark engagement\n"
        "- STRICT MAX 700 characters total\n"
        "- NO sign-off, NO '— KoreaScout', NO username\n"
        "- Do NOT include any URL\n\n"
        "Format exactly:\n[X]\n<post>\n\n[Threads]\n<post>\n\n[LinkedIn]\n<post>"
    )
    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=900,
        messages=[{"role": "user", "content": prompt}],
    )
    response_text = message.content[0].text.strip()

    x_post = ""
    threads_post = ""
    linkedin_post = ""
    x_match = re.search(r"\[X\]\n(.+?)(?=\n\n\[Threads\]|$)", response_text, re.DOTALL)
    threads_match = re.search(r"\[Threads\]\n(.+?)(?=\n\n\[LinkedIn\]|$)", response_text, re.DOTALL)
    linkedin_match = re.search(r"\[LinkedIn\]\n(.+?)$", response_text, re.DOTALL)
    if x_match:
        x_post = x_match.group(1).strip()
    if threads_match:
        threads_post = threads_match.group(1).strip()
    if linkedin_match:
        linkedin_post = linkedin_match.group(1).strip()

    return x_post, threads_post, linkedin_post


async def run_news_bot() -> None:
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    chat_id = TELEGRAM_CHAT_ID

    seen = load_seen_news()
    articles = fetch_all_articles(seen)

    if not articles:
        await bot.send_message(chat_id=chat_id, text="새로운 K뷰티 뉴스가 없습니다.")
        return

    news_message = build_news_message(articles)
    await bot.send_message(chat_id=chat_id, text=news_message)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Sent {len(articles)} articles. Waiting for reply...")

    app = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    selected_articles: list[dict] = []
    reply_received = asyncio.Event()

    async def handle_message(update: Update, context) -> None:
        if str(update.effective_chat.id) != str(chat_id):
            return
        text = update.message.text or ""
        indices = parse_selection(text, len(articles))
        if not indices:
            await update.message.reply_text("유효한 번호를 입력해주세요 (예: 1,3,5)")
            return
        selected_articles.extend(articles[i] for i in indices)
        reply_received.set()

    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    await app.initialize()
    await app.start()
    await app.updater.start_polling(drop_pending_updates=True)

    try:
        await asyncio.wait_for(reply_received.wait(), timeout=300)
    except asyncio.TimeoutError:
        await bot.send_message(chat_id=chat_id, text="시간 초과. 다시 실행해주세요.")
        await app.updater.stop()
        await app.stop()
        await app.shutdown()
        return

    await app.updater.stop()
    await app.stop()
    await app.shutdown()

    new_seen = seen | {a["id"] for a in selected_articles}
    save_seen_news(new_seen)

    for article in selected_articles:
        article["link"] = decode_google_url(article["link"])
        print(f"[{datetime.now().strftime('%H:%M:%S')}] Generating posts for: {article['title']}")
        x_post, threads_post, linkedin_post = await generate_posts(article)

        await bot.send_message(
            chat_id=chat_id,
            text="━━━━━━━━━━━━━━━━━━━━\n🐦 X 포스팅이에요\n━━━━━━━━━━━━━━━━━━━━",
        )
        await bot.send_message(chat_id=chat_id, text=x_post + "\n\n" + article["link"])

        await asyncio.sleep(0.5)

        await bot.send_message(
            chat_id=chat_id,
            text="━━━━━━━━━━━━━━━━━━━━\n🧵 Threads 포스팅이에요\n━━━━━━━━━━━━━━━━━━━━",
        )
        await bot.send_message(chat_id=chat_id, text=threads_post + "\n\n" + article["link"])

        await asyncio.sleep(0.5)

        await bot.send_message(
            chat_id=chat_id,
            text="━━━━━━━━━━━━━━━━━━━━\n💼 LinkedIn 포스팅이에요\n━━━━━━━━━━━━━━━━━━━━",
        )
        await bot.send_message(chat_id=chat_id, text=linkedin_post + "\n\n" + article["link"])

        await asyncio.sleep(1)

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Done.")


def run_scheduler() -> None:
    schedule.every().day.at("06:05").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("11:00").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("15:00").do(lambda: asyncio.run(run_news_bot()))
    schedule.every().day.at("20:00").do(lambda: asyncio.run(run_news_bot()))

    print(f"[{datetime.now().strftime('%H:%M:%S')}] Scheduler started. Runs at 06:05 / 11:00 / 15:00 / 20:00 daily.")
    while True:
        schedule.run_pending()
        time.sleep(30)


if __name__ == "__main__":
    if "--now" in sys.argv:
        asyncio.run(run_news_bot())
    else:
        run_scheduler()
