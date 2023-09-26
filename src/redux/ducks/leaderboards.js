import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "leaderboards",
  initialState: {
    currentTab: 'DAILY',
    entries: {
      DAILY: {},
      WEEKLY: {},
      //MONTHLY: {}
    },
    timers: {
      DAILY: '00:24:00:00',
      WEEKLY: '07:00:00:00',
      //MONTHLY: '30:00:00:00'
    }
  },
  reducers: {
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    setTopUsers: (state, action) => {
      const { type, topUsers } = action.payload;
      state.entries[type].topUsers = topUsers;
    },
    setEntry: (state, action) => {
      const { type, entry } = action.payload;
      state.entries[type] = entry;
      state.entries[type].new = true;
    },
    setTimers: (state, action) => {
      state.timers = action.payload;
    },
  },
  extraReducers: {},
});

export const { setCurrentTab, setEntries, setEntry, setTimers, setTopUsers } = slice.actions;

export default slice.reducer;
