import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  deposit,
  withdraw,
  editProfile,
  deleteProfile,
} from "../../features/user/userSlice";

function UserInfo({ className, onClose, page }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [activePage, setActivePage] = useState(page);
  const [tab, setTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?.firstname) setFirstname(user.firstname);
    if (user?.lastname) setLastname(user.lastname);
  }, [user]);

  const handleDeposit = async () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    await dispatch(deposit({ amount }));
    setAmount("");
  };

  const handleWithdraw = async () => {
    if (!amount) return alert("กรุณากรอกจำนวนเงิน");
    await dispatch(withdraw({ amount }));
    setAmount("");
  };

  const handleEditProfile = async () => {
    if (!firstname || !lastname) return alert("กรุณากรอกชื่อให้ครบ");
    await dispatch(editProfile({ firstname, lastname }));
    alert("อัปเดตข้อมูลสำเร็จ");
  };

  const handleDeleteProfile = async () => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบบัญชีผู้ใช้ของคุณ?")) {
      await dispatch(deleteProfile());
      alert("บัญชีถูกลบเรียบร้อย");
      onClose();
    }
  };

  const icons = {
    profile: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
          <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"></path>
          <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21"></path>
        </g>
      </svg>
    ),
    withdraw: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 15c-1.84 0-2-.86-2-1H8c0 .92.66 2.55 3 2.92V18h2v-1.08c2-.34 3-1.63 3-2.92c0-1.12-.52-3-4-3c-2 0-2-.63-2-1s.7-1 2-1s1.39.64 1.4 1h2A3 3 0 0 0 13 7.12V6h-2v1.09C9 7.42 8 8.71 8 10c0 1.12.52 3 4 3c2 0 2 .68 2 1s-.62 1-2 1"
        ></path>
        <path
          fill="currentColor"
          d="M5 2H2v2h2v17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4h2V2zm13 18H6V4h12z"
        ></path>
      </svg>
    ),
    deposit: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={48}
        height={48}
        viewBox="0 0 48 48"
      >
        <g fill="currentColor" fillRule="evenodd" clipRule="evenodd">
          <path d="M28.772 24.667A4 4 0 0 0 25 22v-1h-2v1a4 4 0 1 0 0 8v4c-.87 0-1.611-.555-1.887-1.333a1 1 0 1 0-1.885.666A4 4 0 0 0 23 36v1h2v-1a4 4 0 0 0 0-8v-4a2 2 0 0 1 1.886 1.333a1 1 0 1 0 1.886-.666M23 24a2 2 0 1 0 0 4zm2 10a2 2 0 1 0 0-4z"></path>
          <path d="M13.153 8.621C15.607 7.42 19.633 6 24.039 6c4.314 0 8.234 1.361 10.675 2.546l.138.067c.736.364 1.33.708 1.748.987L32.906 15C41.422 23.706 48 41.997 24.039 41.997S6.479 24.038 15.069 15l-3.67-5.4c.283-.185.642-.4 1.07-.628q.318-.171.684-.35m17.379 6.307l2.957-4.323c-2.75.198-6.022.844-9.172 1.756c-2.25.65-4.75.551-7.065.124a25 25 0 0 1-1.737-.386l1.92 2.827c4.115 1.465 8.981 1.465 13.097.002M16.28 16.63c4.815 1.86 10.602 1.86 15.417-.002a29.3 29.3 0 0 1 4.988 7.143c1.352 2.758 2.088 5.515 1.968 7.891c-.116 2.293-1.018 4.252-3.078 5.708c-2.147 1.517-5.758 2.627-11.537 2.627c-5.785 0-9.413-1.091-11.58-2.591c-2.075-1.437-2.986-3.37-3.115-5.632c-.135-2.35.585-5.093 1.932-7.87c1.285-2.648 3.078-5.197 5.005-7.274m-1.15-6.714c.8.238 1.636.445 2.484.602c2.15.396 4.306.454 6.146-.079a54 54 0 0 1 6.53-1.471C28.45 8.414 26.298 8 24.038 8c-3.445 0-6.658.961-8.908 1.916"></path>
        </g>
      </svg>
    ),
    cashier: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M19 6H5a3 3 0 0 0-3 3v2.72L8.837 14h6.326L22 11.72V9a3 3 0 0 0-3-3"
          opacity={0.5}
        ></path>
        <path
          fill="currentColor"
          d="M10 6V5h4v1h2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v1zm-1.163 8L2 11.72V18a3.003 3.003 0 0 0 3 3h14a3.003 3.003 0 0 0 3-3v-6.28L15.163 14z"
        ></path>
      </svg>
    ),
    cross: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
          d="m8 8l4 4m0 0l4 4m-4-4l4-4m-4 4l-4 4"
        ></path>
      </svg>
    ),
  };

  return (
    <div className={className}>
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          {icons.cross}
        </button>

        <aside className="sidebar">
          <button
            className={activePage === "profile" ? "active" : ""}
            onClick={() => setActivePage("profile")}
          >
            {icons.profile} บัญชีของฉัน
          </button>
          <button
            className={activePage === "cashier" ? "active" : ""}
            onClick={() => setActivePage("cashier")}
          >
            {icons.cashier} แคชเชียร์
          </button>
        </aside>

        <main className="content">
          {activePage === "profile" && (
            <div className="profile-page">
              <h2>บัญชีของฉัน</h2>
              <div className="info-card">
                <div className="rank">{user.rank || "BRONZE"}</div>

                <div className="info">

                  {!isEditing ? (
                    <>
                      <p>
                        <strong>ชื่อผู้ใช้:</strong> {user.firstname}
                      </p>
                      <p>
                        <strong>นามสกุล:</strong> {user.lastname}
                      </p>
                      <p>
                        <strong>เบอร์โทรศัพท์:</strong> {user.phoneNumber}
                      </p>
                      <p>
                        <strong>คงเหลือ:</strong>{" "}
                        {Number(user.balance || 0).toLocaleString()} THB
                      </p>
                      <p>
                        <strong>รหัสผู้ใช้:</strong> {user.code}
                      </p>

                      <button
                        className="edit-btn"
                        onClick={() => setIsEditing(true)}
                      >
                         แก้ไขข้อมูล
                      </button>
                    </>
                  ) : (
                    <>
                      <label>ชื่อผู้ใช้:</label>
                      <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                      <label>นามสกุล:</label>
                      <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                      <div className="edit-buttons">
                        <button
                          className="save-btn"
                          onClick={async () => {
                            await handleEditProfile();
                            setIsEditing(false);
                          }}
                        >
                           บันทึก
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setFirstname(user.firstname);
                            setLastname(user.lastname);
                            setIsEditing(false);
                          }}
                        >
                           ยกเลิก
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activePage === "cashier" && (
            <div className="cashier-page">
              <h2>แคชเชียร์</h2>
              <div className="tabs">
                <button
                  className={tab === "deposit" ? "active" : ""}
                  onClick={() => setTab("deposit")}
                >
                  {icons.deposit} ฝากเงิน
                </button>
                <button
                  className={tab === "withdraw" ? "active" : ""}
                  onClick={() => setTab("withdraw")}
                >
                  {icons.withdraw} ถอนเงิน
                </button>
              </div>

              {tab === "deposit" && (
                <div className="deposit-section">
                  {/* <p>ฝากขั้นต่ำ 100 บาท</p> */}
                  <input
                    type="number"
                    placeholder="จำนวนเงิน"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button onClick={handleDeposit}>ยืนยันฝากเงิน</button>
                </div>
              )}

              {tab === "withdraw" && (
                <div className="withdraw-section">
                  {/* <p>ถอนขั้นต่ำ 100 บาท</p> */}
                  <input
                    type="number"
                    placeholder="จำนวนเงิน"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  <button onClick={handleWithdraw}>ยืนยันถอนเงิน</button>
                </div>
              )}
            </div>
          )}
        </main>
        <button className="delete-btn" onClick={handleDeleteProfile}>
          ลบบัญชีผู้ใช้
        </button>
      </div>
    </div>
  );
}

UserInfo.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  page: PropTypes.string,
};

export default styled(UserInfo)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;

  .popup {
    display: flex;
    background: #0f172a;
    color: #fff;
    border-radius: 20px;
    width: 900px;
    height: 560px;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    position: relative;
    animation: popupIn 0.25s ease;
  }

  @keyframes popupIn {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    transition: 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      color: #fca311;
      transform: scale(1.2) rotate(90deg);
    }
  }

  /* Sidebar */
  .sidebar {
    width: 240px;
    background: linear-gradient(180deg, #1e293b, #111827);
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 1rem;
    border-right: 1px solid #2b394a;

    button {
      background: none;
      border: none;
      color: #e5e7eb;
      padding: 0.9rem 1.2rem;
      text-align: left;
      border-radius: 10px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      transition: all 0.3s ease;
      letter-spacing: 0.2px;

      svg {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        opacity: 0.85;
      }

      &:hover {
        background: rgba(252, 163, 17, 0.15);
        color: #fca311;
        transform: translateX(3px);
      }

      &.active {
        background: #fca311;
        color: #000;
        font-weight: 600;
        box-shadow: 0 0 12px rgba(252, 163, 17, 0.4);
      }
    }
  }

  /* Content */
  .content {
    flex: 1;
    padding: 2.5rem;
    overflow-y: auto;

    h2 {
      color: #fca311;
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      letter-spacing: 0.5px;
    }

    /* Profile Section */
    .profile-page {
      .info-card {
        background: #1e293b;
        border-radius: 16px;
        padding: 1.5rem 2rem;
        border: 1px solid #2b394a;
        margin-bottom: 2rem;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);

        .rank {
          text-align: right;
          font-weight: bold;
          color: #fca311;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .info p {
          margin: 0.4rem 0;
          color: #e5e7eb;
          font-size: 0.95rem;
        }

        strong {
          color: #fca311;
        }
      }
    }

    /* Cashier Section */
    .cashier-page {
      .tabs {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;

        button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1e293b;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.8rem 1.6rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);

          svg {
            width: 20px;
            height: 20px;
          }

          &:hover {
            background: #334155;
            transform: translateY(-1px);
          }

          &.active {
            background: linear-gradient(to bottom, #fca311, #ffb83f);
            color: #000;
            font-weight: bold;
            box-shadow: 0 0 15px rgba(252, 163, 17, 0.4);
          }
        }
      }

      input {
        width: 60%;
        padding: 0.8rem;
        border-radius: 10px;
        border: none;
        outline: none;
        font-size: 1rem;
        text-align: center;
        margin-bottom: 1rem;
        background: #0f172a;
        color: #fff;
        box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.1);
        transition: 0.2s;

        &:focus {
          border: 1px solid #fca311;
          box-shadow: 0 0 6px rgba(252, 163, 17, 0.4);
        }
      }

      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: linear-gradient(to bottom, #fca311, #ffb83f);
        border: none;
        border-radius: 10px;
        padding: 0.8rem 1.5rem;
        font-weight: bold;
        color: #000;
        cursor: pointer;
        transition: 0.25s;
        font-size: 1rem;
        letter-spacing: 0.3px;

        &:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 0 15px rgba(252, 163, 17, 0.6);
        }
      }

      p {
        color: #e5e7eb;
        margin-bottom: 0.8rem;
        font-size: 0.95rem;
      }

      .deposit-section,
      .withdraw-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        background: #1e293b;
        padding: 2rem;
        border-radius: 12px;
        border: 1px solid #2b394a;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      }
    }
  }
  .info input {
    width: 80%;
    padding: 0.6rem;
    border-radius: 8px;
    border: none;
    background: #1e293b;
    color: white;
    margin-bottom: 0.8rem;
    font-size: 1rem;
    outline: none;
    transition: 0.25s;
  }

  .info input:focus {
    border: 1px solid #fca311;
    box-shadow: 0 0 6px rgba(252, 163, 17, 0.3);
  }

  .delete-btn {
    position: absolute;
    bottom: 1.5rem;
    right: 2rem;
    background: #dc2626;
    color: white;
    border: none;
    padding: 0.7rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    font-weight: bold;
    transition: 0.25s;
  }

  .delete-btn:hover {
    background: #b91c1c;
    box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
  }

  .edit-btn {
    margin-top: 1rem;
    background: linear-gradient(to bottom, #fca311, #ffb83f);
    color: black;
    border: none;
    border-radius: 10px;
    padding: 0.6rem 1.4rem;
    font-weight: 600;
    cursor: pointer;
    transition: 0.25s;
  }
  .edit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 10px rgba(252, 163, 17, 0.6);
  }

  .edit-buttons {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .save-btn {
    background: linear-gradient(to bottom, #16a34a, #4ade80);
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-weight: bold;
  }
  .save-btn:hover {
    box-shadow: 0 0 10px rgba(22, 163, 74, 0.6);
  }

  .cancel-btn {
    background: #dc2626;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    cursor: pointer;
    font-weight: bold;
  }
  .cancel-btn:hover {
    background: #b91c1c;
    box-shadow: 0 0 10px rgba(220, 38, 38, 0.6);
  }
`;
