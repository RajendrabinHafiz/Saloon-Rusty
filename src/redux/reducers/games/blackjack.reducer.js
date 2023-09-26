export const blackjackReducer = (
  state = {
    round: 1,
    beted: null,
    loaded: false,
    gameover: false,
    cards: {
      dealer: [
      ],
      player: [],
    },
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_BLACKJACK_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
