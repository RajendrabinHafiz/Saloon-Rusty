import { createSlice } from "@reduxjs/toolkit";
const slice = createSlice({
  name: "withdrawpopup",
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
