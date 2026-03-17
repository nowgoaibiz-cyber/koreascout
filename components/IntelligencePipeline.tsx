const PILLS = [
  { label: "TikTok", top: "0px", left: "0px", rot: "-1.2deg", delay: "0s", dur: "3.8s" },
  { label: "Instagram", top: "4px", left: "68px", rot: "1deg", delay: "0.5s", dur: "4s" },
  { label: "YouTube", top: "44px", left: "76px", rot: "-0.5deg", delay: "1s", dur: "4.2s" },
  { label: "Olive Young", top: "52px", left: "0px", rot: "0.8deg", delay: "0.3s", dur: "3.6s" },
  { label: "Daiso", top: "108px", left: "88px", rot: "-0.4deg", delay: "0.8s", dur: "4.1s" },
  { label: "B2B Product Data", top: "112px", left: "0px", rot: "0.6deg", delay: "1.3s", dur: "3.9s" },
] as const;

const NOISE_ITEMS = ["Hazmat / Battery", "HS Code Blocked", "Margin Multiplier < 2.0×"] as const;

const NOISE_LINES = ["Zero-margin trends purged", "Global market gaps detected"] as const;

const KOREA_HQ_ROWS = [
  { main: "Factory Direct Line", sub: "— Human-verified" },
  { main: "Exact MOQ & Unit Cost", sub: "— EXW price locked" },
  { main: "MoCRA / CPNP", sub: "— Compliance pre-cleared" },
] as const;

export default function IntelligencePipeline() {
  return (
    <section className="s6-section">
      {/* HEADLINE */}
      <div className="s6-headline">
        <h2>We kill the risks.<br />You own the margin.</h2>
        <p>
          500+ signals scanned. Customs cleared. Factory verified. 10 export-ready winners, every
          week.
        </p>
      </div>

      {/* PIPELINE ROW */}
      <div className="s6-row">
        {/* 00. THE SIGNALS */}
        <div className="s6-step">
          <span className="s6-label">00. The Signals</span>
          <div className="s6-pill-cloud">
            {PILLS.map((p) => (
              <span
                key={p.label}
                className="s6-pill"
                style={{
                  top: p.top,
                  left: p.left,
                  transform: `rotate(${p.rot})`,
                  animationDelay: p.delay,
                  animationDuration: p.dur,
                  zIndex: p.label === "YouTube" || p.label === "Daiso" ? 4 : 2,
                }}
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* ARROW */}
        <div className="s6-arrow-wrap">→</div>

        {/* 01. THE NOISE FILTER */}
        <div className="s6-step">
          <span className="s6-label">01. The Noise Filter</span>
          {NOISE_ITEMS.map((item) => (
            <div key={item} className="s6-kill-row">
              <span className="s6-kill-tag">KILL</span>
              <span className="s6-kill-text">{item}</span>
            </div>
          ))}
          <div className="s6-filter-desc">
            {NOISE_LINES.map((line) => (
              <p key={line}>
                <span style={{ color: "rgba(10,9,8,0.2)", fontSize: "10px" }}>→</span>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* ARROW */}
        <div className="s6-arrow-wrap">→</div>

        {/* 02. KOREA HQ VERIFICATION */}
        <div className="s6-step">
          <span className="s6-label">02. Korea HQ Verification</span>
          {KOREA_HQ_ROWS.map((row) => (
            <div key={row.main} className="s6-verify-row">
              <span className="s6-verify-check" aria-hidden>✓</span>
              <div>
                <div className="s6-v-main">{row.main}</div>
                <div className="s6-v-sub">{row.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ARROW */}
        <div className="s6-arrow-wrap">→</div>

        {/* 03. THE OUTPUT */}
        <div className="s6-step">
          <span className="s6-label">03. The Output</span>
          <div className="s6-output-num">10+</div>
          <p className="s6-output-desc">
            Export-ready winners.
            <br />
            Every week.
          </p>
          <div className="s6-badge">
            <div className="s6-badge-dot" />
            <span>Ready to source</span>
          </div>
        </div>
      </div>
    </section>
  );
}
