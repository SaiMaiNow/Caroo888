import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, Link, useParams } from "react-router-dom";

function UserDetailPage({ className }) {
  const { state } = useLocation();
  const { id } = useParams();
  const [user, setUser] = useState(state?.user || null);
  const [amount, setAmount] = useState("");
  const [showRateDropdown, setShowRateDropdown] = useState(false);
  const rateOptions = ["60%", "70%", "80%", "90%", "100%"];

  if (!user)
    return (
      <div className={className}>
        <Link to="/admin" className="back-btn">
          ⬅ กลับไปหน้ารายชื่อ
        </Link>
        <p style={{ color: "#aaa" }}>❌ ไม่พบข้อมูลผู้ใช้ ID {id}</p>
      </div>
    );

  const handleAddMoney = () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + Number(amount),
    }));
    setAmount("");
  };

  const handleSubtractMoney = () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    if (user.balance < Number(amount)) return alert("❌ ยอดเงินไม่พอ");
    setUser((prev) => ({
      ...prev,
      balance: prev.balance - Number(amount),
    }));
    setAmount("");
  };

  const handleSelectRate = (rate) => {
    setUser((prev) => ({ ...prev, rate }));
    setShowRateDropdown(false);
  };

  return (
    <div className={className}>
      <Link to="/admin" className="back-btn">
        ⬅ กลับไปหน้ารายชื่อ
      </Link>

      <div className="user-card">
        <h1>ข้อมูลผู้เล่น: {user.name}</h1>
        <p>
          <strong>ยอดเงิน:</strong> {user.balance.toLocaleString()} ฿
        </p>
        <p>
          <strong>เรทแตก:</strong> {user.rate}
        </p>

        {/* ✅ ส่วนควบคุมยอดเงิน */}
        <div className="money-control">
          <input
            type="number"
            placeholder="จำนวนเงิน"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="buttons">
            <button onClick={handleAddMoney}>➕ เพิ่มเงิน</button>
            <button onClick={handleSubtractMoney}>➖ ลบเงิน</button>
          </div>
        </div>

        {/* ✅ ส่วนปรับเรท */}
        <div className="rate-control">
          <button onClick={() => setShowRateDropdown(!showRateDropdown)}>
            ⚙️ ปรับเรท
          </button>
          {showRateDropdown && (
            <div className="rate-dropdown">
              {rateOptions.map((rate) => (
                <button key={rate} onClick={() => handleSelectRate(rate)}>
                  {rate}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default styled(UserDetailPage)`
  font-family: "Italiana", serif;
  background: #1a1a1a;
  color: white;
  min-height: 100vh;
  padding: 2rem;

  .back-btn {
    color: #ffb83f;
    text-decoration: none;
    font-size: 1.1rem;
    display: inline-block;
    margin-bottom: 2rem;
  }

  .user-card {
    padding: 2rem;
    border-radius: 12px;
    max-width: 600px;
    margin: auto;
    text-align: center;

    h1 {
      color: #ffb83f;
      margin-bottom: 1rem;
    }

    p {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }

    /* ✅ กล่องควบคุมเงิน */
    .money-control {
      margin-top: 1.5rem;

      input {
        padding: 0.6rem;
        border-radius: 8px;
        border: none;
        text-align: center;
        margin-bottom: 1rem;
        width: 60%;
        background: white;
      }

      .buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;

        button {
          flex: 1;
          background: linear-gradient(to bottom, #e89300, #ffb83f);
          border: none;
          border-radius: 8px;
          padding: 0.6rem;
          font-weight: bold;
          cursor: pointer;
          color: black;
          transition: 0.2s ease;

          &:hover {
            transform: translateY(-2px);
            opacity: 0.9;
          }

          &:nth-child(2) {
            background: linear-gradient(to bottom, #ff5f5f, #ff8080);
          }
        }
      }
    }

    .rate-control {
      margin-top: 1.5rem;
      position: relative;

      button {
        background: #e89300;
        border: none;
        border-radius: 8px;
        padding: 0.6rem 1rem;
        font-weight: bold;
        cursor: pointer;
      }

      .rate-dropdown {
        position: absolute;
        background: #2b2b2b;
        border-radius: 8px;
        top: 100%;
        left: 0;
        right: 0;
        margin-top: 0.5rem;
        border: 1px solid #ffb83f;

        button {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background: none;
          border: none;
          color: white;
          text-align: left;
          &:hover {
            background: #e89300;
            color: black;
          }
        }
      }
    }
  }
`;
