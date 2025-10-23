// FootballLuckGameMiniShortV4.jsx
import React, { useState, useEffect, useRef } from "react";

const ROUND_SECONDS = 15;
const MAX_MATCHES = 38;
const TEAMS = [
  "Liverpool","Man City","Arsenal","Chelsea","Tottenham",
  "Man United","Newcastle","Aston Villa","Brighton","West Ham",
  "Fulham","Brentford","Crystal Palace","Wolves","Everton",
  "Forest","Leicester","Leeds","Bournemouth","Burnley"
];

const randomScore = () => Math.floor(Math.random() * 11);
const checkLuck = (luck) => Math.floor(Math.random() * 100) + 1 <= luck;
const forceLose = (team, opp) => ({
  [team]: Math.floor(Math.random() * 4),
  [opp]: Math.floor(Math.random() * 6) + 5,
});

export default function FootballLuckGameMiniShortV4() {
  const [teams, setTeams] = useState(
    TEAMS.map((n) => ({ name: n, pts: 0, p: 0, w: 0, d: 0, l: 0 }))
  );
  const [matches, setMatches] = useState([]);
  const [timer, setTimer] = useState(ROUND_SECONDS);
  const [isBetting, setIsBetting] = useState(true);
  const [round, setRound] = useState(0);
  const [finishedBets, setFinishedBets] = useState([]);
  const [user, setUser] = useState({
    name: "Player1",
    luck: 65,
    bal: 5000,
    bets: [], // 👈 เดิมพันได้หลายคู่
  });
  const [betAmount, setBetAmount] = useState(100);
  const [msg, setMsg] = useState("");
  const [results, setResults] = useState([]);
  const timerRef = useRef();

  /* สุ่มคู่แข่ง */
  const genMatches = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    setMatches([
      { teamA: shuffled[0].name, teamB: shuffled[1].name },
      { teamA: shuffled[2].name, teamB: shuffled[3].name },
    ]);
  };

  useEffect(() => {
    genMatches();
  }, []);

  /* จับเวลา */
  useEffect(() => {
    if (!isBetting) return;
    timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isBetting]);

useEffect(() => {
  if (!isBetting) return;
  if (timer <= 0) {
    endRound();
  }
}, [timer, isBetting]);

  const rate = () => Number((1.4 + Math.random() * 0.6).toFixed(2));

  const confirmBet = (matchIndex, team) => {
    if (!isBetting) return;
    if (betAmount <= 0) return alert("กรุณาใส่จำนวนเงิน");
    if (user.bal < betAmount) return alert("ยอดเงินไม่พอ");

    const alreadyBet = user.bets.find((b) => b.match === matchIndex);
    if (alreadyBet) return alert("คุณเดิมพันคู่นี้แล้ว");

    const payload = { match: matchIndex, team, amt: betAmount, rate: rate() };
    setUser({
      ...user,
      bal: user.bal - betAmount,
      bets: [...user.bets, payload],
    });
    setMsg(`เดิมพัน ${team} คู่ ${matchIndex + 1} จำนวน ${betAmount}฿`);
  };

  const endRound = () => {
    setIsBetting(false);
    clearInterval(timerRef.current);

    const matchResults = matches.map((m, i) => {
      const userBet = user.bets.find((b) => b.match === i);
      let sA, sB;
      if (userBet) {
        const pass = checkLuck(user.luck);
        if (pass) {
          sA = randomScore();
          sB = randomScore();
        } else {
          const forced = forceLose(userBet.team, userBet.team === m.teamA ? m.teamB : m.teamA);
          sA = forced[m.teamA];
          sB = forced[m.teamB];
          
          setUser((u) => ({ ...u, luck: Math.max(0, u.luck - 5) })); // ❗ Luck -5
        }
      } else {
        sA = randomScore();
        sB = randomScore();
      }
      const win = sA > sB ? m.teamA : sB > sA ? m.teamB : "draw";
      return { ...m, sA, sB, win };
    });

    // อัปเดตตาราง
    let tcopy = [...teams];
    matchResults.forEach((r) => {
      tcopy = tcopy.map((t) => {
        if (t.name === r.teamA || t.name === r.teamB) {
          let add = 0, w = t.w, d = t.d, l = t.l;
          if (r.win === "draw") { add = 1; d++; }
          else if (r.win === t.name) { add = 3; w++; }
          else { l++; }
          return { ...t, pts: t.pts + add, p: t.p + 1, w, d, l };
        }
        return t;
      });
    });

    // ผลการเดิมพันแต่ละคู่
    let gain = 0;
    user.bets.forEach((bet) => {
      const r = matchResults[bet.match];
      if (r.win === bet.team) {
        gain += Math.round(bet.amt * bet.rate);
      } else if (r.win === "draw") {
        gain += Math.round(bet.amt * 0.5);
      } else {
        // ❗ ถ้าแพ้ ลบแต้ม -3
        tcopy = tcopy.map((t) =>
          t.name === bet.team ? { ...t, pts: Math.max(0, t.pts - 3) } : t
        );
      }
    });

    setTeams(tcopy.sort((a, b) => b.pts - a.pts));
    setFinishedBets(user.bets);
    setUser((u) => ({ ...u, bal: u.bal + gain, bets: [] }));
    setResults(matchResults);
    setRound((r) => r + 1);
    setMsg(`รอบจบแล้ว! ได้คืนรวม ${gain}฿`);

    const done = tcopy.every((t) => t.p >= MAX_MATCHES);
    if (done) return setMsg(`🏁 ฤดูกาลจบ! แชมป์: ${tcopy[0].name}`);

setTimeout(() => {
  setResults([]);          // 🧹 ล้างผลการแข่งขันรอบก่อน
  setFinishedBets([]);     // 🧹 ล้างเดิมพันรอบก่อน
  genMatches();            // 🔄 สุ่มคู่ใหม่
  setTimer(ROUND_SECONDS); // ⏱ รีเซ็ตเวลา
  setIsBetting(true);      // ✅ เปิดให้เดิมพันใหม่
}, 2000);
  };

  /* Helper สำหรับสีการ์ด */
const getCardStyle = (matchIndex, result, teamA, teamB) => {
  const bet =
    user.bets.find((b) => b.match === matchIndex) ||
    finishedBets.find((b) => b.match === matchIndex);
  const res = results.find((r) => r && r.teamA === teamA && r.teamB === teamB);
  const isUserBet = Boolean(bet);

  // 🟧 สีพื้นหลังตามผลการแข่งขัน (ทุกคู่)
  let bg = "#111";
  if (res) {
    if (res.win === "draw") {
      bg = "#F8F9FA"; // เสมอ
    } else if (res.win === teamA || res.win === teamB) {
      bg = res.win === teamA || res.win === teamB ? "#00b050" : "#d32f2f"; // ✅ ป้องกันเงื่อนไขผิด
    }
    if (res.sA > res.sB) bg = "#00b050"; // teamA ชนะ
    else if (res.sA < res.sB) bg = "#d32f2f"; // teamB ชนะ
  }

  // 🟨 เส้นซ้ายเฉพาะคู่ที่ผู้เล่นวางเดิมพัน
  const borderLeft = isUserBet ? "4px solid yellow" : "4px solid transparent";

  // 🧩 คืนค่ารูปแบบ
  return {
    background: bg,
    color: res && res.win === "draw" ? "#000" : "#fff", // ให้เสมออ่านง่าย
    borderLeft,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    transition: "all 0.3s ease",
  };
};



  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: 20, fontFamily: "sans-serif" }}>
      <h2>⚽ Football Luck — Short v4</h2>
      <div>⏱ {timer}s | รอบ {round}</div>
      <div>👤 {user.name} • 💰 {user.bal}฿ • 🍀 Luck {user.luck}</div>
      <hr />

      {matches.map((m, i) => {
        const res = results[i];
        return (
          <div key={i} style={getCardStyle(i, res, m.teamA, m.teamB)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>คู่ {i + 1}:</b> {m.teamA} vs {m.teamB}
              </div>
              {res && (
                <div style={{ fontSize: 13 }}>
                  {res.teamA} {res.sA} : {res.sB} {res.teamB} →{" "}
                  {res.win === "draw" ? "เสมอ" : `ชนะ: ${res.win}`}
                </div>
              )}
            </div>
            <div style={{ marginTop: 6 }}>
              <input
                type="number"
                value={betAmount}
                disabled={!isBetting}
                onChange={(e) => setBetAmount(Number(e.target.value || 0))}
                style={{ width: 80, marginRight: 8 }}
              />
              <button disabled={!isBetting} onClick={() => confirmBet(i, m.teamA)}>
                เดิมพัน {m.teamA}
              </button>
              <button disabled={!isBetting} onClick={() => confirmBet(i, m.teamB)}>
                เดิมพัน {m.teamB}
              </button>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 10, fontSize: 14 }}>{msg}</div>

      <h3 style={{ marginTop: 16 }}>🏆 ตารางคะแนน</h3>
      <table style={{ width: "100%", fontSize: 13, color: "#ddd", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "#ee9d12" }}>
            <th>#</th><th>ทีม</th><th>แข่ง</th><th>ชนะ</th><th>เสมอ</th><th>แพ้</th><th>แต้ม</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((t, i) => (
            <tr key={t.name} style={{ textAlign: "center" }}>
              <td>{i + 1}</td>
              <td style={{ textAlign: "left" }}>{t.name}</td>
              <td>{t.p}</td>
              <td style={{ color: "#65ff8a" }}>{t.w}</td>
              <td style={{ color: "#ffe16a" }}>{t.d}</td>
              <td style={{ color: "#ff7a7a" }}>{t.l}</td>
              <td style={{ fontWeight: 700 }}>{t.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
