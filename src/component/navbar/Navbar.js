import styled from "styled-components";
import { Link } from "react-router-dom";
import { Home, DollarSign, Gift, Contact, Gem } from "lucide-react";

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
            class="gem-icon"
          ></iconify-icon>
          <span>เล่นง่าย ได้จริง</span>
        </div>
      </div>

      <nav className="menu">
        <Link to="/">
          <iconify-icon icon="mdi:home" class="icon"></iconify-icon>
          หน้าแรก
        </Link>
        <Link to="/deposit">
          <iconify-icon icon="mdi:cash-multiple" class="icon"></iconify-icon>
          ฝาก ถอน
        </Link>
        <Link to="/promotion">
          <iconify-icon icon="mdi:gift" class="icon"></iconify-icon>
          โปรโมชั่น
        </Link>
        <Link to="/contact">
          <iconify-icon icon="mdi:account-box" class="icon"></iconify-icon>
          ติดต่อเรา
        </Link>
      </nav>

      <div className="actions">
        <button className="btn secondary">สมัครสมาชิก</button>
        <button className="btn primary">เข้าสู่ระบบ</button>
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
  background-color: #0b0b0b;
  color: #df9412;
  padding: 0 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid #2b2b2b;

  .left {
    display: flex;
    align-items: center;
    gap: 3rem;
    .brand {
      font-family: "Keania One", cursive;
      font-size: 1.8rem;
      font-weight: 700;
      letter-spacing: 2px;
      color: #ffb703;
      text-shadow: 0 0 6px rgba(255, 183, 3, 0.8), 0 0 15px rgba(255, 183, 3, 0.5);
    }
    .tagline {
      font-size: 0.9rem;
      color: #ddd;

      .gem-icon {
        margin-right: 20px;
      }
    }
  }

  .menu {
    display: flex;
    gap: 5rem;

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      magin-right: 5px;

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
      padding: 7px 30px;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.2s;

      &.primary {
        color: #000;
        background: linear-gradient(to bottom, #E89300, #FFB83F); //ไล่สีจากบนลงล่าง
      }

      &.secondary {
        background: #2b2b2b;
        color: #fff;
      }

      &:hover {
        transform: translateY(-1px);
        opacity: 0.9;
      }
    }
  }
`;
