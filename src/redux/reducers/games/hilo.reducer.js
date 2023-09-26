export const hiloReducer = (
  /*
    cards -
        way: 0 or null = Start card, 1 = Skipped, 2 = Higher, 3 = Lower, 4 = Checkout
  */
  state = {
    round: 1,
    loaded: false,
    beted: null,
    upHandler: {
      precentage: 87.87,
    },
    downHandler: {
      precentage: 21.93,
    },
    gameover: false,
    cards: {},
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_HILO_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
