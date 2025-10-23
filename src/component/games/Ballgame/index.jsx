// FootballLuckGameMini.jsx
import React, { useEffect, useReducer, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

/* ========== Config ========== */
const ROUND_SECONDS = 15;
const MAX_MATCHES_PER_TEAM = 38;
const TEAM_NAMES = [
  "Liverpool","Man City","Arsenal","Chelsea","Tottenham",
  "Man United","Newcastle","Aston Villa","Brighton","West Ham",
  "Fulham","Brentford","Crystal Palace","Wolves","Everton",
  "Forest","Leicester","Leeds","Bournemouth","Burnley"
];

/* ========== Helpers (game logic) ========== */
export const randomScore = () => Math.floor(Math.random() * 11);
export const checkLuck = (userLuck) => {
  const roll = Math.floor(Math.random() * 100) + 1;
  // debug: console.log(`[Luck] roll=${roll} luck=${userLuck}`);
  return roll <= userLuck;
};
export const forceLose = (chosenTeam, opponentTeam) => ({
  [chosenTeam]: Math.floor(Math.random() * 5),           // 0-4
  [opponentTeam]: Math.floor(Math.random() * 6) + 5,     // 5-10
});

/** simulateMatch: three main cases:
 * - no bet => random normally
 * - bet exists but for other match => ignore bet (simulate random)
 * - bet exists for this match and chosenTeam is in match:
 *     - if checkLuck true => random normally
 *     - else => forceLose on chosenTeam (opponent gets 5-10; chosen 0-4)
 */
export const simulateMatch = (teamA, teamB, userBet = null) => {
  let scoreA, scoreB;
  if (userBet && userBet.matchIndex != null && userBet.chosenTeam) {
    // caller must pass bet only for the relevant match or null
    const { chosenTeam, userLuck } = userBet;
    if (![teamA, teamB].includes(chosenTeam)) {
      // chosen team not in this match => normal random
      scoreA = randomScore(); scoreB = randomScore();
    } else {
      const luckSuccess = checkLuck(userLuck);
      if (luckSuccess) {
        scoreA = randomScore(); scoreB = randomScore();
      } else {
        const opponent = chosenTeam === teamA ? teamB : teamA;
        const r = forceLose(chosenTeam, opponent);
        scoreA = Number(r[teamA] ?? 0);
        scoreB = Number(r[teamB] ?? 0);
      }
    }
  } else {
    scoreA = randomScore(); scoreB = randomScore();
  }
  const winner = scoreA > scoreB ? teamA : scoreB > scoreA ? teamB : "draw";
  return { teamA, teamB, scoreA, scoreB, winner };
};

/* ========== Ranking update ========== */
const updateRankingPlayed = (teams, matchResult) => {
  const { teamA, teamB, winner } = matchResult;
  return teams.map(t => {
    if (t.name === teamA || t.name === teamB) {
      let wins = t.wins || 0, draws = t.draws || 0, losses = t.losses || 0;
      let addPoints = 0;
      if (winner === "draw") { draws += 1; addPoints = 1; }
      else if (t.name === winner) { wins += 1; addPoints = 3; }
      else { losses += 1; addPoints = 0; }
      return { ...t, points: (t.points || 0) + addPoints, played: (t.played || 0) + 1, wins, draws, losses };
    }
    return t;
  }).sort((a,b) => b.points - a.points);
};

/* ========== initial state & reducer ========== */
const initialState = {
  teams: TEAM_NAMES.map(n => ({ name: n, points: 0, played: 0, wins: 0, draws: 0, losses: 0 })),
  user: { name: "player1", luck: 65, balance: 5000, currentBet: null },
  matches: [],
  lastResults: [],   // 🆕 เก็บผลล่าสุดแต่ละคู่
  timer: ROUND_SECONDS,
  isBetting: true,
  seasonEnded: false,
  round: 0,
  notification: null,
};


function reducer(state, action) {
  switch (action.type) {
    case "SET_MATCHES": return { ...state, matches: action.payload };
    case "TICK": return { ...state, timer: action.payload };
    case "SET_IS_BETTING": return { ...state, isBetting: action.payload };
    case "PLACE_BET":
      return {
        ...state,
        user: { ...state.user, balance: state.user.balance - action.payload.amount, currentBet: action.payload }
      };
    case "CLEAR_BET":
      return { ...state, user: { ...state.user, currentBet: null } };
case "APPLY_RESULTS": {
  const { updatedTeams, payouts, notifications, results } = action.payload;
  let newBalance = state.user.balance;
  if (payouts && payouts.add) newBalance += payouts.add;
  return {
    ...state,
    teams: updatedTeams,
    user: { ...state.user, balance: newBalance, currentBet: null },
    notification: notifications && notifications.length ? notifications.join("\n") : null,
    round: state.round + 1,
    lastResults: results, // 🆕 เก็บผลล่าสุดทั้งหมดไว้
  };
}
    case "END_SEASON": return { ...state, seasonEnded: true, isBetting: false, timer: 0 };
    case "RESET_SEASON":
      return { ...initialState, teams: TEAM_NAMES.map(n => ({ name: n, points:0, played:0, wins:0, draws:0, losses:0 })) };
    case "SET_NOTIFICATION": return { ...state, notification: action.payload };
    case "UPDATE_USER": return { ...state, user: { ...state.user, ...action.payload } };
    default: return state;
  }
}

/* ========== Styled components ========== */
const fadeIn = keyframes`from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}`;
const Container = styled.div`
  min-height:100vh; padding:20px; background: #1c1c1c; color:#fff; font-family: Inter,Arial,sans-serif;
`;
const Header = styled.header`display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;`;
const Title = styled.h1`color:#ee9d12;margin:0;font-size:20px;`;
const Grid = styled.main`display:grid;grid-template-columns:300px 1fr 260px;gap:18px;animation:${fadeIn} .35s ease;`;
const Card = styled.div`background:#151515;padding:12px;border-radius:10px;border:1px solid rgba(255,157,18,0.08);`;
const TeamBtn = styled.button`
  background:${p => p.active ? "#ee9d12" : "#222"}; color:${p => p.active ? "#111" : "#fff"};
  border:none;padding:8px 10px;border-radius:8px;font-weight:700;cursor:pointer;margin-right:8px;
`;
const ActionBtn = styled.button`
  background:linear-gradient(180deg,#ee9d12,#d68b06);color:#111;border:none;padding:8px 12px;border-radius:8px;font-weight:700;cursor:pointer;
`;
const Small = styled.div`font-size:12px;color:rgba(255,255,255,0.7);`;

/* ========== Component ========== */
export default function FootballLuckGameMini() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { teams, user, matches, timer, isBetting, seasonEnded, round, notification } = state;
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [betAmount, setBetAmount] = useState(100);
  const timerRef = useRef(null);

  // initial matches on mount
  useEffect(() => {
    dispatch({ type: "SET_MATCHES", payload: generateRandomMatches(state.teams) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // timer logic
  useEffect(() => {
    if (!isBetting || seasonEnded) return;
    timerRef.current = setInterval(() => {
      dispatch({ type: "TICK", payload: (state.timer - 1) });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isBetting, state.timer, seasonEnded]);

  useEffect(() => {
    if (timer <= 0 && isBetting && !seasonEnded) {
      dispatch({ type: "SET_IS_BETTING", payload: false });
      handleEndRound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  function generateRandomMatches(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return [
      { teamA: copy[0].name, teamB: copy[1].name },
      { teamA: copy[2].name, teamB: copy[3].name },
    ];
  }

  function computeRateForMatch(teamName, opponentName, teamsList) {
    const idx = teamsList.findIndex(t => t.name === teamName);
    const oppIdx = teamsList.findIndex(t => t.name === opponentName);
    const base = (i) => (i < 4 ? 1.4 : i < 10 ? 1.8 : 2.4);
    const team = teamsList.find(t => t.name === teamName) || { wins:0, played:0 };
    const opp = teamsList.find(t => t.name === opponentName) || { wins:0, played:0 };
    const teamWinRate = team.played ? (team.wins / team.played) : 0.5;
    const oppWinRate = opp.played ? (opp.wins / opp.played) : 0.5;
    let rate = base(idx === -1 ? 8 : idx);
    rate *= (1 + Math.max(0, (oppWinRate - teamWinRate)));
    if (idx > oppIdx) rate *= 1 + ((idx - oppIdx) / Math.max(1, teamsList.length));
    if (rate < 1.2) rate = 1.2;
    return Number(rate.toFixed(2));
  }

  const handleSelectTeam = (matchIndex, teamName) => {
    if (!isBetting) return;
    setSelectedMatch(matchIndex);
    setSelectedTeam(teamName);
  };

  const confirmBet = () => {
    if (selectedMatch == null) return alert("เลือกคู่และทีมก่อน");
    if (!selectedTeam) return alert("เลือกทีมก่อน");
    if (!betAmount || betAmount <= 0) return alert("จำนวนต้องมากกว่า 0");
    if (betAmount > user.balance) return alert("ยอดเงินไม่พอ");
    const match = matches[selectedMatch];
    const opponent = match.teamA === selectedTeam ? match.teamB : match.teamA;
    const rate = computeRateForMatch(selectedTeam, opponent, teams);
    const payload = { matchIndex: selectedMatch, chosenTeam: selectedTeam, amount: betAmount, rate, userLuck: user.luck };
    dispatch({ type: "PLACE_BET", payload });
    alert(`เดิมพัน ${selectedTeam} คู่ ${selectedMatch+1} จำนวน ${betAmount}฿ (rate ${rate})`);
  };

  // end round: simulate both matches, update ranking, calculate payouts
  const handleEndRound = async () => {
    const userBet = state.user.currentBet;
    const results = matches.map((m, idx) => {
      const betForThis = (userBet && userBet.matchIndex === idx) ? userBet : null;
      return simulateMatch(m.teamA, m.teamB, betForThis);
    });

    // update teams
    let updatedTeams = [...teams];
    results.forEach(r => { updatedTeams = updateRankingPlayed(updatedTeams, r); });

    // payout logic
    let payoutAdd = 0;
    const notifications = [];
    if (userBet) {
      const target = results[userBet.matchIndex];
      const chosen = userBet.chosenTeam;
      const rate = userBet.rate;
      if (!target) notifications.push("ผลการแข่งขันไม่พบ");
      else {
        if (target.winner === chosen) {
          const add = Math.round(userBet.amount * rate);
          payoutAdd += add;
          notifications.push(`🎉 ชนะ! ได้ ${add}฿ (รวม stake)`);
        } else if (target.winner === "draw") {
          const add = Math.round(userBet.amount * 0.5);
          payoutAdd += add;
          notifications.push(`🔷 เสมอ: คืน ${add}฿`);
        } else {
          notifications.push(`💀 แพ้: เสีย ${userBet.amount}฿`);
        }
      }
    }

    dispatch({ type: "APPLY_RESULTS", payload: { updatedTeams, payouts: { add: payoutAdd }, notifications } });

    // reset selection
    setSelectedMatch(null); setSelectedTeam(""); setBetAmount(100);

    // season end check
    const allPlayed = updatedTeams.every(t => (t.played || 0) >= MAX_MATCHES_PER_TEAM);
    if (allPlayed) { dispatch({ type: "END_SEASON" }); return; }

    // next round
    setTimeout(() => {
      dispatch({ type: "SET_MATCHES", payload: generateRandomMatches(updatedTeams) });
      dispatch({ type: "TICK", payload: ROUND_SECONDS });
      dispatch({ type: "SET_IS_BETTING", payload: true });
    }, 900);
  };

  const handleRestart = () => {
    dispatch({ type: "RESET_SEASON" });
    dispatch({ type: "SET_MATCHES", payload: generateRandomMatches(TEAM_NAMES.map(n => ({ name:n, points:0, played:0, wins:0, draws:0, losses:0 }))) });
  };

  const champion = [...teams].sort((a,b) => b.points - a.points)[0] || null;

  return (
    <Container>
      <Header>
        <div>
          <Title>Football Luck — Mini</Title>
          <Small>Round: {round} • Matches per team: {MAX_MATCHES_PER_TEAM}</Small>
        </div>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ background:"#111", padding:"8px 12px", borderRadius:8 }}>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>ผู้เล่น</div>
            <div style={{ fontWeight:800 }}>{user.name} • 💰 {user.balance} ฿</div>
          </div>
        </div>
      </Header>

      <Grid>
        {/* Left: Ranking */}
        <div>
<Card>
  <h3 style={{ marginTop: 0, color: "#ee9d12", textAlign: "center" }}>🏆 ตารางคะแนน</h3>
  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
    <thead>
      <tr style={{ color: "#ee9d12", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <th style={{ textAlign: "left" }}>#</th>
        <th style={{ textAlign: "left" }}>ทีม</th>
        <th>แข่ง</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>แต้ม</th>
      </tr>
    </thead>
    <tbody>
      {teams.map((t, i) => (
        <tr key={t.name} style={{ borderBottom: "1px dashed rgba(255,255,255,0.05)" }}>
          <td style={{ padding: "4px 0" }}>{i + 1}</td>
          <td>{t.name}</td>
          <td style={{ textAlign: "center" }}>{t.played}</td>
          <td style={{ textAlign: "center", color: "#65ff8a" }}>{t.wins}</td>
          <td style={{ textAlign: "center", color: "#ffe16a" }}>{t.draws}</td>
          <td style={{ textAlign: "center", color: "#ff7a7a" }}>{t.losses}</td>
          <td style={{ textAlign: "center", fontWeight: 700 }}>{t.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
</Card>

        </div>

        {/* Center: Matches & Betting */}
        <div>
          <Card>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <Small>เวลาเดิมพัน</Small>
                <div style={{ fontSize:28, fontWeight:800, color:"#ee9d12" }}>{timer}s</div>
                <Small>{isBetting ? "รับเดิมพัน" : "ประกาศผล"}</Small>
              </div>
              <div style={{ textAlign:"right" }}>
                <Small>คู่แข่งขัน (2 คู่)</Small>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>เลือกคู่ → เลือกทีม → ยืนยัน</div>
              </div>
            </div>

            <div style={{ marginTop:12, display:"flex", flexDirection:"column", gap:12 }}>
{matches.map((m, idx) => {
  const rA = computeRateForMatch(m.teamA, m.teamB, teams);
  const rB = computeRateForMatch(m.teamB, m.teamA, teams);
  const res = state.lastResults?.find(r => r.teamA === m.teamA && r.teamB === m.teamB);
  const scoreLine = res ? `${res.scoreA} : ${res.scoreB}` : null;

  return (
    <div key={idx}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 8
      }}>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <TeamBtn
            active={selectedMatch === idx && selectedTeam === m.teamA}
            onClick={() => handleSelectTeam(idx, m.teamA)}
          >
            {m.teamA}
          </TeamBtn>
          <div style={{ fontWeight: 800, color: "#ffd76b" }}>vs</div>
          <TeamBtn
            active={selectedMatch === idx && selectedTeam === m.teamB}
            onClick={() => handleSelectTeam(idx, m.teamB)}
          >
            {m.teamB}
          </TeamBtn>
        </div>

        {/* 🆕 แสดงผลคะแนนล่าสุดใต้ชื่อทีม */}
        {scoreLine && (
          <div style={{
            fontSize: 20, fontWeight: 800,
            color: "#ee9d12", marginTop: 6,
          }}>
            {m.teamA} {res.scoreA} – {res.scoreB} {m.teamB}
          </div>
        )}

        <Small>Rate: {m.teamA} {rA} | {m.teamB} {rB}</Small>
      </div>

      <div style={{ textAlign: "right" }}>
        <Small>Match #{idx + 1}</Small>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
          {teams.find(t => t.name === m.teamA)?.played || 0} / {teams.find(t => t.name === m.teamB)?.played || 0} นัด
        </div>
      </div>
    </div>
  );
})}

            </div>

            <div style={{ marginTop:12, display:"flex", gap:8, alignItems:"center" }}>
              <input type="number" value={betAmount} onChange={e=>setBetAmount(Number(e.target.value||0))} style={{ width:120, padding:8, borderRadius:8, border:"none" }} />
              <ActionBtn onClick={confirmBet}>ยืนยันเดิมพัน</ActionBtn>
              <div style={{ marginLeft:"auto" }}>
                <Small>เลือก: <strong>{selectedMatch!=null ? `คู่ ${selectedMatch+1}` : "-"}</strong> / ทีม: <strong>{selectedTeam || "-"}</strong></Small>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop:12 }}>
            <div style={{ fontWeight:700 }}>คำอธิบาย</div>
            <Small style={{ marginTop:6 }}>
              - แต่ละรอบสุ่ม 2 คู่ (timer {ROUND_SECONDS}s).<br/>
              - วางเดิมพันแล้วหักเงินทันที; payout คำนวณตอนประกาศผล.<br/>
              - ถ้าเดิมพันทีมที่ถูกจับ (match) → ตรวจ Luck: ถ้าดีสุ่มปกติ, ถ้าไม่ให้ทีมที่เลือกแพ้ (forceLose).<br/>
              - ผลชนะได้ 3 แต้ม, เสมอ 1 แต้ม, แพ้ 0 แต้ม.
            </Small>
          </Card>
        </div>

        {/* Right: Player / Info */}
        <div>
          <Card>
            <div style={{ fontWeight:700 }}>ผู้เล่น (Mock)</div>
            <div style={{ marginTop:8 }}>
              <div><Small>ID</Small><div style={{ fontWeight:800 }}>{user.name}</div></div>
              <div style={{ marginTop:8 }}><Small>Balance</Small><div style={{ fontWeight:800 }}>{user.balance} ฿</div></div>
              <div style={{ marginTop:8 }}><Small>Luck</Small><div style={{ fontWeight:800 }}>{user.luck}</div></div>
              <div style={{ marginTop:12, display:"flex", gap:8 }}>
                <ActionBtn onClick={() => dispatch({ type: "UPDATE_USER", payload: { balance: user.balance + 1000 } })}>เติม +1000</ActionBtn>
                <ActionBtn onClick={() => dispatch({ type: "UPDATE_USER", payload: { luck: Math.min(100, user.luck + 5) } })}>เพิ่ม Luck +5</ActionBtn>
              </div>
            </div>
          </Card>

          <Card style={{ marginTop:12 }}>
            <div style={{ fontWeight:700 }}>สถานะ</div>
            <div style={{ marginTop:8 }}>
              <Small>รอบที่ผ่าน: {round}</Small>
              <div style={{ marginTop:8, whiteSpace:"pre-wrap", color:"rgba(255,255,255,0.9)" }}>
                {notification || "ยังไม่มีผลล่าสุด"}
              </div>
            </div>
          </Card>

          <Card style={{ marginTop:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <Small>ลีก: {teams.length} ทีม</Small>
              <ActionBtn onClick={handleRestart}>เริ่มใหม่</ActionBtn>
            </div>
          </Card>
        </div>
      </Grid>

      {/* champion overlay */}
      {seasonEnded && champion && (
        <div style={{
          position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(0,0,0,0.7)", zIndex:2000
        }}>
          <div style={{ background:"#111", padding:22, borderRadius:12, textAlign:"center", width:420 }}>
            <div style={{ color:"#ee9d12", fontWeight:800, fontSize:20 }}>🏁 ฤดูกาลจบ</div>
            <div style={{ marginTop:10, fontSize:18 }}>{champion.name}</div>
            <div style={{ marginTop:6 }}>{champion.points} คะแนน | {champion.played} นัด</div>
            <div style={{ marginTop:12 }}>
              <ActionBtn onClick={handleRestart}>เริ่มฤดูกาลใหม่</ActionBtn>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", marginTop:18, color:"rgba(255,255,255,0.5)" }}>
        developer by bookbxk — demo only
      </div>
    </Container>
  );
}

/* ========== PropTypes (minimal, to satisfy course criteria) ========== */
FootballLuckGameMini.propTypes = {
  // no external props currently; component is self-contained
};
