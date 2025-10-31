import React, { useState } from "react";
import styled from "styled-components";

function Promotion({ className, onClose }) {
  const images = [
    "/promotions/1.png",
    "/promotions/2.png",
    "/promotions/3.png",
    "/promotions/4.png",
  ];

  const icons = {
    left: (
      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path fill="currentColor" d="m15.5 3.87l-1.37-1.37L5.63 12l8.5 9.5l1.37-1.37L8.37 12z" />
      </svg>
    ),
    right: (
      <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
        <path fill="currentColor" d="m8.5 20.13l1.37 1.37L18.37 12l-8.5-9.5l-1.37 1.37L15.63 12z" />
      </svg>
    ),
    cross: (
      <svg xmlns="http://www.w3.org/2000/svg" width={22} height={22} viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth={2}
          d="M18 6L6 18M6 6l12 12"
        />
      </svg>
    ),
  };

  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className={className}>
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          {icons.cross}
        </button>

        <h2>โปรโมชั่นพิเศษ</h2>

        <div className="slider">
          <button className="nav-btn left" onClick={prevSlide}>
            {icons.left}
          </button>

          <div className="slide">
            <img src={images[current]} alt={`Promotion ${current + 1}`} key={current} />
          </div>

          <button className="nav-btn right" onClick={nextSlide}>
            {icons.right}
          </button>
        </div>
      </div>
    </div>
  );
}

export default styled(Promotion)`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
  backdrop-filter: blur(2px);

  .popup {
    position: relative;
    width: 450px;
    height: 500px;
    background: linear-gradient(160deg, #0f172a 0%, #1a1f3b 100%);
    color: #fff;
    border-radius: 18px;
    padding: 1.5rem;
    animation: fadeIn 0.3s ease;
    text-align: center;
    overflow: hidden;
    border: 1px solid rgba(252, 163, 17, 0.25);
  }

  @keyframes fadeIn {
    from {
      transform: scale(0.9);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  h2 {
    color: #fca311;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    letter-spacing: 0.5px;
    text-shadow: 0 0 10px rgba(252, 163, 17, 0.3);
  }

  .close-btn {
    position: absolute;
    top: 0.6rem;
    right: 1rem;
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    transition: 0.25s;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 22px;
      height: 22px;
    }

    &:hover {
      color: #fca311;
      transform: rotate(90deg) scale(1.1);
      filter: drop-shadow(0 0 4px #fca311);
    }
  }

  .slider {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 340px;
    margin-top: 0.5rem;

    .slide {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      animation: fadeSlide 0.6s ease;

      @keyframes fadeSlide {
        from {
          opacity: 0;
          transform: scale(0.97);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        transition: transform 0.3s ease;
      }
    }

    .nav-btn {
      width: 48px;
      height: 48px;

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: #fca311;
        color: #000;
        box-shadow: 0 0 8px rgba(252, 163, 17, 0.4);
      }

      &.left {
        left: 0.5rem;
      }
      &.right {
        right: 0.5rem;
      }
    }
  }
`;
