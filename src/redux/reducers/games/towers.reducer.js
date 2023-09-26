export const towerReducer = (
  state = {
    round: 1,
    beted: 0,
    beting: false,
    gameover: false,
    activeLine: null,
    towersMaxReward: 200 * 1000,
    loaded: false,
    cards: [],
    muted: false,
    difficulty: 0x1,
  },
  action,
) => {
  switch (action.type) {
    case "UPDATE_TOWERS_STATE":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
