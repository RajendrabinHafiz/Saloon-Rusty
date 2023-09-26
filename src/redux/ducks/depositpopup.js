import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "pf",
  initialState: {
    visible: false
  },
  reducers: {
    setVisible: (state, action) => {
      state.visible = action.payload;
    },
  },
  extraReducers: {},
});

export const { setVisible } = slice.actions;

export default slice.reducer;
