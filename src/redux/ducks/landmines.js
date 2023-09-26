/* 
 *
 * mines.js 
 *
 */

import { createSlice } from "@reduxjs/toolkit";

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
}

const slice = createSlice({
  
  name: "landmines",
  initialState: {
    isActive: false,
    balance: 0,
    history: [],
    minesSoundsMuted: false,
    emoji: "happy",
    lastEmoji: "happy",
    mineCount: 5,
    
    isDemo: false,
    playable: false,
    game: {
      id: 0,
      betAmount: 0,
      completed: false,
      mineCount: 13,
      squares: [],
      spacesCleared: 0,
      payoutRate: 1
    },

    seedData: {
      userSeed: '',
      serverSeed: '',
      nonce: 0
    },

    changeSeedsPopupVisible: false
  },
  reducers: {
    setMinesSoundsMuted: (state, action) => {
      state.minesSoundsMuted = action.payload;
    },
    setGameData: (state, action) => {
      state.game = action.payload;
      state.isDemo = false;
      state.isActive = true;
    },
    createDemoGame: (state, action) => {
      let squares = [];
      let mineOffsets = [];
      for (let i = 0; i < 25; i++) {
        squares.push({ open: false, isMine: false, multiplier: 0, openByUser: false });
        mineOffsets.push(i);
      }
      
      for (let j = 0; j < state.mineCount; j++) {
        let rndOffset = generateRandomNumber(0, mineOffsets.length - 1);
        const squareOffset = mineOffsets[rndOffset];
        mineOffsets = mineOffsets.filter(el => el !== squareOffset);
        squares[squareOffset].isMine = true;
      }

      state.game.id = -Date.now();
      state.game.mineCount = state.mineCount;
      state.game.squares = squares;
      state.game.spacesCleared = 0;
      state.game.isCompleted = false;
      state.playable = true;
      state.emoji = "happy";
      state.isDemo = true;
      state.isActive = true;
    },
    setEmoji: (state, action) => {
      if (!state.isActive || state.game.isCompleted) return;
      state.lastEmoji = state.emoji;
      state.emoji = action.payload;
    },
    setEmojiForce: (state, action) => {
      state.emoji = action.payload;
    },
    setLatestEmoji: (state, action) => {
      state.emoji = state.lastEmoji;
    },
    setSquareData: (state, action) => {
      let square = action.payload.data;
      if (!square.isMine) state.game.spacesCleared++;
      state.game.squares[action.payload.offset] = square;
      if (state.minesSoundsMuted) return;
      var audio = new Audio(
        !square.isMine
          ? "/audio/mines/achievement.mp3"
          : "/audio/mines/explosion.mp3"
      );
      if (!square.isMine) audio.volume = 0.4;
      audio.play();
    },
    openAllSquares: (state, action) => {
      for (let i = 0;i < state.game.squares.length;i++) {
        state.game.squares[i].open = true;
      }
      state.game.isCompleted = true;
    },
    completeGame: (state, action) => {
      state.game.isCompleted = true;
    },
    setPlayable: (state, action) => {
      state.playable = action.payload;
    },
    setMineCount: (state, action) => {
      state.mineCount = action.payload;
    },
    setPayoutRate: (state, action) => {
      state.game.payoutRate = action.payload;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    pushHistory: (state, action) => {
      state.history.unshift(action.payload);
      if (state.history.length > 20) state.history = state.history.slice(0, 20);
    },
    setChangeSeedsPopupVisible: (state, action) =>{
      state.changeSeedsPopupVisible = action.payload;
    },

    setSeedData: (state, action) => {
      state.seedData = action.payload;
    },
    setUserSeed: (state, action) => {
      state.seedData.userSeed = action.payload;
    },
    setServerSeed: (state, action) => {
      state.seedData.serverSeed = action.payload;
    },
    setNonce: (state, action) => {
      state.seedData.nonce = action.payload;
    },
  },
  extraReducers: {},
});

export const {
  setMinesSoundsMuted,
  setEmoji,
  setEmojiForce,
  setLatestEmoji,
  setGameData,
  createDemoGame,
  setSquareData,
  setPayoutRate,
  openAllSquares,
  completeGame,
  setPlayable,
  setMineCount,
  setHistory,
  pushHistory,
  finalizeGame,
  setChangeSeedsPopupVisible,
  setSeedData,
  setUserSeed,
  setServerSeed,
  setNonce
} = slice.actions;

export default slice.reducer;
