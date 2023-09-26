import {
    createSlice
} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "statetest",
    initialState: {
        k: 0,
        items: [
            {name: 'Test item 1', amount: 1},
            {name: 'Test item 2', amount: 1},
            {name: 'Test item 3', amount: 1}
        ],
        sortedItemsArr: [],
        selectedItems: [],
        balance: 0,
        descending: false
    },
    reducers: {
        resetVars: (state, action) =>{

        },
        increment: (state, action) => {
            state.k++;
        },
        toggleItem: (state, action) => {
            let item = action.payload;
            if (state.selectedItems.find(el => el.market_hash_name == item.market_hash_name)) {
                state.selectedItems = state.selectedItems.filter(el => el.market_hash_name !== item.market_hash_name);
            } else {
                console.log(item)
                state.selectedItems.push({market_hash_name: item.market_hash_name, amount: 1});
                console.log(state.selectedItems)
            }
        },
        updateInventory: (state, action) => {
            state.items = action.payload;
            let sortedItemNames = Object.keys(action.payload)
                    .sort((a, b) => {
                      return state.descending
                        ? Number(action.payload[b].price) - Number(action.payload[a].price)
                        : Number(action.payload[a].price) - Number(action.payload[b].price);
                    });
            let invArr = [];
            sortedItemNames.forEach(itemName => {
                invArr.push(state.items[itemName]);
            })
            state.sortedItemsArr = invArr;
        },
        setBonus: (state, action) => {
            state.bonus = action.payload;
        },
        setTradeData: (state, action) => {
            state.tradeData = action.payload;
            state.tradeData.enabled = true;
        },
        closeTradePopup: (state, action) => {
            state.tradeData.enabled = false;
        },
        setBalance: (state, action) => {
            state.balance = action.payload * 100;
        },
    },
    extraReducers: {},
}); 

export const {
    increment,
    toggleItem,
    setBonus,
    resetVars,
    setBalance,
    setTradeData,
    updateInventory,
    closeTradePopup
} = slice.actions;

export default slice.reducer;