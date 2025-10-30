import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

function Admin({ className }) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Mock users
  const users = Array.from({ length: 35 }).map((_, i) => ({
    id: i + 1,
    name: `player_${(i + 1).toString().padStart(3, "0")}`,
    balance: 100,
    rate: ["60%", "70%", "80%", "90%", "100%"][Math.floor(Math.random() * 5)],
  }));

  // Pagination
  const totalPages = Math.ceil(users.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = users.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className={className}>
      <h1 className="page-title">Admin</h1>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>ชื่อผู้เล่น</th>
            <th>ยอดเงิน (฿)</th>
            <th>เรทแตก</th>
            <th>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.balance.toLocaleString()}</td>
              <td>{user.rate}</td>
              <td>

                <Link
                  to={`/admin/user/${user.id}`}
                  state={{ user }}
                  className="manage-btn"
                >
                  จัดการ
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          ◀ ก่อนหน้า
        </button>

        <span>
          หน้า {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          ถัดไป ▶
        </button>
      </div>
    </div>
  );
}

export default styled(Admin)`
  font-family: "Italiana", serif;
  background: #1a1a1a;
  color: white;
  min-height: 100vh;
  padding: 2rem;

  .page-title {
    font-family: "Keania One", cursive;
    font-size: 2rem;
    letter-spacing: 2px;
    color: #ffb83f;
    margin-bottom: 2rem;
  }

  .user-table {
    width: 100%;
    border-collapse: collapse;
    background: #2b2b2b;
    border-radius: 12px;
    overflow: hidden;

    th,
    td {
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid #3a3a3a;
    }

    th {
      background: #e89300;
      color: black;
      font-weight: bold;
    }

    tr:hover {
      background: #3a3a3a;
    }

    .manage-btn {
      background: linear-gradient(to bottom, #e89300, #ffb83f);
      border-radius: 6px;
      padding: 0.4rem 0.8rem;
      text-decoration: none;
      color: black;
      font-weight: 600;
      transition: 0.2s;
      &:hover {
        opacity: 0.9;
      }
    }
  }

  .pagination {
    margin-top: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    background: none;

    button {
      background: #e89300;
      border: none;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-weight: 600;
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }
`;
