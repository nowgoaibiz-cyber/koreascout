"use client";

import { useState } from "react";

type ContentType = "키 컨텐츠" | "풀링 컨텐츠";
type Duration = "15초" | "30초" | "60초";
type ScriptResult = { korean: string; english: string };
type ContentIdea = { title: string; text: string };

const PLACEHOLDERS: Record<ContentType, string> = {
  "키 컨텐츠":
    "예) 다이소 화장품은 저가 쓰레기? 절대 아님! 유명 브랜드 저가라인이라 성분은 같고 가격만 낮춤. 학생들과 외국인 여행객들이 쟁여가는 이유가 있음. KoreaScout에서 이런 제품 매주 10개씩 찾아줌",
  "풀링 컨텐츠":
    "예) 아이유가 최근 인스타에 올린 선크림이 올리브영에서 3일만에 품절됨. 재입고 미정. 이런 트렌드를 KoreaScout이 먼저 포착함",
};

const KEY_CONTENT_IDEAS: ContentIdea[] = [
  {
    title: "다이소 시리즈",
    text: "다이소 화장품은 저가 쓰레기? 절대 아님! 유명 브랜드 저가라인. 성분 동일하고 가격만 낮춤. 학생들 필수템. 외국인 여행객들이 쟁여가는 이유. KoreaScout에서 매주 다이소 숨겨진 제품 찾아줌",
  },
  {
    title: "올리브영 탑 제품",
    text: "이번주 올리브영에서 제일 잘나가는 제품은? 수출 가능한지 글로벌 가격은 얼마인지 화해 평점은 어떤지 KoreaScout이 다 분석해줌. 너네는 팔기만 해",
  },
  {
    title: "솔드아웃 제품",
    text: "올리브영에서 또 품절됐다. 이 제품 왜 이렇게 잘나가나 했더니 수출 문의도 엄청남. KoreaScout은 이런 제품 품절 전에 미리 알려줌",
  },
  {
    title: "브랜드 인사이트",
    text: "한국 중소 브랜드인데 글로벌에서 대박난 제품들 있음. 아마존에서 한국 정가의 3배에 팔리는 중. KoreaScout에서 이런 숨겨진 브랜드 찾아줌",
  },
  {
    title: "KoreaScout 소개",
    text: "K뷰티 셀러인데 아직도 올리브영 직접 돌아다니면서 제품 찾음? KoreaScout은 네이버 화해 글로우픽 올리브영 데이터 전부 취합해서 수출 가능한 제품만 골라줌. 우리가 찾고 너네가 팔면 됨",
  },
];

const POOLING_CONTENT_IDEAS: ContentIdea[] = [
  {
    title: "연예인 품절템",
    text: "아이유가 인스타에 올린 선크림 올리브영에서 3일만에 품절. 재입고 미정. 이런 트렌드 KoreaScout이 먼저 포착함",
  },
  {
    title: "SNS 바이럴",
    text: "한국 틱톡에서 난리난 클렌징폼 있음. 일주일만에 조회수 500만. 올리브영 입고되자마자 품절. 글로벌 셀러들 지금 당장 확인해야 함",
  },
  {
    title: "화해 급상승",
    text: "화해 앱에서 이번달 평점 급상승한 제품 발견. 리뷰 수가 한달만에 3배. 올리브영 아직 재고 있음. KoreaScout에서 이런 제품 먼저 알려줌",
  },
  {
    title: "계절 트렌드",
    text: "한국 여름 필수 자외선차단제 시즌 시작. 올해는 어떤 제품이 뜨나. KoreaScout 데이터 기준 상위 5개 제품 수출 가능 여부까지 분석 완료",
  },
];

export default function ScriptGeneratorPage() {
  const [contentType, setContentType] = useState<ContentType>("키 컨텐츠");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState<Duration>("30초");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingVoiceover, setIsGeneratingVoiceover] = useState(false);
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [ideasExpanded, setIdeasExpanded] = useState(false);

  const contentIdeas =
    contentType === "키 컨텐츠" ? KEY_CONTENT_IDEAS : POOLING_CONTENT_IDEAS;

  function handleSelectIdea(text: string) {
    setContent(text);
    setIdeasExpanded(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
      redirect: "manual",
    });
    window.location.href = "/admin/login";
  }

  async function handleGenerateScript() {
    if (!content.trim()) return;
    setIsGeneratingScript(true);
    setAudioUrl(null);
    setAudioBlob(null);
    try {
      const res = await fetch("/api/admin/generate-script", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentType,
          content,
          duration,
        }),
      });
      if (!res.ok) throw new Error("스크립트 생성 실패");
      const data = (await res.json()) as ScriptResult;
      setScript(data);
    } catch {
      alert("스크립트 생성에 실패했습니다.");
    } finally {
      setIsGeneratingScript(false);
    }
  }

  async function handleGenerateVoiceover() {
    if (!script) return;
    setIsGeneratingVoiceover(true);
    try {
      const res = await fetch("/api/admin/generate-voiceover", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: script.english }),
      });
      if (!res.ok) throw new Error("더빙 생성 실패");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioUrl(url);
    } catch {
      alert("더빙 생성에 실패했습니다.");
    } finally {
      setIsGeneratingVoiceover(false);
    }
  }

  async function handleCopy() {
    if (!script) return;
    const text = `🇰🇷 한국어\n${script.korean}\n\n🇺🇸 English\n${script.english}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("복사에 실패했습니다.");
    }
  }

  function handleDownload() {
    if (!audioBlob) return;
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceover.mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-[#F8F7F4] min-h-screen pt-16">
      <header className="bg-white border-b border-[#E8E6E1] px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#1A1916]">KoreaScout Admin</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-sm text-[#9E9C98] hover:text-[#1A1916] transition-colors"
        >
          Logout
        </button>
      </header>

      <div className="bg-white border-b border-[#E8E6E1]">
        <nav className="flex gap-0 px-6">
          <a
            href="/admin"
            className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[#9E9C98] hover:text-[#1A1916] transition-colors"
          >
            Reports
          </a>
          <a
            href="/admin/script-generator"
            className="px-4 py-3 text-sm font-medium border-b-2 border-[#16A34A] text-[#16A34A] transition-colors"
          >
            Script Generator
          </a>
          <a
            href="/admin/orders"
            className="px-4 py-3 text-sm font-medium border-b-2 border-transparent text-[#9E9C98] hover:text-[#1A1916] transition-colors"
          >
            Orders
          </a>
        </nav>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <section className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] p-6">
          <h1 className="text-lg font-bold text-[#1A1916]">Script Generator</h1>
          <p className="mt-1 text-sm text-[#6B6860]">
            내용을 입력하면 숏츠용 스크립트와 더빙을 생성합니다
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-[#1A1916] mb-2">컨텐츠 타입</p>
              <div className="flex gap-2">
                {(["키 컨텐츠", "풀링 컨텐츠"] as ContentType[]).map((type) => {
                  const selected = contentType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setContentType(type)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                        selected
                          ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]"
                          : "bg-white text-[#6B6860] border-[#E8E6E1]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A1916] block mb-2" htmlFor="content">
                핵심 내용
              </label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={PLACEHOLDERS[contentType]}
                className="border border-[#E8E6E1] rounded-xl p-3 text-sm w-full text-[#1A1916] placeholder:text-[#9E9C98] focus:border-[#16A34A] outline-none"
              />

              <button
                type="button"
                onClick={() => setIdeasExpanded((prev) => !prev)}
                className="text-sm text-[#16A34A] underline cursor-pointer mb-2 mt-3 block"
              >
                💡 컨텐츠 아이디어 참고
              </button>

              {ideasExpanded && (
                <div className="mt-2">
                  {contentIdeas.map((idea) => (
                    <button
                      key={idea.title}
                      type="button"
                      onClick={() => handleSelectIdea(idea.text)}
                      className="w-full text-left bg-[#F8F7F4] border border-[#E8E6E1] rounded-xl p-3 mb-2 cursor-pointer hover:bg-[#DCFCE7] hover:border-[#16A34A] transition-colors"
                    >
                      <p className="text-xs font-semibold text-[#1A1916] mb-1">{idea.title}</p>
                      <p className="text-xs text-[#6B6860] line-clamp-2">{idea.text}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[#1A1916] block mb-2" htmlFor="duration">
                영상 길이
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value as Duration)}
                className="w-full bg-white border border-[#E8E6E1] rounded-xl p-3 text-sm text-[#1A1916] focus:border-[#16A34A] outline-none"
              >
                <option value="15초">15초 (숏츠 추천)</option>
                <option value="30초">30초</option>
                <option value="60초">60초</option>
              </select>
            </div>

            <button
              type="button"
              disabled={isGeneratingScript || !content.trim()}
              onClick={handleGenerateScript}
              className="w-full bg-[#16A34A] hover:bg-[#15803D] disabled:bg-[#16A34A] text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isGeneratingScript ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-[#DCFCE7] border-t-white animate-spin" />
                  생성 중...
                </>
              ) : (
                "스크립트 생성"
              )}
            </button>
          </div>
        </section>

        {script && (
          <section className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] p-6">
            <div>
              <p className="text-sm font-semibold text-[#1A1916] mb-2">🇰🇷 한국어</p>
              <p className="whitespace-pre-wrap text-sm text-[#1A1916] leading-6">
                {script.korean}
              </p>
            </div>

            <hr className="border-[#E8E6E1] my-6" />

            <div>
              <p className="text-sm font-semibold text-[#1A1916] mb-2">🇺🇸 English</p>
              <p className="whitespace-pre-wrap text-sm text-[#1A1916] leading-6">
                {script.english}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleGenerateScript}
                className="bg-white border border-[#E8E6E1] text-[#6B6860] rounded-xl py-2.5 text-sm font-medium hover:text-[#1A1916] transition-colors"
              >
                🔄 재생성
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white border border-[#E8E6E1] text-[#6B6860] rounded-xl py-2.5 text-sm font-medium hover:text-[#1A1916] transition-colors"
              >
                📋 복사
              </button>
              <button
                type="button"
                onClick={handleGenerateVoiceover}
                disabled={isGeneratingVoiceover}
                className="bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:bg-[#16A34A]"
              >
                {isGeneratingVoiceover ? "생성 중..." : "🎙 더빙 생성"}
              </button>
            </div>
          </section>
        )}

        {audioUrl && (
          <section className="bg-white rounded-2xl border border-[#E8E6E1] shadow-[0_1px_3px_0_rgb(26_25_22/0.06)] p-6">
            <h2 className="text-lg font-bold text-[#1A1916]">더빙 생성 완료</h2>
            <audio controls className="w-full mt-4">
              <source src={audioUrl} type="audio/mpeg" />
            </audio>
            <button
              type="button"
              onClick={handleDownload}
              className="w-full mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl py-3 text-sm font-semibold transition-colors"
            >
              ⬇ MP3 다운로드
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
