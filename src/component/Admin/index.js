import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { fetchUser } from '../../features/user/userSlice'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

function Admin({ className }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)


  const [users, setUsers] = useState([]);

  console.log(user)
  console.log(user.role)
  

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (!user.isLoggedIn && user.isDataLoaded) {
      navigate('/')
    }
  }, [user.isLoggedIn, user.isDataLoaded, navigate])

  useEffect(() => {
    if (user.role !== "admin" && user.isDataLoaded) {
      navigate('/')
    }
  }, [user.role, user.isDataLoaded, navigate])

  useEffect(() => {
    if (user && user.isDataLoaded) {
      setUsers([user])
      console.log(users)
    }
  }, [user, user.isDataLoaded])


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
          {users.map((value) => (
            <tr key={value.id}>
              <td>{value.id}</td>
              <td>{value.firstname} {value.lastname}</td>
              <td>{value.balance}</td>
              <td>{value.lucknumber}</td>

              <td>
                <Link
                  to={`/admin/user/${value.id}`}
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
