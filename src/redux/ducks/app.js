/* 
 *
 * app.js 
 *
 */

import {
    createSlice
} from "@reduxjs/toolkit";
const slice = createSlice({
    name: "app",
    initialState: {
        chatCollapsed: window.innerWidth <= 1375,
        inited: false,
        navCollapsed: true,
        helpVisible: false,
        chatVisible: true,
        soundsMuted: false,
        faucetVisible: false,
        redeemVisible: false,
        redeemCode: '',
        captchaVisible: false
    },
    reducers: {
        toggleChatCollapsed: (state, action) => {
            state.chatCollapsed = !state.chatCollapsed;
            state.navCollapsed = true;
        },
        toggleNavCollapsed: (state, action) => {
            state.navCollapsed = !state.navCollapsed;
            state.chatCollapsed = true;
        },
        setInited: (state, action) => {
            state.inited = action.payload;
        },
        setHelpVisible: (state, action) => {
            state.helpVisible = action.payload;
        },
        setChatVisible: (state, action) => {
            state.chatVisible = action.payload;
        },
        setSoundsMuted: (state, action) => {
            state.soundsMuted = action.payload;
        },
        setFaucetVisible: (state, action) => {
            state.faucetVisible = action.payload;
        },
        setRedeemVisible: (state, action) => {
            state.redeemVisible = action.payload;
        },
        setRedeemCode: (state, action) => {
            state.redeemCode = action.payload;
        },
        setCaptchaVisible: (state, action) => {
            state.captchaVisible = action.payload;
        }
    },
    extraReducers: {}
});

export const {
    toggleChatCollapsed,
    toggleNavCollapsed,
    setHelpVisible,
    setChatVisible,
    setSoundsMuted,
    setInited,
    setFaucetVisible,
    setRedeemVisible,
    setRedeemCode,
    setCaptchaVisible
} = slice.actions;

export default slice.reducer;