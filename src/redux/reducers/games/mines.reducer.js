export const minesReducer = (
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
    starsEarned: 0,
    cardsSelected: [],
    lastStar: null,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    },
    cards: [],
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_MINES_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
