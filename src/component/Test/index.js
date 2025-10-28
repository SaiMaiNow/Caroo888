import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, played } from '../../features/user/userSlice'

import axios from 'axios'

const Test = () => {
  const dispatch = useDispatch();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector((state) => state.user);

  const handleLogin = () => {
    dispatch(login({phoneNumber: phoneNumber, password: password}))
  }

  const handlePlayed = () => {
    dispatch(played())
  }

  const handleGetInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:4567/api/v1/users/info`, {withCredentials: true})
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
        <h1>Login</h1>
        <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>

        {user && user?.loading && <p>Loading...</p>}

        {user && user?.error && <p>{user.error}</p>}

        {user && user?.isLoggedIn && 
            <p>Login successful, welcome {user.firstname} {user.lastname} <br />
                Phone Number: {user.phoneNumber} <br />
                Role: {user.role} <br />
                Balance: {user.balance} <br />
                Turn: {user.turn} <br />
                Lucknumber: {user.lucknumber} <br />
                Gamelock: {user.gamelock} <br />
                Code: {user.code} <br />
            </p>
        }

        {user && user?.isLoggedIn && <button onClick={handlePlayed}>Play</button>}

        {user && user?.isLoggedIn && <p><button onClick={handleGetInfo}>Get info</button></p>}
    </div>
  )
}

export default Test;