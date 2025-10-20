import React, { useEffect, useState, useRef } from 'react'

const BET_OPTIONS = [
  { id: 'player', label: 'Player', color: 'bg-blue-600', rate: 2 },
  { id: 'tie', label: 'Tie', color: 'bg-green-600', rate: 8 },
  { id: 'banker', label: 'Banker', color: 'bg-red-600', rate: 1.95 },
];

export default function App() {
  const [balance, setBalance] = useState(5000);
  const [bets, setBets] = useState([]); // {option, amount}
  const [selectedChip, setSelectedChip] = useState(50);
  const [timer, setTimer] = useState(15);
  const [isBetting, setIsBetting] = useState(true);
  const [history, setHistory] = useState([]); // most recent first
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
  }, [isBetting])

  const placeBet = (option) => {
    if (!isBetting) return;
    // try to deduct immediately from balance on confirm; here we show pending bet
    setBets(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(b => b.option === option);
      if (idx >= 0) {
        copy[idx].amount += selectedChip;
      } else {
        copy.push({ option, amount: selectedChip });
      }
      return copy;
    })
  }

  const confirmBet = () => {
    // finalize: deduct total pending from balance
    const total = bets.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert('ยอดเดิมพันมากกว่ายอดในบัญชี');
      return;
    }
    setBalance(b => b - total);
    // keep bets as placed for this round
    // disable further betting for this round (optional)
  }

  const cancelBet = () => {
    setBets([]);
  }

  const repeatBet = () => {
    // repeat last round (use history[0].bets)
    if (history.length === 0) return;
    const last = history[0].bets;
    // check balance
    const total = last.reduce((s, b) => s + b.amount, 0);
    if (total > balance) {
      alert('ไม่พอเงินสำหรับวางเดิมพันซ้ำ');
      return;
    }
    setBets(last.map(b => ({ ...b })));
    setBalance(b => b - total);
  }

  const revealResult = () => {
    // random result weighted? For demo uniform
    const options = ['player', 'banker', 'tie'];
    const result = options[Math.floor(Math.random() * 3)];
    // compute payout
    let payout = 0;
    bets.forEach(b => {
      if (b.option === result) {
        const rate = BET_OPTIONS.find(x => x.id === result).rate;
        payout += b.amount * rate;
      }
    })
    // banker commission (simulate) - for banker wins subtract 5% on payout difference (simple)
    if (result === 'banker') {
      // apply 5% commission on winnings (if any)
      // already included in rate (1.95) in config; so skip extra here
    }

    setTimeout(() => {
      setBalance(b => b + payout);
      setHistory(h => [{ result, bets: bets.map(x => ({ ...x })), payout, timestamp: Date.now() }, ...h].slice(0, 50));
      // reset round
      setBets([]);
      setTimer(15);
      setIsBetting(true);
    }, 900);
  }

  // small helpers for UI
  const totalPending = bets.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#0f1020 0%, #121323 60%)" }}>
      <div className="container">
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="glass p-3 rounded-full">
              <div style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>PG</div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Caroo888 Baccarat</h1>
              <div className="text-sm text-gray-300">by bookbxk</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="glass px-4 py-2 flex items-center gap-3">
              <div className="text-sm text-gray-300">Balance</div>
              <div className="font-bold">฿ {balance.toFixed(2)}</div>
            </div>
            <div className="glass px-3 py-2 rounded-lg">
              <button className="px-3 py-1">เมนู</button>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-12 gap-6">
          {/* left: history + big board */}
          <section className="col-span-3">
            <div className="glass p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold">Game History</div>
                <div className="text-sm text-gray-300">{history.length} รอบ</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.slice(0, 30).map((h, idx) => (
                  <div key={idx} title={new Date(h.timestamp).toLocaleString()} className={`w-8 h-8 rounded-full flex items-center justify-center ${h.result === 'player' ? 'bg-blue-600' : h.result === 'banker' ? 'bg-red-600' : 'bg-green-600'}`}>
                    {h.result[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-4">
              <div className="font-semibold mb-2">Big Road (mock)</div>
              <div className="h-40 bg-[rgba(255,255,255,0.02)] rounded p-2 overflow-auto">
                {/* placeholder grid */}
                <div className="text-sm text-gray-400">Mock board: simplified visualization</div>
                <div className="mt-2 grid grid-cols-8 gap-1">
                  {Array.from({ length: 56 }).map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-[rgba(255,255,255,0.02)] flex items-center justify-center text-xs text-gray-400">{i % 3 === 0 ? 'P' : i % 3 === 1 ? 'B' : 'T'}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* center: table + controls */}
          <section className="col-span-6">
            <div className="glass p-6 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-300">Round</div>
                  <div className="text-3xl font-bold">คลาสสิค</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="timer glass neon">{timer}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {BET_OPTIONS.map(opt => (
                  <div key={opt.id} className="glass p-4 flex flex-col items-center justify-center">
                    {/* <div className="text-sm text-gray-300">{opt.label}</div> layer บน font main ของส่วนวางชิป */}
                    <div className="text-2xl font-bold my-2">{opt.id === 'banker' ? 'Banker' : opt.label}</div>
                    <div className="text-sm text-gray-400">1 : {opt.rate}</div>
                    <button onClick={() => placeBet(opt.id)} className={`mt-4 px-5 py-2 rounded-full ${opt.color} text-white font-semibold`} >
                      วางชิป {selectedChip}
                    </button>
                    <div className="mt-3 text-sm text-gray-300">{(bets.find(b => b.option === opt.id)?.amount || 0)} ฿</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center gap-3">
                  {[5, 10, 20, 50, 100].map(chip => (
                    <div key={chip} onClick={() => setSelectedChip(chip)} className={`chip glass ${selectedChip === chip ? 'ring-4 ring-yellow-400' : ''} cursor-pointer`}>
                      {chip}
                    </div>
                  ))}
                </div>


              </div>
            </div>
          </section>

          {/* right: player info */}
          <aside className="col-span-3">
            <div className="glass p-4 mb-4">
              <div className="font-semibold">Player Info</div>
              <div className="text-sm text-gray-300">ID: bookbento</div>
              <div className="text-sm text-gray-300">Rounds played: {history.length}</div>
            </div>

            <div className="glass p-4">
              <div className="font-semibold mb-2">Admin Actions</div>
              <button onClick={() => { setBalance(b => b + 1000) }} className="glass px-3 py-2 rounded-lg w-full mb-2">เติมเงิน +฿1000</button>
              <button onClick={() => { setBalance(1000) }} className="glass px-3 py-2 rounded-lg w-full">รีเซ็ตยอด</button>
            </div>
          </aside>
        </main>

        <footer className="mt-4 text-center text-sm text-gray-600">
          developer by bookbxk | demo purpose only. Not for real gambling
        </footer>

        <div className="fixed right-6 bottom-6 glass px-6 py-4 rounded-lg shadow-lg z-50 text-right">
          <div className="flex space-x-3">
            <div className="flex flex-col justify-center items-start">
              <div className="mt-4 text-sm text-gray-300">ยอดเดิมพัน:<br></br></div>
              <div className="text-base font-bold">{totalPending}</div>
            </div>
            <button onClick={confirmBet} className="
             glass px-4 py-2 rounded-lg transition-all duration-300 
             hover:bg-black/25 active:bg-white/30 active:scale-95 
             backdrop-blur-md border border-white/30 shadow-lg">ยืนยัน</button>

            <button onClick={cancelBet} className="glass px-4 py-2 rounded-lg transition-all duration-300 
             hover:bg-black/25 active:bg-white/30 active:scale-95 
             backdrop-blur-md border border-white/30 shadow-lg">ยกเลิก</button>
             
            <button onClick={repeatBet} className="glass px-4 py-2 rounded-lg transition-all duration-300 
             hover:bg-black/25 active:bg-white/30 active:scale-95 
             backdrop-blur-md border border-white/30 shadow-lg">วางซ้ำ</button>
          </div>
        </div>

      </div>
    </div>
  )
}
