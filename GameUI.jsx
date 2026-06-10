import { useState, useRef, useEffect } from 'react';
import { HITTERS, PITCHERS, POSITIONS } from '../lib/gameLogic';

// ─── STYLES ──────────────────────────────────────────────────────────────
export function btnStyle(bg, dis) {
  const background = dis ? "#141420" : (bg || "#e8c84a");
  const color = dis ? "#333" : (!bg || bg === "#e8c84a") ? "#1a1a2e" : "#fff";
  return {
    background, color, border: "none", borderRadius: 6, padding: "9px 16px",
    fontWeight: "bold", fontSize: 13, cursor: dis ? "not-allowed" : "pointer",
    letterSpacing: 0.5, fontFamily: "'Courier New',monospace", opacity: dis ? 0.5 : 1,
    transition: "opacity 0.1s",
  };
}

export const inputStyle = {
  background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 4,
  color: "#fff", padding: "6px 8px", fontSize: 12, outline: "none",
  width: "100%", boxSizing: "border-box", fontFamily: "'Courier New',monospace",
};

// ─── DIE ─────────────────────────────────────────────────────────────────
const PIPS = {
  1:[[50,50]], 2:[[28,28],[72,72]], 3:[[28,28],[50,50],[72,72]],
  4:[[28,28],[72,28],[28,72],[72,72]], 5:[[28,28],[72,28],[50,50],[28,72],[72,72]],
  6:[[28,22],[72,22],[28,50],[72,50],[28,78],[72,78]],
};

export function Die({ value, rolling, size }) {
  const s = size || 54;
  return (
    <div style={{
      width: s, height: s, background: rolling ? "#e8c84a" : "#fffef7",
      border: "2.5px solid #1a1a2e", borderRadius: s * 0.17, position: "relative",
      boxShadow: rolling ? "0 0 20px #e8c84a99" : "3px 3px 0 #1a1a2e",
      transition: "all 0.12s", flexShrink: 0,
    }}>
      {value && PIPS[value].map(([x, y], i) => (
        <div key={i} style={{
          position: "absolute", width: s * 0.16, height: s * 0.16,
          borderRadius: "50%", background: "#1a1a2e",
          left: x + "%", top: y + "%", transform: "translate(-50%,-50%)",
        }} />
      ))}
    </div>
  );
}

// ─── FIELD ANIMATION ─────────────────────────────────────────────────────
const ANIM_CFG = {
  homerun:   { emoji: "💥", label: "HOME RUN!", color: "#f0c030", size: 36 },
  triple:    { emoji: "🔥", label: "TRIPLE!",   color: "#ff8c42", size: 30 },
  double:    { emoji: "⚡", label: "DOUBLE!",   color: "#7ab8f0", size: 26 },
  single:    { emoji: "✅", label: "SINGLE",    color: "#7afa7a", size: 22 },
  walk:      { emoji: "🚶", label: "WALK",      color: "#aaaaff", size: 20 },
  strikeout: { emoji: "🌀", label: "STRUCK OUT!", color: "#ff5555", size: 24 },
  out:       { emoji: "✕",  label: "OUT",       color: "#666",    size: 18 },
  error:     { emoji: "⚠️", label: "ERROR!",    color: "#ffaa44", size: 24 },
  robbed:    { emoji: "🤿", label: "ROBBED!",   color: "#00ffcc", size: 26 },
  steal:     { emoji: "🏃", label: "STOLEN BASE!", color: "#aaff88", size: 22 },
};

export function FieldAnim({ event }) {
  if (!event) return null;
  const cfg = ANIM_CFG[event] || ANIM_CFG.out;
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.78)", borderRadius: 8, zIndex: 10, pointerEvents: "none",
    }}>
      <style>{`@keyframes bcgPop{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ animation: "bcgPop 0.2s ease-out", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: cfg.size * 1.6, lineHeight: 1, filter: "drop-shadow(0 0 10px " + cfg.color + ")" }}>{cfg.emoji}</div>
        <div style={{ fontSize: cfg.size * 0.52, fontWeight: "bold", color: cfg.color, letterSpacing: 2, marginTop: 6, fontFamily: "'Courier New',monospace", textShadow: "0 0 12px " + cfg.color }}>{cfg.label}</div>
      </div>
    </div>
  );
}

// ─── DIAMOND ─────────────────────────────────────────────────────────────
export function Diamond({ bases, animEvent }) {
  return (
    <div style={{ position: "relative", background: "#0a1a0a", border: "1px solid #1a3a1a", borderRadius: 8, padding: 8 }}>
      <svg viewBox="0 0 220 210" style={{ width: "100%", maxWidth: 200, display: "block", margin: "0 auto" }}>
        <polygon points="110,20 195,105 110,190 25,105" fill="#2d5a27" stroke="#3d6a37" strokeWidth={1} />
        <polygon points="110,30 185,105 110,180 35,105" fill="none" stroke="#5a8a5a" strokeWidth={1} strokeDasharray="4,3" />
        {[[185,105,1,bases[0]], [110,28,2,bases[1]], [35,105,3,bases[2]]].map(([x, y, lbl, runner]) => (
          <g key={lbl}>
            <rect x={x-14} y={y-14} width={28} height={28}
              fill={runner ? "#e8c84a" : "#2a4a2a"} stroke={runner ? "#f0d060" : "#4a7a4a"}
              strokeWidth={2} transform={"rotate(45," + x + "," + y + ")"} rx={3} />
            <text x={x} y={y+4} textAnchor="middle" fontSize={9} fill={runner ? "#1a1a2e" : "#7aaa7a"} fontWeight="bold">{lbl}</text>
            {runner && (
              <text x={x} y={y + (lbl === 2 ? -18 : 20)} textAnchor="middle" fontSize={6.5} fill="#e8c84a">
                {runner.split(" ").pop().slice(0, 9)}
              </text>
            )}
          </g>
        ))}
        <polygon points="110,178 122,168 122,156 98,156 98,168" fill="#2a4a2a" stroke="#4a7a4a" strokeWidth={2} />
        <text x={110} y={172} textAnchor="middle" fontSize={8} fill="#7aaa7a" fontWeight="bold">H</text>
      </svg>
      {animEvent && <FieldAnim event={animEvent} />}
    </div>
  );
}

// ─── SCOREBOARD ──────────────────────────────────────────────────────────
export function Scoreboard({ awayScores, homeScores, awayIR, homeIR, awayName, homeName, inning, isTop }) {
  const cols = Math.max(9, inning);
  const colTemplate = "86px repeat(" + cols + ", 1fr) 34px 28px";
  const awayD = [...awayScores]; if (isTop) awayD[inning - 1] = awayIR;
  const homeD = [...homeScores]; if (!isTop) homeD[inning - 1] = homeIR;
  const aT = awayD.reduce((a, b) => a + (b || 0), 0);
  const hT = homeD.reduce((a, b) => a + (b || 0), 0);
  return (
    <div style={{ background: "#0a0a1a", border: "2px solid #1e1e2e", borderRadius: 8, overflowX: "auto", fontFamily: "'Courier New',monospace", fontSize: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: colTemplate, background: "#0f0f1f", minWidth: 360 }}>
        <div style={{ padding: "4px 8px" }} />
        {Array.from({ length: cols }, (_, i) => <div key={i} style={{ padding: "4px 2px", textAlign: "center", color: "#444" }}>{i+1}</div>)}
        <div style={{ padding: "4px 2px", textAlign: "center", color: "#e8c84a", fontWeight: "bold", fontSize: 13 }}>R</div>
        <div style={{ padding: "4px 2px", textAlign: "center", color: "#333" }}>H</div>
      </div>
      {[
        { name: awayName, d: awayD, isAway: true, total: aT },
        { name: homeName, d: homeD, isAway: false, total: hT },
      ].map(row => (
        <div key={row.name} style={{ display: "grid", gridTemplateColumns: colTemplate, borderTop: "1px solid #141424", minWidth: 360 }}>
          <div style={{ padding: "7px 8px", color: "#fff", fontWeight: "bold", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10 }}>{row.name}</div>
          {Array.from({ length: cols }, (_, i) => {
            const live = row.isAway ? (isTop && i + 1 === inning) : (!isTop && i + 1 === inning);
            const val = row.d[i];
            return (
              <div key={i} style={{
                padding: "7px 2px", textAlign: "center",
                color: live ? "#e8c84a" : val !== undefined ? "#fff" : "#252535",
                background: live ? "#1a180a" : "transparent",
                fontWeight: live ? "bold" : "normal",
              }}>{val !== undefined ? val : "·"}</div>
            );
          })}
          <div style={{ padding: "7px 2px", textAlign: "center", color: "#e8c84a", fontWeight: "bold", fontSize: 14 }}>{row.total}</div>
          <div style={{ padding: "7px 2px", textAlign: "center", color: "#333" }}>{row.d.filter(s => s > 0).length}</div>
        </div>
      ))}
    </div>
  );
}

// ─── GAME LOG ────────────────────────────────────────────────────────────
export function GameLog({ log }) {
  return (
    <div style={{ background: "#0a0a1a", border: "1px solid #141424", borderRadius: 6, padding: "8px 10px", maxHeight: 140, overflowY: "auto", fontFamily: "'Courier New',monospace", fontSize: 11 }}>
      {(!log || log.length === 0) && <div style={{ color: "#222" }}>Play-by-play will appear here...</div>}
      {log && [...log].reverse().map((e, i) => (
        <div key={i} style={{
          color: e.t === "score" ? "#e8c84a" : e.t === "error" ? "#e87a4a" : e.t === "out" ? "#484848" : e.t === "inning" ? "#3a6a9a" : "#aaa",
          borderBottom: "1px solid #0d0d1a", padding: "3px 0",
        }}>{e.text}</div>
      ))}
    </div>
  );
}

// ─── PLAYER SEARCHABLE SELECT ────────────────────────────────────────────
export function PlayerSelect({ value, onChange, isPitcherSlot, label }) {
  const pool = isPitcherSlot ? PITCHERS : HITTERS;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = q.length > 0 ? pool.filter(p => p.name.toLowerCase().includes(q.toLowerCase())) : pool;

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <div style={{ fontSize: 8, color: "#555", letterSpacing: 1, marginBottom: 3 }}>{label}</div>
      <div onClick={() => setOpen(o => !o)} style={{
        background: "#0d0d1f", border: "1px solid " + (open ? "#e8c84a" : "#2a2a4a"),
        borderRadius: 5, padding: "7px 10px", cursor: "pointer",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        color: value ? "#fff" : "#444", fontSize: 12,
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "88%" }}>{value || "Select player..."}</span>
        <span style={{ color: "#555", fontSize: 9 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 200, background: "#111", border: "1px solid #2a2a4a", borderRadius: 6, boxShadow: "0 8px 28px #000c", overflow: "hidden" }}>
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search player..."
            style={{ width: "100%", background: "#0d0d1f", border: "none", borderBottom: "1px solid #2a2a4a", color: "#fff", padding: "8px 10px", fontSize: 12, outline: "none", boxSizing: "border-box", fontFamily: "'Courier New',monospace" }} />
          <div style={{ maxHeight: 190, overflowY: "auto" }}>
            {filtered.slice(0, 50).map(p => (
              <div key={p.name} onClick={() => { onChange(p); setOpen(false); setQ(""); }}
                style={{ padding: "7px 10px", cursor: "pointer", fontSize: 12, color: p.name === value ? "#e8c84a" : "#ccc", background: p.name === value ? "#1a1a0a" : "transparent", borderBottom: "1px solid #0f0f1a", display: "flex", justifyContent: "space-between" }}>
                <span>{p.name}</span>
                <span style={{ color: "#444", fontSize: 10 }}>{p.pos}</span>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ padding: 10, color: "#444", fontSize: 11 }}>No players found</div>}
          </div>
        </div>
      )}
    </div>
  );
}
