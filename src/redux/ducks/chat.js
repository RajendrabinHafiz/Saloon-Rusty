/*
 *
 * chat.js
 *
 */

import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    playersOnline: 0,
    regionPlayers: {
      english: 0,
      russian: 0,
      turkish: 0,
      spanish: 0,
      swedish: 0,
    },
    activeChat: "english",
    trivia: { id: 1, enabled: false, completed: false, $winnersn: [] }
  },
  reducers: {
    chat: (state, action) => {
      if (state.activeChat === action.payload.type) {
        state.messages = action.payload.messages;
      }
    },

    clearUserMessages: (state, action) => {
      const { lang, userId } = action.payload;
      if (state.activeChat === lang) {
        state.messages = state.messages.filter(el => el.id !== userId);
      }
    },


    playersOnline: (state, action) => {
      state.playersOnline = action.payload.players;
      state.regionPlayers = action.payload.regionPlayers;
    },

    changedLan: (state, action) => {
      state.messages = action.payload.messages;
      state.activeChat = action.payload.type;
    },

    setTriviaVar: (state, action) => {
      state.trivia = action.payload;
    },

    completeTrivia: (state, action) => {
      state.trivia.enabled = false;
      state.trivia.completed = false;
    },

      setJoinData: (state, action) => {
      const { active, type } = action.payload;
      state.joinActive = active;
      state.joinType = type;
      state.captchaEnabled = false;
    },
  },
  extraReducers: {},
});

export const { chat, clearUserMessages, playersOnline, changedLan, setTriviaVar, completeTrivia, setJoinData } = slice.actions;

export default slice.reducer;
