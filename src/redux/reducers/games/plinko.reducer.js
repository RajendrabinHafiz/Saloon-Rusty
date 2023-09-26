export const plinkoReducer = (
  state = {
    loaded: false,
    betType: 0x0,
    round: 1,
    beted: null,
    beting: false,
    muted: false,
    gameover: false,
    numberOfbets: 0x0,
    minesCount: 3,
    lastBet: null,
    difficulty: 0x0,
    starsEarned: 0,
    cardsSelected: [],
    lastStar: null,
    payoutWon: null,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    },
    cards: [],

   currentMultiplier: null,
   roundEnded: false,
   multipliersHistory: [],
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_PLINKO_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
