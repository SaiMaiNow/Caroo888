import React, { useState, useEffect, useRef, use } from "react";
import styled from "styled-components";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addBalance,
  subtractBalance,
  played,
  fetchUser,
} from "../../../features/user/userSlice";

const TIME = 15;
const TEAMS = [
  { name: "Liverpool", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "LIV" },
  { name: "Man City", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "MCI" },
  { name: "Arsenal", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "ARS" },
  { name: "Chelsea", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "CHE" },
  { name: "Tottenham", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "TOT" },
  { name: "Man United", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "MUN" },
  { name: "Newcastle", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "NEW" },
  { name: "Aston Villa", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "AVL" },
  { name: "Brighton", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "BHA" },
  { name: "West Ham", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "WHU" },
  { name: "Fulham", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "FUL" },
  { name: "Brentford", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "BRE" },
  { name: "Crystal Palace", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "CRY" },
  { name: "Wolves", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "WOL" },
  { name: "Everton", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "EVE" },
  { name: "Forest", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "FOR" },
  { name: "Leicester", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "LEI" },
  { name: "Leeds", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "LEE" },
  { name: "Bournemouth", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "BOU" },
  { name: "Burnley", pts: 0, p: 0, w: 0, d: 0, l: 0, shortname: "BUR" },
];

//const MockUSER = { name: "Player1", luck: 55, bal: 5000, bets: [] };

function FootballLuckGameMiniStyled({ className }) {
  const [teams, setTeams] = useState(TEAMS); //ตารางคะแนน
  const user = useSelector((state) => state.user);
  console.log("user:", user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [matches, setMatches] = useState([]); //จับคู่
  const [resultsLog, setResultsLog] = useState([]); //log ผลการแข่งขันทั้งหมด
  const [betsLog, setBetsLog] = useState([]); //log ผลการเดิมพันทั้งหมด
  const [timer, setTimer] = useState(TIME); //จับเวลา
  const [isBetting, setIsBetting] = useState(true); //เปิด/ปิดการเดิมพัน
  const [userBets, setUserBets] = useState([]); //เก็บการเดิมพันของผู้ใช้ current
  const [betAmount] = useState(100);
  const timerRef = useRef();
  const [roundEnded, setRoundEnded] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tempTeam, setTempTeam] = useState("");
  const [tempAmount, setTempAmount] = useState("");
  const [, setResults] = useState([]);
  const [fadeState, setFadeState] = useState("fade-in");

  const randomScore = () => Math.floor(Math.random() * 11);
  const checkLuck = (luck) => Math.floor(Math.random() * 100) + 1 <= luck;
  const forceLose = (team, opp) => ({
    [team]: Math.floor(Math.random() * 4),
    [opp]: Math.floor(Math.random() * 6) + 5,
  });

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (!user.isLoggedIn && user.isDataLoaded) {
      navigate("/");
    }
  }, [user.isLoggedIn, user.isDataLoaded, navigate]);

  const getRate = (teamPts, oppPts) => {
    // Base rate = 1.2 - 2.5
    let diff = oppPts - teamPts; // ถ้า diff > 0 แสดงว่าทีมเราน้อยกว่า
    let rate = 1.5 + diff * 0.05; // diff บวกเล็กน้อยเพิ่มเรท
    // จำกัดให้อยู่ระหว่าง 1.3 ถึง 3.0
    rate = Math.max(1.3, Math.min(rate, 3.0));
    return Number(rate.toFixed(2));
  };
  const genMatches = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const newMatches = [
      {
        teamA: shuffled[0].name,
        teamB: shuffled[1].name,
        rates: [
          getRate(shuffled[0].pts, shuffled[1].pts), // ทีม A ชนะ
          1, // เสมอ
          getRate(shuffled[1].pts, shuffled[0].pts), // ทีม B ชนะ
        ],
      },
      {
        teamA: shuffled[2].name,
        teamB: shuffled[3].name,
        rates: [
          getRate(shuffled[2].pts, shuffled[3].pts),
          1,
          getRate(shuffled[3].pts, shuffled[2].pts),
        ],
      },
    ];
    setMatches(newMatches);
  };

  // ป้องกันเรียก endRound ซ้ำ: ใช้ roundEnded flag
  useEffect(() => {
    if (timer <= 0 && !roundEnded) {
      setRoundEnded(true);
      if (showModal) {
        setShowModal(false);
        alert("หมดเวลาวางเดิมพันแล้ว!");
      }
      endRound();
    }
  }, [timer, roundEnded]); // eslint-disable-line

  useEffect(() => genMatches(), []); // สุ่มแมตช์เริ่มต้น
  useEffect(() => {
    if (!isBetting) return;
    timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isBetting]);

  // --- confirmBet: clone match data ก่อนเก็บ, เก็บ amt เป็นตัวเดียว, update user ด้วย functional updater
  const confirmBet = (matchIndex, team) => {
    if (!isBetting) {
      alert("หมดเวลาวางเดิมพันแล้ว!");
      return;
    }

    const amt = Number(tempAmount || betAmount);
    if (amt <= 0 || isNaN(amt)) return alert("กรุณากรอกจำนวนเดิมพันที่ถูกต้อง");
    // ตรวจสอบยอดเพียงพอ
    if (amt > (user.balance ?? 0)) return alert("ยอดเงินไม่พอสำหรับเดิมพันนี้");

    if (
      (user.bets ?? []).find(
        (b) =>
          b.match === matchIndex &&
          b.teamA === matches[matchIndex].teamA &&
          b.teamB === matches[matchIndex].teamB
      )
    )
      return alert("คุณเดิมพันคู่นี้แล้ว");

    const now = new Date();
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}`;
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )}`;
    const m = { ...matches[matchIndex] }; // clone match object เพื่อป้องกัน reference
    const teamRate =
      team === m.teamA ? m.rates[0] : team === m.teamB ? m.rates[2] : 1;

    const payload = {
      match: matchIndex,
      team,
      amt,
      rate: teamRate,
      date: dateStr,
      time: timeStr,
      teamA: m.teamA,
      teamB: m.teamB,
    };

    // ลดยอดผู้เล่นผ่าน thunk (API) และเก็บ bet ลง local state
    dispatch(subtractBalance({ amount: amt }));
    setUserBets((prev) => [...prev, payload]);

    // เก็บ log เป็น copy (ไม่ชี้ไปยัง matches)
    setBetsLog((prev) => [
      ...prev,
      {
        ...payload,
        scoreTeamA: null,
        scoreTeamB: null,
        won: null,
        betType: "รอผล",
        payout: 0,
      },
    ]);

    // รีเซ็ต tempAmount (UX)
    setTempAmount("");
  };

  const endRound = () => {
    if (showModal) {
      setShowModal(false);
      alert("หมดเวลาวางเดิมพันแล้ว!");
    }
    setIsBetting(false);
    clearInterval(timerRef.current);

    // เริ่ม fade out
    setFadeState("fade-out");

    //เก็บสำเนา (snapshot) ของ state ปัจจุบัน (user และ userBets) เพื่อป้องกันปัญหา stale state ภายใน setTimeout
    const userSnapshot = { ...user };
    const betsSnapshot = [...userBets];
    //user อาจถูกอัปเดตจาก server แล้ว balance เปลี่ยน
    //userBets อาจถูกล้างก่อนจบรอบ→ ผลเกมรอบนี้จะผิดเพี้ยน ❌

    setTimeout(() => {
      const now = new Date();
      const dateStr = `${now.getDate()}/${now.getMonth() + 1}`;
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(
        2,
        "0"
      )}`;

      // สร้างผลแต่ละแมตช์ (clone ข้อมูลที่จะเก็บ)
      const matchResults = matches.map((m) => {
        const betForThisMatch = betsSnapshot.find(
          (b) => b.teamA === m.teamA && b.teamB === m.teamB
        );

        console.log(userSnapshot.lucknumber);
        console.log(user.lucknumber);

        let scoreTeamA, scoreTeamB;
        if (betForThisMatch) {
          if (checkLuck(userSnapshot.lucknumber ?? 0)) {
            // เรียก API/Thunk เพื่อปรับ luck ของ user (server จะคืนค่า lucknumber ใหม่)
            dispatch(played());
            scoreTeamA = randomScore();
            scoreTeamA = randomScore();
            scoreTeamB = randomScore();
          } else {
            const forced = forceLose(
              betForThisMatch.team,
              betForThisMatch.team === m.teamA ? m.teamB : m.teamA
            );
            scoreTeamA =
              typeof forced[m.teamA] === "number"
                ? forced[m.teamA]
                : randomScore();
            scoreTeamB =
              typeof forced[m.teamB] === "number"
                ? forced[m.teamB]
                : randomScore();
          }
        } else {
          scoreTeamA = randomScore();
          scoreTeamB = randomScore();
        }

        const win =
          scoreTeamA > scoreTeamB
            ? m.teamA
            : scoreTeamB > scoreTeamA
            ? m.teamB
            : "draw";

        return {
          teamA: m.teamA,
          teamB: m.teamB,
          rates: [...m.rates],
          scoreTeamA,
          scoreTeamB,
          win,
          date: dateStr,
          time: timeStr,
        };
      });

      // --- อัปเดตตารางคะแนนทีม ---
      setTeams((prevTeams) =>
        prevTeams.map((team) => {
          const matchForTeam = matchResults.find(
            (m) => m.teamA === team.name || m.teamB === team.name
          );
          if (!matchForTeam) return team;

          let newTeam = { ...team, p: team.p + 1 };

          if (matchForTeam.win === "draw") {
            newTeam.d = team.d + 1;
            newTeam.pts = team.pts + 1;
          } else if (matchForTeam.win === team.name) {
            newTeam.w = team.w + 1;
            newTeam.pts = team.pts + 3;
          } else {
            newTeam.l = team.l + 1;
          }

          return newTeam;
        })
      );

      // อัปเดต betsLog
      setBetsLog((prevBets) =>
        prevBets.map((bet) => {
          const result = matchResults.find(
            (r) => r.teamA === bet.teamA && r.teamB === bet.teamB
          );
          if (!result) return { ...bet };

          let isWinner = false;
          let payoutAmount = 0;
          let outcomeLabel = "";

          if (result.win === "draw") {
            outcomeLabel = "เสมอ";
            payoutAmount = bet.amt; // คืนเงิน
          } else if (result.win === bet.team) {
            outcomeLabel = "ชนะ";
            isWinner = true;
            payoutAmount = Math.round(bet.amt * bet.rate);
          } else {
            outcomeLabel = "แพ้";
            payoutAmount = -bet.amt;
          }

          return {
            ...bet,
            scoreTeamA: result.scoreTeamA,
            scoreTeamB: result.scoreTeamB,
            won: isWinner,
            betType: outcomeLabel,
            endTime: result.time,
            payout: payoutAmount,
          };
        })
      );

      // คำนวณ gain และอัปเดตยอดผู้เล่น
      let gain = 0;
      betsSnapshot.forEach((b) => {
        const r = matchResults.find(
          (mr) => mr.teamA === b.teamA && mr.teamB === b.teamB
        );
        if (!r) return;
        if (r.win === b.team) gain += Math.round(b.amt * b.rate);
        else if (r.win === "draw") {
          gain += b.amt; // ✅ คืนเงิน
        }
      });

      if (gain > 0) {
        dispatch(addBalance({ amount: gain }));
      }
      setUserBets([]); // clear local bets

      // เก็บผลเพื่อแสดงชั่วคราว
      setResults(matchResults.map((r) => ({ ...r })));

      // append resultsLog
      setResultsLog((prev) => [
        ...prev,
        ...matchResults.map((r) => ({ ...r })),
      ]);

      // รีเซ็ตรอบใหม่
      setTimeout(() => {
        setResults([]);
        genMatches();
        setTimer(TIME);
        setIsBetting(true);
        setFadeState("fade-in");
        setRoundEnded(false);
      }, 2000);
    }, 100);
  };
  //🍀 Luck {user.lucknumber}
  return (
    <div className={className}>
      <div className="header">
        <h1>
          Apex <span>Ball</span>
        </h1>
        <div className="userInfo">
          💰 ฿{user.balance} {user.firstname} {user.lastname}
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
              {[...teams]
                .sort((a, b) => b.pts - a.pts)
                .map((t, i) => (
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
          <br />
        </div>

        {/* center */}
        <div className="center">
          <div className="banner">Apex Ball</div>
          <div className="matches">
            {matches.map((m, i) => {
              const betForMatch = userBets.find(
                (b) => b.teamA === m.teamA && b.teamB === m.teamB
              );
              return (
                <div className={`matchCard ${fadeState}`} key={i}>
                  <div className="header">
                    <div className="teamColumn">
                      <div className="shortname">
                        {" "}
                        {TEAMS.find((t) => t.name === m.teamA)?.shortname ||
                          "?"}
                      </div>
                      <br />
                      <div className="teamName">{m.teamA}</div>
                    </div>

                    <div className="date">
                      {m.date || new Date().toLocaleDateString("th-TH")}
                      <br />
                      <br />
                      <strong>{timer}s</strong>
                    </div>

                    <div className="teamColumn">
                      <div className="shortname">
                        {" "}
                        {TEAMS.find((t) => t.name === m.teamB)?.shortname ||
                          "?"}
                      </div>
                      <br />
                      <div className="teamName">{m.teamB}</div>
                    </div>
                  </div>

                  <div className="headrates">Rates</div>

                  <div className="rates">
                    {m.rates.map((r, idx) => (
                      <span
                        key={idx}
                        title={idx === 0 ? "ชนะ" : idx === 1 ? "เสมอ" : "แพ้"}
                      >
                        {r}x
                      </span>
                    ))}
                  </div>
                  {betForMatch ? (
                    <div className="betInfo">
                      เดิมพัน {betForMatch.team} จำนวน {betForMatch.amt}฿
                    </div>
                  ) : (
                    <div className="betInfo" style={{ visibility: "hidden" }}>
                      placeholder
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
                    ผู้ชนะ: [{r.win}] ชนะ
                    <br />
                    ผลการแข่งขัน: {r.teamA} {r.scoreTeamA}-{r.scoreTeamB}{" "}
                    {r.teamB} <br />
                    วันที่แข่ง: {r.date} <br />
                    เวลาจบแมตช์: {r.time}ิ
                    <br />
                    ---------------------------------------
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
                  .filter((b) => b.betType !== "รอผล")
                  .reverse()
                  .map((b, i) => (
                    <p key={i}>
                      เดิมพัน :({b.team}) จำนวน: {b.amt}฿ เรท x{b.rate} <br />
                      ผลการเดิมพัน: {b.betType}
                      <br />
                      ผลการแข่งขัน: {b.teamA} {b.scoreTeamA}-{b.scoreTeamB}{" "}
                      {b.teamB}
                      <br />
                      วันที่แข่ง: {b.date} <br />
                      เวลาจบแมตช์: {b.endTime} <br />
                      เงินที่ได้/เสีย:{" "}
                      {typeof b.payout === "number"
                        ? b.payout >= 0
                          ? `+฿${b.payout}`
                          : `-฿${Math.abs(b.payout)}`
                        : `฿0`}
                      <br />
                      ---------------------------------------
                    </p>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && selectedMatch !== null && matches[selectedMatch] && (
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
                onChange={(e) => {
                  const value = e.target.value;

                  // ตรวจว่าเป็นเลขจำนวนเต็มบวกเท่านั้น
                  if (/^\d*$/.test(value)) {
                    // ถ้าเป็นตัวเลขถูกต้องให้บันทึกค่าได้
                    setTempAmount(value);
                  } else {
                    // ถ้าไม่ใช่ (ติดลบ, ตัวอักษร, ทศนิยม)
                    alert(
                      "กรุณากรอกจำนวนเดิมพันเป็นตัวเลขจำนวนเต็มบวกเท่านั้น!"
                    );
                    setTempAmount(""); // รีเซ็ตค่ากลับเป็นว่าง
                  }
                }}
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
  font-family: "Keania", serif;
  background: #111;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  .headrates {
    font-size: 16px;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #111;
    padding: 15px 30px;
    border-bottom: 2px solid #00eaff;
  }
  .header h1 {
    font-size: 24px;
    text-shadow: 0 0 6px #f0f0f0ff, 0 0 6px #00bfff; /* เงาสีฟ้า */
  }
  .header h1 span {
    color: #00eaff;
  }
  .userInfo {
    color: #ffffffff; /* สีขาว */
    font-size: 14px;
    text-shadow: 0 0 6px #00bfff, 0 0 12px #00bfff; /* เงาสีฟ้า */
  }

  .main {
    display: grid;
    grid-template-columns: 22% 56% 22%;
    flex-grow: 1;
    box-shadow: 0 6px 12px -2px #00bfff;
  }
  .sidebar-left {
    background: #232323;
    padding: 10px;
    box-shadow: 0 0 4px #00bfff;
  }
  .sidebar-left h2 {
    background: #00eaff;
    color: #000;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 10px;
    box-shadow: 0 0 4px #00bfff;
  }
  .sidebar-left table {
    width: 100%;
    font-size: 12px;
    border-collapse: collapse;
    color: #ddd;
    background: #111;
    box-shadow: 0 0 4px #00bfff;
  }
  .sidebar-left th,
  td {
    padding: 4px;
    text-align: center;
    padding: 6px;
  }
  .sidebar-left th {
    color: #00eaff;
    border-bottom: 1px solid #00eaff;
  }
  .center {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    gap: 15px;
    border: 1px solid #00eaff;
  }

  .banner {
    background: #00eaff;
    color: #000;
    font-size: 32px;
    width: 100%;
    height: 180px;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    text-shadow: 0 0 15px #ffffffff, 0 0 15px #cbf2ffff; /* เงาสีฟ้า */
    box-shadow: 0 0 7px #00bfff;
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
    width: 390px;
    text-align: center;
    padding: 30px;
    box-shadow: 0 0 7px #00bfff;
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
  .matchCard .teamColumn {
    width: 100px; /* fix width เท่ากัน */
    flex-shrink: 0;
  }
  .matchCard .shortname {
    background: #00eaff;
    color: #000;
    font-weight: 600;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 7px #00eaff;
  }
  .matchCard .date {
    font-size: 14px;
    color: #aaa;
  }

  .matchCard .date strong {
    border: 1px solid #00fbff;
    padding: 4px 8px;
    border-radius: 6px;

    font-size: 16px;
    color: #00fbff;
  }
  .matchCard .teams {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  .matchCard .rates {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 6px 0;
    background: #111;
  }
  .matchCard .rates span {
    padding: 10px 50px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    background: #111;
    transition: 0.2s;
  }

  .matchCard button {
    background: #00eaff;
    color: #000;
    border: none;
    border-radius: 20px;
    width: 100%;
    font-weight: 700;
    font-size: 16px;
    padding: 5px 15px;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 0 7px #00eaff;
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
    padding: 10px;
    background: #111;
    box-shadow: 0 0 4px #00bfff;
  }
  .resultBox {
    background: #1c1c1c;
    border-radius: 6px;
    padding: 10px;
    font-size: 14px;
    height: 200px;
    overflow-y: auto;
    box-shadow: 0 0 4px #00bfff;
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
    box-shadow: 0 0 5px #00eaff;
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
  /* 🎞️ Fade animation */
  .matchCard {
    opacity: 1;
    transform: scale(1);
    transition: opacity 0.3s ease, transform 0.3s ease;
  }

  .matchCard.fade-out {
    opacity: 0;
    transform: scale(1);
  }

  .matchCard.fade-in {
    opacity: 1;
    transform: scale(1);
  }
  .matchCard .teamColumn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px; /* เว้นช่องว่างระหว่าง logo กับชื่อทีม */
  }

  .matchCard .teamName {
    font-size: 14px;
    color: #fff;
    font-weight: 600;
    text-align: center;
  }
`;
