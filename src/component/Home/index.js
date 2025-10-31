import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser } from '../../features/user/userSlice'

function Home({ className }) {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    "/images/1.png",
    "/images/2.png",
    "/images/3.png",
    "/images/4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length); //exp (0+1)%4=1
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handleGameClick = (path) => {
    const gameWindow = window.open(path, '_blank', 'width=1500,height=800');
    if (!gameWindow && user.isLoggedIn && user.isDataLoaded) {
      window.open(path, '_blank');
    }
  };

  return (
    <div id="home" className={className}>
      <Navbar />
      <div className="home-container">
        {/* <div className="sidebar">
          {menuItems.map((item) => (
            <Link key={item.id} to={item.path} className="menu-item">
              <item.icon className="icon" />
              <span className="label">{item.label}</span>
            </Link>
          ))}
        </div> */}

        <div className="content">
          <section className="banner">
            {banners.map((src, i) => (
              <img
                key={i}
                src={src}
                className={`banner-image ${i === currentBanner ? "active" : ""
                  }`}
              />
            ))}

            <div className="banner-dots">
              {banners.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === currentBanner ? "active" : ""}`}
                  onClick={() => setCurrentBanner(index)}
                />
              ))}
            </div>
          </section>

          <section className="games-section">
            <div className="section-header">
              <div>
                <img src="/images/slot.jpeg" className="section-icon" />
                <h2>สล็อตออนไลน์</h2>
              </div>

              <button onClick={() => handleGameClick('/games/slot')}>เล่นเกม</button>
            </div>

            <div className="games-grid">
              <div className="game-card large">
                <span className="game-title"></span>
              </div>
              <div className="game-cards-small">
                <div className="game-card small">
                  <span className="game-title"></span>
                </div>
                <div className="game-card small">
                  <span className="game-title"></span>
                </div>
              </div>
            </div>
          </section>

          <section className="games-section">
            <div className="section-header">
              <div>
                <img src="/images/card.jpeg" className="section-icon" />
                <h2>บาคาร่าออนไลน์</h2>
              </div>

              <button onClick={() => handleGameClick('/games/baccarat')}>เล่นเกม</button>
            </div>

            <div className="games-grid">
              <div className="game-card large">
                <span className="game-title"></span>
              </div>
              <div className="game-cards-small">
                <div className="game-card small"></div>
                <div className="game-card small"></div>
              </div>
            </div>
          </section>

          <section className="games-section">
            <div className="section-header">
              <div>
                <img src="/images/pngegg.png" className="section-icon" />
                <h2>พนันฟุตบอล</h2>
              </div>

              <button onClick={() => handleGameClick('/games/ballgame')}>เล่นเกม</button>
            </div>

            <div className="games-grid">
              <div className="game-card large">
                <span className="game-title"></span>
              </div>
              <div className="game-cards-small">
                <div className="game-card small"></div>
                <div className="game-card small"></div>
              </div>
            </div>
          </section>

          <section className="info-game">
            <h2 className="brand-title">Caroo888</h2>

            <p className="description">
              แพลตฟอร์มเกมเสี่ยงโชคสุดล้ำ ที่สร้างมาเพื่อความรวย
              สัมผัสประสบการณ์เกมแนวคาสิโน เช่น เกมเลือกไพ่ เสี่ยงดวงฟุตบอล
              และสุ่มโชคของผู้เล่นในรูปแบบเกมเสมือนจริง
            </p>

            <div className="info-section">
              <h3> Slot สาวถ้ำ</h3>
              <p>
                สัมผัสพลังแห่งโชคลาภจากดินแดนโบราณ!เพียงกดหมุน วงล้อขนาด 5x6
                จะสุ่มภาพทั้งหมดพร้อมกันหากภาพตรงกันในแนวตั้ง แนวนอน
                หรือแนวเฉียง จะได้รับรางวัลทันที!เมื่อชนะ
                สัญลักษณ์ที่แตกจะหล่นลงมาแทนที่
                สร้างโอกาสรับโบนัสซ้ำได้ไม่รู้จบ!เลือกช่วงราคาการหมุนได้ตามใจ
                แล้วลุ้นรับสมบัติล้ำค่าของสาวถ้ำไปพร้อมกัน!
              </p>
            </div>

            <div className="info-section">
              <h3>บาคาร่า</h3>
              <p>
                เกมไพ่สุดฮิตประจำโต๊ะ! เลือกระหว่าง Player (น้ำเงิน) หรือ Banker
                (แดง) เพื่อทายฝั่งที่แต้มสูงกว่า ยังมีให้เลือกเดิมพัน Player
                Pair / Banker Pair (ดำ) หรือ Pie (เขียว) เพิ่มความมันส์! เปิดไพ่
                2 ใบลุ้นแต้มสูงสุด 9 แต้ม ดูสถิติย้อนหลังได้ 7 ตา
                ช่วยประกอบการตัดสินใจในการลงเดิมพันรอบต่อไป ทายถูก
                รับเงินเต็มมือ ทำทุนกู้ซื้อรถให้ชายไอซ์ได้สบาย ๆ
              </p>
            </div>

            <div className="info-section">
              <h3>เกมเลือกไพ่เสี่ยงโชค</h3>
              <p>
                เลือกจากไพ่ 10 ใบ เปิดไปทีละใบเพื่อตามหารางวัลใหญ่! เลือกถูก
                รับเงินต่อไปเรื่อย ๆ เลือกพอเมื่อไหร่ กด “พอ”
                เพื่อรับรางวัลที่ได้มา แต่ต้องเลือกถูกอย่างน้อย 2
                ใบก่อนถึงจะได้เงินนะ! แต่ระวัง… ถ้าเปิดพลาดเมื่อไหร่
                แตกหมดทันที! 🔥 เกมเสี่ยงโชคสไตล์คาสิโนฝรั่ง สนุก ลุ้น
                ระทึกทุกคลิก!
              </p>
            </div>

            <div className="info-section">
              <h3>ทายผลบอลเสี่ยงโชค</h3>
              <p>
                เกมใหม่สายฟุตบอลสำหรับสายวัดดวง! ระบบจะสุ่มทีมจาก 16 ทีม มา 2
                ทีมให้คุณเลือกทายผล เลือกทีมที่คุณมั่นใจ
                แล้วลุ้นผลชนะจากโชคและค่าพลังทีม ยิ่งทีมคุณโชคดีเท่าไหร่
                โอกาสชนะก็ยิ่งสูง! ใครสายบอล ห้ามพลาด — เดิมพันมันส์
                ลุ้นผลไวเหมือนดูบอลจริง!
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default styled(Home)`
  width: 100%;
  height: auto;
  background-image: url('/images/bg_v2.png');
  /* background-size: cover; */
  /* background-position: center; */
  background-repeat: no-repeat;
  background-color: #222426;

  .home-container {
    font-family: "Italiana", serif;
    display: flex;
    max-width: 1000px;
    margin: 0 auto;

    /* .sidebar {
      width: 220px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      .menu-item {
        width: 180px;
        height: 64px;
        margin-top: 15px;
        background: #e89300;
        border: none;
        border-radius: 14px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding-left: 10px;
        gap: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #000000;
        text-decoration: none;

        &:hover {
          opacity: 0.8;
          transform: scale(1.05);
        }

        svg {
          color: #000000;
          fill: currentColor;
          stroke: currentColor;
          flex-shrink: 0;
          background: #e89300;
        }

        .label {
          font-size: 15px;
          color: #000000;
          font-weight: 500;
          background: #e89300;
        }
      }
    } */

    .content {
      flex: 1;
      /* padding-right: 2rem; */
      margin-top: 15px;

      .banner {
        position: relative;
        width: 100%;
        height: 370px;
        overflow: hidden;
        border-radius: 12px;
      }

      .banner-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        /* object-fit: cover; */
        opacity: 0;
        transition: opacity 1s ease;
      }

      .banner-image.active {
        opacity: 1;
      }

      .banner-dots {
        position: absolute;
        bottom: 15px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        background: none;
      }

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .dot.active {
        background: #fff;
        transform: scale(1.2);
      }

      .games-section {
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 1.5rem;
        background: black;

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;

          div {
            display: flex;
            align-items: center;
            gap: 1rem;

            .section-icon {
              width: 40px;
              height: 40px;
              border-radius: 8px;
            }

            .icon-badge {
              background: linear-gradient(to bottom, #e89300, #ffb83f);
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;

              svg {
                color: #000;
              }
            }

            h2 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #fff;
            }
          }

          button {
            text-decoration: none;
            background: #E89300;
            border: none;
            color: black;
            font-size: 1rem;
            cursor: pointer;
            padding: 0.4rem 1rem;
            border-radius: 0.2rem;
          }

          &:hover {
            button {
              background: #ffb83f;
              color: black;
            }
          }
        }

        .games-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;

          .game-card {
            background: #2b2b2b;
            border-radius: 12px;
            display: flex;
            align-items: flex-end;
            padding: 1rem;
            position: relative;
            overflow: hidden;
            aspect-ratio: 16/9;

            .game-title {
              font-size: 0.9rem;
              color: #fff;
              position: relative;
              z-index: 1;
            }
          }

          .game-cards-small {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
        }
      }

      .recommended-section {
        padding: 2rem 1.5rem;
        background: #000000;
        margin-top: 1.5rem;

        .section-title {
          text-align: center;
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #fff;
          background: #000000;
        }

        .featured-game {
          background: linear-gradient(to right, #e89300, #ffb83f);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;

          .game-preview {
            background: #e0e0e0;
            height: 180px;
            border-radius: 8px;
            margin-bottom: 0.75rem;
          }

          .game-subtitle {
            text-align: center;
            margin-top: 0.75rem;
            font-size: 2rem;
            color: #000;
            background: none;
          }
        }

        .recommended-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;

          .recommended-card {
            background: #2b2b2b;
            height: 70px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            color: #fff;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              background: #3a3a3a;
              transform: translateY(-2px);
            }
          }
        }
      }
      .info-game {
        padding: 2.5rem 1.5rem;

        .brand-title {
          font-family: "Keania One", cursive;
          font-size: 30px;
          letter-spacing: 2px;
          color: #ffb703;
          text-decoration: none;
        }

        .description {
          font-size: 20px;
          color: #999;
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .info-section {
          margin-bottom: 2rem;
          font-family: "Inter", serif;

          h3 {
            color: #ffb83f;
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          p {
            font-size: 20px;
            color: #999;
            line-height: 1.7;
          }
        }
      }
    }
  }
`;
