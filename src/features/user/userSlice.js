import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4567/api/v1';

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await axios.get(`${API_URL}/users/info`, { withCredentials: true });
    return response.data;
});

export const login = createAsyncThunk('user/login', async (Data) => {
    const response = await axios.post(`${API_URL}/auth/login`, {phoneNumber: Data.phoneNumber, password: Data.password}, { withCredentials: true })
    return response.data;
});

export const register = createAsyncThunk('user/register', async (Data) => {
    const response = await axios.post(`${API_URL}/auth/register`, {firstname: Data.firstname, lastname: Data.lastname, phoneNumber: Data.phoneNumber, password: Data.password, agentCode: Data.agentCode}, { withCredentials: true });
    return response.data;
})

export const logout = createAsyncThunk('user/logout', async () => {
    const response = await axios.post(`${API_URL}/auth/logout`, {withCredentials: true});
    return response.data;
});

export const addBalance = createAsyncThunk('user/addBalance', async (Data) => {
    const response = await axios.post(`${API_URL}/users/addBalance`, {amount: Data.amount}, { withCredentials: true })
    return response.data
});

export const subtractBalance = createAsyncThunk('user/subtractBalance', async (Data) => {
    const response = await axios.post(`${API_URL}/users/subtractBalance`, {amount: Data.amount}, { withCredentials: true });
    return response.data;
});

export const withdraw = createAsyncThunk('user/withdraw', async (Data) => {
    const response = await axios.post(`${API_URL}/users/withdraw`, {amount: Data.amount}, { withCredentials: true })
    return response.data;
});

export const deposit = createAsyncThunk('user/deposit', async (Data) => {
    const response = await axios.post(`${API_URL}/users/deposit`, {amount: Data.amount, promotionCode: Data.promotionCode}, { withCredentials: true });
    return response.data;
});

export const played = createAsyncThunk('user/played', async () => {
    const response = await axios.post(`${API_URL}/luck/played`, {withCredentials: true});
    return response.data;
});

const initialState = {
    id: null,
    role: null,
    firstname: null,
    lastname: null,
    phoneNumber: null,
    balance: null,
    turn: null,
    lucknumber: null,
    gamelock: [],
    code: null,
    isLoggedIn: false,
    loading: false,
    error: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder.addMatcher((action) => action.type.endsWith('/pending'), (state, action) => {
            state.loading = true
            state.error = null
        })
        builder.addMatcher((action) => action.type.endsWith('/fulfilled'), (state, action) => {
            state.loading = false
            state.error = null

            if (action.type.includes('fetchUser')) {
                state.id = action.payload.id
                state.role = action.payload.role
                state.firstname = action.payload.firstname
                state.lastname = action.payload.lastname
                state.phoneNumber = action.payload.phoneNumber
                state.balance = action.payload.balance
                state.turn = action.payload.turn
                state.lucknumber = action.payload.lucknumber
                state.gamelock = action.payload.gamelock
                state.code = action.payload.code
            } 
            else if (action.type.includes('login')) {
                state.id = action.payload.id
                state.role = action.payload.role
                state.firstname = action.payload.firstname
                state.lastname = action.payload.lastname
                state.phoneNumber = action.payload.phoneNumber
                state.balance = action.payload.balance
                state.turn = action.payload.turn
                state.lucknumber = action.payload.lucknumber
                state.gamelock = action.payload.gamelock
                state.code = action.payload.code
                state.isLoggedIn = true
            }
            else if (action.type.includes('register')) {
                state.id = action.payload.id
                state.role = action.payload.role
                state.firstname = action.payload.firstname
                state.lastname = action.payload.lastname
                state.phoneNumber = action.payload.phoneNumber
                state.balance = action.payload.balance
                state.turn = action.payload.turn
                state.lucknumber = action.payload.lucknumber
                state.gamelock = action.payload.gamelock
                state.code = action.payload.code
                state.isLoggedIn = true
            }
            else if (action.type.includes('logout')) {
                state.id = null
                state.role = null
                state.firstname = null
                state.lastname = null
                state.phoneNumber = null
                state.balance = null
                state.turn = null
                state.lucknumber = null
                state.gamelock = []
                state.code = null
                state.isLoggedIn = false
            }
            else if (action.type.includes('addBalance')) {
                state.balance = action.payload.balance
            }
            else if (action.type.includes('subtractBalance')) {
                state.balance = action.payload.balance
            }
            else if (action.type.includes('withdraw')) {
                state.balance = action.payload.balance
            }
            else if (action.type.includes('deposit')) {
                state.balance = action.payload.balance
            }
            else if (action.type.includes('played')) {
                state.lucknumber = action.payload.lucknumber
            }
        })
        builder.addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
    }
});