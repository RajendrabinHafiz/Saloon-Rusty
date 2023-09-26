import {
    createSlice
} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "admin",
    initialState: {
        dashboardData: {
            dailyStats: {
                depositData: { totalAmount: 0, amounts: [], netProfit: 0 },
            },
            dailyTable: [],
            generalStats: {

            },
            monthlyChartData: [
                ['x', 'TEST'],
                [0, 0],
                [1, 10],
                [2, 23],
                [3, 17],
                [4, 18],
                [5, 9],
                [6, 11],
                [7, 27],
                [8, 33],
                [9, 40],
                [10, 32],
                [11, 35],
              ],
              newUsersData: []
        },
     
    },
        reducers: {
            setDashboardData: (state, action) => {
                state.dashboardData = action.payload;
            }
        },
        extraReducers: {},
    });

export const {
    setDashboardData
} = slice.actions;

export default slice.reducer;