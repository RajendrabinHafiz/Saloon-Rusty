import { createSlice } from "@reduxjs/toolkit";

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max + 1)) + min;
}

const slice = createSlice({
  
  name: "slots",
  initialState: {
    isActive: false,
    balance: 0,

    slotsSoundsMuted: false,

    defs: {
     LINES: {
      '1': [ 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder' ],
      '2': [ 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder' ],
      '3': [ 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder', 'Sulfur', 'Charcoal', 'Gunpowder' ]
     },
     COMBINATIONS: {}
  },

    history: []
   
  },
  reducers: {
    setSlotsSoundsMuted: (state, action) => {
      state.slotsSoundsMuted = action.payload;
    },
    init: (state, action) => {
      const { slotLines, combinations, history, publicSeedData } = action.payload;
      state.defs.LINES = slotLines;
      state.defs.COMBINATIONS = combinations;
      state.history = history;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    pushHistory(state, action) {
      const data = action.payload;
      state.history.push(data);
      if (state.history.length > 15) state.history = state.history.slice(-15);
    }
  },
  extraReducers: {},
});

export const {
  setSlotsSoundsMuted,
  init,
  pushHistory
} = slice.actions;

export default slice.reducer;
