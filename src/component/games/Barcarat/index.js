import { useState, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";


function Baccarat({ className }) {
  const [balance, setBalance] = useState(5000);
  const [bets, setBets] = useState([]);
  const [selectedChip, setSelectedChip] = useState(50);
  const [timer, setTimer] = useState(15);
  const [isBetting, setIsBetting] = useState(true);
  const [history, setHistory] = useState([]);
  const [cards, setCards] = useState({ player: [], banker: [], points: { p: 0, b: 0 } });
  const timerRef = useRef(null);

  const BET_OPTIONS = [
    { id: "player", label: "Player", color: "blue", rate: 2 },
    { id: "tie", label: "Tie", color: "green", rate: 8 },
    { id: "banker", label: "Banker", color: "red", rate: 1.95 },
  ];

  const cardImages = {
    C1: "/cards/C1.png",
    C2: "/cards/C2.png",
    C3: "/cards/C3.png",
    C4: "/cards/C4.png",
    C5: "/cards/C5.png",
    C6: "/cards/C6.png",
    C7: "/cards/C7.png",
    C8: "/cards/C8.png",
    C9: "/cards/C9.png",
    C10: "/cards/C10.png",
    C11: "/cards/C11.png",
    C12: "/cards/C12.png",
    C13: "/cards/C13.png",
    D1: "/cards/D1.png",
    D2: "/cards/D2.png",
    D3: "/cards/D3.png",
    D4: "/cards/D4.png",
    D5: "/cards/D5.png",
    D6: "/cards/D6.png",
    D7: "/cards/D7.png",
    D8: "/cards/D8.png",
    D9: "/cards/D9.png",
    D10: "/cards/D10.png",
    D11: "/cards/D11.png",
    D12: "/cards/D12.png",
    D13: "/cards/D13.png",
    H1: "/cards/H1.png",
    H2: "/cards/H2.png",
    H3: "/cards/H3.png",
    H4: "/cards/H4.png",
    H5: "/cards/H5.png",
    H6: "/cards/H6.png",
    H7: "/cards/H7.png",
    H8: "/cards/H8.png",
    H9: "/cards/H9.png",
    H10: "/cards/H10.png",
    H11: "/cards/H11.png",
    H12: "/cards/H12.png",
    H13: "/cards/H13.png",
    S1: "/cards/S1.png",
    S2: "/cards/S2.png",
    S3: "/cards/S3.png",
    S4: "/cards/S4.png",
    S5: "/cards/S5.png",
    S6: "/cards/S6.png",
    S7: "/cards/S7.png",
    S8: "/cards/S8.png",
    S9: "/cards/S9.png",
    S10: "/cards/S10.png",
    S11: "/cards/S11.png",
    S12: "/cards/S12.png",
    S13: "/cards/S13.png",
  };

  useEffect(() => {
    if (isBetting) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsBetting(false);
            revealResult();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isBetting]);

  const dealBaccarat = () => {
    const suits = ["C", "D", "H", "S"];
    const deck = suits.flatMap((suit) =>
      Array.from({ length: 13 }, (_, i) => `${suit}${i + 1}`)
    );

    const cardValue = (card) => {
      const num = parseInt(card.slice(1));
      return num >= 10 ? 0 : num;
    };

    const calcPoints = (cards) =>
      cards.reduce((sum, c) => sum + cardValue(c), 0) % 10;

    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    const player = [shuffled[0], shuffled[2]];
    const banker = [shuffled[1], shuffled[3]];

    const playerPoint = calcPoints(player);
    const bankerPoint = calcPoints(banker);

    if (playerPoint <= 5) player.push(shuffled[4]);
    if (bankerPoint <= 5) banker.push(shuffled[5]);

    const p = calcPoints(player);
    const b = calcPoints(banker);
    const result = p > b ? "player" : p < b ? "banker" : "tie";

    return { player, banker, points: { p, b }, result };
  };


  const placeBet = (option) => {
    if (!isBetting) return;
    setBets((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((b) => b.option === option);
      if (idx >= 0) copy[idx].amount += selectedChip;
      else copy.push({ option, amount: selectedChip });
      return copy;
    });
  };

  const confirmBet = () => {
    const total = bets.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert("ยอดเดิมพันมากกว่ายอดในบัญชี");
      return;
    }
    setBalance((b) => b - total);
  };

  const cancelBet = () => setBets([]);

  const repeatBet = () => {
    if (history.length === 0) return;
    const last = history[0].bets;
    const total = last.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert("ไม่พอเงินสำหรับวางเดิมพันซ้ำ");
      return;
    }
    setBets(last.map((b) => ({ ...b })));
    setBalance((b) => b - total);
  };

  const revealResult = () => {
    const gameResult = dealBaccarat();
    const { player, banker, points, result } = gameResult;

    let payout = 0;
    bets.forEach((b) => {
      if (b.option === result) {
        const rate = BET_OPTIONS.find((x) => x.id === result).rate;
        payout += b.amount * rate;
      }
    });

    setTimeout(() => {
      setBalance((b) => b + payout);
      setHistory((h) => [result, ...h]);
      setBets([]);
      setCards({ player, banker, points });
      setTimer(15);
      setIsBetting(true);
    }, 900);
  };

  const totalPending = bets.reduce((s, b) => s + b.amount, 0);

  return (
    <div className={className}>
      <div className="container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">PG</div>
            <div>
              <h1>Caroo888 Baccarat</h1>
              <p className="subtitle">by bookbxk</p>
            </div>
          </div>
          <div className="balance-box">
            <span>Balance:</span> ฿ {balance.toFixed(2)}
          </div>
        </header>

        <main className="main">
          <section className="history glass">
            <h2>Game History {history.length}</h2><br></br>
            <div className="history-grid">
              {history.slice(0, 30).map((h, i) => (
                <div key={i} className={`history-dot ${h}`}>
                  {h[0].toUpperCase()} {/* P/B/T */}
                </div>
              ))}
            </div>
          </section>

          <section className="cards glass">
            <div>

              <div style={{ display: "flex" }}>
                {cards.player.map((c) => (
                  <img key={c} src={cardImages[c]} alt={c} style={{ width: 60, marginRight: 5 }} />
                ))}
              </div>
              <br></br>

              <h3>Player ({cards.player.length ? cards.points?.p : "-"})</h3>
              <br></br>
            </div>

            <div>
              <div style={{ display: "flex" }}>
                {cards.banker.map((c) => (
                  <img key={c} src={cardImages[c]} alt={c} style={{ width: 60, marginRight: 5 }} />
                ))}
              </div>
              <br></br>

              <h3>Banker ({cards.banker.length ? cards.points?.b : "-"})</h3>
              <br></br>
            </div>
          </section>

          <section className="table glass">
            <div className="timer">{timer}</div>
            <div className="bet-options">
              {BET_OPTIONS.map((opt) => (
                <div key={opt.id} className="bet-box">
                  <div className="bet-label">{opt.label}</div>
                  <div className="bet-rate">1 : {opt.rate}</div>
                  <button
                    className={`bet-btn ${opt.color}`}
                    onClick={() => placeBet(opt.id)}
                  >
                    วางชิป
                  </button>
                  <div className="bet-amount">
                    {(bets.find((b) => b.option === opt.id)?.amount || 0)} ฿
                  </div>
                </div>
              ))}
            </div>
            <div className="chip-bar">
              {[5, 10, 20, 50, 100].map((chip) => (
                <div
                  key={chip}
                  className={`chip ${selectedChip === chip ? "selected" : ""}`}
                  onClick={() => setSelectedChip(chip)}
                >
                  {chip}
                </div>
              ))}
            </div>
          </section>

          <section className="player glass">
            <h3>Player Info</h3>
            <br></br>
            <p>ID: bookbento</p>
            <br></br>
            <p>Rounds played: {history.length}</p>
            <br></br>
            <button onClick={() => setBalance((b) => b + 1000)}>เติมเงิน +฿1000</button>
            <button onClick={() => setBalance(1000)}>รีเซ็ตยอด</button>
          </section>
        </main>

        <footer>developer by bookbxk | demo only</footer>

        <div className="floating glass">
          <div>ยอดเดิมพัน: {totalPending}</div>
          <div className="btn-group">
            <button onClick={confirmBet}>ยืนยัน</button>
            <button onClick={cancelBet}>ยกเลิก</button>
            <button onClick={repeatBet}>วางซ้ำ</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default styled(Baccarat)`
  font-family: "Kanit", sans-serif;
  color: white;
  background: linear-gradient(180deg, #0f1020 0%, #121323 60%);
  min-height: 100vh;

  .container {
    padding: 20px;
    max-width: 1200px;
    margin: auto;
  }

  .glass {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 14px;
    backdrop-filter: blur(8px);
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-icon {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 800;
    }

    .subtitle {
      font-size: 12px;
      color: #aaa;
    }
  }

  .balance-box {
    background: rgba(255, 255, 255, 0.06);
    padding: 10px 16px;
    border-radius: 10px;
    font-weight: bold;
  }

  .main {
    display: grid;
    grid-template-columns: 3fr 6fr 3fr;
    gap: 20px;
  }

  .history-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .history-dot {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    &.player {
      background: #2563eb;
    }
    &.tie {
      background: #16a34a;
    }
    &.banker {
      background: #dc2626;
    }
  }

  .timer {
    width: 68px;
    height: 68px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    border: 4px solid rgba(255, 255, 255, 0.1);
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .bet-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .bet-box {
      text-align: center;
      flex: 1;

      .bet-btn {
        font-family: "Kanit", sans-serif;
        color: white;
        border: none;
        border-radius: 50px;
        padding: 10px 20px;
        cursor: pointer;
        margin-top: 10px;

        &.blue {
          background: #2563eb;
        }
        &.green {
          background: #16a34a;
        }
        &.red {
          background: #dc2626;
        }
      }

      .bet-amount {
        font-size: 14px;
        color: #ccc;
        margin-top: 5px;
      }
    }
  }

  .chip-bar {
    display: flex;
    justify-content: center;
    gap: 10px;

    .chip {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      border: 4px solid rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.05);
      cursor: pointer;

      &.selected {
        box-shadow: 0 0 0 4px #facc15;
      }
    }
  }

  .player button {
    display: bloC13;
    width: 100%;
    margin: 8px 0;
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
    color: white;
    cursor: pointer;
  }

  footer {
    text-align: center;
    color: #888;
    margin-top: 20px;
  }

  .floating {
    position: fixed;
    right: 20px;
    bottom: 20px;
    padding: 16px;
    border-radius: 12px;
    text-align: right;

    .btn-group button {
      font-family: "Kanit", sans-serif;
      color: white;
      margin-left: 6px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
    }
  }

.cards {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding: 20px 0;
}
`;
