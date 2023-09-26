export const diceReducer = (
  state = {
    round: 1,
    beted: null,
    betType: 0x0,
    gameover: false,
    beting: false,
    numberOfbets: 0,
    lastDice: null,
    lastBet: null,
    dices: [],
    diced: 50,
    loaded: false,
    diced_on: 22,
    type: 0x0,
    muted: false,
    onAction: {
      onWin: 0x0,
      onLoss: 0x0,
    }
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_DICE_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
