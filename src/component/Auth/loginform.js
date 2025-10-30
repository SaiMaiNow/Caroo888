import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { useDispatch, useSelector } from 'react-redux'
import { login, fetchUser } from '../../features/user/userSlice'

const LoginForm = ({ className }) => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector((state) => state.user)

  const handleLogin = (e) => {
    e.preventDefault()
    if (phoneNumber.length === 0 || password.length === 0) {
      setError("กรุณาระบุหมายเลขโทรศัพท์และรหัสผ่าน")
      return
    }
    
    dispatch(login({phoneNumber: phoneNumber, password: password}))
  }

  useEffect(() => {
    if (!user.isLoggedIn) {
      console.log('fetching user')
      dispatch(fetchUser())
    }
  }, [user.isLoggedIn])

  useEffect(() => {
    if (user.isLoggedIn) {
      navigate('/')
    }
  }, [user.isLoggedIn, navigate])

  useEffect(() => {
    if (user.error) {
      setError(user.error)
      console.error(user.error)
    }
  }, [user.error])

  return (
    <div className={className}>
      <div className="phoneNumber">
        <label htmlFor="phoneNumber">หมายเลขโทรศัพท์</label>
        <div>
          <select type="select" name="countryCode" id="countryCode">
            <option value="+66">+66</option>
            <option value="+65">+65</option>
            <option value="+60">+60</option>
            <option value="+63">+63</option>
            <option value="+62">+62</option>
            <option value="+61">+61</option>
          </select>
          <input type="text" name="phoneNumber" className={`${error && phoneNumber.length === 0 ? 'error' : ''}`} id="phoneNumber" placeholder="ระบุหมายเลขโทรศัพท์" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
      </div>
      <div className="password">
        <label htmlFor="password">รหัสผ่าน</label>
        <div>
          <input type={showPassword ? 'text' : 'password'} name="password" className={`${error && password.length === 0 ? 'error' : ''}`} id="password" placeholder="ระบุรหัสผ่าน" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button">
            ลืมรหัสผ่าน?
          </button>
        </div>
      </div>
      <div className="showPassword">
        <input type="checkbox" name="showPassword" id="showPassword" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
        <label htmlFor="showPassword">เเสดงรหัสผ่าน</label>
      </div>
      <div className="register">
        {error && <p className="error">{error}</p>}
        <p>ยังไม่มีบัญชีใช่ไหม? <Link to="/auth/register">สมัครสมาชิก</Link></p>
        <button type="button" onClick={handleLogin}>เข้าสู่ระบบ</button>
      </div>
    </div>
  )
}

LoginForm.propTypes = {
  className: PropTypes.string.isRequired
}

export default styled(LoginForm)`
  background: #ffff;
  padding: 20px 35px;
  border-radius: 1rem;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  label {
    font-size: 1rem;
    font-weight: 600;
    color: rgb(114, 114, 114);
  }

  input {
    width: 100%;
    padding: 0.5rem;
    background-color: #141414;
    border-radius: 0.4rem;
    border: 1px solid #2a2a2a;
    color: #ffffff;
    caret-color: #ffb703;
    outline: 1px solid transparent;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  input::placeholder { color: #9aa0a6; }
  input:focus { border-color: #ffb703; box-shadow: 0 0 0 3px rgba(255, 183, 3, 0.15); }

  select {
    background-color: #141414;
    color: #ffffff;
    border: 1px solid #2a2a2a;
    border-radius: 0.4rem;
    padding: 0.5rem 0.75rem;
    appearance: none;
  }

  .phoneNumber > div { 
    display: flex; 
    align-items: center; 
    gap: 0.6rem; 
  }

  .phoneNumber, .password {
    width: 400px;
  }

  .password > div { 
    display: flex; 
    align-items: center; 
    gap: 0.6rem; 
  }

  .password input {
    width: 80%;
    border-radius: 0.4rem 0 0 0.4rem !important;
  }

  .password button {
    width: 20%;
    background: transparent;
    color: rgb(114, 114, 114);
    border: none;
    cursor: pointer;
    padding: 0.5rem 0rem;
    background-color: #141414;
    border-radius: 0 0.4rem 0.4rem 0;
  }

  .password button:hover { text-decoration: underline; }

  .showPassword { 
    width: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 0.5rem; 
    
    label {
      width: 90%;
      font-size: 0.9rem;
      font-weight: 400;
      color: rgb(114, 114, 114);
    }

    input {
      width: 5%;
    }
  }

  .error {
    background-color: #ff4d4f;
  }

  .register { width: 100%; display: flex; flex-direction: column; gap: 0.6rem; }
  .register p { margin: 0; color: #555; }
  .register a { color: #3b82f6; text-decoration: none; }
  .register a:hover { text-decoration: underline; }
  .register button {
    margin-top: 0.25rem;
    background: linear-gradient(90deg, #ffb703, #ffa31a);
    color: #141414;
    border: none;
    border-radius: 0.5rem;
    padding: 0.7rem 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.08s ease, filter 0.15s ease;
  }
  .register button:hover { filter: brightness(1.05); }
  .register button:active { transform: translateY(1px); }
  .register button[disabled] { opacity: 0.7; cursor: not-allowed; }
`