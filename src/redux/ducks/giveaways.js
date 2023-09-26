import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "giveaways",
  initialState: {
    popupActive: true,
    discordUserTag: "",
    joinActive: false,
    captchaEnabled: false,
    joinType: "HOURLY",
    giveaways: {
      HOURLY: {},
      DAILY: {},
      WEEKLY: {}
    },
    participated: {
      HOURLY: false,
      DAILY: false,
      WEEKLY: false
    },
    timers: {
      HOURLY: '~',
      DAILY: '~',
      WEEKLY: '~'
    }
  },
  reducers: {
    setPopupActive: (state, action) => {
      state.popupActive = action.payload;
      state.captchaEnabled = false;
    },
    setGiveawaysData: (state, action) => {
      state.giveaways = action.payload;
    },
    setParticipatedData: (state, action) => {
      state.participated = action.payload;
    },
    attend: (state, action) => {
      state.participated[action.payload] = true;
      state.captchaEnabled = false;
    },
    setWinner: (state, action) => {
      const { type, winner } = action.payload;
      state.giveaways[type].winner = winner;
    },
    setGiveaway: (state, action) => {
      const { type, giveaway } = action.payload;
      state.giveaways[type] = giveaway;
      state.giveaways[type].new = true;
      state.participated[type] = false;
    },
    setTimers: (state, action) => {
      state.timers = action.payload;
    },
    setJoinData: (state, action) => {
      const { active, type } = action.payload;
      state.joinActive = active;
      state.joinType = type;
      state.captchaEnabled = false;
    },
    setJoinedCount: (state, action) => {
      const { type, joinedCount } = action.payload;
      state.giveaways[type].joinedCount = joinedCount;
    },
    setDiscordUserTag: (state, action) => {
      state.discordUserTag = action.payload;
    },
    setCaptchaEnabled: (state, action) => {
      state.captchaEnabled = action.payload;
    }
  },
  extraReducers: {},
});

export const { setGiveawaysData, setParticipatedData, attend, setWinner, setGiveaway, setPopupActive, setTimers, setJoinData, setDiscordUserTag, setJoinedCount, setCaptchaEnabled } = slice.actions;

export default slice.reducer;
