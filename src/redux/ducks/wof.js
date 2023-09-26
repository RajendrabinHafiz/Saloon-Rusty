/*
 *
 *  wof.js
 *
 */

import { createSlice } from "@reduxjs/toolkit";

/**
 * Updates latest bets
 * @param {*} history
 * @returns
 */
function updateLastBets(history) {
  let temp = {
    red: 0,
    green: 0,
    black: 0,
    yellow: 0,
  };

  if (history) {
    history.map((info, i) => {
      if (info.fairRound.color === "red") {
        temp.red++;
      } else if (info.fairRound.color === "green") {
        temp.green++;
      } else if (info.fairRound.color === "yellow") {
        temp.yellow++;
      } else {
        temp.black++;
      }
    });
  }

  return temp;
}

const slice = createSlice({
  name: "wof",
  initialState: {
    muted: false,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    },
    beted: null,
    betType: 0x0,
    gameover: false,
    beting: false,
    numberOfbets: 0,
    loaded: false,
    id: -1,
    counter: 0,
    spinnerActive: false,
    players: { red: {}, black: {}, green: {}, yellow: {} },
    history: [],
    balance: 0,
    GAME_TIMER_INTERVAL: 20 * 1000,
    remainingTime: 20 * 1000,
    hash: "Loading",
    betTotals: {
      red: 0,
      black: 0,
      green: 0,
      yellow: 0,
    },
    projected: {
      red: 0,
      black: 0,
      green: 0,
      yellow: 0,
    },
    lastBets: {
      red: 0,
      green: 0,
      black: 0,
      yellow: 0,
    },
    userId: "",
    winningColor: false,

    animation: {
      EL_SIZE: 95,
      SPINNER_VIEW_WIDTH: 450,
      SPINNER_TOTAL_WIDTH: 0,

      R: 0.999,
      S: 0.01,
      tf: 0,
      vi: 0,
      LOGR: 0,

      dist: 0,
      distWithoutWobble: 0,
      offsetIndex: 0,
      offsetX: 1000,

      startTime: 0
    },
    spinning: false
  },
  reducers: {
    countDown: (state, action) => {
      state.counter = state.counter - 0.01;
    },

    WOFCounter: (state, action) => {
      state.counter = action.payload.counter;
      state.spinnerActive = false;
      state.hash = action.payload.hash;
      state.winningColor = false;
    },

    setRemainingTime: (state, action) => {
      state.remainingTime = action.payload;
    },

    setWinningColor: (state, action) => {
      state.winningColor = action.payload.color;
    },

    setPlayers: (state, action) => {
      let temp = {
        red: 0,
        black: 0,
        green: 0,
        yellow: 0,
      };
      let projected = {
        red: 0,
        black: 0,
        green: 0,
        yellow: 0,
      };
      for (var color in action.payload) {
        for (var player in action.payload[color]) {
          temp[color] += action.payload[color][player].amount;
          if (player === state.userId) {
            projected[color] +=
              action.payload[color][player].amount *
              (color === "red" ? 2 : color === "black" ? 3 : color === "green" ? 5 : 50);
          }
        }
      }

      state.projected = projected;
      state.players = action.payload;
      state.betTotals = temp;
    },

    WOFHistory: (state, action) => {
      if (action.payload !== undefined) {
        state.history = action.payload;
        state.lastBets = updateLastBets(action.payload);
      }
    },

    WOFConnect: (state, action) => {
      let temp = {
        red: 0,
        black: 0,
        green: 0,
        yellow: 0,
      };
      let projected = {
        red: 0,
        black: 0,
        green: 0,
        yellow: 0,
      };
      for (var color in action.payload.players) {
        for (var player in action.payload.players[color]) {
          temp[color] += action.payload.players[color][player].amount;
          if (player === state.userId) {
            projected[color] +=
              action.payload.players[color][player].amount *
              (color === "red" ? 2 : color === "black" ? 3 : color === "green" ? 5 : 50);
          }
        }
      }

      state.projected = projected;
      state.players = action.payload.players;
      state.betTotals = temp;
      state.userId = action.payload.userId;
      state.counter = action.payload.counter;
      state.hash = action.payload.hash;
      state.balance = action.payload.balance;
      state.history = action.payload.history;
      state.GAME_TIMER_INTERVAL = action.payload.GAME_TIMER_INTERVAL;
      state.remainingTime = action.payload.remainingTime;

      if (action.payload.end) {
        state.spinnerActive = true;
      }
    },

    setSpinnerActive: (state, action) => {
      state.spinnerActive = true;
    },

    setOffsetX: (state, action) => {
      state.animation.offsetX = action.payload;
    },
    setLOGR: (state, action) => {
      state.animation.LOGR = action.payload;
    },
    setDist: (state, action) => {
      state.animation.dist = action.payload;
    },
    setViAndTF: (state, action) => {
      state.animation.vi = action.payload.vi;
      state.animation.tf = action.payload.tf;
    },
    setStartTime: (state, action) => {
      state.animation.startTime = action.payload;
    },
    setSpinning: (state, action) => {
      state.spinning = action.payload;
    },

    updateConstantsWof: (state, action) => {
      for (let key in action.payload) {
        state[key] = action.payload[key];
      }
    }
  },
  extraReducers: {},
});

export const { countDown, WOFCounter, setWinningColor, setPlayers, WOFHistory, WOFConnect, setSpinnerActive, setRemainingTime,
  setOffsetX,
  setLOGR,
  setDist,
  setViAndTF,
  setStartTime,
  setSpinning,
  updateConstantsWof
} =
  slice.actions;
export default slice.reducer;
