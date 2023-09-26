/*
 *
 * roulette.js
 *
 */

import { createSlice } from "@reduxjs/toolkit";

function totalAmount(players) {
  let temp = {
    red: 0,
    green: 0,
    black: 0,
  };

  for (var color in players) {
    for (var player in players[color]) {
      temp[color] += players[color][player].amount;
    }
  }

  return temp;
}

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
  };

  history.map((info) => {
    if (info.fairRound.ticket === 0) {
      temp.green++;
    } else if (info.fairRound.ticket <= 7) {
      temp.red++;
    } else {
      temp.black++;
    }
  });

  return temp;
}

const slice = createSlice({
  name: "roulette",
  initialState: {
    id: -1,
    players: {
      red: {},
      green: {},
      black: {},
    },
    counter: 0,
    balance: 0,
    ROULETTE_TIMER_INTERVAL: 20 * 1000,
    remainingTime: 20 * 1000,
    startedAt: 0,
    history: [],
    hash: "Not Found",
    spinnerActive: false,
    projected: {
      red: 0,
      green: 0,
      black: 0,
    },
    total: {
      red: 0,
      green: 0,
      black: 0,
    },
    done: false,
    numbers: [
      1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8
    ],
    lastBets: {
      red: 0,
      green: 0,
      black: 0,
    },


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
    rouletteTimer: (state, action) => {
      state.counter = action.payload.counter;
      state.hash = action.payload.hash;
      state.spinnerActive = action.payload.spinning;
    },

    setRemainingTime: (state, action) => {
      state.remainingTime = action.payload;
    },
    
    countDown: (state, action) => {
      state.counter = state.counter - 0.01;
    },

    rouletteConnect: (state, action) => {
      state.id = action.payload.id;
      state.total = totalAmount(action.payload.players);
      state.ROULETTE_TIMER_INTERVAL = action.payload.ROULETTE_TIMER_INTERVAL;
      state.remainingTime = action.payload.remainingTime;
      state.hash = action.payload.hash;
      state.spinnerActive = action.payload.spinning;
      state.players = action.payload.players;
      state.history = action.payload.history;
      state.lastBets = updateLastBets(action.payload.history);
    },

    reset: (state, action) => {
      state.players = {
        red: {},
        green: {},
        black: {},
      };
      state.total = {
        red: 0,
        green: 0,
        black: 0,
      };
      state.projected = {
        red: 0,
        green: 0,
        black: 0,
      };

      state.history = action.payload.history;
      state.done = false;
      state.lastBets = updateLastBets(action.payload.history);
    },

    roulettePlayers: (state, action) => {
      const players = {
        red: action.payload.red,
        green: action.payload.green,
        black: action.payload.black,
      };

      state.players = players;
      state.total = totalAmount(players);
    },

    roulettePlaceBetRes: (state, action) => {
      let temp = state.projected;
      temp[action.payload.color] += action.payload.color === "green" ? action.payload.bet * 14 : action.payload.bet * 2;
      state.projected = temp;
    },

    rouletteDone: (state, action) => {
      state.done = true;
    },

    setSpinnerTotalWidth: (state, action) => {
      state.animation.SPINNER_TOTAL_WIDTH = action.payload;
    },
    setSpinnerViewWidth: (state, action) => {
      state.animation.SPINNER_VIEW_WIDTH = action.payload;
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
  },
  extraReducers: {},
});

export const { 
  rouletteTimer, 
  rouletteConnect,
  countDown, 
  reset,
  roulettePlayers, 
  roulettePlaceBetRes,
  rouletteDone, 
  setRemainingTime,

  setSpinnerTotalWidth,
  setSpinnerViewWidth,
  setOffsetX,
  setLOGR,
  setDist,
  setViAndTF,
  setStartTime,
  setSpinning
 } =
  slice.actions;
export default slice.reducer;
