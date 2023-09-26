/* 
 *
 * shop.js 
 *
 */

import {
    createSlice
} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "shop",
    initialState: {
        page: 'Deposit',
        k: 0,
        selected: {},
        selectedValue: 0,
        inventory: {},
        displayIv: {},
        sortedIv: {},
        invArr: [],
        descending: true,
        bonus: false,
        balance: 0,
        minAmount: 0,
        maxAmount: 10000,
        searched: { target: { value: "" } },
        tradeData: {
            enabled: false, cost: 500, items: [
                {
                    amount: 1,
                    assetid: "3339969285765539093",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.38,
                    steamid: "76561199072178573",
                },
                {
                    amount: 1,
                    assetid: "3339969285765539093",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.38,
                    steamid: "76561199072178573",
                },
                {
                    amount: 1,
                    assetid: "3339969285765539093",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.38,
                    steamid: "76561199072178573",
                },
                {
                    amount: 1,
                    assetid: "3339969285765539093",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.38,
                    steamid: "76561199072178573",
                },
                {
                    amount: 1,
                    assetid: "3339969285765539093",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.58,
                    steamid: "76561199072178573",
                }
            ],
            link: "https://steamcommunity.com/tradeoffer/4767378854",
            securityCode: "1234x"
        }
    },
    reducers: {
        resetVars: (state, action) => {
            state.page = action.payload;
            state.selected = {};
            state.k = 0;
            state.selectedValue = 0;
            state.inventory = {};
            state.displayIv = {};
            state.sortedIv = [];
            state.invArr = [];
            state.descending = true;
            state.bonus = false;
            state.balance = 0;
            state.minAmount = 0;
            state.maxAmount = 10000;
            state.searched = { target: { value: "" } };
            state.tradeData.enabled = false;
        },
        setBalance: (state, action) => {
            state.balance = action.payload * 100;
        },

        searchForItem: (state, action) => {

            if (action.payload != null) {
                state.searched = action.payload;
            }

            var temp = {};

            for (var item in state.inventory) {
                if (item.toLowerCase().includes(state.searched.target.value.toLowerCase())) {
                    if (state.inventory[item].price >= state.minAmount && state.inventory[item].price <= state.maxAmount) {
                        temp[item] = state.inventory[item];
                    }
                }
            }

            state.displayIv = temp;
            state.searched = action.payload;
            let invArr = [];
            Object.keys(state.displayIv).forEach(itemName => {
                invArr.push(state.displayIv[itemName]);
            })
            state.invArr = invArr;
        },

        updateInventory: (state, action) => {
            state.inventory = action.payload;
            state.displayIv = action.payload;
            state.sortedIv = Object.keys(action.payload)
                .sort((a, b) => {
                    return state.descending
                        ? Number(action.payload[b].price) - Number(action.payload[a].price)
                        : Number(action.payload[a].price) - Number(action.payload[b].price);
                });
            let invArr = [];
            state.sortedIv.forEach(itemName => {
                invArr.push(state.displayIv[itemName]);
            })
            state.invArr = invArr;
        },

        setSelected: (state, action) => {
            const keyVal = action.payload.info.market_hash_name;
            if (!state.selected[keyVal]) {
                state.selected[keyVal] = state.displayIv[keyVal];
                state.selectedValue = Math.round((state.selectedValue + Number(action.payload.info.price)) * 100) / 100;
            } else {
                let tempSelected = state.selected[keyVal].selectedAmount;
                //delete state.selected[keyVal];
                //state.k++;
                try {
                    state.selected[action.payload.info.market_hash_name].selectedAmount = action.payload.selectedAmount;
                    state.selectedValue = Math.round((state.selectedValue + (Number(action.payload.info.price) * (action.payload.selectedAmount - tempSelected))) * 100) / 100;
                } catch (err) {
                    console.log(err)
                }
            }
        },

        removeSelected: (state, action) => {
            let temp = state.selected;
            let tempSelected = temp[action.payload.info.market_hash_name].selectedAmount;
            delete temp[action.payload.info.market_hash_name];
            state.selected = temp;
            state.selectedValue = Math.round((state.selectedValue - (Number(action.payload.info.price) * (tempSelected))) * 100) / 100;
        },

        toggleDescending: (state, action) => {
            state.descending = !state.descending;

            let newSorted = Object.keys(state.displayIv)
                .sort((a, b) => {
                    return state.descending
                        ? Number(state.displayIv[b].price) - Number(state.displayIv[a].price)
                        : Number(state.displayIv[a].price) - Number(state.displayIv[b].price);
                });
            let invArr = [];
            newSorted.forEach(itemName => {
                console.log(state.displayIv[itemName])
                invArr.push(state.displayIv[itemName]);
            })
            state.invArr = invArr;

        },

        setMinAmount: (state, action) => {
            if (!action.payload) {
                state.minAmount = 0;
            } else {
                state.minAmount = action.payload;
            }
        },

        setMaxAmount: (state, action) => {
            if (!action.payload) {
                state.maxAmount = 100000;
            } else {
                state.maxAmount = action.payload;
            }
        },
        setBonus: (state, action) => {
            state.bonus = action.payload;
        },
        setTradeData: (state, action) => {
            if (state.page === "Withdraw") {
                let audio = new Audio("/audio/trade/withdraw.mp3");
                audio.play();
            }

            state.tradeData = action.payload;
            state.tradeData.enabled = true;
        },
        closeTradePopup: (state, action) => {
            state.tradeData.enabled = false;
        }
    },
    extraReducers: {},
});

export const {
    resetVars,
    setBalance,
    searchForItem,
    updateInventory,
    setSelected,
    removeSelected,
    toggleDescending,
    setMinAmount,
    setMaxAmount,
    setBonus,
    setTradeData,
    closeTradePopup
} = slice.actions;

export default slice.reducer;