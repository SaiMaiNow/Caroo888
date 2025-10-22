import {
  simulateMatch,
  updateRanking,
  placeBet
} from "./gameFBlogic.js";

let user = {
  name: "Player1",
  luck: 60,
  balance: 5000,
};

let teams = [
  { name: "Team A", points: 10 },
  { name: "Team B", points: 12 },
];

// ผู้เล่นวางเดิมพัน
user = placeBet(user, "Team A", 1000, 1.5);
console.log("💰 User after bet:", user);

// จำลองการแข่งขัน
const match = simulateMatch("Team A", "Team B", user.currentBet);
console.log("⚽ Match Result:", match);

// อัปเดตคะแนนทีม
teams = updateRanking(teams, match);
console.log("🏆 Updated Ranking:", teams);
