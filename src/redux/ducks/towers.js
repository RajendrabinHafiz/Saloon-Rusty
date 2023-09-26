/*
 *
 * towers.js
 *
 */

import { createSlice } from "@reduxjs/toolkit";

function calcReward(towersLevel, type, level) {
  return (1 / towersLevel[type] ** level) * (1 - 0.03 * level);
}

const slice = createSlice({
  name: "towers",
  initialState: {
    info: [],
    mode: "easy",
    level: 0,
    active: false,
    balance: 0,
    history: [],
    towersLevel: {
      easy: 2 / 3,
      medium: 1 / 2,
      hard: 1 / 3,
    },
    towersMaxReward: 200 * 1000,
    towerSoundsMuted: false
  },
  reducers: {
    towersHistory: (state, action) => {
      state.history = action.payload;
    },

    towersConnect: (state, action) => {
      state.balance = action.payload.balance;
    },

    createTowersResponse: (state, action) => {
      state.level = action.payload.level;
      state.info = [];
      state.active = true;
    },

    setInfo: (state, action) => {
      state.info = action.payload.info;
    },

    towersCheckAlternativeResponse: (state, action) => {
      let won = action.payload.rightAnswer == true;
      if (action.payload.rightAnswer && !action.payload.done) {
        let output = state.info;
        for (var i = 0; i < action.payload.answers.length; i++) {
          if (output[i]) {
            output[i].answer = action.payload.answers[i];
          } else {
            output.push({ number: "-", answer: action.payload.answers[i] });
          }
        }
        state.info = output;

        if (action.payload.done) {
          state.level = 0;
          state.active = false;
        } else {
          state.level = action.payload.level;
          state.active = true;
        }
      } else {
        let output = state.info;
        for (var j = 0; j < action.payload.tickets.length; j++) {
          if (output[j]) {
            output[j].answer = action.payload.tickets[j];
          } else {
            output.push({ number: "-", answer: action.payload.tickets[j] });
          }
        }

        state.active = false;
        state.info = output;
      }
      state.mode = action.payload.mode;
    },

    towersValues: (state, action) => {
      let output = [];
      let betAmount = action.payload == null || action.payload === "" ? 0.01 : action.payload;
      if (isNaN(betAmount)) betAmount = 0.01;
      for (var i = 1; i <= 8; i++) {
        let reward = Math.floor(betAmount * calcReward(state.towersLevel, state.mode, i)) / 100;
        if (reward > state.towersMaxReward) {
          break;
        } else {
          output.push({ number: reward });
        }
      }

      state.info = output;
    },

    setRef: (state, action) => {
      state.betInput = action.payload.betInput;
    },

    setMode: (state, action) => {
      state.mode = action.payload;
    },
    towerSounds: (state, action) => {
      if (state.towerSoundsMuted) return;
      var audio = new Audio(
        action.payload.type === "win"
          ? "/audio/towers/win.mp3"
          : action.payload.type === "loose"
          ? "/audio/towers/fail.mp3"
          : "/audio/towers/advance.mp3"
      );
      audio.volume = 0.4;
      audio.play();
    },

    setTowerSoundsMuted: (state, action) => {
      state.towerSoundsMuted = action.payload;
  }
  },
  extraReducers: {},
});

export const {
  towersHistory,
  towersConnect,
  createTowersResponse,
  setInfo,
  towersCheckAlternativeResponse,
  towersValues,
  setRef,
  setMode,
  setTowerSoundsMuted,
  towerSounds
} = slice.actions;

export default slice.reducer;
