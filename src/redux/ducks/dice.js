/* 
 *
 * dice.js 
 *
 */

import {
    createSlice
} from "@reduxjs/toolkit";

const slice = createSlice({
    name: "dice",
    initialState: {
        type: "over",
        balance: 0,
        values: [5000],
        winnings: 0,
        button: 0,
        winningNr: 0,
        history: [],
        diceSoundsMuted: false
    },
    reducers: {
        setWinnings: (state, action) => {
            state.winnings = action.payload;
        },
        setType: (state, action) => {
            state.type = action.payload;
        },
        setValue: (state, action) => {
            state.values = action.payload;
        },
        setBalance: (state, action) => {
            state.balance = action.payload;
        },
        diceResponse: (state, action) => {
            state.balance = action.payload.won ? 1 : 2;
            state.winningNr = action.payload.fairRound.ticket;

            if (state.diceSoundsMuted) return;

            var audio = new Audio(
                action.payload.won
                  ? "/audio/dice_win.mp3"
                  : "/audio/dice_loose.mp3"
              );
              audio.play();
        },


        //Deprecated
        diceSound: (state, action) => {
            return;
            if (state.diceSoundsMuted) return;

            var audio = new Audio(
                action.payload.type === "winning"
                  ? "/audio/dice_win.mp3"
                  : "/audio/dice_loose.mp3"
              );
              audio.play();
        },
        //

        setHistory: (state, action) => {
            state.history = action.payload;
        },
        setDiceSoundsMuted: (state, action) => {
            state.diceSoundsMuted = action.payload;
        }
    },
    extraReducers: {},
}); 

export const {
    setWinnings,
    setValue,
    setBalance,
    diceResponse,
    diceSound,
    setHistory,
    setType,
    setDiceSoundsMuted
} = slice.actions;

export default slice.reducer;