export const slideReducer = (
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
    tX: 0,
    currentMultiplier: 0,
    showUp: false,
    spinning: false,
    nextRound: 15,
    cardsSelected: [],
    cardsSlide: [
      1.14, 1.74, 1.26, 1.83, 14.87, 1.06, 1.84, 2.93, 1.77, 1.32, 1.62, 10.79,
      1.35, 1.03, 2.62, 109.66, 2.95, 1.92, 3.58, 10.12, 3.61, 1.26, 11.22,
      1.39, 13.52, 2.78, 1.56, 22.45, 1.47, 2.08, 1.41, 9.82, 1.06, 8.64, 1.01,
      1.02, 22.31, 3.23, 1.35, 1.71, 1, 6.4, 1.05, 4.83, 1.74, 1.3, 1.1, 1.39,
      22.05, 2.35, 2.75, 1.46, 4.68, 3.28, 1.05, 16.36, 1.39, 1.87, 1.61, 41.49,
      3.08, 10.95, 1.21, 2.31, 1.2, 5.3, 1.04, 1.04, 9.3, 2.5, 1.75, 4.56, 4.95,
      10.1, 1.32, 5.86, 2.67, 3.32, 1.6, 2.14, 8.42, 2.36, 1.33, 1.72, 4.26,
      1.35, 10.57, 1, 1.49, 1.17, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99,
    ],
    lastStar: null,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    },
    cards: [],

    historyMultiplier: [],
    spinningTime: 0,
    pickedItemIndex: null,
    transition: 0,
    animationX: 0,
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_SLIDE_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
