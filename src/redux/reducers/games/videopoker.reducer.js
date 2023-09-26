export const videopokerReducer = (
  state = {
    round: 1,
    beted: null,
    gameover: false,
    loaded: false,
    muted: false,
    cards: {
      1: { suit: "H", value: 6, selected: false, active: false },
      2: { suit: "S", value: "K", selected: false, active: false },
      3: { suit: "C", value: 7, selected: false, active: false },
      4: { suit: "H", value: "J", selected: false, active: false },
      5: { suit: "C", value: 5, selected: false, active: false },
    },
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_VIDEOPOKER_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
