import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { fetchUser } from '../../features/user/userSlice'

import LoginForm from './loginform'
import RegisterFrom from './registerfrom'

const Auth = ({ className }) => {
  const { type } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    if (type !== 'login' && type !== 'register') {
      navigate('/')
    }
  }, [type, navigate])

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  useEffect(() => {
    if (user.isLoggedIn && user.isDataLoaded) {
      navigate('/')
    }
  }, [user.isLoggedIn, user.isDataLoaded, navigate])

  return (
    <div className={className}>
      <div className="container">
        <div className="left">
          <Link to="/" className="brand">
            Caroo888
          </Link>

          <p>{type === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</p>
          <p>{type === 'login' ? 'บัญชีของคุณ' : 'ได้เลยตอนนี้'}</p>
          <p>{type === 'login' ? 'เล่นง่าย ได้จริง รวยไว!' : 'สมัครง่าย รวดเร็ว ภายใน 1 นาที!'}</p>
        </div>
        <div className="right"> 
          {type === 'login' && <LoginForm />}
          {type === 'register' && <RegisterFrom />}
        </div>
      </div>
    </div>
  )
}

Auth.propTypes = {
  className: PropTypes.string.isRequired
};

export default styled(Auth)`
  font-family: "Kanit", sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 7rem 15rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.05;
    z-index: 0;
    pointer-events: none;
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 2rem;
    position: relative;
    z-index: 1;
    background-color: transparent;
    
    .left {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: flex-start;
      height: 100%;

      p {
        color: #fff;
        font-size: 2rem;
      }

      p:last-child {
        color: rgb(142, 142, 142);
      }

      .brand {
        font-family: "Keania One", cursive;
        font-size: 3rem;
        letter-spacing: 2px;
        color: #ffb703;
        text-shadow: 0 0 6px rgba(255, 183, 3, 0.8),
          0 0 15px rgba(255, 183, 3, 0.5);
        text-decoration: none;
        margin-bottom: 7rem;
      }
    }
  }
`