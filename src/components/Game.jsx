import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  getDiceOutcome, aiError, aiRobHR, aiInjury, injPos,
  canSteal, stealSafe, rollDice, advanceRunners,
  POSITIONS, DEFAULT_HOME_LINEUP, DEFAULT_HOME_PITCHERS,
  HITTERS, toPlayer, toPitcher,
} from '../lib/gameLogic';
import { Die, Diamond, Scoreboard, GameLog, PlayerSelect, btnStyle, inputStyle, FieldAnim } from './GameUI';

export default function Game({ gameId, onBack }) {
  const [state, setStateLocal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [dice, setDice] = useState([null, null]);
  const [animEvent, setAnimEvent] = useState(null);
  const [myRole, setMyRole] = useState(null); // "away" | "home" | "spectator"
  const [showJoin, setShowJoin] = useState(false);
  const [shareMsg, setShareMsg] = useState("");
  const animRef = useRef(null);
  const stateRef = useRef(null);
  const playerName = localStorage.getItem('bcg_player_name') || 'Player';

  // Load game and subscribe to real-time updates
  useEffect(() => {
    loadGame();
    const channel = supabase
      .channel('game:' + gameId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'games', filter: 'id=eq.' + gameId },
        (payload) => {
          const newState = payload.new.state;
          stateRef.current = newState;
          setStateLocal(newState);
        }
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [gameId]);

  async function loadGame() {
    setLoading(true);
    const { data, error: err } = await supabase.from('games').select('state').eq('id', gameId).single();
    if (err) { setError("Game not found."); setLoading(false); return; }
    const s = data.state;
    stateRef.current = s;
    setStateLocal(s);
    // Determine role
    const stored = localStorage.getItem('bcg_role_' + gameId);
    if (stored) { setMyRole(stored); }
    else if (s.awayPlayerName === playerName) { setMyRole("away"); localStorage.setItem('bcg_role_' + gameId, "away"); }
    else if (s.homePlayerName === playerName) { setMyRole("home"); localStorage.setItem('bcg_role_' + gameId, "home"); }
    else if (s.status === "waiting_home") { setShowJoin(true); }
    else { setMyRole("spectator"); }
    setLoading(false);
  }

  async function saveState(newState) {
    stateRef.current = newState;
    setStateLocal(newState);
    await supabase.from('games').update({ state: newState }).eq('id', gameId);
  }

  function showAnim(type) {
    if (animRef.current) clearTimeout(animRef.current);
    setAnimEvent(type);
    animRef.current = setTimeout(() => setAnimEvent(null), 1600);
  }

  // ── MY TURN CHECK ───────────────────────────────────────────────────────
  function isMyTurn(s) {
    if (!s || s.gameOver) return false;
    if (myRole === "spectator") return false;
    if (s.status === "waiting_home") return false;
    return (s.isTop && myRole === "away") || (!s.isTop && myRole === "home");
  }

  // ── END HALF INNING ─────────────────────────────────────────────────────
  function endHalf(s, runs) {
    let ns = { ...s };
    if (ns.isTop) {
      const a = [...(ns.awayScores || [])]; a[ns.inning - 1] = runs;
      ns.awayScores = a; ns.awayIR = 0;
    } else {
      const h = [...(ns.homeScores || [])]; h[ns.inning - 1] = runs;
      ns.homeScores = h; ns.homeIR = 0;
      if (ns.inning >= 9) {
        const at = ns.awayScores.reduce((a, b) => a + b, 0);
        const ht = h.reduce((a, b) => a + b, 0);
        if (ht !== at) { ns.gameOver = true; ns.status = "complete"; return ns; }
      }
    }
    ns.outs = 0; ns.bases = [null, null, null];
    const nt = !ns.isTop;
    const ni = ns.isTop ? ns.inning : ns.inning + 1;
    if (!ns.isTop) ns.inning = ni;
    ns.isTop = nt;
    ns.log = [...(ns.log || []), { text: "-- " + (nt ? "Top" : "Bot") + " " + ni + " --", t: "inning" }];
    return ns;
  }

  function addLog(s, text, t) {
    return { ...s, log: [...(s.log || []), { text, t: t || "normal" }] };
  }

  function applyOutToState(s, runsSnap) {
    const newOuts = (s.outs || 0) + 1;
    if (newOuts >= 3) {
      return endHalf(s, runsSnap);
    }
    return { ...s, outs: newOuts };
  }

  // ── ROLL ────────────────────────────────────────────────────────────────
  async function handleRoll() {
    const s = stateRef.current;
    if (!s || rolling || s.gameOver || !isMyTurn(s)) return;
    setRolling(true);

    const [d1, d2] = rollDice();
    setDice([d1, d2]);

    const lineup = s.isTop ? s.awayLineup : s.homeLineup;
    const bIdx = s.isTop ? s.awayBatterIdx : s.homeBatterIdx;
    const batter = lineup[bIdx % lineup.length];
    const name = batter ? batter.name : "Batter";
    const result = getDiceOutcome(d1, d2, batter);

    let ns = { ...s };
    ns = addLog(ns, "▶ " + name + " -- " + d1 + "+" + d2 + ": " + result.label);
    const runsNow = s.isTop ? (s.awayIR || 0) : (s.homeIR || 0);
    const irKey = s.isTop ? "awayIR" : "homeIR";
    const biKey = s.isTop ? "awayBatterIdx" : "homeBatterIdx";
    const advBatter = (st) => ({ ...st, [biKey]: ((st[biKey] || 0) + 1) % lineup.length });

    if (result.type === "strikeout") {
      showAnim("strikeout");
      ns = addLog(ns, "  X Strikeout.", "out");
      ns = advBatter(ns);
      ns = applyOutToState(ns, runsNow);
    } else if (result.type === "out") {
      if (aiError()) {
        showAnim("error");
        ns = addLog(ns, "  ERROR! " + name + " reaches first.", "error");
        const [nb] = advanceRunners(ns.bases, "single", name);
        ns = { ...ns, bases: nb }; ns = advBatter(ns);
      } else {
        showAnim("out");
        ns = addLog(ns, "  X Out.", "out");
        ns = advBatter(ns);
        ns = applyOutToState(ns, runsNow);
      }
    } else if (result.type === "homerun") {
      if (aiRobHR()) {
        showAnim("robbed");
        ns = addLog(ns, "  HOME RUN ROBBED!", "out");
        ns = advBatter(ns); ns = applyOutToState(ns, runsNow);
      } else {
        if (aiInjury()) ns = addLog(ns, "  HR -- " + injPos() + " INJURED!", "error");
        showAnim("homerun");
        ns = addLog(ns, "  HOME RUN! " + name + " goes yard!", "score");
        const [nb, runs] = advanceRunners(ns.bases, "homerun", name);
        ns = { ...ns, bases: nb, [irKey]: (ns[irKey] || 0) + runs };
        ns = addLog(ns, "  * " + runs + " run" + (runs !== 1 ? "s" : "") + " score!", "score");
        ns = advBatter(ns);
      }
    } else {
      let hitType = result.type;
      if (result.type === "triple" && !(batter && batter.hrSeason >= 45) && !(batter && batter.triSeason >= 6)) {
        hitType = "triple_stop2";
      }
      const [nb, runs] = advanceRunners(ns.bases, hitType, name);
      ns = { ...ns, bases: nb, [irKey]: (ns[irKey] || 0) + runs };
      showAnim(hitType === "triple_stop2" ? "double" : hitType);
      if (runs > 0) ns = addLog(ns, "  * " + runs + " run" + (runs !== 1 ? "s" : "") + " score!", "score");
      ns = advBatter(ns);
    }

    await saveState(ns);
    setRolling(false);
  }

  // ── STEAL ───────────────────────────────────────────────────────────────
  async function handleSteal(to3) {
    const s = stateRef.current;
    if (!s || rolling || !isMyTurn(s)) return;
    const runnerName = to3 ? s.bases[1] : s.bases[0];
    if (!runnerName) return;
    const lineup = s.isTop ? s.awayLineup : s.homeLineup;
    const ro = lineup.find(p => p.name === runnerName);
    if (!canSteal(ro)) { alert(runnerName + " needs 20+ career SB to steal."); return; }

    const [d1, d2] = rollDice(); setDice([d1, d2]);
    let ns = { ...s };
    const runsNow = s.isTop ? (s.awayIR || 0) : (s.homeIR || 0);

    if (stealSafe(d1, d2, to3)) {
      showAnim("steal");
      ns = addLog(ns, "  " + runnerName + " steals " + (to3 ? "3rd" : "2nd") + " -- SAFE!", "score");
      const nb = [...ns.bases];
      if (to3) { nb[2] = nb[1]; nb[1] = null; } else { nb[1] = nb[0]; nb[0] = null; }
      ns = { ...ns, bases: nb };
    } else {
      showAnim("out");
      ns = addLog(ns, "  " + runnerName + " caught stealing!", "out");
      const nb = [...ns.bases];
      if (to3) nb[1] = null; else nb[0] = null;
      ns = { ...ns, bases: nb };
      ns = applyOutToState(ns, runsNow);
    }
    await saveState(ns);
  }

  // ── CHANGE PITCHER ──────────────────────────────────────────────────────
  async function handleChangePitcher(idx) {
    const s = stateRef.current;
    if (!s) return;
    const key = s.isTop ? "homePitcherIdx" : "awayPitcherIdx";
    await saveState({ ...s, [key]: idx });
  }

  // ── JOIN AS HOME TEAM ───────────────────────────────────────────────────
  async function handleJoin(teamName, lineup, pitchers) {
    const s = stateRef.current;
    const ns = {
      ...s,
      homeName: teamName,
      homeLineup: lineup,
      homePitchers: pitchers,
      homePlayerName: playerName,
      status: "active",
    };
    await saveState(ns);
    setMyRole("home");
    localStorage.setItem('bcg_role_' + gameId, "home");
    setShowJoin(false);
  }

  // ── SHARE LINK ──────────────────────────────────────────────────────────
  function copyLink() {
    const url = window.location.origin + "/?game=" + gameId;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg("Copied!");
      setTimeout(() => setShareMsg(""), 2000);
    });
  }

  // ── RENDER ──────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#444", fontFamily: "'Courier New',monospace" }}>Loading game...</div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style={{ color: "#e87a4a", fontFamily: "'Courier New',monospace" }}>{error}</div>
      <button onClick={onBack} style={btnStyle()}>Back to Lobby</button>
    </div>
  );

  if (showJoin) {
    return <JoinTeamSetup onJoin={handleJoin} onBack={() => { setShowJoin(false); setMyRole("spectator"); }} />;
  }

  if (!state) return null;

  const s = state;
  const awayTotal = (s.awayScores || []).reduce((a, b) => a + b, 0) + (s.awayIR || 0);
  const homeTotal = (s.homeScores || []).reduce((a, b) => a + b, 0) + (s.homeIR || 0);
  const battingLineup = s.isTop ? s.awayLineup : s.homeLineup;
  const bIdx = s.isTop ? s.awayBatterIdx : s.homeBatterIdx;
  const currentBatter = battingLineup ? battingLineup[bIdx % battingLineup.length] : null;
  const pitcherList = s.isTop ? s.homePitchers : s.awayPitchers;
  const pIdx = s.isTop ? (s.homePitcherIdx || 0) : (s.awayPitcherIdx || 0);
  const currentPitcher = pitcherList && pitcherList[pIdx] ? pitcherList[pIdx].name : "Pitcher";
  const myTurn = isMyTurn(s);
  const waitingForOpponent = !s.gameOver && !myTurn && s.status !== "waiting_home";
  const battingTeam = s.isTop ? s.awayName : s.homeName;
  const fieldingTeam = s.isTop ? s.homeName : s.awayName;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", color: "#fff", fontFamily: "'Courier New',monospace" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "10px 12px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} style={{ background: "none", border: "1px solid #1e1e2e", color: "#444", padding: "4px 8px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "inherit" }}>←</button>
            <div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#e8c84a", letterSpacing: 4 }}>BCG</div>
              <div style={{ fontSize: 7, color: "#333", letterSpacing: 2 }}>
                {myRole === "spectator" ? "SPECTATING" : "PLAYING AS " + (myRole || "").toUpperCase()}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={copyLink} style={{ background: "#0d0d1f", border: "1px solid #2a2a4a", color: "#666", padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontSize: 10, fontFamily: "inherit" }}>
              {shareMsg || "Share Link"}
            </button>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 20, fontWeight: "bold" }}>
                <span style={{ color: "#e8c84a" }}>{awayTotal}</span>
                <span style={{ color: "#252535", margin: "0 6px" }}>--</span>
                <span style={{ color: "#e8c84a" }}>{homeTotal}</span>
              </div>
              <div style={{ fontSize: 8, color: "#444" }}>{s.awayName} / {s.homeName}</div>
            </div>
          </div>
        </div>

        {/* Waiting banner */}
        {s.status === "waiting_home" && (
          <div style={{ background: "#1a1a0a", border: "1px solid #e8c84a44", borderRadius: 6, padding: "10px 14px", marginBottom: 10, fontSize: 11, color: "#e8c84a", textAlign: "center" }}>
            Waiting for opponent to join... Share this link!
            <br />
            <span style={{ color: "#666", fontSize: 10, wordBreak: "break-all" }}>
              {window.location.origin + "/?game=" + gameId}
            </span>
          </div>
        )}

        {waitingForOpponent && (
          <div style={{ background: "#0a0a1a", border: "1px solid #3a6a9a44", borderRadius: 6, padding: "10px 14px", marginBottom: 10, fontSize: 11, color: "#3a6a9a", textAlign: "center" }}>
            Waiting for {s.isTop ? s.awayName : s.homeName} to bat...
          </div>
        )}

        <Scoreboard
          awayScores={s.awayScores || []} homeScores={s.homeScores || []}
          awayIR={s.awayIR || 0} homeIR={s.homeIR || 0}
          awayName={s.awayName} homeName={s.homeName}
          inning={s.inning || 1} isTop={s.isTop}
        />

        {/* Situation */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ background: "#111", border: "1px solid #1e1e2e", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#e8c84a", fontWeight: "bold" }}>
            {s.isTop ? "Top" : "Bot"} {s.inning || 1}
          </div>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 17, height: 17, borderRadius: "50%", background: i < (s.outs || 0) ? "#e87a4a" : "#141424", border: "2px solid #1e1e2e" }} />)}
            <span style={{ color: "#444", fontSize: 10, marginLeft: 2 }}>{s.outs || 0} out{(s.outs || 0) !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 10, color: "#3a3a5a" }}>
            pitching: <span style={{ color: "#666" }}>{currentPitcher}</span>
          </div>
        </div>

        {/* Diamond + batter */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <Diamond bases={s.bases || [null, null, null]} animEvent={myTurn ? animEvent : null} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ background: "#111", border: "1px solid #1e1e2e", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, color: "#3a3a5a", letterSpacing: 1, marginBottom: 4 }}>AT BAT -- {battingTeam}</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: "bold" }}>{currentBatter ? currentBatter.name : "---"}</div>
              <div style={{ color: "#3a3a5a", fontSize: 9, marginTop: 2 }}>
                {POSITIONS[bIdx % POSITIONS.length]} · #{(bIdx % (battingLineup ? battingLineup.length : 8)) + 1}
              </div>
              <div style={{ fontSize: 9, color: "#252540", marginTop: 4, lineHeight: 1.8 }}>
                HR/s: {currentBatter ? currentBatter.hrSeason : 0} · 3B/s: {currentBatter ? currentBatter.triSeason : 0} · SB: {currentBatter ? currentBatter.sbCareer : 0}
              </div>
            </div>
            <div style={{ background: "#111", border: "1px solid #1e1e2e", borderRadius: 6, padding: "10px 12px" }}>
              <div style={{ fontSize: 8, color: "#3a3a5a", letterSpacing: 1, marginBottom: 8 }}>LAST ROLL</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <Die value={dice[0]} rolling={rolling} size={52} />
                <Die value={dice[1]} rolling={rolling} size={52} />
                {dice[0] && <div style={{ fontSize: 18, color: "#252535", fontWeight: "bold" }}>{dice[0] + dice[1]}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Actions (only when it's your turn) */}
        {!s.gameOver && myTurn && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            <button onClick={handleRoll} disabled={rolling}
              style={{ ...btnStyle(null, rolling), fontSize: 16, padding: "14px", letterSpacing: 3, width: "100%" }}>
              {rolling ? "Rolling..." : "🎲  ROLL TO BAT"}
            </button>
            <div style={{ display: "flex", gap: 8 }}>
              {[false, true].map(to3 => {
                const runner = to3 ? (s.bases || [])[1] : (s.bases || [])[0];
                const dis = !runner || rolling;
                return (
                  <button key={String(to3)} onClick={() => handleSteal(to3)} disabled={dis}
                    style={{ flex: 1, fontSize: 11, padding: "8px", background: dis ? "#141420" : "#0d2030", color: dis ? "#333" : "#7ab0d8", border: "1px solid " + (dis ? "#1a1a2e" : "#1a2a40"), borderRadius: 6, cursor: dis ? "not-allowed" : "pointer", fontFamily: "'Courier New',monospace", opacity: dis ? 0.5 : 1 }}>
                    {"🏃 Steal " + (to3 ? "3rd" : "2nd") + (runner ? " (" + runner.split(" ").pop().slice(0, 7) + ")" : "")}
                  </button>
                );
              })}
            </div>
            {/* Bullpen - fielding team manager controls their own pitcher */}
            {myRole && pitcherList && (
              <div style={{ background: "#0a0a18", border: "1px solid #141424", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontSize: 8, color: "#2a2a4a", letterSpacing: 1, marginBottom: 6 }}>{fieldingTeam} BULLPEN</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {pitcherList.map((p, i) => (
                    <button key={i} onClick={() => handleChangePitcher(i)}
                      style={{ background: i === pIdx ? "#0a1a14" : "#0a0a15", color: i === pIdx ? "#4aaa7a" : "#2a2a4a", border: "1px solid " + (i === pIdx ? "#1a4a2a" : "#141424"), borderRadius: 4, padding: "4px 8px", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Game over */}
        {s.gameOver && (
          <div style={{ background: "#0a0a15", border: "2px solid #e8c84a", borderRadius: 10, padding: "20px", textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#e8c84a", letterSpacing: 4, marginBottom: 10 }}>FINAL SCORE</div>
            <div style={{ fontSize: 24, fontWeight: "bold", marginBottom: 6 }}>
              {s.awayName} <span style={{ color: "#e8c84a" }}>{awayTotal}</span>
              <span style={{ color: "#252535", margin: "0 10px" }}>--</span>
              <span style={{ color: "#e8c84a" }}>{homeTotal}</span> {s.homeName}
            </div>
            <div style={{ color: "#555", fontSize: 12, marginBottom: 16 }}>
              {awayTotal !== homeTotal ? (awayTotal > homeTotal ? s.awayName : s.homeName) + " wins!" : "Tie game"}
            </div>
            <button onClick={onBack} style={{ ...btnStyle(), padding: "10px 28px" }}>Back to Lobby</button>
          </div>
        )}

        <div style={{ fontSize: 8, color: "#252535", letterSpacing: 1, marginBottom: 4 }}>PLAY-BY-PLAY</div>
        <GameLog log={s.log} />

        <details style={{ marginTop: 10 }}>
          <summary style={{ color: "#1e1e2e", fontSize: 9, cursor: "pointer" }}>DICE TABLE ▾</summary>
          <div style={{ background: "#0a0a15", border: "1px solid #141424", borderRadius: 6, padding: "10px 12px", marginTop: 6, fontSize: 10, color: "#444", lineHeight: 2 }}>
            <div><span style={{ color: "#e8c84a" }}>Walk</span> -- 1+1 | <span style={{ color: "#e8c84a" }}>Single</span> -- sum 5 or 3+4 | <span style={{ color: "#e8c84a" }}>Double</span> -- sum 10</div>
            <div><span style={{ color: "#e8c84a" }}>HR</span> -- 5+6 or 6+6 (45+ HR/s) | <span style={{ color: "#e8c84a" }}>Triple</span> -- 6+6 (6+ 3B/s) | <span style={{ color: "#e8c84a" }}>K</span> -- 6+1/2/3</div>
          </div>
        </details>
      </div>
    </div>
  );
}

// ─── JOIN AS HOME TEAM ───────────────────────────────────────────────────
function JoinTeamSetup({ onJoin, onBack }) {
  const playerName = localStorage.getItem('bcg_player_name') || 'Player';
  const [teamName, setTeamName] = useState(playerName + "'s Team");
  const [lineup, setLineup] = useState(DEFAULT_HOME_LINEUP);
  const [pitchers, setPitchers] = useState(DEFAULT_HOME_PITCHERS);
  const [saving, setSaving] = useState(false);

  const PITCHERS_POOL = require('../lib/gameLogic').PITCHERS;
  const POSITIONS_LIST = require('../lib/gameLogic').POSITIONS;

  async function handleJoin() {
    setSaving(true);
    await onJoin(teamName, lineup, pitchers);
    setSaving(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", color: "#fff", fontFamily: "'Courier New',monospace" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #2a2a4a", color: "#666", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>← Back</button>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#e8c84a" }}>JOIN AS HOME TEAM</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 4 }}>YOUR TEAM NAME</div>
          <input value={teamName} onChange={e => setTeamName(e.target.value)} style={{ background: "#0d0d1f", border: "1px solid #2a2a4a", borderRadius: 4, color: "#fff", padding: "6px 8px", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box", fontFamily: "'Courier New',monospace" }} />
        </div>
        <div style={{ color: "#555", fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>BATTING ORDER</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {lineup.map((p, i) => (
            <PlayerSelect key={i} value={p ? p.name : ""} label={(i+1) + ". " + POSITIONS_LIST[i]} isPitcherSlot={false}
              onChange={h => { const n = [...lineup]; n[i] = toPlayer(h, POSITIONS_LIST[i]); setLineup(n); }} />
          ))}
        </div>
        <div style={{ color: "#555", fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>PITCHING STAFF</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
          {pitchers.map((p, i) => (
            <PlayerSelect key={i} value={p ? p.name : ""} label={p.pos + " " + (i+1)} isPitcherSlot={true}
              onChange={pt => { const n = [...pitchers]; n[i] = toPitcher(pt, p.pos); setPitchers(n); }} />
          ))}
        </div>
        <button onClick={handleJoin} disabled={saving}
          style={{ ...btnStyle(null, saving), width: "100%", padding: "14px", fontSize: 14, letterSpacing: 2 }}>
          {saving ? "Joining..." : "JOIN GAME"}
        </button>
      </div>
    </div>
  );
}
