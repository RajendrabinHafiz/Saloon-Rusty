import {
    createSlice
} from "@reduxjs/toolkit";


const slice = createSlice({
    name: "depositmenu",
    initialState: {
        currentWallet: { currency: '', transactions: [] }
        
    },
    reducers: {
        setCurrentWallet: (state, action) => {
            state.currentWallet = action.payload;
        },
        walletUnshiftTransaction: (state, action) => {
            const { transaction, currency } = action.payload;
            if (state.currentWallet.currency != currency) return;
            state.currentWallet.transactions.unshift(transaction);
            state.currentWallet.transactions = state.currentWallet.transactions.slice(0, 5);
        },
        walletUpdateTransactionStatus: (state, action) => {
            const { transactionId, newStatus } = action.payload;
            let targetTransaction = state.currentWallet.transaction.find(transaction => transaction.id == transactionId);
            if (targetTransaction) targetTransaction.status = newStatus;
        }
        
    },
    extraReducers: {},
});

export const {
    setCurrentWallet,
    walletUnshiftTransaction,
    walletUpdateTransactionStatus
} = slice.actions;

export default slice.reducer;