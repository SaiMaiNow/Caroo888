import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";

function Home({ className }) {
  // const menuItems = [
  //   {
  //     id: 1,
  //     icon: () => (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width={50}
  //         height={50}
  //         viewBox="0 0 32 32"
  //       >
  //         <g>
  //           <path d="M5.276 14.64c0-.358.292-.614.62-.614H8.5a.473.473 0 0 1 .42.693l-1.563 3a.473.473 0 1 1-.84-.438l1.202-2.307H6.224v.118a.474.474 0 0 1-.947 0zm7.62-.613a.613.613 0 0 0-.62.614v.451a.474.474 0 0 0 .947 0v-.119h1.496l-1.201 2.308a.473.473 0 1 0 .84.438l1.562-3a.473.473 0 0 0-.42-.692zm6.381.613c0-.358.29-.614.619-.614H22.5a.473.473 0 0 1 .42.693l-1.563 3a.473.473 0 1 1-.84-.438l1.203-2.307h-1.496v.118a.474.474 0 0 1-.948 0zM6 24.554c0-.302.257-.554.566-.554h14.868c.309 0 .566.252.566.554v.766C22 26.8 20.775 28 19.261 28H8.74C7.225 28 6 26.801 6 25.32z"></path>
  //           <path d="M1 7.332C1 5.392 2.712 4 4.584 4h18.842C25.303 4 27 5.396 27 7.332V13h2V7.915a1.5 1.5 0 1 1 1 0V13h.355c.362 0 .645.252.645.573v3.854c0 .311-.283.573-.645.573H27v10.462C26.984 29.815 25.917 31 24.5 31h-21C2.099 31 1 29.838 1 28.45zM4.584 6C3.614 6 3 6.69 3 7.332V10.5h22V7.332C25 6.684 24.391 6 23.426 6zM25 11.5h-2.75v.01c0 .684-.56 1.24-1.25 1.24s-1.25-.556-1.25-1.24v-.01h-4.5v.01c0 .684-.56 1.24-1.25 1.24s-1.25-.556-1.25-1.24v-.01h-4.5v.01c0 .684-.56 1.24-1.25 1.24s-1.25-.556-1.25-1.24v-.01H3v9h2.75v-.01c0-.684.56-1.24 1.25-1.24s1.25.556 1.25 1.24v.01h4.5v-.01c0-.684.56-1.24 1.25-1.24s1.25.556 1.25 1.24v.01h4.5v-.01c0-.684.56-1.24 1.25-1.24s1.25.556 1.25 1.24v.01H25zm-22 10v6.95c0 .336.254.55.5.55h21c.23 0 .494-.21.5-.557V21.5z"></path>
  //         </g>
  //       </svg>
  //     ),
  //     label: "สล็อต",
  //     path: "/slots",
  //   },
  //   {
  //     id: 2,
  //     icon: () => (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width={50}
  //         height={50}
  //         viewBox="0 0 24 24"
  //       >
  //         <g fill="none" stroke="currentColor" strokeWidth={1.5}>
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M15.93 9.1a1.9 1.9 0 0 0-2.751 0L12 10.314L10.821 9.1a1.9 1.9 0 0 0-2.751 0a2.06 2.06 0 0 0 0 2.845l3.511 3.631a.58.58 0 0 0 .838 0l3.511-3.636a2.06 2.06 0 0 0 0-2.84"
  //           ></path>
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M20 .75H4a1 1 0 0 0-1 1v20.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V1.75a1 1 0 0 0-1-1"
  //           ></path>
  //           <path d="M6 4.125a.375.375 0 1 1 0-.75m0 .75a.375.375 0 1 0 0-.75m12 17.25a.375.375 0 0 1 0-.75m0 .75a.375.375 0 0 0 0-.75"></path>
  //         </g>
  //       </svg>
  //     ),
  //     label: "บาคาร่า",
  //     path: "/baccarat",
  //   },
  //   {
  //     id: 3,
  //     icon: () => (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width={50}
  //         height={50}
  //         viewBox="0 0 24 24"
  //       >
  //         <g fill="none" stroke="currentColor" strokeWidth={1.5}>
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M15.93 9.1a1.9 1.9 0 0 0-2.751 0L12 10.314L10.821 9.1a1.9 1.9 0 0 0-2.751 0a2.06 2.06 0 0 0 0 2.845l3.511 3.631a.58.58 0 0 0 .838 0l3.511-3.636a2.06 2.06 0 0 0 0-2.84"
  //           ></path>
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             d="M20 .75H4a1 1 0 0 0-1 1v20.5a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V1.75a1 1 0 0 0-1-1"
  //           ></path>
  //           <path d="M6 4.125a.375.375 0 1 1 0-.75m0 .75a.375.375 0 1 0 0-.75m12 17.25a.375.375 0 0 1 0-.75m0 .75a.375.375 0 0 0 0-.75"></path>
  //         </g>
  //       </svg>
  //     ),
  //     label: "ไพ่สิบโชค",
  //     path: "/ten-card",
  //   },
  //   {
  //     id: 4,
  //     icon: () => (
  //       <svg
  //         xmlns="http://www.w3.org/2000/svg"
  //         width={50}
  //         height={50}
  //         viewBox="0 0 24 24"
  //       >
  //         <path
  //           fill="currentColor"
  //           fillRule="evenodd"
  //           d="m2.782 11.225l.396-.262c.594-.393.987-.654 1.265-.887c.264-.221.364-.369.416-.507s.076-.315.025-.656c-.054-.36-.175-.815-.359-1.504l-.167-.625a9.2 9.2 0 0 0-1.576 4.44m2.75-5.84l.024.074l.429 1.602c.17.638.315 1.177.382 1.631c.035.233.053.46.042.687l2.5 1.053a2 2 0 0 1 .18-.16l1.838-1.404q.148-.113.312-.19v-2.71a3.5 3.5 0 0 1-.608-.284c-.398-.229-.847-.56-1.377-.952L7.876 3.715a9.3 9.3 0 0 0-2.344 1.67m4.007-2.306l.572.422c.573.423.953.702 1.268.883c.298.171.47.214.618.216c.147.001.32-.038.622-.203c.318-.174.704-.445 1.286-.855l.622-.438a9.2 9.2 0 0 0-2.538-.354a9.2 9.2 0 0 0-2.45.329m6.646.678a1 1 0 0 1-.095.08l-1.354.954c-.54.38-.995.702-1.397.922c-.197.108-.396.2-.6.267v2.697q.163.078.311.191l1.837 1.405q.099.075.184.162l2.56-1.06c-.01-.225.008-.451.043-.683c.067-.454.212-.993.382-1.63l.429-1.602l.008-.029a9.3 9.3 0 0 0-2.308-1.674m3.48 3.095l-.149.557c-.184.689-.305 1.145-.359 1.504c-.05.34-.027.518.025.656s.152.286.416.507c.278.233.67.494 1.265.887l.328.217a9.2 9.2 0 0 0-1.526-4.328m3.055 5.55q.007-.2.007-.402c0-5.936-4.807-10.75-10.738-10.75C6.057 1.25 1.25 6.064 1.25 12s4.807 10.75 10.739 10.75c5.625 0 10.238-4.33 10.7-9.84a.75.75 0 0 0 .03-.508m-1.543.567L20 12.19c-.55-.363-1.016-.67-1.367-.966a3.6 3.6 0 0 1-.458-.452l-2.613 1.082a2 2 0 0 1-.067.324l-.721 2.337q-.038.123-.092.236l1.468 1.698c.225-.075.46-.12.704-.148c.456-.052 1.014-.052 1.673-.052h1.668a9.2 9.2 0 0 0 .98-3.281m-1.951 4.781h-.656c-.713 0-1.184.001-1.544.042c-.341.04-.506.107-.625.194c-.12.086-.237.22-.382.533c-.153.33-.303.777-.528 1.453l-.226.68a9.26 9.26 0 0 0 3.96-2.902m-5.7 3.372l.555-1.663c.208-.627.385-1.156.578-1.572q.129-.281.295-.528l-1.434-1.66q-.202.051-.416.051h-2.23q-.2 0-.388-.043L9.21 17.332q.178.257.313.555c.194.416.37.945.579 1.572l.565 1.697a9.3 9.3 0 0 0 2.86-.034m-4.58-.385l-.254-.765c-.226-.676-.376-1.124-.529-1.453c-.145-.312-.262-.447-.381-.533c-.12-.087-.284-.155-.625-.194c-.36-.04-.832-.042-1.544-.042H4.75a9.26 9.26 0 0 0 4.195 2.987m-5.15-4.46a.8.8 0 0 1 .202-.027h1.656c.66 0 1.217 0 1.673.052c.235.027.46.069.676.139l1.304-1.662a2 2 0 0 1-.105-.263l-.721-2.337a2 2 0 0 1-.068-.328l-2.55-1.075a3.6 3.6 0 0 1-.456.45c-.352.294-.817.601-1.367.965l-1.236.817c.127 1.17.47 2.273.991 3.27m8.192-6.269a.25.25 0 0 0-.15.052L10 11.464a.25.25 0 0 0-.087.273l.722 2.337a.25.25 0 0 0 .237.176h2.23a.25.25 0 0 0 .238-.176l.722-2.337a.25.25 0 0 0-.087-.273l-1.837-1.405a.25.25 0 0 0-.15-.05"
  //           clipRule="evenodd"
  //         ></path>
  //       </svg>
  //     ),
  //     label: "ฟุตบอล",
  //     path: "/football",
  //   },
  // ];

  const [currentBanner, setCurrentBanner] = useState(0);

  const banners = [
    "/images/1.png",
    "/images/2.jpg",
    "/images/3.webp",
    "/images/4.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length); //exp (0+1)%4=1
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={className}>
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

              <Link to="/games/slot">เล่นเกม</Link>
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

              <Link to="/games/baccarat">เล่นเกม</Link>
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

              <Link to="/games/ballgame">เล่นเกม</Link>
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

          a {
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
            a {
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
