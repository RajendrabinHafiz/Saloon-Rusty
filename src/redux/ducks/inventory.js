import {
    createSlice
} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "inventory",
    initialState: {
        page: 'Deposit',

        items: [1,2,3,4],
        bonusRatio: 0,
        /* selectedAssetIds: [], */
        _selectedAssetIds: [],
       

        filter: {
            orderByDescending: true,
            minAmount: 0,
            maxAmount: 0,
            name: ''
        },
        filteredItems: [],

        balance: 0,

        totalItemsValue: 0,

        tradeData: {
            enabled: false, cost: 500, items: [
                {
                    amount: 1,
                    assetid: "1",
                    color: "#[object Object]",
                    image: "6TMcQ7eX6E0EZl2byXi7vaVKyDk_zQLX05x6eLCFM9neAckxGDf7qU2e2gu64OnAeQ7835df42LHfCk4nReh8DEiv5dbMao7pbAyQvq8Ok65_UA",
                    market_hash_name: "Toy SAP",
                    price: 1.38,
                    steamid: "76561199072178573",
                }
            ],
            link: "https://steamcommunity.com/tradeoffer/",
            trackingId: "X"
        }
    },
    reducers: {
        resetVars: (state, action) => {
            state.page = action.payload;

            state.items = [];
            state.bonusRatio = 0;
            state._selectedAssetIds = [];

            state.filter = {
                orderByDescending: true,
                minAmount: 0,
                maxAmount: 0,
                name: ''
            };

            state.filteredItems = [];

            state.totalItemsValue = 0;

            state.tradeData.enabled = false;
        },
        setBalance: (state, action) => {
            state.balance = action.payload * 100;
        },
        setItems: (state, action) => {
            state.items = action.payload;
        },
        setBonusRatio: (state, action) => {
            state.bonusRatio = action.payload;
        },
        resetSelectedAssetIds: (state, action) => {
            state._selectedAssetIds = [];
            state.totalItemsValue = 0;
        },

        addItems: (state, action) => {
            const itemsToBeAdded = action.payload;
            itemsToBeAdded.forEach(item => {
               let foundItem = state.items.find(el => el.assetid == item.assetid);
               if (!foundItem) state.items.push(item);
               else foundItem = item;
            });
        },
        removeItems: (state, action) => {
            const itemsToBeRemoved = action.payload;
            itemsToBeRemoved.forEach(item => {
                state.items = state.items.filter(el => el.assetid != item.assetid);
                state._selectedAssetIds = state._selectedAssetIds.filter(el => !el.includes(item.assetid));
             });
        },
        setItemsBusiness: (state, action) => {
            const items = action.payload;
            items.forEach(item => {
               let foundItem = state.items.find(el => el.assetid == item.assetid);
                if (foundItem) {
                    foundItem.amount = item.amount; 
                    foundItem.busy = item.busy; 
                    if (item.busy) {
                        state._selectedAssetIds = state._selectedAssetIds.filter(el => !el.includes(item.assetid));
                    }
                }
            });
        },
        setFilterValue: (state, action) => {
            let {key, value} = action.payload;
            if (key == 'minAmount' || key == 'maxAmount') value = parseFloat(value * 100);
            state.filter[key] = value;
        },

        filterItems: (state, action) => {
            let filteredItems =  state.items.sort((a, b) => {
                return state.filter.orderByDescending
                    ? b.price - a.price
                    : a.price - b.price;
            });
            if (state.filter.minAmount > 0) filteredItems = filteredItems.filter(el => el.price >= state.filter.minAmount);
            if (state.filter.maxAmount > 0) filteredItems = filteredItems.filter(el => el.price <= state.filter.maxAmount);
            
            if (state.filter.name) filteredItems = filteredItems.filter(el => el.market_hash_name.toLowerCase().includes(state.filter.name.toLowerCase()))
            filteredItems = filteredItems.filter(el => !el.busy);

            const seperatedItems = [];
            filteredItems.map(el => {
                //if (!el.available || el.busy) el.amount = 1;
                for (let i = 1;i <= el.amount;i++) {
                    let clonedElement = JSON.parse(JSON.stringify(el));
                    clonedElement.assetid_cloned = `${clonedElement.assetid}_${i}`;
                    clonedElement.amount = 1;
                   
                    seperatedItems.push(clonedElement)
                }
            })
            state.filteredItems = seperatedItems;
        },

        toggleItem: (state, action) => {
            const item = action.payload;
            if (state._selectedAssetIds.includes(item.assetid_cloned)) state._selectedAssetIds = state._selectedAssetIds.filter(el => el !== item.assetid_cloned);
            else state._selectedAssetIds.push(item.assetid_cloned);

 
            let totalItemsValue = 0;
            state._selectedAssetIds.forEach(assetId_cloned => {
                const assetId = assetId_cloned.split('_')[0];
                const item = state.items.find(el => el.assetid == assetId);
                totalItemsValue += item.price;
            })
            state.totalItemsValue = totalItemsValue;
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
        },

    },
    extraReducers: {},
});

export const {
    resetVars,
    setBalance,
    setItems,
    setBonusRatio,
    setFilterValue,
    addItems,
    removeItems,
    resetSelectedAssetIds,
    setItemsBusiness,
    filterItems,
    toggleItem,
    setTradeData,
    closeTradePopup
} = slice.actions;

export default slice.reducer;