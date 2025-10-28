
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";



const ROUND_SECONDS = 15;
const MAX_MATCHES = 38;
const TEAMS = [
  "Liverpool", "Man City", "Arsenal", "Chelsea", "Tottenham",
  "Man United", "Newcastle", "Aston Villa", "Brighton", "West Ham",
  "Fulham", "Brentford", "Crystal Palace", "Wolves", "Everton",
  "Forest", "Leicester", "Leeds", "Bournemouth", "Burnley"
];

const randomScore = () => Math.floor(Math.random() * 11);
const checkLuck = (luck) => Math.floor(Math.random() * 100) + 1 <= luck;
const forceLose = (team, opp) => ({
  [team]: Math.floor(Math.random() * 4),
  [opp]: Math.floor(Math.random() * 6) + 5,
});

export default function FootballLuckGameMiniStyled() {
  const [teams, setTeams] = useState(
    TEAMS.map((n) => ({ name: n, pts: 0, p: 0, w: 0, d: 0, l: 0 }))
  );
  const [resultsLog, setResultsLog] = useState([]);
const [betsLog, setBetsLog] = useState([]);

  const [matches, setMatches] = useState([]);
  const [timer, setTimer] = useState(ROUND_SECONDS);
  const [isBetting, setIsBetting] = useState(true);
  const [round, setRound] = useState(0);
  const [finishedBets, setFinishedBets] = useState([]);
  const [user, setUser] = useState({
    name: "Player1",
    luck: 55,
    bal: 4977,
    bets: [],
  });
  const [betAmount, setBetAmount] = useState(100);
  const [msg, setMsg] = useState("");
  const [results, setResults] = useState([]);
  const timerRef = useRef();
  const [betConfirmed, setBetConfirmed] = useState(false);

  // 🔹 เพิ่มสำหรับ popup/modal
  const [showModal, setShowModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [tempTeam, setTempTeam] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  const genMatches = () => {
    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    setMatches([
      { teamA: shuffled[0].name, teamB: shuffled[1].name },
      { teamA: shuffled[2].name, teamB: shuffled[3].name },
    ]);
  };
  useEffect(() => { genRate(); }, []);

 
  useEffect(() => {
    if (!isBetting) return;
    timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [isBetting]);
  useEffect(() => { if (timer <= 0) endRound(); }, [timer]);

  const rate = () => Number((1.4 + Math.random() * 0.6).toFixed(2));

const genRate = () => {
  const shuffled = [...teams].sort(() => Math.random() - 0.5);
  const newMatches = [
    { 
      teamA: shuffled[0].name, 
      teamB: shuffled[1].name,
      rates: [rate(), 1, rate()] // ใช้ rate() ครั้งเดียวตอนสร้าง match
    },
    { 
      teamA: shuffled[2].name, 
      teamB: shuffled[3].name,
      rates: [rate(), 1, rate()]
    },
  ];
  setMatches(newMatches);
};


const confirmBet = (matchIndex, team) => {
  if (!isBetting) return;
  if (betAmount <= 0 || user.bal < betAmount) return alert("ยอดเงินไม่พอ");
  const alreadyBet = user.bets.find((b) => b.match === matchIndex);
  if (alreadyBet) return alert("คุณเดิมพันคู่นี้แล้ว");

  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth()+1}`;
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

  const teamRate = team === matches[matchIndex].teamA ? matches[matchIndex].rates[0]
               : team === matches[matchIndex].teamB ? matches[matchIndex].rates[2]
               : 1;

  const payload = {
    match: matchIndex,
    team,
    amt: betAmount,
  rate: teamRate, // ใช้ rate ที่คงที่จาก match
    date: dateStr,
    time: timeStr
  };

  // อัพเดท user
  setUser({
    ...user,
    bal: user.bal - betAmount,
    bets: [...user.bets, payload],
  });

  // เพิ่ม log ทันที
  setBetsLog(prev => [
    ...prev,
    {
      ...payload,
      teamA: matches[matchIndex].teamA,
      teamB: matches[matchIndex].teamB,
      sA: null, // ยังไม่มีสกอร์ตอนนี้
      sB: null,
      won: null,
      betType: "รอผล",
    }
  ]);

  setBetConfirmed(true);
  setMsg(`เดิมพัน ${team} จำนวน ${betAmount}฿`);
};




const endRound = () => {
  setIsBetting(false);
  clearInterval(timerRef.current);

  const now = new Date();
  const dateStr = `${now.getDate()}/${now.getMonth()+1}`;
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;

  const matchResults = matches.map((m, i) => {
    const userBet = user.bets.find((b) => b.match === i);
    let sA, sB;
    if (userBet) {
      const pass = checkLuck(user.luck);
      if (pass) {
           setUser(u => ({ ...u, luck: u.luck - 5 })); // ลด luck
        sA = randomScore(); sB = randomScore();
      } else {
        const forced = forceLose(userBet.team, userBet.team === m.teamA ? m.teamB : m.teamA);
        sA = forced[m.teamA]; sB = forced[m.teamB];
      }
    } else { sA = randomScore(); sB = randomScore(); }
    const win = sA > sB ? m.teamA : sB > sA ? m.teamB : "draw";
    return { ...m, sA, sB, win, date: dateStr, time: timeStr };
  });

  // อัพเดทผลการแข่งขัน log
  setResultsLog(prev => [...prev, ...matchResults]);

  // อัพเดทผลการเดิมพัน log
  const newBetsLog = user.bets.map(bet => {
    const r = matchResults[bet.match];
    let won = null;
    if (r.win === "draw") won = null; // เสมอ
    else won = r.win === bet.team;
    return {
      ...r,
      teamBet: bet.team,
      betType: won === null ? "เสมอ" : won ? "ชนะไป" : "แพ้",
      amount: bet.amt * (won ? bet.rate : 1),
      won
    };
  });
  setBetsLog(prev => [...prev, ...newBetsLog]);

  // อัพเดทคะแนน
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

  // อัพเดท user balance
  let gain = 0;
  user.bets.forEach((bet) => {
    const r = matchResults[bet.match];
    if (r.win === bet.team) gain += Math.round(bet.amt * bet.rate);
  });

  setTeams(tcopy.sort((a,b)=>b.pts - a.pts));
  setUser(u => ({ ...u, bal: u.bal + gain, bets: [] }));
  setResults(matchResults);
  setRound(r => r + 1);
  setMsg(`รอบจบแล้ว! ได้คืนรวม ${gain}฿`);

  // รีเซ็ตสำหรับรอบต่อไป แต่ log คงอยู่
setTimeout(() => {
  setResults([]); 
  genRate(); // <-- สร้าง match + rates พร้อม
  setTimer(ROUND_SECONDS); 
  setIsBetting(true);
}, 2500);
};


  return (
    <Layout>
    
      <Header>
        <h1>Apex <span>Ball</span></h1>
        <UserInfo>
          🍀 Luck {user.luck}   💰 ฿{user.bal}   {user.name} 
        </UserInfo>
      </Header>

      <Main>
        <SidebarLeft>
          <h2>ตารางคะแนน</h2>
          <Table>
            <thead>
              <tr><th>#</th><th>ทีม</th><th>แข่ง</th><th>ชนะ</th><th>เสมอ</th><th>แพ้</th><th>แต้ม</th></tr>
            </thead>
            <tbody>
            
              {teams.map((t, i) => (
                <tr key={t.name}>
                  <td>{i + 1}</td><td>{t.name}</td><td>{t.p}</td>
                  <td>{t.w}</td><td>{t.d}</td><td>{t.l}</td><td>{t.pts}</td>
                </tr>
              ))}
              <br />
            </tbody>
          </Table>
        </SidebarLeft>

        <Center>
          <Banner>ภาพโฆษณา</Banner>
          
<Matches>
  {matches.map((m, i) => {
    // ตรวจสอบว่าผู้เล่นเดิมพันคู่นี้แล้วหรือยัง
    const betForMatch = user.bets.find(b => b.match === i);

    return (
      <MatchCard key={i}>
        <div className="header">
          <div className="logo">Logo</div>
          <div className="date">28/10<br /><small>{timer}s</small></div>
          <div className="logo">Logo</div>
        </div>

        <div className="teams">
          <span>{m.teamA}</span><span>{m.teamB}</span>
        </div>
<br />
<div className="odds">
  {m.rates?.map((r, idx) => { 
    const label = idx === 0 ? "ชนะ" : idx === 1 ? "เสมอ" : "แพ้";
    return (
      <span key={idx} title={label}>
        {r}x
      </span>
    );
  })}
</div>
<br />
        {/* แสดงข้อมูลเดิมพันถ้ามี */}
        {betForMatch && (
          <div className="betInfo">
            เดิมพัน {betForMatch.team} จำนวน {betForMatch.amt}฿
          </div>
        )}

        <button
          disabled={!!betForMatch} // กดไม่ได้ถ้าวางเดิมพันแล้ว
          onClick={() => {
            if (!betForMatch) {
              setSelectedMatch(i);
              setTempTeam(m.teamA);
              setShowModal(true);
            }
          }}
        >
          {betForMatch ? "วางเดิมพันเรียบร้อย" : "ร่วมสนุกทันที"}
        </button>
      </MatchCard>
    );
  })}
</Matches>

        </Center>
<SidebarRight>
  <div className="section">
<h3>ผลการแข่งขัน</h3>
<LogBox>
  {resultsLog.length === 0 ? (
    <p>ยังไม่มีผล</p>
  ) : (
    [...resultsLog].reverse().map((r, i) => {  // <-- เพิ่ม reverse()
      const timeStr = r.time || "เวลาไม่ระบุ";
      let resultText;

      if (r.win === "draw") {
        resultText = `${r.date} [ เสมอ ] ${r.teamA} ${r.sA}-${r.sB} ${r.teamB} ${timeStr}`;
      } else {
        const loser = r.teamA === r.win ? r.teamB : r.teamA;
        resultText = `${r.date} [ ${r.win} ชนะ ] ${loser} ${loser === r.teamA ? r.sA : r.sB}-${r.win === r.teamA ? r.sA : r.sB} ${r.win} ${timeStr}`;
      }

      let color = r.win === "draw" ? "#ffff00" : "#ffffffff"; // เสมอเหลือง ชนะขาว
      return <p key={i} style={{color, marginBottom: "4px"}}>{resultText}</p>;
    })
  )}
</LogBox>

  </div>

  <div className="section">
    <h3>ผลการเดิมพัน</h3>
    <LogBox>
{betsLog.length === 0 ? (
  <p>ยังไม่มีการเดิมพัน</p>
) : (
    betsLog
      .filter(b => b.won !== null)   // <-- กรองเฉพาะที่มีผลแล้ว
       .reverse() // <-- reverse เพื่อเอาอันล่าสุดบนสุด
      .map((b, i) => {
        const statusText = b.won ? "คุณชนะเดิมพัน" : "คุณแพ้เดิมพัน";
        let color = b.won ? "#00ff00" : "#ff4444";

    return (
      <p key={i} style={{color, marginBottom:"6px"}}>
        {statusText} ({b.date} {b.time})<br/>
        คุณเดิมพัน {b.teamBet} {b.betType}<br/>
        {b.sA !== null ? `${b.teamA} ${b.sA}-${b.sB} ${b.teamB}` : `${b.teamA} vs ${b.teamB}`}<br/>
        {b.won === null ? `จำนวนเดิมพัน ${b.amt}฿` : b.won ? `ได้รับ ${b.amount} บาท` : `เสีย ${b.amount} บาท`}
      </p>
    );
  })
)}
    </LogBox>
  </div>
</SidebarRight>


      </Main>

      {/* 🔹 Modal กล่องเดิมพัน */}
      {showModal && (
        <ModalOverlay>
          <ModalBox>
            <h3>วางเดิมพัน</h3>
<TeamSelectWrapper>
  คุณเลือก:       
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
</TeamSelectWrapper>
            <input
              type="number"
              placeholder="กรอกจำนวนเดิมพัน"
              value={tempAmount}
              onChange={(e) => setTempAmount(e.target.value)}
            />
            <div className="btns">
              <button onClick={() => {

                 if (!isBetting || timer <= 0) {
            alert("หมดเวลาวางเดิมพันแล้ว");
            setShowModal(false);
            return;
          }

                const amt = Number(tempAmount);
                if (amt <= 0 || user.bal < amt) {
                  alert("ยอดเงินไม่พอหรือไม่ถูกต้อง");
                  return;
                }
                setBetAmount(amt);
                confirmBet(selectedMatch, tempTeam);
                setShowModal(false);
                setTempAmount("");
              }}>ยืนยัน</button>

              <button className="cancel" onClick={() => setShowModal(false)}>ยกเลิก</button>
            </div>
          </ModalBox>
        </ModalOverlay>
      )}
    </Layout>
  );
}

/* 🎨 Styled Components */
const Layout = styled.div`
font-family: 'Tahoma', 'Segoe UI', 'Arial', 'Helvetica', 'Roboto', sans-serif;
  background: #111;
  color: #fff;

  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #1a1a1a;
  padding: 15px 30px;
  border-bottom: 2px solid #00eaff;
  h1 { font-size: 24px; }
  span { color: #00eaff; }
`;

const UserInfo = styled.div`
  color: #ccc;
  font-size: 14px;
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: 22% 56% 22%;
  flex-grow: 1;
`;

const SidebarLeft = styled.aside`
  background: #232323;
  padding: 10px;
  h2 {
    background: #00eaff;
    color: #000;
    text-align: center;
    border-radius: 6px;
    margin-bottom: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  font-size: 12px;
  border-collapse: collapse;
  color: #ddd;
  th, td { padding: 4px; text-align: center; }
  th { color: #00eaff; }
`;

const Center = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 15px;
`;

const Banner = styled.div`
  background: #00eaff;
  color: #000;
  width: 100%;
  height: 180px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`;

const Matches = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
`;

const MatchCard = styled.div`
  
  background: #111;
  border: 2px solid #00eaff;
  border-radius: 12px;
  width: 230px;
  text-align: center;
  padding: 30px;
  .betInfo {
    background: #00eaff22;
    color: #00eaff;
    font-size: 12px;
    border-radius: 6px;
    margin: 6px 0;
    padding: 4px;
  }
  .header {
display: flex; justify-content: space-between; align-items: center; 
  }
  .logo {
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
  .date {
    font-size: 12px;
    color: #aaa;
  }
  .teams {
    display: flex;
    justify-content: space-between;
    margin-top: 6px;
  }
  .odds {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin: 6px 0;
  }
.odds span {
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

.odds span:hover {
  background: #00eaff22;
  color: #00eaff;
}

  button {
    background: #00eaff;
    color: #000;
    border: none;
    border-radius: 20px;
    font-weight: 700;
    padding: 5px 15px;
    cursor: pointer;
    transition: 0.2s;
  }
  button:hover {
    background: #00ffff;
  }
`;

const SidebarRight = styled.aside`
  background: #232323;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .section h3 {
    color: #00eaff;
    border-bottom: 1px solid #00eaff;
    padding-bottom: 4px;
  }
  .box {
    background: #1c1c1c;
    border-radius: 6px;
    padding: 6px;
    font-size: 13px;
  }
`;

/* 🔹 Popup Styled */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: #111;
  border: 2px solid #00eaff;
  border-radius: 12px;
  padding: 25px;
  width: 300px;
  text-align: center;
  color: #fff;
  box-shadow: 0 0 15px #00eaff55;

  h3 { color: #00eaff; margin-bottom: 10px; }
  input {
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
  button {
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
  button.cancel {
    background: #444;
    color: #fff;
  }
  button:hover {
    opacity: 0.85;
  }
`;
//    {teams.slice(0, 20).map((t, i) => (
const LogBox = styled.div`
  background: #1c1c1c;
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  height: 200px;
  overflow-y: auto;
`;

const TeamSelectWrapper = styled.p`
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;

  select {
    background: #000;
    color: #00eaff;
    border: 1px solid #00eaff;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 14px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      border-color: #00ffff;
      background: #111;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 5px #00eaff;
    }
  }

  option {
    background: #111;
    color: #00eaff;
    padding: 4px 10px;
  }
`;
