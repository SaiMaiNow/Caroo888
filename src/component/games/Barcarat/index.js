import { useState, useEffect, useRef } from 'react'
import './global.css'

const BET_OPTIONS = [
  { id: 'player', label: 'Player', color: 'blue', rate: 2 },
  { id: 'tie', label: 'Tie', color: 'green', rate: 8 },
  { id: 'banker', label: 'Banker', color: 'red', rate: 1.95 },
];

export default function Home() {
  const [balance, setBalance] = useState(5000);
  const [bets, setBets] = useState([]);
  const [selectedChip, setSelectedChip] = useState(50);
  const [timer, setTimer] = useState(15);
  const [isBetting, setIsBetting] = useState(true);
  const [history, setHistory] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isBetting) {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setIsBetting(false);
            revealResult();
            return 0;
          }
          return t - 1;
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [isBetting]);

  const placeBet = (option) => {
    if (!isBetting) return;
    setBets(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(b => b.option === option);
      if (idx >= 0) copy[idx].amount += selectedChip;
      else copy.push({ option, amount: selectedChip });
      return copy;
    })
  };

  const confirmBet = () => {
    const total = bets.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert('ยอดเดิมพันมากกว่ายอดในบัญชี');
      return;
    }
    setBalance(b => b - total);
  };

  const cancelBet = () => setBets([]);

  const repeatBet = () => {
    if (history.length === 0) return;
    const last = history[0].bets;
    const total = last.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert('ไม่พอเงินสำหรับวางเดิมพันซ้ำ');
      return;
    }
    setBets(last.map(b => ({ ...b })));
    setBalance(b => b - total);
  };

  const revealResult = () => {
    const options = ['player', 'banker', 'tie'];
    const result = options[Math.floor(Math.random() * 3)];
    let payout = 0;
    bets.forEach(b => {
      if (b.option === result) {
        const rate = BET_OPTIONS.find(x => x.id === result).rate;
        payout += b.amount * rate;
      }
    });
    setTimeout(() => {
      setBalance(b => b + payout);
      setHistory(h => [{ result, bets: bets.map(x => ({ ...x })), payout, timestamp: Date.now() }, ...h].slice(0, 50));
      setBets([]);
      setTimer(15);
      setIsBetting(true);
    }, 900);
  };

  const totalPending = bets.reduce((s, b) => s + b.amount, 0);

  return (
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
              <div key={i} className={`history-dot ${h.result}`}>{h.result[0].toUpperCase()}</div>
            ))}
          </div>
        </section>

        <section className="table glass">
          <div className="timer">{timer}</div>
          <div className="bet-options">
            {BET_OPTIONS.map(opt => (
              <div key={opt.id} className="bet-box">
                <div className="bet-label">{opt.label}</div>
                <div className="bet-rate">1 : {opt.rate}</div>
                <button
                  className={`bet-btn ${opt.color}`}
                  onClick={() => placeBet(opt.id)}>
                  วางชิป
                </button>
                <div className="bet-amount">{(bets.find(b => b.option === opt.id)?.amount || 0)} ฿</div>
              </div>
            ))}
          </div>
          <div className="chip-bar">
            {[5, 10, 20, 50, 100].map(chip => (
              <div
                key={chip}
                className={`chip ${selectedChip === chip ? 'selected' : ''}`}
                onClick={() => setSelectedChip(chip)}>
                {chip}
              </div>
            ))}
          </div>
        </section>

        <section className="player glass">
          <h3>Player Info</h3><br></br>
          <p>ID: bookbento</p><br></br>
          <p>Rounds played: {history.length}</p>
          <button onClick={() => setBalance(b => b + 1000)}>เติมเงิน +฿1000</button>
          <button onClick={() => setBalance(1000)}>รีเซ็ตยอด</button>
        </section>
      </main>

      <footer>developer by bookbxk | demo only</footer>

      <div className="floating glass">
        <div>ยอดเดิมพัน: {totalPending}</div>
        <br></br>
        <div className="btn-group">
          <button onClick={confirmBet}>ยืนยัน</button>
          <button onClick={cancelBet}>ยกเลิก</button>
          <button onClick={repeatBet}>วางซ้ำ</button>
        </div>
      </div>
    </div>
  )
}

