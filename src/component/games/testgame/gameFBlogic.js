//ไม่มีการเดิมพัน → สุ่มปกติ
//เดิมพันแต่ทีมผิด → ignore bet
//เดิมพันถูกทีม → ตรวจดวงและจัดการผลตาม luck

// สุ่มสกอร์ (0–10)
export const randomScore = () => Math.floor(Math.random() * 11);

//เช็คดวง สุ่มได้ <= luck → ดวงดี
export const checkLuck = (userLuck) => {
  const roll = Math.floor(Math.random() * 100) + 1; // สุ่มเลข 1–100
  console.log(`[Luck Check] Roll: ${roll}, User Luck: ${userLuck}`);
  return roll <= userLuck; // true = ดวงดี, false = ดวงซวย
};

//lock ผล
export const forceLose = (chosenTeam, opponentTeam) => {
  const result = {
    [chosenTeam]: Math.floor(Math.random() * 5),        // ทีมเราได้ 0–4
    [opponentTeam]: Math.floor(Math.random() * 6) + 5,  // ทีมคู่แข่งได้ 5–10
  };
  console.log(`[Force Lose] ${chosenTeam}: ${result[chosenTeam]}, ${opponentTeam}: ${result[opponentTeam]}`);
  return result;
};

//logic หลัก
export const simulateMatch = (teamA, teamB, userBet = null) => {
  let scoreA, scoreB;

  // ✅ กรณีมีการเดิมพัน
  if (userBet) {
    const { chosenTeam, userLuck } = userBet;

    // ตรวจสอบชื่อทีมที่เลือกว่าถูกต้องไหม
    if (![teamA, teamB].includes(chosenTeam)) {
      console.warn(`[จำลองผล] ⚠️ ทีมที่ผู้เล่นเลือก (${chosenTeam}) ไม่ได้อยู่ในการแข่งขัน ${teamA} vs ${teamB} ระบบจะสุ่มผลตามปกติ`);
      scoreA = randomScore();
      scoreB = randomScore();
    } else {
      // ตรวจสอบดวงของผู้เล่น
      const luckSuccess = checkLuck(userLuck);

      if (luckSuccess) {
        // ดวงดี → สุ่มผลจริง
        scoreA = randomScore();
        scoreB = randomScore();
        console.log(`[จำลองผล] 🍀 ดวงดี! ระบบจะสุ่มผลการแข่งขันตามจริง`);
      } else {
        // ดวงไม่ถึง → บังคับให้แพ้
        const opponent = chosenTeam === teamA ? teamB : teamA;
        const result = forceLose(chosenTeam, opponent);
        scoreA = Number(result[teamA] ?? 0);
        scoreB = Number(result[teamB] ?? 0);
        console.log(`[จำลองผล] 💀 ดวงไม่ดี! ทีม ${chosenTeam} ถูกบังคับให้แพ้`);
      }
    }
  }

  // ไม่มีเดิมพัน → สุ่มปกติ
  else {
    scoreA = randomScore();
    scoreB = randomScore();
    console.log(`[จำลองผล] 🎯 ไม่มีการเดิมพัน ระบบจะสุ่มผลตามปกติ`);
  }

  //  คำนวณผู้ชนะ
  const winner =
    scoreA > scoreB ? teamA :
    scoreB > scoreA ? teamB : "เสมอ";

  console.log(
    `[ผลการแข่งขัน]  ${teamA} ${scoreA} : ${scoreB} ${teamB} → ผลลัพธ์: ${
      winner === "เสมอ" ? "เสมอกัน" : `ทีมที่ชนะคือ ${winner}`
    }`
  );

  return {
    teamA,
    teamB,
    scoreA,
    scoreB,
    winner,
  };
};
//ที่ return กลับมา คือชื่อ team teamA = "Liverpool" teamB = "Man City"


// อัปเดตตารางคะแนนทีม
export const updateRanking = (teams, matchResult) => {
  const { teamA, teamB, winner } = matchResult;

  const updatedTeams = teams.map((team) => {
    if (team.name === teamA || team.name === teamB) {
      if (winner === "draw") {
        return { ...team, points: team.points + 1 };//draw = เสมอ +1 คะแนน
      } else if (team.name === winner) {
        return { ...team, points: team.points + 3 };//win+3
      }
    }
    return team;
  });

  // เรียงมากไปน้อย
  return updatedTeams.sort((a, b) => b.points - a.points);
};


// วางเดิมพัน
export const placeBet = (user, team, amount, rate) => {
  if (amount > user.balance) {
    throw new Error("ยอดเงินไม่พอสำหรับการเดิมพันนี้");//ตรวจเงินของ user
  }
//...user = คัดลอกข้อมูล user เดิม obj
  return {
    ...user,
    balance: user.balance - amount, // หักเงินก่อนเริ่มแข่ง
    currentBet: {
      chosenTeam: team,
      amount,
      rate,
      userLuck: user.luck,
    },
  };
};

