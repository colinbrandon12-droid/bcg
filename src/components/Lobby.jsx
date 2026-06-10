import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { btnStyle, inputStyle } from './GameUI';

export default function Lobby({ onJoinGame }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('bcg_player_name') || '');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGames();
    // Save player name
    if (playerName) localStorage.setItem('bcg_player_name', playerName);
  }, [playerName]);

  async function fetchGames() {
    setLoading(true);
    const { data } = await supabase
      .from('games')
      .select('id, created_at, state')
      .order('created_at', { ascending: false })
      .limit(20);
    setGames(data || []);
    setLoading(false);
  }

  function handleJoin(gameId) {
    if (!playerName.trim()) { alert('Enter your name first!'); return; }
    localStorage.setItem('bcg_player_name', playerName.trim());
    onJoinGame(gameId);
  }

  function handleNew() {
    if (!playerName.trim()) { alert('Enter your name first!'); return; }
    localStorage.setItem('bcg_player_name', playerName.trim());
    setCreating(true);
  }

  if (creating) {
    return <TeamSetup playerName={playerName} onCancel={() => setCreating(false)} onJoinGame={onJoinGame} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", color: "#fff", fontFamily: "'Courier New',monospace" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 38, fontWeight: "bold", color: "#e8c84a", letterSpacing: 6 }}>BCG</div>
          <div style={{ fontSize: 9, color: "#444", letterSpacing: 3, marginTop: 2 }}>BASEBALL CARD GAME</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 6 }}>YOUR NAME</div>
          <input
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            placeholder="Enter your name..."
            style={inputStyle}
          />
        </div>

        <button onClick={handleNew} style={{ ...btnStyle(null, false), width: "100%", padding: "14px", fontSize: 15, letterSpacing: 3, marginBottom: 24 }}>
          + START NEW GAME
        </button>

        <div style={{ fontSize: 9, color: "#444", letterSpacing: 1, marginBottom: 10 }}>OPEN GAMES — tap to join</div>

        {loading && <div style={{ color: "#333", textAlign: "center", padding: 20 }}>Loading...</div>}

        {!loading && games.length === 0 && (
          <div style={{ color: "#333", textAlign: "center", padding: 20, border: "1px solid #1a1a2a", borderRadius: 8 }}>
            No games yet. Start one!
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {games.map(g => {
            const s = g.state || {};
            const awayName = s.awayName || "Away";
            const homeName = s.homeName || "Home";
            const inning = s.inning || 1;
            const isTop = s.isTop !== false;
            const awayTotal = (s.awayScores || []).reduce((a, b) => a + b, 0) + (s.awayIR || 0);
            const homeTotal = (s.homeScores || []).reduce((a, b) => a + b, 0) + (s.homeIR || 0);
            const status = s.gameOver ? "Final" : (s.status === "waiting_home" ? "Needs opponent" : (isTop ? "Top " : "Bot ") + inning);
            const date = new Date(g.created_at);
            const timeStr = date.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

            return (
              <div key={g.id} onClick={() => handleJoin(g.id)} style={{
                background: "#111", border: "1px solid #1e1e2e", borderRadius: 8,
                padding: "12px 14px", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: "#fff", marginBottom: 3 }}>
                    {awayName} <span style={{ color: "#e8c84a" }}>{awayTotal}</span>
                    <span style={{ color: "#333", margin: "0 6px" }}>--</span>
                    <span style={{ color: "#e8c84a" }}>{homeTotal}</span> {homeName}
                  </div>
                  <div style={{ fontSize: 10, color: "#444" }}>{status} · {timeStr}</div>
                </div>
                <div style={{ fontSize: 10, color: s.status === "waiting_home" ? "#e8c84a" : "#3a6a9a", textAlign: "right" }}>
                  {s.status === "waiting_home" ? "JOIN ▶" : s.gameOver ? "VIEW" : "PLAY ▶"}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={fetchGames} style={{ ...btnStyle("#111"), width: "100%", marginTop: 16, border: "1px solid #1e1e2e", color: "#444", fontSize: 11 }}>
          Refresh
        </button>
      </div>
    </div>
  );
}

// ─── TEAM SETUP (before creating a game) ─────────────────────────────────
import {
  POSITIONS, HITTERS, PITCHERS,
  DEFAULT_AWAY_LINEUP, DEFAULT_AWAY_PITCHERS,
  toPlayer, toPitcher,
} from '../lib/gameLogic';
import { PlayerSelect } from './GameUI';
import { makeInitialState } from '../lib/gameLogic';

function TeamSetup({ playerName, onCancel, onJoinGame }) {
  const [teamName, setTeamName] = useState(playerName + "'s Team");
  const [lineup, setLineup] = useState(DEFAULT_AWAY_LINEUP);
  const [pitchers, setPitchers] = useState(DEFAULT_AWAY_PITCHERS);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!teamName.trim()) return;
    setSaving(true);
    const state = makeInitialState(
      teamName, lineup, pitchers,
      "Opponent", [], []
    );
    state.status = "waiting_home";
    state.awayPlayerName = playerName;

    const { data, error } = await supabase
      .from('games')
      .insert({ state })
      .select('id')
      .single();

    if (error) { alert("Error creating game: " + error.message); setSaving(false); return; }
    onJoinGame(data.id);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1f", color: "#fff", fontFamily: "'Courier New',monospace" }}>
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <button onClick={onCancel} style={{ background: "none", border: "1px solid #2a2a4a", color: "#666", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>← Back</button>
          <div style={{ fontSize: 18, fontWeight: "bold", color: "#e8c84a", letterSpacing: 2 }}>BUILD YOUR TEAM</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 1, marginBottom: 4 }}>YOUR TEAM NAME</div>
          <input value={teamName} onChange={e => setTeamName(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ color: "#555", fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>BATTING ORDER</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {lineup.map((p, i) => (
            <PlayerSelect key={i} value={p ? p.name : ""} label={(i + 1) + ". " + POSITIONS[i]} isPitcherSlot={false}
              onChange={h => { const n = [...lineup]; n[i] = toPlayer(h, POSITIONS[i]); setLineup(n); }} />
          ))}
        </div>

        <div style={{ color: "#555", fontSize: 9, letterSpacing: 1, marginBottom: 8 }}>PITCHING STAFF</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
          {pitchers.map((p, i) => (
            <PlayerSelect key={i} value={p ? p.name : ""} label={p.pos + " " + (i + 1)} isPitcherSlot={true}
              onChange={pt => { const n = [...pitchers]; n[i] = toPitcher(pt, p.pos); setPitchers(n); }} />
          ))}
        </div>

        <button onClick={handleCreate} disabled={saving}
          style={{ ...btnStyle(null, saving), width: "100%", padding: "14px", fontSize: 14, letterSpacing: 2 }}>
          {saving ? "Creating..." : "CREATE GAME + GET LINK"}
        </button>
      </div>
    </div>
  );
}
