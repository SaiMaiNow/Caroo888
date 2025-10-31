import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../features/user/userSlice'

function Navbar({ className }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  return (
    <header className={className}>
      <div className="left">
        <Link to="/" className="brand">
          Caroo888
        </Link>
        <div className="tagline">
          <svg className="gem-icon" xmlns="http://www.w3.org/2000/svg" width="1.13em" height="1em" viewBox="0 0 576 512"><path fill="currentColor" d="M464 0H112c-4 0-7.8 2-10 5.4L2 152.6c-2.9 4.4-2.6 10.2.7 14.2l276 340.8c4.8 5.9 13.8 5.9 18.6 0l276-340.8c3.3-4.1 3.6-9.8.7-14.2L474.1 5.4C471.8 2 468.1 0 464 0m-19.3 48l63.3 96h-68.4l-51.7-96zm-202.1 0h90.7l51.7 96H191zm-111.3 0h56.8l-51.7 96H68zm-43 144h51.4L208 352zm102.9 0h193.6L288 435.3zM368 352l68.2-160h51.4z"></path></svg>
          <span>เล่นง่าย ได้จริง</span>
        </div>
      </div>

      <nav className="menu">
        <Link to="/">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></g></svg>
          หน้าแรก
        </Link>
        <Link to="/deposit">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="currentColor" d="M12 2.25a.75.75 0 0 1 .75.75v1.25H17a.75.75 0 0 1 0 1.5h-4.25v5.5h1.75a4.25 4.25 0 0 1 0 8.5h-1.75V21a.75.75 0 0 1-1.5 0v-1.25H6a.75.75 0 0 1 0-1.5h5.25v-5.5H9.5a4.25 4.25 0 0 1 0-8.5h1.75V3a.75.75 0 0 1 .75-.75m-.75 3.5H9.5a2.75 2.75 0 0 0 0 5.5h1.75zm1.5 7v5.5h1.75a2.75 2.75 0 1 0 0-5.5z"></path></svg>
          ฝาก ถอน
        </Link>
        <Link to="/promotion">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12v9.4a.6.6 0 0 1-.6.6H4.6a.6.6 0 0 1-.6-.6V12m17.4-5H2.6a.6.6 0 0 0-.6.6v3.8a.6.6 0 0 0 .6.6h18.8a.6.6 0 0 0 .6-.6V7.6a.6.6 0 0 0-.6-.6M12 22V7m0 0H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7m0 0h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7"></path></svg>
          โปรโมชั่น
        </Link>
        <Link to="/contact">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" width={30} height={30} viewBox="0 0 24 24"><path fill="#ffb83f" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V6h16zM4 0h16v2H4m0 20h16v2H4m8-12a2.5 2.5 0 0 0 0-5a2.5 2.5 0 0 0 0 5m0-3.5c.55 0 1 .45 1 1s-.45 1-1 1s-1-.45-1-1s.45-1 1-1m5 7.5c0-2.1-3.31-3-5-3s-5 .9-5 3v1h10zm-8.19-.5c.61-.5 2.03-1 3.19-1c1.17 0 2.59.5 3.2 1z"></path></svg>
          ติดต่อเรา
        </Link>
      </nav>

      <div className="actions">
        {user && user?.isLoggedIn && user?.isDataLoaded ? (
          <div className="user-info">
            <p>{user.balance}THB</p>
            <button>ฝาก</button>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M4 22a8 8 0 1 1 16 0zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6" /></svg>
            </div>
          </div>
        ) : (
          <>
            <Link to="/auth/register" className="btn register">
              สมัครสมาชิก
            </Link>
            <Link to="/auth/login" className="btn login">
              เข้าสู่ระบบ
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default styled(Navbar)`
  font-family: "Italiana", serif;
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  margin-bottom: 20px;
  /* border-bottom: 2px solid #E89300; */
  box-shadow: 0 0 20px 2px rgba(232, 147, 0, 0.8);

  .left {
    display: flex;
    align-items: center;
    gap: 3rem;
    .brand {
      font-family: "Keania One", cursive;
      font-size: 1.8rem;
      letter-spacing: 2px;
      color: #ffb703;
      text-shadow: 0 0 6px rgba(255, 183, 3, 0.8),
        0 0 15px rgba(255, 183, 3, 0.5);
      text-decoration: none;
    }
    .tagline {
      font-size: 0.9rem;
      color: #ffffff;

      .gem-icon {
        margin-right: 20px;
      }
    }
  }

  .menu {
    display: flex;
    gap: 5rem;

    /* Link เป็น React component ที่สุดท้ายแปลงเป็น <a> tag */
    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-right: 5px;

      .icon {
        // font-size: 50px;
        margin-bottom: 5px;
        color: #ffb83f;
      }

      &:hover {
        color: #ffb703;
        transform: scale(1.05);
      }
    }
  }

  .actions {
    display: flex;
    gap: 1.5rem;

    .btn {
      border: none;
      // padding: 7px 30px;
      height: 40px;
      width: 150px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      &.login {
        color: #000;
        background: linear-gradient(
          to bottom,
          #e89300,
          #ffb83f
        ); //ไล่สีจากบนลงล่าง
      }

      &.register {
        background: #2b2b2b;
        color: #fff;
      }

      &:hover {
        transform: translateY(-1px);
        opacity: 0.9; //ทึบแสงขึ้น
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: white;
      font-size: 1.2rem;

      button {
        background: #E89300;
        border: none;
        color: black;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.4rem 1rem;
        border-radius: 0.5rem;
      }

      div {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid white;
        color: white;
        font-size: 1rem;
        padding: 0.4rem 0.6rem;
        border-radius: 0.5rem;
      }
    }
  }
`;
