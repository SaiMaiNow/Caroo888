import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const TIME = 15;
const TEAMS = [
  { name: "Liverpool", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Man City", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Arsenal", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Chelsea", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Tottenham", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Man United", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Newcastle", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Aston Villa", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Brighton", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "West Ham", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Fulham", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Brentford", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Crystal Palace", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Wolves", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Everton", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Forest", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Leicester", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Leeds", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Bournemouth", pts: 0, p: 0, w: 0, d: 0, l: 0 },
  { name: "Burnley", pts: 0, p: 0, w: 0, d: 0, l: 0 },
];

const MockUSER = { name: "Player1", luck: 55, bal: 5000, bets: [] };

function FootballLuckGameMiniStyled({ className }) {
  const [teams, setTeams] = useState(TEAMS);
  const [matches, setMatches] = useState([]);
  const [resultsLog, setResultsLog] = useState([]);
  const [betsLog, setBetsLog] = useState([]);
  const [timer, setTimer] = useState(TIME);
  const [isBetting, setIsBetting] = useState(true);
  const [user, setUser] = useState(MockUSER);
  const [betAmount, setBetAmount] = useState(100);
  const timerRef = useRef();

  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tempTeam, setTempTeam] = useState("");
  const [tempAmount, setTempAmount] = useState("");
  const [results, setResults] = useState([]);

  const randomScore = () => Math.floor(Math.random() * 11);
  const checkLuck = (luck) => Math.floor(Math.random() * 100) + 1 <= luck;
  const forceLose = (team, opp) => ({
    [team]: Math.floor(Math.random() * 4),
    [opp]: Math.floor(Math.random() * 6) + 5,
  });

  const rate = () => Number((1.4 + Math.random() * 0.6).toFixed(2));
  const genMatches = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const newMatches = [
      {
        teamA: shuffled[0].name,
        teamB: shuffled[1].name,
        rates: [rate(), 1, rate()],
      },
      {
        teamA: shuffled[2].name,
        teamB: shuffled[3].name,
        rates: [rate(), 1, rate()],
      },
    ];
    setMatches(newMatches);
  };

  useEffect(() => genMatches(), []);
  useEffect(() => {
    if (!isBetting) return;
    timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isBetting]);
  useEffect(() => {
    if (timer <= 0) endRound();
  }, [timer]);

  const confirmBet = (matchIndex, team) => {
    if (!isBetting) return;
    const amt = Number(tempAmount || betAmount);
    if (amt <= 0 || user.bal < amt) return alert("ยอดเงินไม่พอ");
    if (user.bets.find((b) => b.match === matchIndex))
      return alert("คุณเดิมพันคู่นี้แล้ว");

    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}`;
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )}`;
    const m = matches[matchIndex];
    const teamRate =
      team === m.teamA ? m.rates[0] : team === m.teamB ? m.rates[2] : 1;

    const payload = {
      match: matchIndex,
      team,
      amt,
      rate: teamRate,
      date: dateStr,
      time: timeStr,
    };
    setUser({ ...user, bal: user.bal - amt, bets: [...user.bets, payload] });

    setBetsLog((prev) => [
      ...prev,
      {
        ...payload,
        teamA: m.teamA,
        teamB: m.teamB,
        sA: null,
        sB: null,
        won: null,
        betType: "รอผล",
      },
    ]);
  };

  const endRound = () => {
    setIsBetting(false);
    clearInterval(timerRef.current);
    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}`;
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )}`;

    const matchResults = matches.map((m, i) => {
      const bet = user.bets.find((b) => b.match === i);
      let sA, sB;
      if (bet) {
        if (checkLuck(user.luck)) {
          setUser((u) => ({ ...u, luck: u.luck - 5 }));
          sA = randomScore();
          sB = randomScore();
        } else {
          const forced = forceLose(
            bet.team,
            bet.team === m.teamA ? m.teamB : m.teamA
          );
          sA = forced[m.teamA];
          sB = forced[m.teamB];
        }
      } else {
        sA = randomScore();
        sB = randomScore();
      }
      const win = sA > sB ? m.teamA : sB > sA ? m.teamB : "draw";
      return { ...m, sA, sB, win, date: dateStr, time: timeStr };
    });

    setResultsLog((prev) => [...prev, ...matchResults]);

    const newBetsLog = user.bets.map((b) => {
      const r = matchResults[b.match];
      const won = r.win === b.team;
      return {
        ...r,
        teamBet: b.team,
        betType: r.win === "draw" ? "เสมอ" : won ? "ชนะไป" : "แพ้",
        amount: b.amt * (won ? b.rate : 1),
        won,
      };
    });
    setBetsLog((prev) => [...prev, ...newBetsLog]);

    let updatedTeams = [...teams];
    matchResults.forEach((r) => {
      updatedTeams = updatedTeams.map((t) => {
        if (t.name === r.teamA || t.name === r.teamB) {
          let add = 0,
            w = t.w,
            d = t.d,
            l = t.l;
          if (r.win === "draw") {
            add = 1;
            d++;
          } else if (r.win === t.name) {
            add = 3;
            w++;
          } else {
            l++;
          }
          return { ...t, pts: t.pts + add, p: t.p + 1, w, d, l };
        }
        return t;
      });
    });

    let gain = 0;
    user.bets.forEach((b) => {
      const r = matchResults[b.match];
      if (r.win === b.team) gain += Math.round(b.amt * b.rate);
    });
    setTeams(updatedTeams.sort((a, b) => b.pts - a.pts));
    setUser((u) => ({ ...u, bal: u.bal + gain, bets: [] }));
    setResults(matchResults);

    setTimeout(() => {
      setResults([]);
      genMatches();
      setTimer(TIME);
      setIsBetting(true);
    }, 2500);
  };

  return (
    <div className={className}>
      <div className="header">
        <h1>
          Apex <span>Ball</span>
        </h1>
        <div className="userInfo">
          🍀 Luck {user.luck} 💰 ฿{user.bal} {user.name}
        </div>
      </div>

      <div className="main">
        {/* sidebar-left */}
        <div className="sidebar-left">
          <h2>ตารางคะแนน</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>ทีม</th>
                <th>แข่ง</th>
                <th>ชนะ</th>
                <th>เสมอ</th>
                <th>แพ้</th>
                <th>แต้ม</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t, i) => (
                <tr key={t.name}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{t.p}</td>
                  <td>{t.w}</td>
                  <td>{t.d}</td>
                  <td>{t.l}</td>
                  <td>{t.pts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* center */}
        <div className="center">
          <div className="banner">ภาพโฆษณา</div>
          <div className="matches">
            {matches.map((m, i) => {
              const betForMatch = user.bets.find((b) => b.match === i);
              return (
                <div className="matchCard" key={i}>
                  <div className="header">
                    <div className="logo">Logo</div>
                    <div className="date">
                      28/10
                      <br />
                      <small>{timer}s</small>
                    </div>
                    <div className="logo">Logo</div>
                  </div>
                  <div className="teams">
                    <span>{m.teamA}</span>
                    <span>{m.teamB}</span>
                  </div>
                  <div className="odds">
                    {m.rates.map((r, idx) => (
                      <span
                        key={idx}
                        title={idx === 0 ? "ชนะ" : idx === 1 ? "เสมอ" : "แพ้"}
                      >
                        {r}x
                      </span>
                    ))}
                  </div>
                  {betForMatch && (
                    <div className="betInfo">
                      เดิมพัน {betForMatch.team} จำนวน {betForMatch.amt}฿
                    </div>
                  )}
                  <button
                    disabled={!!betForMatch}
                    onClick={() => {
                      if (!isBetting) {
                        alert("หมดเวลาวางเดิมพันแล้ว ไม่สามารถวางเดิมพันได้!");
                        return;
                      }
                      if (!betForMatch) {
                        setSelectedMatch(i);
                        setTempTeam(m.teamA);
                        setShowModal(true);
                      }
                    }}
                  >
                    {betForMatch ? "วางเดิมพันเรียบร้อย" : "ร่วมสนุกทันที"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* sidebar-right */}
        <div className="sidebar-right">
          <div className="section">
            <h3>ผลการแข่งขัน</h3>
            <div className="resultBox">
              {resultsLog.length === 0 ? (
                <p>ยังไม่มีผล</p>
              ) : (
                [...resultsLog].reverse().map((r, i) => (
                  <p key={i}>
                    {r.date} {r.teamA} {r.sA}-{r.sB} {r.teamB} [{r.win}]
                  </p>
                ))
              )}
            </div>
          </div>
          <div className="section">
            <h3>ผลการเดิมพัน</h3>
            <div className="resultBox">
              {betsLog.length === 0 ? (
                <p>ยังไม่มีการเดิมพัน</p>
              ) : (
                betsLog
                  .filter((b) => b.won !== null)
                  .reverse()
                  .map((b, i) => (
                    <p key={i}>
                      {b.teamBet} {b.betType} | {b.amount}฿
                    </p>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modalWrapper">
          <div className="modalBox">
            <h3>วางเดิมพัน</h3>
            <>
              <p className="teamSelectWrapper">
                เลือกทีม:
                <select
                  value={tempTeam}
                  onChange={(e) => setTempTeam(e.target.value)}
                >
                  <option value={matches[selectedMatch].teamA}>
                    {matches[selectedMatch].teamA}
                  </option>
                  <option value={matches[selectedMatch].teamB}>
                    {matches[selectedMatch].teamB}
                  </option>
                </select>
              </p>
              <input
                type="number"
                placeholder="จำนวนเดิมพัน"
                value={tempAmount}
                onChange={(e) => setTempAmount(e.target.value)}
              />
              <div className="btns">
                <button
                  onClick={() => {
                    if (!isBetting) {
                      alert("หมดเวลาวางเดิมพันแล้ว ไม่สามารถวางเดิมพันได้!");
                      setShowModal(false);
                      return;
                    }
                    confirmBet(selectedMatch, tempTeam);
                    setShowModal(false);
                    setTempAmount("");
                  }}
                >
                  ยืนยัน
                </button>
                <button className="cancel" onClick={() => setShowModal(false)}>
                  ยกเลิก
                </button>
              </div>
            </>
          </div>
        </div>
      )}
    </div>
  );
}

export default styled(FootballLuckGameMiniStyled)`
  font-family: "Tahoma", sans-serif;
  background: #111;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1a1a1a;
    padding: 15px 30px;
    border-bottom: 2px solid #00eaff;
  }
  .header h1 {
    font-size: 24px;
  }
  .header h1 span {
    color: #00eaff;
  }
  .userInfo {
    color: #ccc;
    font-size: 14px;
  }

  .main {
    display: grid;
    grid-template-columns: 22% 56% 22%;
    flex-grow: 1;
  }
  .sidebar-left {
    background: #232323;
    padding: 10px;
  }
  .sidebar-left h2 {
    background: #00eaff;
    color: #000;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  .sidebar-left table {
    width: 100%;
    font-size: 12px;
    border-collapse: collapse;
    color: #ddd;
  }
  .sidebar-left th,
  td {
    padding: 4px;
    text-align: center;
  }
  .sidebar-left th {
    color: #00eaff;
  }

  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 15px;
  }
  .banner {
    background: #00eaff;
    color: #000;
    width: 100%;
    height: 180px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
  .matches {
    display: flex;
    justify-content: center;
    gap: 30px;
  }
  .matchCard {
    background: #111;
    border: 2px solid #00eaff;
    border-radius: 12px;
    width: 230px;
    text-align: center;
    padding: 30px;
  }
  .matchCard .betInfo {
    background: #00eaff22;
    color: #00eaff;
    font-size: 12px;
    border-radius: 6px;
    margin: 6px 0;
    padding: 4px;
  }
  .matchCard .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .matchCard .logo {
    background: #00eaff;
    color: #000;
    font-weight: 600;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .matchCard .date {
    font-size: 12px;
    color: #aaa;
  }
  .matchCard .teams {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  .matchCard .odds {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 6px 0;
  }
  .matchCard .odds span {
    border: 1px solid #00eaff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    background: #111;
    transition: 0.2s;
  }
  .matchCard .odds span:hover {
    background: #00eaff22;
    color: #00eaff;
  }
  .matchCard button {
    background: #00eaff;
    color: #000;
    border: none;
    border-radius: 20px;
    font-weight: 700;
    padding: 5px 15px;
    cursor: pointer;
    transition: 0.2s;
  }
  .matchCard button:hover {
    background: #00ffff;
  }

  .sidebar-right {
    background: #232323;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  .section h3 {
    color: #00eaff;
    border-bottom: 1px solid #00eaff;
    padding-bottom: 4px;
  }
  .resultBox {
    background: #1c1c1c;
    border-radius: 6px;
    padding: 10px;
    font-size: 13px;
    height: 200px;
    overflow-y: auto;
  }

  .modalWrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  .modalBox {
    background: #111;
    border: 2px solid #00eaff;
    border-radius: 12px;
    padding: 25px;
    width: 300px;
    text-align: center;
    color: #fff;
    box-shadow: 0 0 15px #00eaff55;
  }
  .modalBox h3 {
    color: #00eaff;
    margin-bottom: 10px;
  }
  .modalBox input {
    width: 100%;
    padding: 8px;
    background: #000;
    color: #00eaff;
    border: 1px solid #00eaff;
    border-radius: 6px;
    margin: 10px 0;
    text-align: center;
  }
  .btns {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .btns button {
    flex: 1;
    background: #00eaff;
    color: #000;
    font-weight: 600;
    border: none;
    border-radius: 20px;
    padding: 6px 0;
    cursor: pointer;
    transition: 0.2s;
  }
  .btns button.cancel {
    background: #444;
    color: #fff;
  }
  .btns button:hover {
    opacity: 0.85;
  }
  .teamSelectWrapper {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .teamSelectWrapper select {
    background: #000;
    color: #00eaff;
    border: 1px solid #00eaff;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;
  }
  .teamSelectWrapper select:hover {
    border-color: #00ffff;
    background: #111;
  }
  .teamSelectWrapper select:focus {
    outline: none;
    box-shadow: 0 0 5px #00eaff;
  }
  .teamSelectWrapper option {
    background: #111;
    color: #00eaff;
    padding: 4px 10px;
  }
`;
