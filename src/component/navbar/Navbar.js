import styled from "styled-components";
import { Link } from "react-router-dom";

function Navbar({ className }) {
  return (
    <header className={className}>
      <div className="left">
        <Link to="/" className="brand">
          Caroo888
        </Link>
        <div className="tagline">
          <iconify-icon
            icon="mdi:diamond-stone"
            className="gem-icon"
          ></iconify-icon>
          <span>เล่นง่าย ได้จริง</span>
        </div>
      </div>

      <nav className="menu">
        <Link to="/">
          <iconify-icon icon="mdi:home" className="icon"></iconify-icon>
          หน้าแรก
        </Link>
        <Link to="/deposit">
          <iconify-icon icon="mdi:cash-multiple" className="icon"></iconify-icon>
          ฝาก ถอน
        </Link>
        <Link to="/promotion">
          <iconify-icon icon="mdi:gift" className="icon"></iconify-icon>
          โปรโมชั่น
        </Link>
        <Link to="/contact">
          <iconify-icon icon="mdi:account-box" className="icon"></iconify-icon>
          ติดต่อเรา
        </Link>
      </nav>

      <div className="actions">
        <button className="btn register">สมัครสมาชิก</button>
        <button className="btn login">เข้าสู่ระบบ</button>
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
      text-shadow: 0 0 6px rgba(255, 183, 3, 0.8), 0 0 15px rgba(255, 183, 3, 0.5);
      text-decoration: none;
    }
    .tagline {
      font-size: 0.9rem;
      color: #FFFFFF;

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
        font-size: 30px;
        margin-bottom: 5px;
        color: #FFB83F;
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

      &.login {
        color: #000;
        background: linear-gradient(to bottom, #E89300, #FFB83F); //ไล่สีจากบนลงล่าง
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
  }
`;
