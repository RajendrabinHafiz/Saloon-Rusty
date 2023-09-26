/* 
 *
 * dem.js 
 *
 */

import {
    createSlice
} from "@reduxjs/toolkit";

const slice = createSlice({
    name: "dem",
    initialState: {
        demvar: 0,
    },
    reducers: {
      
    },
    extraReducers: {},
}); 

export const {

} = slice.actions;

export default slice.reducer;