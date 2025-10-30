import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addBalance, subtractBalance } from "../../features/user/userSlice";

function UserDetailPage({ className }) {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); 
  const [amount, setAmount] = useState("");
  const [showRateDropdown, setShowRateDropdown] = useState(false);
  const rateOptions = ["60%", "70%", "80%", "90%", "100%"];

  const handleAddMoney = () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    dispatch(addBalance({ amount: Number(amount) })); 
    setAmount("");
  };

  const handleSubtractMoney = () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    if (user.balance < Number(amount)) return alert("❌ ยอดเงินไม่พอ");
    dispatch(subtractBalance({ amount: Number(amount) })); 
    setAmount("");
  };

  return (
    <div className={className}>
      <Link to="/admin" className="back-btn">
        ⬅ กลับไปหน้ารายชื่อ
      </Link>

      <div className="user-card">
        <h1>
          ข้อมูลผู้เล่น: {user.firstname} {user.lastname}
        </h1>
        <p>
          <strong>ยอดเงิน:</strong>{" "}
          {user.balance ? user.balance : 0} ฿
        </p>
        <p>
          <strong>เรทแตก:</strong> {user.lucknumber ?? "-"}
        </p>

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

        <div className="rate-control">
          <button onClick={() => setShowRateDropdown(!showRateDropdown)}>
            ⚙️ ปรับเรท
          </button>
          {showRateDropdown && (
            <div className="rate-dropdown">
              {rateOptions.map((rate) => (
                <button key={rate}>{rate}</button>
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
