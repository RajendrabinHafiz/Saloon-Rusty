/* 
 *
 * profile.js 
 *
 */

import {
    createSlice
} from "@reduxjs/toolkit";

const slice = createSlice({
    name: "profile",
    initialState: {
        loggedIn: false,
        id: "-1",
        username: "Not found",
        avatar: process.env.PUBLIC_URL + "/images/profile-pic-blank.png",
        balance: "",
        latestBalanceUpdate: 0,

        gameHistory: [],
        tradeHistory: [],
        
        totalDeposit: 0,
        totalWithdraw: 0,
        
        info: {
            deposit: 0,
            withdraw: 0,
        },
        levelInfo: {
            level: 1,
            neededXp: 1,
            xp: 1
        },
        addedCode: "None",
        yourCode: "None",
        muted: 0,
        transactionsActive: true,
        tradeurl: "",
        withdrawOk: 1
    },
    reducers: {
        profileResponse: (state, action) => {
            let temp = {
                deposit: 0,
                withdraw: 0,
            }

            //state.id = action.payload.id;
            //state.username = action.payload.username;
            //state.avatar = action.payload.avatar;

            state.gameHistory = action.payload.gameHistory;
            state.tradeHistory = action.payload.tradeHistory;

            //state.balance = action.payload.balance;
            state.totalDeposit = action.payload.totalDeposit;
            state.totalWithdraw = action.payload.totalWithdraw;
            state.levelInfo = action.payload.levelInfo;
            state.muted = action.payload.muted;
            state.tradeurl = action.payload.tradeurl;
        },

        code: (state, action) => {
            state.yourCode = action.payload.yourCode;
            state.addedCode = action.payload.addedCode;
        },

        userData: (state, action) => {
            state.loggedIn = true;
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.avatar = action.payload.avatar;
            state.rank = action.payload.rank;
            state.withdrawOk = action.payload.withdrawOk;
        },

        balanceUpdate: (state, action) => {
            state.balance = action.payload;
        },

        updateBalance: (state, action) => {
            const { value, time } = action.payload;
            state.balance = value;
            state.latestBalanceUpdate = time;
        },

        setWithdrawOk: (state, action) => {
            state.withdrawOk = action.payload;
        }
    },
    extraReducers: {},
}); 

export const {
    profileResponse,
    code,
    balanceUpdate,
    updateBalance,
    userData,
    setWithdrawOk
} = slice.actions;

export default slice.reducer;